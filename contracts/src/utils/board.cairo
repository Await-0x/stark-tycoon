use crate::models::Game;

#[derive(Copy, Drop)]
pub struct TileBonus {
    pub bonus_type: u8,
    pub bonus_value: u16,
}

pub fn derive_tile_bonus(seed: u64, position_id: u8) -> TileBonus {
    let mut entropy: u64 = seed;

    let mut i: u8 = 0;
    while i < position_id {
        entropy = entropy / 40;
        i += 1;
    }

    let bonus_type: u8 = (entropy % 8).try_into().unwrap();
    let raw_value: u16 = ((entropy / 8) % 5).try_into().unwrap();

    let bonus_value: u16 = match bonus_type {
        0 => 0,
        1 => raw_value + 1,
        2 => (raw_value % 3) + 1,
        3 => (raw_value % 3) + 1,
        4 => (raw_value + 1) * 100,
        5 => (raw_value % 3 + 1) * 100,
        6 => (raw_value % 3 + 1) * 100,
        7 => (raw_value % 3 + 1) * 100,
        _ => 0,
    };

    TileBonus { bonus_type, bonus_value }
}

pub fn apply_tile_bonus(ref game: Game, bonus: TileBonus) {
    match bonus.bonus_type {
        0 => {},
        1 => { game.capital_production += bonus.bonus_value; },
        2 => { game.users_production += bonus.bonus_value; },
        3 => { game.research_production += bonus.bonus_value; },
        4 => { game.capital += bonus.bonus_value; },
        5 => { game.users += bonus.bonus_value; },
        6 => { game.research += bonus.bonus_value; },
        7 => { game.transactions += bonus.bonus_value.into(); },
        _ => {},
    }
}
