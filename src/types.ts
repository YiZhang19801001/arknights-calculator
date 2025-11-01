export type LevelUp = {
  level: number;
  sanityReward: number;
  reputation: number;
};

export type Results = {
  hours: string;
  totalMinutes: number;
  totalDays: number;
  totalWeeks: number;
  naturalRegen: number;
  extraSanity: number;
  weeklySanityPotions: number;
  totalSanityUsed: number;
  finalLevel: number;
  finalReputation: string;
  levelUps: LevelUp[];
  totalSanityFromLevelUp: number;
  targetPulls: number;
  totalOrundum: number;
  dailyOrundum: number;
  freeOrundum: number;
  orundumGap: number;
  needOriginite: number;
  sanityPerOriginite: string | number;
  orundumStageSanity: number;
  originiteStageSanity: number;
  weeklyOrundumReward: number;
  annihilationCount: number;
  annihilationOrundum: number;
  weeklyMissionOrundum: number;
  extraOrundum: number;
  orundumFromStages: number;
  totalObtainedOrundum: number;
};

export type CalculatorInputs = {
  startDate: string;
  endDate: string;
  extraSanity: number;
  targetPulls: number;
  annihilationCount: number;
  extraOrundum: number;
};
