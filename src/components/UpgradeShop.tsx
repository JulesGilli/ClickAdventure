import React from 'react';
import { MousePointerClickIcon, ZapIcon, ArrowBigUpIcon } from 'lucide-react';
export function UpgradeShop({
  upgrades,
  points,
  purchaseUpgrade
}) {
  const upgradeItems = [{
    type: 'clickPower',
    name: 'Click Power',
    description: 'Increase points per click',
    icon: <MousePointerClickIcon className="w-6 h-6" />,
    color: 'bg-blue-500'
  }, {
    type: 'autoClicker',
    name: 'Auto Clicker',
    description: 'Generate points automatically',
    icon: <ZapIcon className="w-6 h-6" />,
    color: 'bg-green-500'
  }, {
    type: 'doublePoints',
    name: 'Multiplier',
    description: 'Increase all point gains',
    icon: <ArrowBigUpIcon className="w-6 h-6" />,
    color: 'bg-purple-500'
  }];
  return <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {upgradeItems.map(item => {
      const upgrade = upgrades[item.type];
      const canAfford = points >= upgrade.cost;
      return <div key={item.type} className="bg-gray-800 bg-opacity-50 p-4 rounded-lg shadow-lg">
            <div className="flex items-center mb-3">
              <div className={`${item.color} p-2 rounded-full mr-3`}>
                {item.icon}
              </div>
              <div>
                <h3 className="font-bold">{item.name}</h3>
                <p className="text-xs text-gray-300">Level: {upgrade.level}</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 mb-3">{item.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-yellow-300 flex items-center">
                <div className="w-4 h-4 mr-1" /> {upgrade.cost}
              </span>
              <button onClick={() => purchaseUpgrade(item.type)} disabled={!canAfford} className={`px-3 py-1 rounded-md ${canAfford ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-gray-600 cursor-not-allowed'}`}>
                Buy
              </button>
            </div>
          </div>;
    })}
    </div>;
}