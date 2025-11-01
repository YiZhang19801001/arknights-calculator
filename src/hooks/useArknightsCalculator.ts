import { useCallback, useState } from 'react';
import { levels } from '../assets/data';
import * as C from '../constants';
import { type CalculatorInputs, type LevelUp, type Results } from '../types';

// Pure helper function to calculate the number of unique weeks between two dates.
const getWeeksInRange = (start: Date, end: Date): number => {
  const weeks = new Set<string>();
  const current = new Date(start);

  while (current <= end) {
    const year = current.getFullYear();
    // Simplified week number calculation
    const startOfYear = new Date(year, 0, 1);
    const days = Math.floor(
      (current.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)
    );
    const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
    weeks.add(`${year}-W${weekNumber}`);
    current.setDate(current.getDate() + 7); // Jump to the next week
  }

  return weeks.size;
};

// Pure helper function to simulate sanity usage and level-ups.
const simulateSanityUsage = (
  availableSanity: number,
  currentLevel: number,
  currentReputation: number,
  reputationPerSanity: number
): {
  sanityUsed: number;
  levelUps: LevelUp[];
  finalLevel: number;
  finalReputation: number;
} => {
  let sanityUsed = 0;
  const levelUps: LevelUp[] = [];
  let level = currentLevel;
  let reputation = currentReputation;

  while (availableSanity > 0 && level < C.MAX_LEVEL) {
    availableSanity--;
    sanityUsed++;
    reputation += reputationPerSanity;

    const currentLevelData = levels[level - 1];
    if (reputation >= currentLevelData.reqReputation) {
      reputation -= currentLevelData.reqReputation;
      level++;
      const newLevelData = levels[level - 1];
      const sanityReward = newLevelData.cap;

      levelUps.push({
        level: level,
        sanityReward: sanityReward,
        reputation: reputation,
      });

      availableSanity += sanityReward;
    }
  }

  // If max level is reached, any remaining sanity is still "used" for this simulation block
  sanityUsed += availableSanity;

  return {
    sanityUsed,
    levelUps,
    finalLevel: level,
    finalReputation: reputation,
  };
};

