import { useEffect, useState } from 'react';
import { ClickArea } from './ClickArea';
import { ResourceDisplay } from './ResourceDisplay';
import { UpgradeShop } from './UpgradeShop';
import { AchievementPanel } from './AchievementPanel';
import { SpecialAbilities } from './SpecialAbilities';
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

  const tierBoost = isTierLevel ? 6.0 : 1; // +500% of base = x6 multiplier
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

  const [upgrades, setUpgrades] = useState<Upgrades>(() => {
    const baseUpgrades: Record<UpgradeType, { cost: number; increment: number }> = {
      clickPower: { cost: 10, increment: 1 },
      autoClicker: { cost: 50, increment: 1 },
      doublePoints: { cost: 200, increment: 0.1 }
    };

    const initialUpgrades = {} as Upgrades;
    (Object.keys(baseUpgrades) as UpgradeType[]).forEach(type => {
      const { cost, increment } = calculateUpgradeStats(baseUpgrades[type].cost, baseUpgrades[type].increment, 1);
      initialUpgrades[type] = {
        level: 0,
        cost,
        increment: 0,
        tier: 1
      };
    });
    return initialUpgrades;
  });

  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: 1, name: 'First Click', description: 'Click for the first time', unlocked: false, requirement: 1 },
    { id: 2, name: 'Clicking Pro', description: 'Click 100 times', unlocked: false, requirement: 100 },
    { id: 3, name: 'Clicking Master', description: 'Click 1000 times', unlocked: false, requirement: 1000 },
    { id: 4, name: 'Rich Clicker', description: 'Earn 1000 points', unlocked: false, requirement: 1000 },
    { id: 5, name: 'Upgrade Enthusiast', description: 'Buy 5 upgrades', unlocked: false, requirement: 5 },
  ]);

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

  const handleClick = () => {
    const pointsToAdd = pointsPerClick * multiplier;
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

      if (upgradeType === 'clickPower') {
        setPointsPerClick(prev => prev + increment);
      } else if (upgradeType === 'autoClicker') {
        setPointsPerSecond(prev => prev + increment);
      } else if (upgradeType === 'doublePoints') {
        setMultiplier(prev => prev + increment);
      }

      setUpgrades(newUpgrades);
      checkAchievements();
    }
  };

  const useAbility = (abilityId: number) => {
    const now = Date.now();
    const ability = abilities.find(a => a.id === abilityId);
    if (!ability || ability.active || now - ability.lastUsed < ability.cooldown || points < ability.cost) return;

    setPoints(prev => prev - ability.cost);

    const updatedAbilities = abilities.map(a =>
      a.id === abilityId ? { ...a, active: true, lastUsed: now } : a
    );
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

    newAchievements.forEach(achievement => {
      if (!achievement.unlocked) {
        if (achievement.id <= 3 && clickCount >= achievement.requirement) {
          achievement.unlocked = true;
        } else if (achievement.id === 4 && points >= achievement.requirement) {
          achievement.unlocked = true;
        } else if (achievement.id === 5) {
          const totalUpgrades = Object.values(upgrades).reduce((total, u) => total + u.level, 0);
          if (totalUpgrades >= achievement.requirement) {
            achievement.unlocked = true;
          }
        }
      }
    });

    setAchievements(newAchievements);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (pointsPerSecond > 0) {
        setPoints(prev => prev + pointsPerSecond * multiplier);
        checkAchievements();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [pointsPerSecond, multiplier]);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Clicker Adventure</h1>
      <ResourceDisplay points={points} pointsPerClick={pointsPerClick} pointsPerSecond={pointsPerSecond} multiplier={multiplier} />
      <ClickArea handleClick={handleClick} pointsPerClick={pointsPerClick} multiplier={multiplier} />
      <div className="mt-8 bg-gray-800 bg-opacity-50 rounded-lg p-4">
        <div className="flex border-b border-gray-700 mb-4">
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
        {activeTab === 'upgrades' && <UpgradeShop upgrades={upgrades} points={points} purchaseUpgrade={purchaseUpgrade} />}
        {activeTab === 'abilities' && <SpecialAbilities abilities={abilities} points={points} useAbility={useAbility} />}
        {activeTab === 'achievements' && <AchievementPanel achievements={achievements} />}
      </div>
    </div>
  );
}
