import {
  Award,
  Calculator,
  Calendar,
  Clock,
  Gem,
  Plus,
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
  weeklyOrundum: number;
  freeOrundum: number;
  orundumGap: number;
  needOriginite: number;
  sanityPerOriginite: string | number;
};

const ArkCalc = () => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [extraSanity, setExtraSanity] = useState<number>(0);
  const [targetPulls, setTargetPulls] = useState<number>(0);
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

    let currentSanity = 127; // 初始理智
    let currentLevel = 1;
    let currentReputation = 0;
    let totalSanityUsed = 0;
    let levelUps = [];

    // 可用的总理智 = 初始理智 + 自然恢复 + 额外理智 + 周常理智药剂
    let availableSanity =
      currentSanity + naturalRegen + extraSanity + weeklySanityPotions;

    // 模拟使用理智和升级过程
    while (availableSanity > 0) {
      availableSanity--;
      totalSanityUsed++;
      currentReputation += 12;

      const currentLevelData = levels[currentLevel - 1];
      if (
        currentLevel < 50 &&
        currentReputation >= currentLevelData.reqReputation
      ) {
        currentReputation -= currentLevelData.reqReputation;
        currentLevel++;
        const newLevelData = levels[currentLevel - 1];
        const sanityReward = newLevelData.cap;

        levelUps.push({
          level: currentLevel,
          sanityReward: sanityReward,
          reputation: currentReputation,
        });

        availableSanity += sanityReward;
      }
    }

    // 计算抽卡相关
    const totalOrundum = targetPulls * 600; // 需要的总合成玉
    const dailyOrundum = totalDays * 100; // 每日100合成玉
    const weeklyOrundum = totalWeeks * 500; // 每周500合成玉
    const freeOrundum = dailyOrundum + weeklyOrundum; // 免费合成玉
    const orundumGap = Math.max(0, totalOrundum - freeOrundum); // 缺口
    const needOriginite = Math.ceil(orundumGap / 180); // 需要刷的源石数量
    const sanityPerOriginite =
      needOriginite > 0 ? (totalSanityUsed / needOriginite).toFixed(2) : 0;

    setResults({
      hours,
      totalMinutes,
      totalDays,
      totalWeeks,
      naturalRegen,
      extraSanity,
      weeklySanityPotions,
      totalSanityUsed,
      finalLevel: currentLevel,
      finalReputation: currentReputation.toFixed(1),
      levelUps,
      totalSanityFromLevelUp: levelUps.reduce(
        (sum, lu) => sum + lu.sanityReward,
        0
      ),
      // 抽卡相关
      targetPulls,
      totalOrundum,
      dailyOrundum,
      weeklyOrundum,
      freeOrundum,
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

            <div>
              <label className="block text-slate-300 text-lg mb-3">
                <Plus className="inline w-5 h-5 mr-2" />
                额外获得理智（邮件、商店购买等）
              </label>
              <input
                type="number"
                value={extraSanity}
                onChange={(e) => setExtraSanity(Number(e.target.value))}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                placeholder="输入额外理智数量"
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
                    游玩时长:
                    <span className="font-bold text-white">
                      {results.hours}
                    </span>
                    小时 ({results.totalMinutes} 分钟)
                  </p>
                  <p>
                    总天数:
                    <span className="font-bold text-white">
                      {results.totalDays}
                    </span>
                    天
                  </p>
                  <p>
                    跨越周数:
                    <span className="font-bold text-white">
                      {results.totalWeeks}
                    </span>
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
                    <div className="text-slate-400 text-sm mb-1">
                      自然恢复理智
                    </div>
                    <div className="text-2xl font-bold text-green-400">
                      {results.naturalRegen}
                    </div>
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-slate-400 text-sm mb-1">
                      周常理智药剂
                    </div>
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
                    <div className="text-slate-400 text-sm mb-1">
                      升级获得理智
                    </div>
                    <div className="text-2xl font-bold text-purple-400">
                      {results.totalSanityFromLevelUp}
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-4 border border-blue-500/30">
                  <div className="text-slate-300 text-sm mb-1">总可用理智</div>
                  <div className="text-3xl font-bold text-yellow-400">
                    {results.totalSanityUsed}
                  </div>
                  <div className="text-slate-400 text-xs mt-1">
                    = 127 + {results.naturalRegen} +
                    {results.weeklySanityPotions} + {results.extraSanity} +
                    {results.totalSanityFromLevelUp}
                  </div>
                </div>

                <div className="mt-4 bg-slate-800/50 rounded-lg p-4">
                  <div className="text-slate-400 text-sm mb-1">升级次数</div>
                  <div className="text-2xl font-bold text-blue-400">
                    {results.levelUps.length} 次
                  </div>
                </div>

                <div className="mt-4 bg-slate-800/50 rounded-lg p-4">
                  <div className="text-slate-400 text-sm mb-1">最终状态</div>
                  <div className="text-white text-lg">
                    等级
                    <span className="font-bold text-blue-400">
                      {results.finalLevel}
                    </span>
                    | 声望
                    <span className="font-bold text-yellow-400">
                      {results.finalReputation}
                    </span>
                    / {levels[results.finalLevel - 1].reqReputation}
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
                        需要合成玉总量
                      </div>
                      <div className="text-2xl font-bold text-amber-400">
                        {results.totalOrundum.toLocaleString()}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <div className="text-slate-400 text-sm mb-1">
                          日常合成玉
                        </div>
                        <div className="text-xl font-bold text-green-400">
                          {results.dailyOrundum}
                        </div>
                        <div className="text-slate-500 text-xs mt-1">
                          {results.totalDays}天 × 100
                        </div>
                      </div>

                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <div className="text-slate-400 text-sm mb-1">
                          周常合成玉
                        </div>
                        <div className="text-xl font-bold text-cyan-400">
                          {results.weeklyOrundum}
                        </div>
                        <div className="text-slate-500 text-xs mt-1">
                          {results.totalWeeks}周 × 500
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="text-slate-400 text-sm mb-1">
                        免费合成玉总计
                      </div>
                      <div className="text-2xl font-bold text-emerald-400">
                        {results.freeOrundum.toLocaleString()}
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
                        需要刷的源石数量
                      </div>
                      <div className="text-2xl font-bold text-purple-400">
                        {results.needOriginite}
                      </div>
                      <div className="text-slate-500 text-xs mt-1">
                        每源石 = 180合成玉
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg p-6 border border-purple-500/50">
                      <div className="text-slate-300 text-sm mb-2">
                        ⭐ 平均每个源石需要的理智
                      </div>
                      <div className="text-4xl font-bold text-pink-400">
                        {results.sanityPerOriginite}
                      </div>
                      <div className="text-slate-400 text-sm mt-2">
                        也就是说，平均每关卡需要消耗
                        <span className="text-pink-300 font-bold">
                          {results.sanityPerOriginite}
                        </span>
                        理智才能满足抽卡需求
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {results.levelUps.length > 0 && (
                <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
                  <h3 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    升级记录（共 {results.levelUps.length} 次）
                  </h3>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {results.levelUps.map((lu, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-800/50 rounded-lg p-3 text-slate-300"
                      >
                        升至 Lv.{lu.level} → 获得
                        <span className="text-green-400 font-bold">
                          {lu.sanityReward}
                        </span>
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
          <p>初始理智: 127 | 恢复速度: 6分钟/1理智 | 转化率: 1理智=12声望</p>
          <p>
            1抽=600合成玉 | 1源石=180合成玉 | 每周奖励:
            2理智药剂(240理智)+500合成玉 | 每日奖励: 100合成玉
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArkCalc;