export const useArknightsCalculator = () => {
  const [results, setResults] = useState<Results | null>(null);

  const calculate = useCallback((inputs: CalculatorInputs) => {
    const {
      startDate,
      endDate,
      extraSanity,
      targetPulls,
      annihilationCount,
      extraOrundum,
    } = inputs;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // 1. Time-based calculations
    const totalMinutes = Math.floor(
      (end.getTime() - start.getTime()) / (1000 * 60)
    );
    const totalDays = Math.floor(totalMinutes / (60 * 24));
    const totalWeeks = getWeeksInRange(start, end);
    const hours = (totalMinutes / 60).toFixed(2);

    // 2. Sanity calculations
    const naturalRegen = Math.floor(totalMinutes / C.MINUTES_PER_SANITY_REGEN);
    const weeklySanityPotions =
      totalWeeks * C.POTIONS_PER_WEEK * C.SANITY_PER_WEEKLY_POTION;

    let availableSanity =
      C.INITIAL_SANITY + naturalRegen + extraSanity + weeklySanityPotions;
    let currentLevel = 1;
    let currentReputation = 0;
    const allLevelUps: LevelUp[] = [];

    let orundumStageSanity = 0;
    let orundumFromStages = 0;

    // 3. Simulate Annihilation
    const annihilationSanityCost =
      annihilationCount * C.SANITY_FOR_ANNIHILATION;
    if (availableSanity >= annihilationSanityCost) {
      const sim = simulateSanityUsage(
        annihilationSanityCost,
        currentLevel,
        currentReputation,
        C.REPUTATION_PER_SANITY_ORUNDUM
      );
      orundumStageSanity += sim.sanityUsed;
      currentLevel = sim.finalLevel;
      currentReputation = sim.finalReputation;
      allLevelUps.push(...sim.levelUps);
      const sanityFromLevelUps = sim.levelUps.reduce(
        (sum, lu) => sum + lu.sanityReward,
        0
      );
      availableSanity =
        availableSanity - annihilationSanityCost + sanityFromLevelUps;
      orundumFromStages += annihilationCount * C.ORUNDUM_PER_ANNIHILATION;
    }

    const annihilationOrundum = orundumFromStages;

    // 4. Simulate Weekly Orundum Missions
    let weeklySanityUsed = 0;
    for (let i = 0; i < totalWeeks; i++) {
      const weeklyMissionCost =
        i === 0
          ? C.FIRST_WEEK_ORUNDUM_MISSION_SANITY
          : C.SUBSEQUENT_WEEK_ORUNDUM_MISSION_SANITY;
      if (availableSanity >= weeklyMissionCost) {
        const sim = simulateSanityUsage(
          weeklyMissionCost,
          currentLevel,
          currentReputation,
          C.REPUTATION_PER_SANITY_ORUNDUM
        );
        weeklySanityUsed += sim.sanityUsed;
        currentLevel = sim.finalLevel;
        currentReputation = sim.finalReputation;
        allLevelUps.push(...sim.levelUps);
        const sanityFromLevelUps = sim.levelUps.reduce(
          (sum, lu) => sum + lu.sanityReward,
          0
        );
        availableSanity =
          availableSanity - weeklyMissionCost + sanityFromLevelUps;
        orundumFromStages += C.WEEKLY_ORUNDUM_REWARD;
      }
    }
    orundumStageSanity += weeklySanityUsed;

    // 5. Simulate remaining sanity on Originite stages
    const originiteSim = simulateSanityUsage(
      availableSanity,
      currentLevel,
      currentReputation,
      C.REPUTATION_PER_SANITY_ORIGINITE
    );
    const originiteStageSanity = originiteSim.sanityUsed;
    allLevelUps.push(...originiteSim.levelUps);
    const finalLevel = originiteSim.finalLevel;
    const finalReputation = originiteSim.finalReputation;

    const totalSanityUsed = orundumStageSanity + originiteStageSanity;
    const totalSanityFromLevelUp = allLevelUps.reduce(
      (sum, lu) => sum + lu.sanityReward,
      0
    );

    // 6. Orundum & Pulls calculations
    const totalOrundum = targetPulls * C.ORUNDUM_PER_PULL;
    const dailyOrundum = totalDays * C.DAILY_ORUNDUM;
    const weeklyOrundumReward = totalWeeks * C.WEEKLY_MISSION_ORUNDUM_REWARD;
    const freeOrundum = dailyOrundum + weeklyOrundumReward;
    const totalObtainedOrundum = freeOrundum + orundumFromStages + extraOrundum;
    const orundumGap = Math.max(0, totalOrundum - totalObtainedOrundum);
    const needOriginite = Math.ceil(orundumGap / C.ORUNDUM_PER_ORIGINITE);
    const sanityPerOriginite =
      needOriginite > 0 ? (originiteStageSanity / needOriginite).toFixed(2) : 0;

    setResults({
      hours,
      totalMinutes,
      totalDays,
      totalWeeks,
      naturalRegen,
      extraSanity,
      weeklySanityPotions,
      totalSanityUsed,
      orundumStageSanity,
      originiteStageSanity,
      finalLevel,
      finalReputation: finalReputation.toFixed(1),
      levelUps: allLevelUps,
      totalSanityFromLevelUp,
      targetPulls,
      totalOrundum,
      dailyOrundum,
      weeklyOrundumReward,
      freeOrundum,
      annihilationCount,
      annihilationOrundum,
      weeklyMissionOrundum: orundumFromStages - annihilationOrundum,
      extraOrundum,
      orundumFromStages,
      totalObtainedOrundum,
      orundumGap,
      needOriginite,
      sanityPerOriginite,
    });
  }, []);

  return { results, calculate };
};
