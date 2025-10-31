import React, { useState } from 'react';
import { Calculator, Clock, TrendingUp, Award, Calendar, Plus } from 'lucide-react';

const ArkCalc = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [extraSanity, setExtraSanity] = useState(0);
  const [results, setResults] = useState(null);

  // 等级数据
  const levels = [
    {level: 1, cap: 127, reqReputation: 500, totalReputation: 0},
    {level: 2, cap: 129, reqReputation: 800, totalReputation: 500},
    {level: 3, cap: 131, reqReputation: 1240, totalReputation: 1300},
    {level: 4, cap: 133, reqReputation: 1320, totalReputation: 2540},
    {level: 5, cap: 135, reqReputation: 1400, totalReputation: 3860},
    {level: 6, cap: 136, reqReputation: 1480, totalReputation: 5260},
    {level: 7, cap: 137, reqReputation: 1560, totalReputation: 6740},
    {level: 8, cap: 138, reqReputation: 1640, totalReputation: 8300},
    {level: 9, cap: 139, reqReputation: 1720, totalReputation: 9940},
    {level: 10, cap: 140, reqReputation: 1800, totalReputation: 11660},
    {level: 11, cap: 141, reqReputation: 1880, totalReputation: 13460},
    {level: 12, cap: 142, reqReputation: 1960, totalReputation: 15340},
    {level: 13, cap: 143, reqReputation: 2040, totalReputation: 17300},
    {level: 14, cap: 144, reqReputation: 2120, totalReputation: 19340},
    {level: 15, cap: 145, reqReputation: 2200, totalReputation: 21460},
    {level: 16, cap: 146, reqReputation: 2280, totalReputation: 23660},
    {level: 17, cap: 147, reqReputation: 2360, totalReputation: 25940},
    {level: 18, cap: 148, reqReputation: 2440, totalReputation: 28300},
    {level: 19, cap: 149, reqReputation: 2520, totalReputation: 30740},
    {level: 20, cap: 150, reqReputation: 2600, totalReputation: 33260},
    {level: 21, cap: 151, reqReputation: 2680, totalReputation: 35860},
    {level: 22, cap: 152, reqReputation: 2760, totalReputation: 38540},
    {level: 23, cap: 153, reqReputation: 2840, totalReputation: 41300},
    {level: 24, cap: 154, reqReputation: 2920, totalReputation: 44140},
    {level: 25, cap: 155, reqReputation: 3000, totalReputation: 47060},
    {level: 26, cap: 156, reqReputation: 3080, totalReputation: 50060},
    {level: 27, cap: 157, reqReputation: 3160, totalReputation: 53140},
    {level: 28, cap: 158, reqReputation: 3240, totalReputation: 56300},
    {level: 29, cap: 159, reqReputation: 3350, totalReputation: 59540},
    {level: 30, cap: 160, reqReputation: 3460, totalReputation: 62890},
    {level: 31, cap: 161, reqReputation: 3570, totalReputation: 66350},
    {level: 32, cap: 162, reqReputation: 3680, totalReputation: 69920},
    {level: 33, cap: 163, reqReputation: 3790, totalReputation: 73600},
    {level: 34, cap: 164, reqReputation: 3900, totalReputation: 77390},
    {level: 35, cap: 165, reqReputation: 4200, totalReputation: 81290},
    {level: 36, cap: 165, reqReputation: 4500, totalReputation: 85490},
    {level: 37, cap: 165, reqReputation: 4800, totalReputation: 89990},
    {level: 38, cap: 165, reqReputation: 5100, totalReputation: 94790},
    {level: 39, cap: 165, reqReputation: 5400, totalReputation: 99890},
    {level: 40, cap: 166, reqReputation: 5700, totalReputation: 105290},
    {level: 41, cap: 166, reqReputation: 6000, totalReputation: 110990},
    {level: 42, cap: 166, reqReputation: 6300, totalReputation: 116990},
    {level: 43, cap: 166, reqReputation: 6600, totalReputation: 123290},
    {level: 44, cap: 166, reqReputation: 6900, totalReputation: 129890},
    {level: 45, cap: 167, reqReputation: 7200, totalReputation: 136790},
    {level: 46, cap: 167, reqReputation: 7500, totalReputation: 143990},
    {level: 47, cap: 167, reqReputation: 7800, totalReputation: 151490},
    {level: 48, cap: 167, reqReputation: 8100, totalReputation: 159290},
    {level: 49, cap: 167, reqReputation: 8400, totalReputation: 167390},
    {level: 50, cap: 168, reqReputation: 8700, totalReputation: 175790}
  ];

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

    const totalMinutes = Math.floor((end - start) / (1000 * 60));
    const hours = (totalMinutes / 60).toFixed(2);
    const naturalRegen = Math.floor(totalMinutes / 6); // 每6分钟回复1理智
    
    let currentSanity = 127; // 初始理智
    let currentLevel = 1;
    let currentReputation = 0;
    let totalSanityUsed = 0;
    let levelUps = [];
    
    // 可用的总理智 = 初始理智 + 自然恢复 + 额外理智
    let availableSanity = currentSanity + naturalRegen + extraSanity;
    
    // 模拟使用理智和升级过程
    while (availableSanity > 0) {
      // 使用1点理智
      availableSanity--;
      totalSanityUsed++;
      currentReputation += 12; // 1理智=12声望
      
      // 检查是否升级
      const currentLevelData = levels[currentLevel - 1];
      if (currentLevel < 50 && currentReputation >= currentLevelData.reqReputation) {
        // 升级
        currentReputation -= currentLevelData.reqReputation;
        currentLevel++;
        const newLevelData = levels[currentLevel - 1];
        const sanityReward = newLevelData.cap;
        
        levelUps.push({
          level: currentLevel,
          sanityReward: sanityReward,
          reputation: currentReputation
        });
        
        // 获得升级奖励的理智
        availableSanity += sanityReward;
      }
    }
    
    setResults({
      hours,
      totalMinutes,
      naturalRegen,
      extraSanity,
      totalSanityUsed,
      finalLevel: currentLevel,
      finalReputation: currentReputation.toFixed(1),
      levelUps,
      totalSanityFromLevelUp: levelUps.reduce((sum, lu) => sum + lu.sanityReward, 0)
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700 p-8">
          <div className="flex items-center gap-3 mb-8">
            <Calculator className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">明日方舟理智计算器</h1>
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
                  <p>游玩时长: <span className="font-bold text-white">{results.hours}</span> 小时 ({results.totalMinutes} 分钟)</p>
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
                    <div className="text-slate-400 text-sm mb-1">自然恢复理智</div>
                    <div className="text-2xl font-bold text-green-400">{results.naturalRegen}</div>
                  </div>
                  
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-slate-400 text-sm mb-1">额外理智</div>
                    <div className="text-2xl font-bold text-orange-400">{results.extraSanity}</div>
                  </div>
                  
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-slate-400 text-sm mb-1">升级获得理智</div>
                    <div className="text-2xl font-bold text-purple-400">{results.totalSanityFromLevelUp}</div>
                  </div>
                </div>
                
                <div className="mt-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-4 border border-blue-500/30">
                  <div className="text-slate-300 text-sm mb-1">总可用理智</div>
                  <div className="text-3xl font-bold text-yellow-400">{results.totalSanityUsed}</div>
                  <div className="text-slate-400 text-xs mt-1">
                    = 127 + {results.naturalRegen} + {results.extraSanity} + {results.totalSanityFromLevelUp}
                  </div>
                </div>
                
                <div className="mt-4 bg-slate-800/50 rounded-lg p-4">
                  <div className="text-slate-400 text-sm mb-1">升级次数</div>
                  <div className="text-2xl font-bold text-blue-400">{results.levelUps.length} 次</div>
                </div>
                
                <div className="mt-4 bg-slate-800/50 rounded-lg p-4">
                  <div className="text-slate-400 text-sm mb-1">最终状态</div>
                  <div className="text-white text-lg">
                    等级 <span className="font-bold text-blue-400">{results.finalLevel}</span> | 
                    声望 <span className="font-bold text-yellow-400">{results.finalReputation}</span> / {levels[results.finalLevel - 1].reqReputation}
                  </div>
                </div>
              </div>
              
              {results.levelUps.length > 0 && (
                <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
                  <h3 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    升级记录（共 {results.levelUps.length} 次）
                  </h3>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {results.levelUps.map((lu, idx) => (
                      <div key={idx} className="bg-slate-800/50 rounded-lg p-3 text-slate-300">
                        升至 Lv.{lu.level} → 获得 <span className="text-green-400 font-bold">{lu.sanityReward}</span> 理智
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-6 text-center text-slate-400 text-sm">
          <p>初始理智: 127 | 恢复速度: 6分钟/1理智 | 转化率: 1理智=12声望</p>
        </div>
      </div>
    </div>
  );
};

export default ArkCalc;
