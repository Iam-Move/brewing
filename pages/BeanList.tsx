import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';

const BeanList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const { beans } = useData();

  const filteredBeans = beans.filter(bean => {
    if (!searchTerm.trim()) return true;
    const terms = searchTerm.toLowerCase().split(/\s+/).filter(t => t.length > 0);

    const targetString = `
          ${bean.name} 
          ${bean.roastery} 
          ${bean.process} 
          ${bean.country || ''} 
          ${bean.region || ''} 
          ${bean.farm || ''}
      `.toLowerCase();

    // Check if EVERY search term is present in the target string
    return terms.every(term => targetString.includes(term));
  });

  return (
    <div className="flex flex-col min-h-screen bg-background" style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))' }}>
      {/* Safe Area 상단 배경 */}
      <div className="fixed top-0 left-0 right-0 bg-background z-30" style={{ height: 'env(safe-area-inset-top, 0px)' }} />

      <header
        className="sticky z-20 bg-background/95 backdrop-blur-md border-b border-white/5"
        style={{ top: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="px-4 h-11 flex items-center justify-between">
          <h1 className="text-lg font-bold text-textMain">원두</h1>
          <button
            onClick={() => navigate('/beans/new')}
            className="bg-primary hover:bg-primary/90 text-background text-sm font-bold px-4 py-1.5 rounded-full transition-colors"
          >
            추가
          </button>
        </div>
      </header>

      {/* 헤더 높이만큼 여백 */}
      <div style={{ height: 'env(safe-area-inset-top, 0px)' }} />

      <div className="px-4 py-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-textSub">search</span>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 rounded-xl bg-surface border-none text-textMain placeholder-textSub focus:ring-1 focus:ring-primary focus:outline-none"
            placeholder="원두, 로스터리, 가공방식, 국가 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 px-4 mt-2">
        {filteredBeans.map((bean) => {
          // Calculate Average Score
          let displayScore = bean.score;
          if (bean.tastingRecords && bean.tastingRecords.length > 0) {
            const totalScore = bean.tastingRecords.reduce((sum, record) => sum + record.score, 0);
            displayScore = Number((totalScore / bean.tastingRecords.length).toFixed(2));
          }

          return (
            <div
              key={bean.id}
              onClick={() => navigate(`/beans/${bean.id}`)}
              className="flex bg-surface rounded-xl p-3 gap-4 active:scale-[0.98] transition-transform cursor-pointer"
            >
              {bean.imageUrl ? (
                <div
                  className="w-24 h-24 rounded-lg bg-cover bg-center shrink-0 bg-surfaceLight"
                  style={{ backgroundImage: `url(${bean.imageUrl})` }}
                />
              ) : (
                <div className="w-24 h-24 rounded-lg bg-surfaceLight shrink-0 flex items-center justify-center p-2 text-center">
                  <span className="text-textSub text-xs font-bold leading-tight line-clamp-3">{bean.name}</span>
                </div>
              )}
              <div className="flex flex-col justify-between py-1 flex-1 min-w-0">
                <h2 className="text-textMain font-bold text-base leading-tight line-clamp-2">{bean.name}</h2>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-textSub text-xs bg-surfaceLight px-2 py-1 rounded">{bean.roastery}</span>
                  <span className="text-textSub text-xs bg-surfaceLight px-2 py-1 rounded">{bean.country}</span>
                  <span className="text-textSub text-xs bg-surfaceLight px-2 py-1 rounded">{bean.process}</span>
                  <div className="flex items-center gap-1 bg-surfaceLight px-2 py-1 rounded">
                    <span className="material-symbols-outlined text-primary text-[14px] filled">star</span>
                    <span className="text-primary text-xs font-bold">
                      {displayScore > 0 ? displayScore : '미입력'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        {filteredBeans.length === 0 && (
          <div className="text-center text-textSub mt-10">검색 결과가 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default BeanList;
