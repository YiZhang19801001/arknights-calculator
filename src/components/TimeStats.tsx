import { Clock } from 'lucide-react';
import { type Results } from '../types';

type TimeStatsProps = {
  results: Results;
};

export const TimeStats = ({ results }: TimeStatsProps) => (
  <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
    <h2 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
      <Clock className="w-6 h-6" />
      时间统计
    </h2>
    <div className="text-slate-300 space-y-2">
      <p>
        游玩时长: <span className="font-bold text-white">{results.hours}</span>{' '}
        小时
      </p>
      <p>
        总天数:{' '}
        <span className="font-bold text-white">{results.totalDays}</span> 天
      </p>
      <p>
        跨越周数:{' '}
        <span className="font-bold text-white">{results.totalWeeks}</span> 周
      </p>
    </div>
  </div>
);
