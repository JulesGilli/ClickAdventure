export type BonusType = {
    id: number;
    name: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
    bonus: number;
    type: 'clickMultiplier' | 'autoMultiplier' | 'multiplierBonus';
  };

export const POSSIBLE_BONUSES = [
    {
      id: 1,
      name: 'Click Master',
      rarity: 'common',
      bonus: 0.5,
      type: 'clickMultiplier',
    },
    {
      id: 2,
      name: 'Speed Demon',
      rarity: 'common',
      bonus: 1.0,
      type: 'autoMultiplier',
    },
    {
      id: 3,
      name: 'Lucky Star',
      rarity: 'rare',
      bonus: 1.0,
      type: 'clickMultiplier',
    },
    {
      id: 4,
      name: 'Time Lord',
      rarity: 'rare',
      bonus: 2.0,
      type: 'autoMultiplier',
    },
    {
      id: 5,
      name: 'Golden Touch',
      rarity: 'epic',
      bonus: 2.0,
      type: 'clickMultiplier',
    },
    {
      id: 6,
      name: 'Infinity Engine',
      rarity: 'epic',
      bonus: 5.0,
      type: 'autoMultiplier',
    },
     {
    id: 7,
    name: 'Legendary Clicker',
    rarity: 'legendary',
    bonus: 5.0,
    type: 'clickMultiplier',
  },
  {
    id: 8,
    name: 'Legendary Engine',
    rarity: 'legendary',
    bonus: 10.0,
    type: 'autoMultiplier',
  },
  {
    id: 9,
    name: 'Legendary Prestige',
    rarity: 'legendary',
    bonus: 5.0,
    type: 'multiplierBonus',
  },

  // Nouveaux Mythic bonuses
  {
    id: 10,
    name: 'Mythic Clicker',
    rarity: 'mythic',
    bonus: 20.0,
    type: 'clickMultiplier',
  },
  {
    id: 11,
    name: 'Mythic Engine',
    rarity: 'mythic',
    bonus: 50.0,
    type: 'autoMultiplier',
  },
  {
    id: 12,
    name: 'Mythic Prestige',
    rarity: 'mythic',
    bonus: 20.0,
    type: 'multiplierBonus',
  },
  ] as const;
  