import { Gem } from 'lucide-react';
import { type Results } from '../types';

type OrundumAnalysisProps = {
  results: Results;
};

export const OrundumAnalysis = ({ results }: OrundumAnalysisProps) => (
  <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 rounded-xl p-6 border border-amber-600/50">
    <h2 className="text-xl font-bold text-amber-400 mb-4 flex items-center gap-2">
      <Gem className="w-6 h-6" />
      抽卡资源分析
    </h2>

    <div className="space-y-4">
      <div className="bg-slate-800/50 rounded-lg p-4">
        <div className="text-slate-400 text-sm mb-1">目标抽数</div>
        <div className="text-2xl font-bold text-white">
          {results.targetPulls} 抽
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-lg p-4">
        <div className="text-slate-400 text-sm mb-1">需要合成玉</div>
        <div className="text-2xl font-bold text-amber-400">
          {results.totalOrundum.toLocaleString()}
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-slate-300 font-semibold">合成玉来源:</div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="text-slate-400 text-xs mb-1">日常</div>
            <div className="text-lg font-bold text-green-400">
              {results.dailyOrundum}
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="text-slate-400 text-xs mb-1">周常</div>
            <div className="text-lg font-bold text-cyan-400">
              {results.weeklyOrundumReward}
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="text-slate-400 text-xs mb-1">剿灭战</div>
            <div className="text-lg font-bold text-red-400">
              {results.annihilationOrundum}
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="text-slate-400 text-xs mb-1">每周任务</div>
            <div className="text-lg font-bold text-purple-400">
              {results.weeklyMissionOrundum}
            </div>
          </div>

          {results.extraOrundum > 0 && (
            <div className="bg-slate-800/50 rounded-lg p-3 col-span-2">
              <div className="text-slate-400 text-xs mb-1">额外合成玉</div>
              <div className="text-lg font-bold text-orange-400">
                {results.extraOrundum}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-emerald-900/30 rounded-lg p-4 border border-emerald-600/50">
        <div className="text-emerald-300 text-sm mb-1">总获得合成玉</div>
        <div className="text-2xl font-bold text-emerald-400">
          {results.totalObtainedOrundum.toLocaleString()}
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-lg p-4">
        <div className="text-slate-400 text-sm mb-1">合成玉缺口</div>
        <div className="text-2xl font-bold text-red-400">
          {results.orundumGap.toLocaleString()}
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-lg p-4">
        <div className="text-slate-400 text-sm mb-1">需要源石</div>
        <div className="text-2xl font-bold text-purple-400">
          {results.needOriginite}
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg p-6 border border-purple-500/50">
        <div className="text-slate-300 text-sm mb-2">⭐ 平均每源石需要理智</div>
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
);
