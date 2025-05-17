import React from 'react';
import { SparklesIcon, ClockIcon } from 'lucide-react';
export function SpecialAbilities({
  abilities,
  points,
  useAbility
}) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {abilities.map(ability => {
      const now = Date.now();
      const cooldownRemaining = Math.max(0, ability.cooldown - (now - ability.lastUsed));
      const cooldownPercent = cooldownRemaining / ability.cooldown * 100;
      const canUse = cooldownRemaining === 0 && !ability.active && points >= ability.cost;
      return <div key={ability.id} className="bg-gray-800 bg-opacity-50 p-4 rounded-lg shadow-lg relative overflow-hidden">
            {/* Cooldown overlay */}
            {cooldownRemaining > 0 && <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="flex items-center">
                  <ClockIcon className="w-5 h-5 mr-2 text-red-400" />
                  <span>{Math.ceil(cooldownRemaining / 1000)}s</span>
                </div>
              </div>}
            {/* Active indicator */}
            {ability.active && <div className="absolute inset-0 border-2 border-yellow-400 animate-pulse rounded-lg pointer-events-none"></div>}
            <div className="flex items-center mb-3">
              <div className="bg-indigo-500 p-2 rounded-full mr-3">
                <SparklesIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold">{ability.name}</h3>
                <p className="text-xs text-gray-300">
                  Duration: {ability.duration / 1000}s | Cooldown:{' '}
                  {ability.cooldown / 1000}s
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-300 mb-3">{ability.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-yellow-300 flex items-center">
                <div className="w-4 h-4 mr-1" /> {ability.cost}
              </span>
              <button onClick={() => useAbility(ability.id)} disabled={!canUse} className={`px-3 py-1 rounded-md ${canUse ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-gray-600 cursor-not-allowed'}`}>
                {ability.active ? 'Active' : 'Use'}
              </button>
            </div>
            {/* Cooldown progress bar */}
            {cooldownRemaining > 0 && <div className="w-full bg-gray-700 h-1 mt-3 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full" style={{
            width: `${100 - cooldownPercent}%`
          }}></div>
              </div>}
          </div>;
    })}
    </div>;
}