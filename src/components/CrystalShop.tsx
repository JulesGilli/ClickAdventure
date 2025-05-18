import React from 'react'
import { SparklesIcon, GemIcon } from 'lucide-react'

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
]

const RARITY_COLORS = {
  common: 'text-gray-300',
  rare: 'text-blue-300',
  epic: 'text-purple-300',
}

export function CrystalShop({ crystals, onDraw, activeDraws }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Crystal Shop</h3>
        <div className="flex items-center bg-purple-900 bg-opacity-50 px-3 py-1 rounded-lg">
          <GemIcon className="w-5 h-5 text-purple-300 mr-2" />
          <span className="text-purple-300 font-bold">{crystals}</span>
        </div>
      </div>
      <div className="grid gap-6">
        <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
          <div className="text-center mb-4">
            <h4 className="font-bold text-lg mb-2">Draw Bonus (10 Crystals)</h4>
            <p className="text-sm text-gray-300">Draw a random permanent bonus</p>
          </div>
          <button
            onClick={onDraw}
            disabled={crystals < 10}
            className={`w-full py-3 rounded-lg flex items-center justify-center font-bold ${crystals >= 10 ? 'bg-purple-600 hover:bg-purple-500' : 'bg-gray-700 cursor-not-allowed'}`}
          >
            <SparklesIcon className="w-5 h-5 mr-2" />
            Draw Bonus
          </button>
        </div>
        <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
          <h4 className="font-bold mb-3">Active Bonuses</h4>
          <div className="space-y-2">
            {activeDraws.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No active bonuses yet</p>
            ) : (
              activeDraws.map((draw) => (
                <div
                  key={draw.id}
                  className="flex justify-between items-center bg-gray-700 bg-opacity-50 p-2 rounded"
                >
                  <div>
                    <p className={`font-bold ${RARITY_COLORS[draw.rarity]}`}>
                      {draw.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {draw.type === 'clickMultiplier'
                        ? 'Click Power'
                        : 'Auto-Click Power'}{' '}
                      +{draw.bonus * 100}%
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs ${RARITY_COLORS[draw.rarity]}`}>
                    {draw.rarity}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
