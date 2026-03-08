use crate::models::{Board, Building, Game};

#[starknet::interface]
pub trait IStarktycoonActions<T> {
    fn start_game(ref self: T, player_name: Option<felt252>) -> felt252;
    fn buy_building(ref self: T, game_id: felt252, building_id: u8, position_id: u8);
    fn upgrade_building(ref self: T, game_id: felt252, position_id: u8, upgrade_id: u8);
    fn refresh_market(ref self: T, game_id: felt252);
    fn destroy_building(ref self: T, game_id: felt252, position_id: u8);
    fn submit_score(ref self: T, game_id: felt252);
    fn get_game_state(self: @T, game_id: felt252) -> (Game, Board, Span<Building>);
}

#[dojo::contract]
pub mod starktycoon {
    use dojo::model::ModelStorage;
    use game_components_embeddable_game_standard::minigame::extensions::settings::interface::IMinigameSettings;
    use game_components_embeddable_game_standard::minigame::interface::IMinigameTokenData;
    use game_components_embeddable_game_standard::minigame::minigame::{
        assert_token_ownership, mint, post_action, pre_action,
    };
    use game_components_embeddable_game_standard::minigame::minigame_component::MinigameComponent;
    use game_components_embeddable_game_standard::token::structs::unpack_minted_at;
    use openzeppelin_introspection::src5::SRC5Component;
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};
    use starknet::{ContractAddress, get_block_timestamp, get_caller_address, get_contract_address};
    use crate::constants::{
        BOARD_SIZE, GAME_DURATION, MARKET_SIZE, START_CAPITAL, START_CAPITAL_PRODUCTION,
        TOTAL_BUILDINGS,
    };
    use crate::models::{Board, Building, Game};
    use crate::utils::buildings::{building_spec, upgrade_spec};
    use crate::utils::vrf::VRFImpl;
    use crate::utils::{board, market};

    // Components
    component!(path: MinigameComponent, storage: minigame, event: MinigameEvent);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);

    #[abi(embed_v0)]
    impl MinigameImpl = MinigameComponent::MinigameImpl<ContractState>;
    impl MinigameInternalImpl = MinigameComponent::InternalImpl<ContractState>;

    #[abi(embed_v0)]
    impl SRC5Impl = SRC5Component::SRC5Impl<ContractState>;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        minigame: MinigameComponent::Storage,
        #[substorage(v0)]
        src5: SRC5Component::Storage,
        denshokan_address: ContractAddress,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        MinigameEvent: MinigameComponent::Event,
        #[flat]
        SRC5Event: SRC5Component::Event,
    }

    fn dojo_init(
        ref self: ContractState,
        creator_address: ContractAddress,
        denshokan_address: ContractAddress,
    ) {
        self.denshokan_address.write(denshokan_address);
        self
            .minigame
            .initializer(
                creator_address,
                "Stark Tycoon",
                "Stark Tycoon is an onchain tycoon game",
                "Provable Games",
                "Provable Games",
                "Tycoon",
                "https://stark-tycoon.vercel.app/favicon.png",
                Option::Some("#0092D1"),
                Option::Some("https://stark-tycoon.vercel.app/"),
                Option::None,
                Option::None,
                Option::None,
                denshokan_address,
                Option::None,
                Option::None,
                1,
            );
    }

    #[abi(embed_v0)]
    impl StarktycoonActionsImpl of super::IStarktycoonActions<ContractState> {
        fn start_game(ref self: ContractState, player_name: Option<felt252>) -> felt252 {
            let mut world = self.world_default();
            let current_time = get_block_timestamp();

            let game_id = mint(
                self.denshokan_address.read(),
                get_contract_address(),
                player_name,
                Option::None,
                Option::Some(current_time),
                Option::Some(current_time + GAME_DURATION),
                Option::None,
                Option::None,
                Option::None,
                Option::None,
                Option::None,
                get_caller_address(),
                false,
                false,
                0,
                0,
            );

            let vrf_seed = VRFImpl::seed();
            let seed_u256: u256 = vrf_seed.into();
            let market_seed: felt252 = seed_u256.low.into();
            let board_seed: u64 = (seed_u256.high % 0x10000000000000000).try_into().unwrap();

            let mut game: Game = world.read_model(game_id);
            game.capital = START_CAPITAL;
            game.capital_production = START_CAPITAL_PRODUCTION;
            game.market_size = MARKET_SIZE;
            game.market_packed = market::pack_market_from_seed(market_seed, MARKET_SIZE);

            let board = Board { game_id, seed: board_seed };

            world.write_model(@game);
            world.write_model(@board);
            game_id
        }

        fn buy_building(
            ref self: ContractState, game_id: felt252, building_id: u8, position_id: u8,
        ) {
            let denshokan_address = self.denshokan_address.read();
            assert_token_ownership(denshokan_address, game_id);
            pre_action(denshokan_address, game_id);

            let mut world = self.world_default();
            let mut game: Game = world.read_model(game_id);

            let minted_at = unpack_minted_at(game_id);
            tick_production(ref game, minted_at);

            // Validate building_id in range 1..=TOTAL_BUILDINGS
            assert(building_id >= 1 && building_id <= TOTAL_BUILDINGS, 'Invalid building id');

            // Validate position_id in range
            assert(position_id < BOARD_SIZE, 'Invalid position');

            // Check position not already occupied
            let existing: Building = world.read_model((game_id, position_id));
            assert(existing.building_id == 0, 'Position occupied');

            // Check building is in the market
            let slot = market::find_building(game.market_packed, building_id, game.market_size);
            assert(slot.is_some(), 'Building not in market');
            let slot = slot.unwrap();

            // Deduct costs (capital always, users for tx buildings)
            let spec = building_spec(building_id);
            assert(game.capital >= spec.capital_cost, 'Not enough capital');
            assert(game.users >= spec.users_cost, 'Not enough users');
            game.capital -= spec.capital_cost;
            game.users -= spec.users_cost;

            // Add production rates
            game.capital_production += spec.capital_production;
            game.users_production += spec.users_production;
            game.research_production += spec.research_production;
            game.transactions_production += spec.tx_production;

            // Add multipliers
            game.users_multiplier += spec.users_multiplier;
            game.research_multiplier += spec.research_multiplier;
            game.tx_multiplier += spec.tx_multiplier;

            // Apply tile bonus (only if not already consumed on this tile)
            if existing.bonus_consumed == 0 {
                let board_data: Board = world.read_model(game_id);
                let bonus = board::derive_tile_bonus(board_data.seed, position_id);
                board::apply_tile_bonus(ref game, bonus);
            }

            // Replace the bought slot with a new random building
            game
                .market_packed =
                    market::replace_slot_from_seed(game.market_packed, slot, VRFImpl::seed());

            // Write the building to the board
            let building = Building {
                game_id, position_id, building_id, upgrade_level: 0, bonus_consumed: 1,
            };

            world.write_model(@building);
            world.write_model(@game);
            post_action(denshokan_address, game_id);
        }

        fn upgrade_building(
            ref self: ContractState, game_id: felt252, position_id: u8, upgrade_id: u8,
        ) {
            let denshokan_address = self.denshokan_address.read();
            assert_token_ownership(denshokan_address, game_id);
            pre_action(denshokan_address, game_id);

            let mut world = self.world_default();
            let mut game: Game = world.read_model(game_id);

            let minted_at = unpack_minted_at(game_id);
            tick_production(ref game, minted_at);

            // Read building and validate
            let mut building: Building = world.read_model((game_id, position_id));
            assert(building.building_id != 0, 'No building here');

            // Validate upgrade_id (must be 1 or 2)
            assert(upgrade_id == 1 || upgrade_id == 2, 'Invalid upgrade id');

            // Upgrades must be sequential: upgrade 1 requires level 0, upgrade 2 requires level 1
            assert(building.upgrade_level == upgrade_id - 1, 'Wrong upgrade order');

            // Get upgrade spec and deduct research cost
            let upg = upgrade_spec(building.building_id, upgrade_id);
            assert(game.research >= upg.research_cost, 'Not enough research');
            game.research -= upg.research_cost;

            // Apply production bonuses
            game.capital_production += upg.capital_production;
            game.users_production += upg.users_production;
            game.research_production += upg.research_production;
            game.transactions_production += upg.tx_production;

            // Apply multiplier bonuses
            game.users_multiplier += upg.users_multiplier;
            game.research_multiplier += upg.research_multiplier;
            game.tx_multiplier += upg.tx_multiplier;

            // Advance upgrade level
            building.upgrade_level = upgrade_id;
            world.write_model(@building);
            world.write_model(@game);
            post_action(denshokan_address, game_id);
        }

        fn destroy_building(ref self: ContractState, game_id: felt252, position_id: u8) {
            let denshokan_address = self.denshokan_address.read();
            assert_token_ownership(denshokan_address, game_id);
            pre_action(denshokan_address, game_id);

            let mut world = self.world_default();
            let mut game: Game = world.read_model(game_id);

            let minted_at = unpack_minted_at(game_id);
            tick_production(ref game, minted_at);

            // Read building and validate it exists
            let mut building: Building = world.read_model((game_id, position_id));
            assert(building.building_id != 0, 'No building here');

            // Reverse base production/multipliers
            let spec = building_spec(building.building_id);
            game.capital_production -= spec.capital_production;
            game.users_production -= spec.users_production;
            game.research_production -= spec.research_production;
            game.transactions_production -= spec.tx_production;
            game.users_multiplier -= spec.users_multiplier;
            game.research_multiplier -= spec.research_multiplier;
            game.tx_multiplier -= spec.tx_multiplier;

            // Reverse upgrade bonuses
            let mut lvl: u8 = 1;
            while lvl <= building.upgrade_level {
                let upg = upgrade_spec(building.building_id, lvl);
                game.capital_production -= upg.capital_production;
                game.users_production -= upg.users_production;
                game.research_production -= upg.research_production;
                game.transactions_production -= upg.tx_production;
                game.users_multiplier -= upg.users_multiplier;
                game.research_multiplier -= upg.research_multiplier;
                game.tx_multiplier -= upg.tx_multiplier;
                lvl += 1;
            }

            // Zero out the building (bonus_consumed stays 1)
            building.building_id = 0;
            building.upgrade_level = 0;

            world.write_model(@building);
            world.write_model(@game);
            post_action(denshokan_address, game_id);
        }

        fn refresh_market(ref self: ContractState, game_id: felt252) {
            let denshokan_address = self.denshokan_address.read();
            assert_token_ownership(denshokan_address, game_id);
            pre_action(denshokan_address, game_id);

            let mut world = self.world_default();
            let mut game: Game = world.read_model(game_id);

            let minted_at = unpack_minted_at(game_id);
            tick_production(ref game, minted_at);

            // Cost: refresh_count * 500 capital (first refresh is free)
            let cost: u16 = game.refresh_count.into() * 500;
            assert(game.capital >= cost, 'Not enough capital');
            game.capital -= cost;

            // Generate entirely new market
            game.market_packed = market::pack_market_from_seed(VRFImpl::seed(), game.market_size);
            game.refresh_count += 1;

            world.write_model(@game);
            post_action(denshokan_address, game_id);
        }

        fn submit_score(ref self: ContractState, game_id: felt252) {
            let denshokan_address = self.denshokan_address.read();

            let mut world = self.world_default();
            let mut game: Game = world.read_model(game_id);

            // Must not have been submitted already
            let game_time_u64: u64 = game.game_time.into();
            assert(game_time_u64 < GAME_DURATION, 'Score already submitted');

            // Must be after game end time
            let minted_at = unpack_minted_at(game_id);
            assert(get_block_timestamp() >= minted_at + GAME_DURATION, 'Game not over yet');

            // Final tick capped at end time
            tick_production(ref game, minted_at);

            world.write_model(@game);
            post_action(denshokan_address, game_id);
        }

        fn get_game_state(self: @ContractState, game_id: felt252) -> (Game, Board, Span<Building>) {
            let world = self.world_default();
            let game: Game = world.read_model(game_id);
            let board: Board = world.read_model(game_id);
            let mut buildings = array![];

            for position_id in 0..BOARD_SIZE {
                let building: Building = world.read_model((game_id, position_id));
                if building.building_id != 0 || building.bonus_consumed != 0 {
                    buildings.append(building);
                }
            }

            (game, board, buildings.span())
        }
    }

    fn tick_production(ref game: Game, minted_at: u64) {
        let current_time = get_block_timestamp();
        let end_time = minted_at + GAME_DURATION;

        let effective_time = if current_time > end_time {
            end_time
        } else {
            current_time
        };

        let tick_duration: u64 = effective_time - (minted_at + game.game_time.into());
        let seconds_passed: u16 = tick_duration.try_into().unwrap();

        let capital_delta: u32 = game.capital_production.into() * seconds_passed.into();
        let new_capital: u32 = game.capital.into() + capital_delta;
        game.capital = if new_capital > 0xFFFF {
            0xFFFF
        } else {
            new_capital.try_into().unwrap()
        };

        let users_rate: u32 = (game.users_production.into()
            * (100_u32 + game.users_multiplier.into()))
            / 100;
        let new_users: u32 = game.users.into() + users_rate * seconds_passed.into();
        game.users = if new_users > 0xFFFF {
            0xFFFF
        } else {
            new_users.try_into().unwrap()
        };

        let research_rate: u32 = (game.research_production.into()
            * (100_u32 + game.research_multiplier.into()))
            / 100;
        let new_research: u32 = game.research.into() + research_rate * seconds_passed.into();
        game
            .research =
                if new_research > 0xFFFF {
                    0xFFFF
                } else {
                    new_research.try_into().unwrap()
                };

        let tx_rate: u32 = (game.transactions_production.into()
            * (100_u32 + game.tx_multiplier.into()))
            / 100;
        game.transactions += tx_rate * seconds_passed.into();

        game.game_time += seconds_passed;
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"ST_0_0_3")
        }
    }

    #[abi(embed_v0)]
    impl TokenDataImpl of IMinigameTokenData<ContractState> {
        fn score(self: @ContractState, token_id: felt252) -> u64 {
            let world = self.world_default();
            let game: Game = world.read_model(token_id);
            game.transactions.into()
        }

        fn game_over(self: @ContractState, token_id: felt252) -> bool {
            let world = self.world_default();
            let game: Game = world.read_model(token_id);
            game.game_time.into() >= GAME_DURATION
        }

        fn score_batch(self: @ContractState, token_ids: Span<felt252>) -> Array<u64> {
            let world = self.world_default();
            let mut scores = array![];
            for token_id in token_ids {
                let game: Game = world.read_model(*token_id);
                scores.append(game.transactions.into());
            }
            scores
        }

        fn game_over_batch(self: @ContractState, token_ids: Span<felt252>) -> Array<bool> {
            let mut results = array![];
            let mut i = 0;
            loop {
                if i >= token_ids.len() {
                    break;
                }
                results.append(self.game_over(*token_ids.at(i)));
                i += 1;
            }
            results
        }
    }

    #[abi(embed_v0)]
    impl SettingsImpl of IMinigameSettings<ContractState> {
        fn settings_exist(self: @ContractState, settings_id: u32) -> bool {
            settings_id == 0
        }

        fn settings_exist_batch(self: @ContractState, settings_ids: Span<u32>) -> Array<bool> {
            let mut results = array![];
            for settings_id in settings_ids {
                results.append(*settings_id == 0);
            }
            results
        }
    }
}
