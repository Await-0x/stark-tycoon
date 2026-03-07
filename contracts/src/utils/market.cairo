use crate::constants::TOTAL_BUILDINGS;

/// Compute 32^exp using repeated multiplication.
pub fn pow32(exp: u8) -> u64 {
    let mut result: u64 = 1;
    let mut i: u8 = 0;
    loop {
        if i >= exp {
            break;
        }
        result *= 32;
        i += 1;
    }
    result
}

/// Extract the building_id stored at the given slot (5 bits per slot).
pub fn get_slot(packed: u64, slot: u8) -> u8 {
    ((packed / pow32(slot)) % 32).try_into().unwrap()
}

/// Replace the building_id at the given slot, returning the updated packed value.
pub fn set_slot(packed: u64, slot: u8, new_value: u8) -> u64 {
    let old_value: u64 = get_slot(packed, slot).into();
    let factor = pow32(slot);
    packed - old_value * factor + new_value.into() * factor
}

/// Find the slot index containing `building_id`. Returns None if not found.
pub fn find_building(packed: u64, building_id: u8, market_size: u8) -> Option<u8> {
    let mut i: u8 = 0;
    loop {
        if i >= market_size {
            break Option::None;
        }
        if get_slot(packed, i) == building_id {
            break Option::Some(i);
        }
        i += 1;
    }
}

/// Derive N building IDs (1..=TOTAL_BUILDINGS) from a VRF seed and pack them.
pub fn pack_market_from_seed(seed: felt252, market_size: u8) -> u64 {
    let mut value: u256 = seed.into();
    let total: u256 = TOTAL_BUILDINGS.into();
    let mut packed: u64 = 0;
    let mut i: u8 = 0;
    loop {
        if i >= market_size {
            break;
        }
        let building_id: u8 = (value % total).try_into().unwrap() + 1;
        packed = packed + building_id.into() * pow32(i);
        value = value / total;
        i += 1;
    }
    packed
}

/// Replace one slot with a new building derived from a fresh VRF seed.
pub fn replace_slot_from_seed(packed: u64, slot: u8, seed: felt252) -> u64 {
    let value: u256 = seed.into();
    let total: u256 = TOTAL_BUILDINGS.into();
    let building_id: u8 = (value % total).try_into().unwrap() + 1;
    set_slot(packed, slot, building_id)
}
