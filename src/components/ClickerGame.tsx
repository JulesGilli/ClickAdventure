import React, { useEffect, useState } from 'react';
import { ClickArea } from './ClickArea';
import { ResourceDisplay } from './ResourceDisplay';
import { UpgradeShop } from './UpgradeShop';
import { AchievementPanel } from './AchievementPanel';
import { SpecialAbilities } from './SpecialAbilities';
import { ZapIcon, TrophyIcon, ShoppingCartIcon, SparklesIcon } from 'lucide-react';
export function ClickerGame() {
  // Core game state
  const [points, setPoints] = useState(0);
  const [pointsPerClick, setPointsPerClick] = useState(1);
  const [pointsPerSecond, setPointsPerSecond] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [clickCount, setClickCount] = useState(0);
  // Upgrades state
  const [upgrades, setUpgrades] = useState({
    clickPower: {
      level: 0,
      cost: 10,
      increment: 1
    },
    autoClicker: {
      level: 0,
      cost: 50,
      increment: 1
    },
    doublePoints: {
      level: 0,
      cost: 200,
      increment: 0.1
    }
  });
  // Achievements state
  const [achievements, setAchievements] = useState([{
    id: 1,
    name: 'First Click',
    description: 'Click for the first time',
    unlocked: false,
    requirement: 1
  }, {
    id: 2,
    name: 'Clicking Pro',
    description: 'Click 100 times',
    unlocked: false,
    requirement: 100
  }, {
    id: 3,
    name: 'Clicking Master',
    description: 'Click 1000 times',
    unlocked: false,
    requirement: 1000
  }, {
    id: 4,
    name: 'Rich Clicker',
    description: 'Earn 1000 points',
    unlocked: false,
    requirement: 1000
  }, {
    id: 5,
    name: 'Upgrade Enthusiast',
    description: 'Buy 5 upgrades',
    unlocked: false,
    requirement: 5
  }]);
  // Special abilities state
  const [abilities, setAbilities] = useState([{
    id: 1,
    name: 'Double Time',
    description: 'Double your points per second for 10 seconds',
    cost: 100,
    cooldown: 30000,
    duration: 10000,
    active: false,
    lastUsed: 0
  }, {
    id: 2,
    name: 'Click Frenzy',
    description: 'Triple your points per click for 10 seconds',
    cost: 200,
    cooldown: 60000,
    duration: 10000,
    active: false,
    lastUsed: 0
  }]);
  // Active tabs state
  const [activeTab, setActiveTab] = useState('upgrades');
  // Handle clicking
  const handleClick = () => {
    const pointsToAdd = pointsPerClick * multiplier;
    setPoints(prev => prev + pointsToAdd);
    setClickCount(prev => prev + 1);
    checkAchievements();
  };
  // Handle purchasing upgrades
  const purchaseUpgrade = upgradeType => {
    const upgrade = upgrades[upgradeType];
    if (points >= upgrade.cost) {
      setPoints(prev => prev - upgrade.cost);
      const newUpgrades = {
        ...upgrades
      };
      newUpgrades[upgradeType].level += 1;
      newUpgrades[upgradeType].cost = Math.floor(upgrade.cost * 1.5);
      if (upgradeType === 'clickPower') {
        setPointsPerClick(prev => prev + upgrade.increment);
      } else if (upgradeType === 'autoClicker') {
        setPointsPerSecond(prev => prev + upgrade.increment);
      } else if (upgradeType === 'doublePoints') {
        setMultiplier(prev => prev + upgrade.increment);
      }
      setUpgrades(newUpgrades);
      checkAchievements();
    }
  };
  // Handle using special abilities
  const useAbility = abilityId => {
    const now = Date.now();
    const ability = abilities.find(a => a.id === abilityId);
    if (!ability || ability.active || now - ability.lastUsed < ability.cooldown || points < ability.cost) {
      return;
    }
    setPoints(prev => prev - ability.cost);
    const newAbilities = abilities.map(a => {
      if (a.id === abilityId) {
        return {
          ...a,
          active: true,
          lastUsed: now
        };
      }
      return a;
    });
    setAbilities(newAbilities);
    if (abilityId === 1) {
      setMultiplier(prev => prev * 2);
      setTimeout(() => {
        setMultiplier(prev => prev / 2);
        setAbilities(prev => prev.map(a => a.id === abilityId ? {
          ...a,
          active: false
        } : a));
      }, ability.duration);
    } else if (abilityId === 2) {
      setPointsPerClick(prev => prev * 3);
      setTimeout(() => {
        setPointsPerClick(prev => prev / 3);
        setAbilities(prev => prev.map(a => a.id === abilityId ? {
          ...a,
          active: false
        } : a));
      }, ability.duration);
    }
  };
  // Check for achievements
  const checkAchievements = () => {
    const newAchievements = [...achievements];
    // Check click count achievements
    const clickAchievements = newAchievements.filter(a => a.id <= 3 && !a.unlocked);
    clickAchievements.forEach(achievement => {
      if (clickCount >= achievement.requirement) {
        achievement.unlocked = true;
      }
    });
    // Check points achievement
    const pointsAchievement = newAchievements.find(a => a.id === 4);
    if (pointsAchievement && !pointsAchievement.unlocked && points >= pointsAchievement.requirement) {
      pointsAchievement.unlocked = true;
    }
    // Check upgrade achievement
    const upgradeAchievement = newAchievements.find(a => a.id === 5);
    if (upgradeAchievement && !upgradeAchievement.unlocked) {
      const totalUpgrades = Object.values(upgrades).reduce((total, upgrade) => total + upgrade.level, 0);
      if (totalUpgrades >= upgradeAchievement.requirement) {
        upgradeAchievement.unlocked = true;
      }
    }
    setAchievements(newAchievements);
  };
  // Auto-clicker effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (pointsPerSecond > 0) {
        setPoints(prev => prev + pointsPerSecond * multiplier);
        checkAchievements();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [pointsPerSecond, multiplier]);
  return <div className="container mx-auto px-4 py-8">
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
    </div>;
}