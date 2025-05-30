const levelThresholds = [0, 100, 250, 500, 750, 1000, 1500, 2000, 3000, 4000, 5000]

export function getLevelFromXP(totalXP: number): number {
  for (let i = levelThresholds.length - 1; i >= 0; i--) {
    if (totalXP >= levelThresholds[i]) {
      return i + 1
    }
  }
  return 1
}
