import { ZapIcon, MousePointerClickIcon } from 'lucide-react';

type Props = {
  points: number;
  pointsPerClick: number;
  pointsPerSecond: number;
  multiplier: number;
};

export function ResourceDisplay({
  points,
  pointsPerClick,
  pointsPerSecond,
  multiplier
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

      {/* Points */}
      <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg shadow-lg flex items-center">
        <div className="bg-yellow-500 p-3 rounded-full mr-4">
          <div className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-sm text-gray-300">Points</h3>
          <p className="text-2xl font-bold">
            {Math.floor(points).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Per Click */}
      <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg shadow-lg flex items-center">
        <div className="bg-blue-500 p-3 rounded-full mr-4">
          <MousePointerClickIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-sm text-gray-300">Per Click</h3>
          <p className="text-2xl font-bold">
            {(pointsPerClick * multiplier).toFixed(1)}
          </p>
        </div>
      </div>

      {/* Per Second */}
      <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg shadow-lg flex items-center">
        <div className="bg-green-500 p-3 rounded-full mr-4">
          <ZapIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-sm text-gray-300">Per Second</h3>
          <p className="text-2xl font-bold">
            {pointsPerSecond.toFixed(1)}
          </p>
        </div>
      </div>
    </div>
  );
}
