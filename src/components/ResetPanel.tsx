import { RefreshCwIcon } from 'lucide-react'

type ResetPanelProps = {
    points: number;
    crystalsToEarn: number;
    onReset: () => void;
    canReset: boolean;
  };

export function ResetPanel({ points, crystalsToEarn, onReset }: ResetPanelProps) {
  return (
    <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg text-center">
      <h3 className="text-2xl font-bold mb-4">Prestige Reset</h3>
      <p className="text-gray-300 mb-6">
        Reset all your progress to earn crystals. Crystals can be used for permanent bonuses.
      </p>
      <div className="bg-indigo-900 bg-opacity-50 p-4 rounded-lg mb-6">
        <p className="text-lg mb-2">You will receive:</p>
        <p className="text-3xl font-bold text-purple-300">
          {crystalsToEarn} Crystals
        </p>
        <p className="text-sm text-gray-400 mt-2">
          (Based on total points: {Math.floor(points).toLocaleString()})
        </p>
      </div>
      <button
  onClick={onReset}
  className="w-full h-40 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center hover:from-blue-500 hover:to-purple-500 transition-colors shadow-lg overflow-hidden relative"
>
  <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity"></div>
  <div className="flex flex-col items-center">
    <RefreshCwIcon className="w-8 h-8 mb-2 animate-spin-slow" />
    <span className="text-xl font-bold">PRESTIGE RESET</span>
  </div>
</button>
    </div>
  )
}
