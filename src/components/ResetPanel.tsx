import { RefreshCwIcon } from 'lucide-react'

interface ResetPanelProps {
  points: number
  crystalsToEarn: number
  onReset: () => void
}

export function ResetPanel({ points, crystalsToEarn, onReset }: ResetPanelProps) {
  return (
    <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg text-center">
      <h3 className="text-2xl font-bold mb-4">Reset Progress</h3>
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
        className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center mx-auto"
      >
        <RefreshCwIcon className="w-5 h-5 mr-2" />
        Reset Progress
      </button>
    </div>
  )
}
