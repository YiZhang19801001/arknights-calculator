import {
  Award,
  Calculator,
  Calendar,
  Clock,
  Gem,
  Plus,
  Swords,
  Target,
  TrendingUp,
} from 'lucide-react';
import { useState } from 'react';
import { levels } from './assets/data';

type Results = {
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
  levelUps: { level: number; sanityReward: number; reputation: number }[];
  totalSanityFromLevelUp: number;
  // 抽卡相关
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

const ArkCalc = () => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [extraSanity, setExtraSanity] = useState<number>(0);
  const [targetPulls, setTargetPulls] = useState<number>(0);
  const [annihilationCount, setAnnihilationCount] = useState<number>(0);
  const [extraOrundum, setExtraOrundum] = useState<number>(0);
  const [results, setResults] = useState<Results | null>(null);

  // 计算跨越的周数（只要在周内就算）
  const getWeeksInRange = (start: Date, end: Date) => {
    const weeks = new Set();
    const current = new Date(start);

    while (current <= end) {
      // 计算当前日期所属的周（使用年份+周数作为唯一标识）
      const year = current.getFullYear();
      const startOfYear = new Date(year, 0, 1);
      const days = Math.floor(
        (current.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)
      );
      const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
      weeks.add(`${year}-W${weekNumber}`);

      // 移动到下一天
      current.setDate(current.getDate() + 1);
    }

    return weeks.size;
  };

  const simulateSanityUsage = (
    availableSanity: number,
    currentLevel: number,
    currentReputation: number,
    reputationPerSanity: number
  ) => {
    let sanityUsed = 0;
    let levelUps = [];
    let level = currentLevel;
    let reputation = currentReputation;

    while (availableSanity > 0) {
      availableSanity--;
      sanityUsed++;
      reputation += reputationPerSanity;

      const currentLevelData = levels[level - 1];
      if (level < 50 && reputation >= currentLevelData.reqReputation) {
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

    return {
      sanityUsed,
      levelUps,
      finalLevel: level,
      finalReputation: reputation,
    };
  };

  const calculate = () => {
    if (!startDate || !endDate) {
      alert('请选择开始和结束时间');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      alert('结束时间必须晚于开始时间');
      return;
    }

    const totalMinutes = Math.floor(
      (end.getTime() - start.getTime()) / (1000 * 60)
    );
    const totalDays = Math.floor(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    const totalWeeks = getWeeksInRange(start, end);
    const hours = (totalMinutes / 60).toFixed(2);

    // 计算自然恢复理智
    const naturalRegen = Math.floor(totalMinutes / 6);

    // 计算周常理智药剂奖励
    const weeklySanityPotions = totalWeeks * 2 * 120; // 每周2个，每个120理智

    let availableSanity =
      127 + naturalRegen + extraSanity + weeklySanityPotions;
    let currentLevel = 1;
    let currentReputation = 0;
    let allLevelUps = [];

    let orundumStageSanity = 0;
    let orundumFromStages = 0;

    const annihilationSanity = annihilationCount * 25;
    const annihilationOrundum = annihilationCount * 1500;

    if (availableSanity >= annihilationSanity) {
      const result = simulateSanityUsage(
        annihilationSanity,
        currentLevel,
        currentReputation,
        10
      );
      orundumStageSanity += result.sanityUsed;
      currentLevel = result.finalLevel;
      currentReputation = result.finalReputation;
      allLevelUps.push(...result.levelUps);
      availableSanity =
        availableSanity -
        annihilationSanity +
        result.levelUps.reduce((sum, lu) => sum + lu.sanityReward, 0);
      orundumFromStages += annihilationOrundum;
    }

    const weeklyOrundum = 1800;
    let weeklySanityUsed = 0;

    if (totalWeeks > 0 && availableSanity >= 134) {
      const result = simulateSanityUsage(
        134,
        currentLevel,
        currentReputation,
        10
      );
      weeklySanityUsed += result.sanityUsed;
      currentLevel = result.finalLevel;
      currentReputation = result.finalReputation;
      allLevelUps.push(...result.levelUps);
      availableSanity =
        availableSanity -
        134 +
        result.levelUps.reduce((sum, lu) => sum + lu.sanityReward, 0);
      orundumFromStages += weeklyOrundum;
    }

    for (let i = 1; i < totalWeeks; i++) {
      if (availableSanity >= 124) {
        const result = simulateSanityUsage(
          124,
          currentLevel,
          currentReputation,
          10
        );
        weeklySanityUsed += result.sanityUsed;
        currentLevel = result.finalLevel;
        currentReputation = result.finalReputation;
        allLevelUps.push(...result.levelUps);
        availableSanity =
          availableSanity -
          124 +
          result.levelUps.reduce((sum, lu) => sum + lu.sanityReward, 0);
        orundumFromStages += weeklyOrundum;
      }
    }

    orundumStageSanity += weeklySanityUsed;

    const result = simulateSanityUsage(
      availableSanity,
      currentLevel,
      currentReputation,
      12
    );
    const originiteStageSanity = result.sanityUsed;
    allLevelUps.push(...result.levelUps);
    const finalLevel = result.finalLevel;
    const finalReputation = result.finalReputation;

    const totalSanityUsed = orundumStageSanity + originiteStageSanity;
    const totalSanityFromLevelUp = allLevelUps.reduce(
      (sum, lu) => sum + lu.sanityReward,
      0
    );

    const totalOrundum = targetPulls * 600;
    const dailyOrundum = totalDays * 100;
    const weeklyOrundumReward = totalWeeks * 500;
    const freeOrundum = dailyOrundum + weeklyOrundumReward;
    const totalObtainedOrundum = freeOrundum + orundumFromStages + extraOrundum;
    const orundumGap = Math.max(0, totalOrundum - totalObtainedOrundum);
    const needOriginite = Math.ceil(orundumGap / 180);
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700 p-8">
          <div className="flex items-center gap-3 mb-8">
            <Calculator className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">
              明日方舟理智计算器
            </h1>
          </div>

          <div className="space-y-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 text-lg mb-3">
                  <Calendar className="inline w-5 h-5 mr-2" />
                  开始时间
                </label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-lg mb-3">
                  <Calendar className="inline w-5 h-5 mr-2" />
                  结束时间
                </label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 text-lg mb-3">
                <Target className="inline w-5 h-5 mr-2" />
                目标抽数
              </label>
              <input
                type="number"
                value={targetPulls}
                onChange={(e) => setTargetPulls(Number(e.target.value))}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                placeholder="输入需要的抽数"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 text-lg mb-3">
                  <Swords className="inline w-5 h-5 mr-2" />
                  可刷取的剿灭战数量
                </label>
                <input
                  type="number"
                  value={annihilationCount}
                  onChange={(e) => setAnnihilationCount(Number(e.target.value))}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  placeholder="剿灭战模拟关卡数"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-lg mb-3">
                  <Plus className="inline w-5 h-5 mr-2" />
                  额外获得理智
                </label>
                <input
                  type="number"
                  value={extraSanity}
                  onChange={(e) => setExtraSanity(Number(e.target.value))}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  placeholder="邮件、商店购买等"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 text-lg mb-3">
                <Gem className="inline w-5 h-5 mr-2" />
                额外获得合成玉
              </label>
              <input
                type="number"
                value={extraOrundum}
                onChange={(e) => setExtraOrundum(Number(e.target.value))}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                placeholder="活动奖励等额外合成玉"
              />
            </div>
          </div>

          <button
            onClick={calculate}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg shadow-lg"
          >
            开始计算
          </button>

          {results && (
            <div className="mt-8 space-y-6">
              <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
                <h2 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
                  <Clock className="w-6 h-6" />
                  时间统计
                </h2>
                <div className="text-slate-300 space-y-2">
                  <p>
                    游玩时长:{' '}
                    <span className="font-bold text-white">
                      {results.hours}
                    </span>{' '}
                    小时
                  </p>
                  <p>
                    总天数:{' '}
                    <span className="font-bold text-white">
                      {results.totalDays}
                    </span>{' '}
                    天
                  </p>
                  <p>
                    跨越周数:{' '}
                    <span className="font-bold text-white">
                      {results.totalWeeks}
                    </span>{' '}
                    周
                  </p>
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
                <h2 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6" />
                  理智统计
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-slate-400 text-sm mb-1">初始理智</div>
                    <div className="text-2xl font-bold text-blue-400">127</div>
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-slate-400 text-sm mb-1">自然恢复</div>
                    <div className="text-2xl font-bold text-green-400">
                      {results.naturalRegen}
                    </div>
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-slate-400 text-sm mb-1">周常药剂</div>
                    <div className="text-2xl font-bold text-cyan-400">
                      {results.weeklySanityPotions}
                    </div>
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-slate-400 text-sm mb-1">额外理智</div>
                    <div className="text-2xl font-bold text-orange-400">
                      {results.extraSanity}
                    </div>
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-slate-400 text-sm mb-1">升级奖励</div>
                    <div className="text-2xl font-bold text-purple-400">
                      {results.totalSanityFromLevelUp}
                    </div>
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-slate-400 text-sm mb-1">
                      合成玉关卡
                    </div>
                    <div className="text-2xl font-bold text-amber-400">
                      {results.orundumStageSanity}
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-4 border border-blue-500/30">
                  <div className="text-slate-300 text-sm mb-1">总可用理智</div>
                  <div className="text-3xl font-bold text-yellow-400">
                    {results.totalSanityUsed}
                  </div>
                  <div className="text-slate-400 text-xs mt-1">
                    源石关卡可用:{' '}
                    <span className="text-green-300 font-bold">
                      {results.originiteStageSanity}
                    </span>{' '}
                    理智
                  </div>
                </div>

                <div className="mt-4 bg-slate-800/50 rounded-lg p-4">
                  <div className="text-slate-400 text-sm mb-1">最终状态</div>
                  <div className="text-white text-lg">
                    Lv.
                    <span className="font-bold text-blue-400">
                      {results.finalLevel}
                    </span>{' '}
                    | 声望{' '}
                    <span className="font-bold text-yellow-400">
                      {results.finalReputation}
                    </span>
                    /{levels[results.finalLevel - 1].reqReputation}
                  </div>
                </div>
              </div>

              {results.targetPulls > 0 && (
                <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 rounded-xl p-6 border border-amber-600/50">
                  <h2 className="text-xl font-bold text-amber-400 mb-4 flex items-center gap-2">
                    <Gem className="w-6 h-6" />
                    抽卡资源分析
                  </h2>

                  <div className="space-y-4">
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="text-slate-400 text-sm mb-1">
                        目标抽数
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {results.targetPulls} 抽
                      </div>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="text-slate-400 text-sm mb-1">
                        需要合成玉
                      </div>
                      <div className="text-2xl font-bold text-amber-400">
                        {results.totalOrundum.toLocaleString()}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="text-slate-300 font-semibold">
                        合成玉来源:
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-800/50 rounded-lg p-3">
                          <div className="text-slate-400 text-xs mb-1">
                            日常
                          </div>
                          <div className="text-lg font-bold text-green-400">
                            {results.dailyOrundum}
                          </div>
                        </div>

                        <div className="bg-slate-800/50 rounded-lg p-3">
                          <div className="text-slate-400 text-xs mb-1">
                            周常
                          </div>
                          <div className="text-lg font-bold text-cyan-400">
                            {results.weeklyOrundumReward}
                          </div>
                        </div>

                        <div className="bg-slate-800/50 rounded-lg p-3">
                          <div className="text-slate-400 text-xs mb-1">
                            剿灭战
                          </div>
                          <div className="text-lg font-bold text-red-400">
                            {results.annihilationOrundum}
                          </div>
                        </div>

                        <div className="bg-slate-800/50 rounded-lg p-3">
                          <div className="text-slate-400 text-xs mb-1">
                            每周任务
                          </div>
                          <div className="text-lg font-bold text-purple-400">
                            {results.weeklyMissionOrundum}
                          </div>
                        </div>

                        {results.extraOrundum > 0 && (
                          <div className="bg-slate-800/50 rounded-lg p-3 col-span-2">
                            <div className="text-slate-400 text-xs mb-1">
                              额外合成玉
                            </div>
                            <div className="text-lg font-bold text-orange-400">
                              {results.extraOrundum}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-emerald-900/30 rounded-lg p-4 border border-emerald-600/50">
                      <div className="text-emerald-300 text-sm mb-1">
                        总获得合成玉
                      </div>
                      <div className="text-2xl font-bold text-emerald-400">
                        {results.totalObtainedOrundum.toLocaleString()}
                      </div>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="text-slate-400 text-sm mb-1">
                        合成玉缺口
                      </div>
                      <div className="text-2xl font-bold text-red-400">
                        {results.orundumGap.toLocaleString()}
                      </div>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="text-slate-400 text-sm mb-1">
                        需要源石
                      </div>
                      <div className="text-2xl font-bold text-purple-400">
                        {results.needOriginite}
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg p-6 border border-purple-500/50">
                      <div className="text-slate-300 text-sm mb-2">
                        ⭐ 平均每源石需要理智
                      </div>
                      <div className="text-4xl font-bold text-pink-400">
                        {results.sanityPerOriginite}
                      </div>
                      <div className="text-slate-400 text-sm mt-2">
                        平均每关卡需要{' '}
                        <span className="text-pink-300 font-bold">
                          {results.sanityPerOriginite}
                        </span>{' '}
                        理智
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {results.levelUps.length > 0 && (
                <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
                  <h3 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    升级记录 ({results.levelUps.length} 次)
                  </h3>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {results.levelUps.map((lu, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-800/50 rounded-lg p-3 text-slate-300"
                      >
                        Lv.{lu.level} → +
                        <span className="text-green-400 font-bold">
                          {lu.sanityReward}
                        </span>{' '}
                        理智
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-slate-400 text-sm space-y-1">
          <p>合成玉关卡: 1理智=10声望 | 源石关卡: 1理智=12声望</p>
          <p>第一周: 134理智=1800合成玉 | 后续周: 124理智=1800合成玉</p>
        </div>
      </div>
    </div>
  );
};

export default ArkCalc;
