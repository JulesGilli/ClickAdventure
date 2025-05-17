export function calculateUpgradeStats(
    baseCost: number,
    baseIncrement: number,
    level: number
  ) {
    const tier = Math.floor(level / 10) + 1;
    const isTierLevel = level > 0 && level % 10 === 0;
  
    const exponentialCost = baseCost * Math.pow(1.2, level);
    const cost = isTierLevel ? exponentialCost * 3 : exponentialCost;
  
    const exponentialIncrement = baseIncrement * Math.pow(1.1, level);
    const increment = isTierLevel ? exponentialIncrement * 2 : exponentialIncrement;
  
    return {
      tier,
      cost: Math.floor(cost),
      increment: parseFloat(increment.toFixed(2))
    };
  }
  