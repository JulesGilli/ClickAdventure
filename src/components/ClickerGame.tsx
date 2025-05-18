import { useEffect, useState } from 'react';
import { ClickArea } from './ClickArea';
import { ResourceDisplay } from './ResourceDisplay';
import { UpgradeShop } from './UpgradeShop';
import { AchievementPanel } from './AchievementPanel';
import { SpecialAbilities } from './SpecialAbilities';
import { ResetPanel } from './ResetPanel';
import { CrystalShop, POSSIBLE_BONUSES } from './CrystalShop'
import { TrophyIcon, ShoppingCartIcon, SparklesIcon } from 'lucide-react';

// Types

type UpgradeType = 'clickPower' | 'autoClicker' | 'doublePoints';

type Upgrade = {
  level: number;
  cost: number;
  increment: number;
  tier: number;
};

type Upgrades = Record<UpgradeType, Upgrade>;

type Ability = {
  id: number;
  level: number;
  name: string;
  description: string;
  cost: number;
  cooldown: number;
  duration: number;
  active: boolean;
  lastUsed: number;
  multiplier: number;
  target: 'click' | 'passive';
};

type Achievement = {
  id: number;
  name: string;
  description: string;
  unlocked: boolean;
  requirement: number;
};

function calculateUpgradeStats(baseCost: number, baseIncrement: number, level: number) {
  const tier = Math.floor(level / 10) + 1;
  const isTierLevel = level > 0 && level % 10 === 0;
  const costMultiplier = Math.pow(1.45, level) * (isTierLevel ? 5 : 1);
  const cost = baseCost * costMultiplier;
  const tierBoost = isTierLevel ? 6.0 : 1;
  const increment = baseIncrement * Math.pow(1.03, level) * tierBoost;
  return {
    tier,
    cost: Math.floor(cost),
    increment: parseFloat(increment.toFixed(2))
  };
}

