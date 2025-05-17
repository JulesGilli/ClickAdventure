import { TrophyIcon, LockIcon, UnlockIcon } from 'lucide-react';

type Achievement = {
  id: number;
  name: string;
  description: string;
  unlocked: boolean;
};

type Props = {
  achievements: Achievement[];
};

export function AchievementPanel({ achievements }: Props) {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Achievements</h3>
        <span className="bg-yellow-600 px-2 py-1 rounded-md text-sm">
          {unlockedCount}/{achievements.length} Unlocked
        </span>
      </div>
      <div className="space-y-3">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`flex items-center p-3 rounded-lg ${
              achievement.unlocked
                ? 'bg-gradient-to-r from-yellow-900 to-yellow-700'
                : 'bg-gray-700 bg-opacity-50'
            }`}
          >
            <div
              className={`p-2 rounded-full mr-3 ${
                achievement.unlocked ? 'bg-yellow-500' : 'bg-gray-600'
              }`}
            >
              {achievement.unlocked ? (
                <TrophyIcon className="w-5 h-5 text-yellow-100" />
              ) : (
                <LockIcon className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <div>
              <h4 className="font-bold">{achievement.name}</h4>
              <p className="text-sm text-gray-300">{achievement.description}</p>
            </div>
            {achievement.unlocked && (
              <UnlockIcon className="w-5 h-5 text-yellow-300 ml-auto" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
