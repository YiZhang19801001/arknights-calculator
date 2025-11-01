import { Calculator, Calendar, Gem, Plus, Swords, Target } from 'lucide-react';
import { useState } from 'react';
import { LevelUpLog } from './components/LevelUpLog';
import { OrundumAnalysis } from './components/OrundumAnalysis';
import { SanityStats } from './components/SanityStats';
import { TimeStats } from './components/TimeStats';
import { useArknightsCalculator } from './hooks/useArknightsCalculator';
import { type CalculatorInputs } from './types';

const initialInputs: CalculatorInputs = {
  startDate: '',
  endDate: '',
  extraSanity: 0,
  targetPulls: 0,
  annihilationCount: 0,
  extraOrundum: 0,
};

const ArkCalc = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>(initialInputs);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { results, calculate } = useArknightsCalculator();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : Number(value)) : value,
    }));
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!inputs.startDate) {
      newErrors.startDate = '请选择开始时间';
    }
    if (!inputs.endDate) {
      newErrors.endDate = '请选择结束时间';
    }
    if (
      inputs.startDate &&
      inputs.endDate &&
      new Date(inputs.endDate) <= new Date(inputs.startDate)
    ) {
      newErrors.endDate = '结束时间必须晚于开始时间';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (validate()) {
      calculate(inputs);
    }
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
                  name="startDate"
                  type="datetime-local"
                  value={inputs.startDate}
                  onChange={handleChange}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.startDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.startDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-slate-300 text-lg mb-3">
                  <Calendar className="inline w-5 h-5 mr-2" />
                  结束时间
                </label>
                <input
                  name="endDate"
                  type="datetime-local"
                  value={inputs.endDate}
                  onChange={handleChange}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.endDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-slate-300 text-lg mb-3">
                <Target className="inline w-5 h-5 mr-2" />
                目标抽数
              </label>
              <input
                name="targetPulls"
                type="number"
                value={inputs.targetPulls}
                onChange={handleChange}
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
                  name="annihilationCount"
                  type="number"
                  value={inputs.annihilationCount}
                  onChange={handleChange}
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
                  name="extraSanity"
                  type="number"
                  value={inputs.extraSanity}
                  onChange={handleChange}
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
                name="extraOrundum"
                type="number"
                value={inputs.extraOrundum}
                onChange={handleChange}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                placeholder="活动奖励等额外合成玉"
              />
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg shadow-lg"
          >
            开始计算
          </button>

          {results && (
            <div className="mt-8 space-y-6">
              <TimeStats results={results} />
              <SanityStats results={results} />
              {results.targetPulls > 0 && <OrundumAnalysis results={results} />}
              {results.levelUps.length > 0 && <LevelUpLog results={results} />}
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