export function ClickerGame() {
  const [points, setPoints] = useState(0);
  const [pointsPerClick, setPointsPerClick] = useState(1);
  const [pointsPerSecond, setPointsPerSecond] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [clickCount, setClickCount] = useState(0);
  const [prestigeMultiplier, setPrestigeMultiplier] = useState(1);
  const [abilityUses, setAbilityUses] = useState(0);
  const [resetCount, setResetCount] = useState(0);
  const [autoBuyEnabled, setAutoBuyEnabled] = useState(false);
  const [crystals, setCrystals] = useState(0);
  const [activeDraws, setActiveDraws] = useState<BonusDraw[]>([]);

  type BonusDraw = (typeof POSSIBLE_BONUSES)[number] & { id: number };

  const [upgrades, setUpgrades] = useState<Upgrades>(() => {
    const baseUpgrades: Record<UpgradeType, { cost: number; increment: number }> = {
      clickPower: { cost: 10, increment: 1 },
      autoClicker: { cost: 50, increment: 1 },
      doublePoints: { cost: 200, increment: 0.1 }
    };

    const initialUpgrades = {} as Upgrades;
    (Object.keys(baseUpgrades) as UpgradeType[]).forEach(type => {
      const { cost } = calculateUpgradeStats(baseUpgrades[type].cost, baseUpgrades[type].increment, 1);
      initialUpgrades[type] = {
        level: 0,
        cost,
        increment: 0,
        tier: 1
      };
    });
    return initialUpgrades;
  });

  const allAchievements: Achievement[] = [
    { id: 1, name: 'First Click', description: 'Click for the first time', unlocked: false, requirement: 1 },
    { id: 2, name: 'Clicking Pro', description: 'Click 100 times', unlocked: false, requirement: 100 },
    { id: 3, name: 'Clicking Master', description: 'Click 1,000 times', unlocked: false, requirement: 1000 },
    { id: 4, name: 'Clicking God', description: 'Click 10,000 times', unlocked: false, requirement: 10000 },
    { id: 5, name: 'First Fortune', description: 'Earn 1,000 points', unlocked: false, requirement: 1000 },
    { id: 6, name: 'Wealthy', description: 'Earn 10,000 points', unlocked: false, requirement: 10000 },
    { id: 7, name: 'Millionaire', description: 'Earn 1,000,000 points', unlocked: false, requirement: 1000000 },
    { id: 8, name: 'Upgrade Beginner', description: 'Buy 5 upgrades', unlocked: false, requirement: 5 },
    { id: 9, name: 'Upgrade Veteran', description: 'Buy 25 upgrades', unlocked: false, requirement: 25 },
    { id: 10, name: 'Upgrade Master', description: 'Buy 100 upgrades', unlocked: false, requirement: 100 },
    { id: 11, name: 'Passive Player', description: 'Reach 10 passive points/sec', unlocked: false, requirement: 10 },
    { id: 12, name: 'Multiplier Novice', description: 'Reach 2x multiplier', unlocked: false, requirement: 2 },
    { id: 13, name: 'Multiplier Lord', description: 'Reach 10x multiplier', unlocked: false, requirement: 10 },
    { id: 14, name: 'Ability User', description: 'Use abilities 5 times', unlocked: false, requirement: 5 },
    { id: 15, name: 'Ability Abuser', description: 'Use abilities 25 times', unlocked: false, requirement: 25 },
    { id: 16, name: 'First Reset', description: 'Do 1 reset', unlocked: false, requirement: 1 },
    { id: 17, name: 'Reset Lover', description: 'Do 5 resets', unlocked: false, requirement: 5 },
    { id: 18, name: 'Reset Maniac', description: 'Do 10 resets', unlocked: false, requirement: 10 },
    { id: 19, name: 'Prestige Starter', description: 'Get prestige multiplier x10', unlocked: false, requirement: 10 },
    { id: 20, name: 'Prestige Pro', description: 'Get prestige multiplier x100', unlocked: false, requirement: 100 },
    { id: 21, name: 'Ultimate Riches', description: 'Reach 1 billion points', unlocked: false, requirement: 1_000_000_000 },
    { id: 22, name: 'You Win!', description: 'Unlock all achievements', unlocked: false, requirement: 22 },
  ];

  const [achievements, setAchievements] = useState<Achievement[]>(allAchievements);

  const [abilities, setAbilities] = useState<Ability[]>([
    {
      id: 1,
      level: 1,
      name: 'Click Frenzy',
      description: 'Triple your points per click for 10 seconds',
      cost: 200,
      cooldown: 60000,
      duration: 10000,
      active: false,
      lastUsed: 0,
      multiplier: 3,
      target: 'click'
    },
    {
      id: 2,
      level: 1,
      name: 'Double Time',
      description: 'Double your points per second for 10 seconds',
      cost: 100,
      cooldown: 30000,
      duration: 10000,
      active: false,
      lastUsed: 0,
      multiplier: 2,
      target: 'passive'
    }
  ]);
  
  const [activeTab, setActiveTab] = useState<'upgrades' | 'abilities' | 'achievements'>('upgrades');

  const handlePrestigeReset = () => {
    const earnedCrystals = Math.floor(Math.sqrt(points / 1000));
    if (earnedCrystals > 0) {
      setCrystals(prev => prev + earnedCrystals);
    }
  
    // Reset progress
    setPoints(0);
    setPointsPerClick(1);
    setPointsPerSecond(0);
    setMultiplier(1);
    setClickCount(0);
    setResetCount(prev => prev + 1);
  
    setResetCount(prev => {
      const newCount = prev + 1;
      if (newCount === 1) setAutoBuyEnabled(true);
      return newCount;
    });

    const resetUpgrades = { ...upgrades };
    (Object.keys(resetUpgrades) as UpgradeType[]).forEach(type => {
      const baseCost = type === 'clickPower' ? 10 : type === 'autoClicker' ? 50 : 200;
      const baseIncrement = type === 'clickPower' ? 1 : type === 'autoClicker' ? 1 : 0.1;
      const { cost } = calculateUpgradeStats(baseCost, baseIncrement, 1);
      resetUpgrades[type] = {
        level: 0,
        cost,
        increment: 0,
        tier: 1
      };
    });

    setUpgrades(resetUpgrades);

    setAbilities([
      {
        id: 1,
        level: 1,
        name: 'Click Frenzy',
        description: 'Triple your points per click for 10 seconds',
        cost: 200,
        cooldown: 60000,
        duration: 10000,
        active: false,
        lastUsed: 0,
        multiplier: 3,
        target: 'click'
      },
      {
        id: 2,
        level: 1,
        name: 'Double Time',
        description: 'Double your points per second for 10 seconds',
        cost: 100,
        cooldown: 30000,
        duration: 10000,
        active: false,
        lastUsed: 0,
        multiplier: 2,
        target: 'passive'
      }
    ]);

  };

  const handleClick = () => {
    const pointsToAdd = pointsPerClick * multiplier * prestigeMultiplier;
    setPoints(prev => prev + pointsToAdd);
    setClickCount(prev => prev + 1);
    checkAchievements();
  };

  const purchaseUpgrade = (upgradeType: UpgradeType) => {
    const upgrade = upgrades[upgradeType];
    const nextLevel = upgrade.level + 1;

    const baseCost = upgradeType === 'clickPower' ? 10 : upgradeType === 'autoClicker' ? 50 : 200;
    const baseIncrement = upgradeType === 'clickPower' ? 1 : upgradeType === 'autoClicker' ? 1 : 0.1;

    const { cost, increment, tier } = calculateUpgradeStats(baseCost, baseIncrement, nextLevel);

    if (points >= cost) {
      setPoints(prev => prev - cost);
      const { cost: nextCost } = calculateUpgradeStats(baseCost, baseIncrement, nextLevel + 1);
      const newUpgrades = { ...upgrades };
      newUpgrades[upgradeType] = {
        level: nextLevel,
        cost: nextCost,
        increment: upgrade.increment + increment,
        tier
      };
      if (upgradeType === 'clickPower') setPointsPerClick(prev => prev + increment);
      else if (upgradeType === 'autoClicker') setPointsPerSecond(prev => prev + increment);
      else if (upgradeType === 'doublePoints') setMultiplier(prev => prev + increment);
      setUpgrades(newUpgrades);
      checkAchievements();
    }
  };

  const useAbility = (abilityId: number) => {
    const now = Date.now();
    const ability = abilities.find(a => a.id === abilityId);
    if (!ability || ability.active || now - ability.lastUsed < ability.cooldown || points < ability.cost) return;
    setPoints(prev => prev - ability.cost);
    setAbilityUses(prev => prev + 1);
    const updatedAbilities = abilities.map(a => a.id === abilityId ? { ...a, active: true, lastUsed: now } : a);
    setAbilities(updatedAbilities);
    if (ability.target === 'click') {
      setPointsPerClick(prev => prev * ability.multiplier);
      setTimeout(() => {
        setPointsPerClick(prev => prev / ability.multiplier);
        setAbilities(prev => prev.map(a => a.id === abilityId ? { ...a, active: false } : a));
      }, ability.duration);
    } else if (ability.target === 'passive') {
      setMultiplier(prev => prev * ability.multiplier);
      setTimeout(() => {
        setMultiplier(prev => prev / ability.multiplier);
        setAbilities(prev => prev.map(a => a.id === abilityId ? { ...a, active: false } : a));
      }, ability.duration);
    }
  };

  const checkAchievements = () => {
    const newAchievements = [...achievements];
    const totalUpgrades = Object.values(upgrades).reduce((sum, u) => sum + u.level, 0);
    const unlockedCount = newAchievements.filter(a => a.unlocked).length;
    newAchievements.forEach(achievement => {
      if (achievement.unlocked) return;
      const { id, requirement } = achievement;
      if (
        (id === 1 && clickCount >= requirement) ||
        (id === 2 && clickCount >= requirement) ||
        (id === 3 && clickCount >= requirement) ||
        (id === 4 && clickCount >= requirement) ||
        (id === 5 && points >= requirement) ||
        (id === 6 && points >= requirement) ||
        (id === 7 && points >= requirement) ||
        (id === 8 && totalUpgrades >= requirement) ||
        (id === 9 && totalUpgrades >= requirement) ||
        (id === 10 && totalUpgrades >= requirement) ||
        (id === 11 && pointsPerSecond >= requirement) ||
        (id === 12 && multiplier >= requirement) ||
        (id === 13 && multiplier >= requirement) ||
        (id === 14 && abilityUses >= requirement) ||
        (id === 15 && abilityUses >= requirement) ||
        (id === 16 && resetCount >= requirement) ||
        (id === 17 && resetCount >= requirement) ||
        (id === 18 && resetCount >= requirement) ||
        (id === 19 && prestigeMultiplier >= requirement) ||
        (id === 20 && prestigeMultiplier >= requirement) ||
        (id === 21 && points >= requirement) ||
        (id === 22 && unlockedCount >= 21)
      ) {
        achievement.unlocked = true;
      }
    });
    setAchievements(newAchievements);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (pointsPerSecond > 0) {
        setPoints(prev => prev + pointsPerSecond * multiplier * prestigeMultiplier);
        checkAchievements();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [pointsPerSecond, multiplier, prestigeMultiplier]);

  useEffect(() => {
    const upgradeAbilities = () => {
      setAbilities(prevAbilities =>
        prevAbilities.map(ability => {
          if (ability.level === 1 && points >= 100000) {
            return {
              ...ability,
              level: 2,
              name: ability.name + ' II',
              description: ability.target === 'click'
                ? '5x points per click for 12 seconds'
                : '3x points per second for 12 seconds',
              multiplier: ability.target === 'click' ? 5 : 3,
              cost: ability.cost * 5,
              cooldown: ability.cooldown * 2,
              duration: 12000
            };
          }
          return ability;
        })
      );
    };
    upgradeAbilities();
  }, [points]);

  useEffect(() => {
    if (!autoBuyEnabled) return;
  
    const tryAutoBuy = () => {
      const affordableUpgrades = (Object.keys(upgrades) as UpgradeType[])
        .filter(type => points >= upgrades[type].cost)
        .sort((a, b) => upgrades[a].cost - upgrades[b].cost);
    
      if (affordableUpgrades.length > 0) {
        purchaseUpgrade(affordableUpgrades[0]); // Achète l'upgrade la moins chère
      }
    };
  
    const interval = setInterval(tryAutoBuy, 1000); // toutes les secondes
    return () => clearInterval(interval);
  }, [autoBuyEnabled, points, upgrades]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Clicker Adventure</h1>
      <ResourceDisplay points={points} pointsPerClick={pointsPerClick} pointsPerSecond={pointsPerSecond} multiplier={multiplier} />
      <ClickArea handleClick={handleClick} pointsPerClick={pointsPerClick} multiplier={multiplier} prestigeMultiplier={prestigeMultiplier} />
      <div className="mt-8 bg-gray-800 bg-opacity-50 rounded-lg p-4">
      <div className="flex justify-between items-center border-b border-gray-700 mb-4">
  <div className="flex">
    <button className={`flex items-center px-4 py-2 ${activeTab === 'upgrades' ? 'bg-purple-700 rounded-t-lg' : 'text-gray-300'}`} onClick={() => setActiveTab('upgrades')}>
      <ShoppingCartIcon className="w-5 h-5 mr-1" /> Upgrades
    </button>
    <button className={`flex items-center px-4 py-2 ${activeTab === 'abilities' ? 'bg-purple-700 rounded-t-lg' : 'text-gray-300'}`} onClick={() => setActiveTab('abilities')}>
      <SparklesIcon className="w-5 h-5 mr-1" /> Abilities
    </button>
    <button className={`flex items-center px-4 py-2 ${activeTab === 'achievements' ? 'bg-purple-700 rounded-t-lg' : 'text-gray-300'}`} onClick={() => setActiveTab('achievements')}>
      <TrophyIcon className="w-5 h-5 mr-1" /> Achievements
    </button>
  </div>

  {resetCount > 0 && (
  <label className="flex items-center gap-2 text-white text-sm pr-2">
    <input
      type="checkbox"
      checked={autoBuyEnabled}
      onChange={() => setAutoBuyEnabled(prev => !prev)}
      className="w-4 h-4"
    />
    Auto-Buy
  </label>
)}
</div>
        {activeTab === 'upgrades' && <UpgradeShop upgrades={upgrades} points={points} purchaseUpgrade={purchaseUpgrade} />}
        {activeTab === 'abilities' && <SpecialAbilities abilities={abilities} points={points} useAbility={useAbility} />}
        {activeTab === 'achievements' && <AchievementPanel achievements={achievements} />}
        {points >= 1_000_000 && (
  <ResetPanel
    points={points}
    crystalsToEarn={Math.floor(Math.sqrt(points / 1000))}
    onReset={handlePrestigeReset}
  />
)}
      </div>
    </div>
  );
}
