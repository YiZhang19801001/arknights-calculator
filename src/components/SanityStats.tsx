import { TrendingUp } from 'lucide-react';
import { levels } from '../assets/data';
import { type Results } from '../types';

type SanityStatsProps = {
  results: Results;
};

export const SanityStats = ({ results }: SanityStatsProps) => (
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
        <div className="text-slate-400 text-sm mb-1">合成玉关卡</div>
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
        <span className="font-bold text-blue-400">{results.finalLevel}</span> |
        声望{' '}
        <span className="font-bold text-yellow-400">
          {results.finalReputation}
        </span>
        /{levels[results.finalLevel - 1].reqReputation}
      </div>
    </div>
  </div>
);
