#[derive(IntrospectPacked, Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct Game {
    #[key]
    pub game_id: felt252,
    // Resources
    pub capital: u16,
    pub users: u16,
    pub research: u16,
    pub transactions: u32,
    // Production rates (per second)
    pub capital_production: u16,
    pub users_production: u16,
    pub research_production: u16,
    pub transactions_production: u16,
    // Multipliers (1 = 1%)
    pub users_multiplier: u8,
    pub research_multiplier: u8,
    pub tx_multiplier: u8,
    // Seconds passed since game start
    pub game_time: u16,
    // Market
    pub market_size: u8,
    pub market_packed: u32,
    pub refresh_count: u8,
}

#[derive(IntrospectPacked, Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct Board {
    #[key]
    pub game_id: felt252,
    pub seed: u64,
}

#[derive(IntrospectPacked, Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct Building {
    #[key]
    pub game_id: felt252,
    #[key]
    pub position_id: u8,
    pub building_id: u8,
    pub upgrade_level: u8,
}
