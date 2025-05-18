import { useState, MouseEvent } from 'react';
import { MousePointerClickIcon } from 'lucide-react';

type Props = {
  handleClick: () => void;
  pointsPerClick: number;
  multiplier: number;
  prestigeMultiplier: number; // <- il manquait cette prop
};

type ClickEffect = {
  id: number;
  x: number;
  y: number;
  points: number;
};

export function ClickArea({ handleClick, pointsPerClick, multiplier, prestigeMultiplier }: Props) {
  const [clickEffects, setClickEffects] = useState<ClickEffect[]>([]);

  const handleAreaClick = (e: MouseEvent<HTMLButtonElement>) => {
    handleClick();

    const id = Date.now();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const points = pointsPerClick * multiplier * prestigeMultiplier; // <- correction ici

    setClickEffects(prev => [
      ...prev,
      { id, x, y, points: Math.floor(points) }
    ]);

    setTimeout(() => {
      setClickEffects(prev => prev.filter(effect => effect.id !== id));
    }, 1000);
  };

  return (
    <div className="relative">
      <button
        onClick={handleAreaClick}
        className="w-full h-40 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center hover:from-blue-500 hover:to-purple-500 transition-colors shadow-lg overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity"></div>
        <div className="flex flex-col items-center">
          <MousePointerClickIcon className="w-12 h-12 mb-2 animate-bounce" />
          <span className="text-xl font-bold">CLICK ME!</span>
        </div>
      </button>

      {clickEffects.map(effect => (
        <div
          key={effect.id}
          className="absolute pointer-events-none text-yellow-300 font-bold text-lg animate-fly-up"
          style={{
            left: `${effect.x}px`,
            top: `${effect.y}px`,
            textShadow: '0 0 5px rgba(0,0,0,0.5)'
          }}
        >
          +{effect.points}
        </div>
      ))}
    </div>
  );
}
