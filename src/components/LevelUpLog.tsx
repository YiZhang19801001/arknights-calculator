import { Award } from 'lucide-react';
import { type Results } from '../types';

type LevelUpLogProps = {
  results: Results;
};

export const LevelUpLog = ({ results }: LevelUpLogProps) => (
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
          <span className="text-green-400 font-bold">{lu.sanityReward}</span>{' '}
          理智
        </div>
      ))}
    </div>
  </div>
);
