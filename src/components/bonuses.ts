export type BonusType = {
    id: number;
    name: string;
    rarity: 'common' | 'rare' | 'epic';
    bonus: number;
    type: 'clickMultiplier' | 'autoMultiplier' | 'prestigeMultiplier';
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
      bonus: 0.5,
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
      bonus: 1.0,
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
      bonus: 2.0,
      type: 'autoMultiplier',
    },
  ] as const;
  