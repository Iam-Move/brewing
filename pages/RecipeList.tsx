import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';

const getYoutubeThumbnail = (youtubeId: string) => {
  return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
};

const RecipeList: React.FC = () => {
  const navigate = useNavigate();
  const { recipes } = useData();
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [dripperFilter, setDripperFilter] = useState<string>('All');
  const [roastFilter, setRoastFilter] = useState<string>('All');
  const [amountFilter, setAmountFilter] = useState<string>('All');

  // 온도 필터 - 고정 순서
  const types = ['All', 'Hot', 'Iced', 'Hot/Iced'];

  // 드리퍼 필터 - "전부 가능" 최상단, 나머지 ABC순
  const drippers = useMemo(() => {
    const unique = [...new Set(recipes.map(r => r.dripper))];
    const sorted = unique
      .filter(d => d !== '전부 가능')
      .sort((a, b) => a.localeCompare(b, 'en'));

    // "전부 가능"이 있으면 최상단에
    if (unique.includes('전부 가능')) {
      return ['All', '전부 가능', ...sorted];
    }
    return ['All', ...sorted];
  }, []);

  // 배전도 필터 - 고정 순서
  const roastLevels = useMemo(() => {
    const order = ['Light', 'Medium Light', 'Medium', 'Medium Dark', 'Dark'];
    const all = recipes.flatMap(r => r.roastLevel);
    const unique = [...new Set(all)];

    // order에 있는 것들 순서대로, 없는 것들은 뒤에
    const sorted = unique.sort((a, b) => {
      const aIdx = order.indexOf(a);
      const bIdx = order.indexOf(b);
      if (aIdx === -1 && bIdx === -1) return a.localeCompare(b);
      if (aIdx === -1) return 1;
      if (bIdx === -1) return -1;
      return aIdx - bIdx;
    });

    return ['All', ...sorted];
  }, []);

  // 원두 도징량 필터 - 숫자 오름차순
  const beanAmounts = useMemo(() => {
    const unique = [...new Set(recipes.map(r => r.beanAmount))];
    const sorted = unique.sort((a, b) => a - b);
    return ['All', ...sorted];
  }, [recipes]);

  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      const matchType = typeFilter === 'All' || recipe.type === typeFilter;
      const matchDripper = dripperFilter === 'All' || recipe.dripper === dripperFilter;
      const matchRoast = roastFilter === 'All' || recipe.roastLevel.includes(roastFilter);
      const matchAmount = amountFilter === 'All' || recipe.beanAmount === Number(amountFilter);
      return matchType && matchDripper && matchRoast && matchAmount;
    });
  }, [typeFilter, dripperFilter, roastFilter, amountFilter]);

  const activeFilterCount = [typeFilter, dripperFilter, roastFilter, amountFilter].filter(f => f !== 'All').length;

  const resetFilters = () => {
    setTypeFilter('All');
    setDripperFilter('All');
    setRoastFilter('All');
    setAmountFilter('All');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background" style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))' }}>
      {/* Safe Area 상단 배경 */}
      <div className="fixed top-0 left-0 right-0 bg-background z-30" style={{ height: 'env(safe-area-inset-top, 0px)' }} />

      <header
        className="sticky z-20 bg-background/95 backdrop-blur-md border-b border-white/5"
        style={{ top: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="px-4 h-11 flex items-center justify-between">
          <h1 className="text-lg font-bold text-textMain">레시피</h1>
          <button
            onClick={() => navigate('/recipes/new')}
            className="bg-primary hover:bg-primary/90 text-background text-sm font-bold px-4 py-1.5 rounded-full transition-colors"
          >
            추가
          </button>
        </div>
      </header>

      {/* 헤더 높이만큼 여백 */}
      <div style={{ height: 'env(safe-area-inset-top, 0px)' }} />

      {/* 필터 영역 */}
      <div className="px-4 py-3">
        <div className="grid grid-cols-2 gap-2">
          {/* 온도 드롭다운 */}
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className={`w-full appearance-none bg-surface text-sm rounded-lg px-3 py-2.5 pr-8 outline-none border transition-colors cursor-pointer ${typeFilter !== 'All'
                ? 'border-primary text-primary'
                : 'border-transparent text-textMain'
                }`}
            >
              {types.map(type => (
                <option key={type} value={type}>
                  {type === 'All' ? '온도 전체' : type}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-textSub text-[18px] pointer-events-none">
              expand_more
            </span>
          </div>

          {/* 드리퍼 드롭다운 */}
          <div className="relative">
            <select
              value={dripperFilter}
              onChange={(e) => setDripperFilter(e.target.value)}
              className={`w-full appearance-none bg-surface text-sm rounded-lg px-3 py-2.5 pr-8 outline-none border transition-colors cursor-pointer ${dripperFilter !== 'All'
                ? 'border-primary text-primary'
                : 'border-transparent text-textMain'
                }`}
            >
              {drippers.map(dripper => (
                <option key={dripper} value={dripper}>
                  {dripper === 'All' ? '드리퍼 전체' : dripper}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-textSub text-[18px] pointer-events-none">
              expand_more
            </span>
          </div>

          {/* 배전도 드롭다운 */}
          <div className="relative">
            <select
              value={roastFilter}
              onChange={(e) => setRoastFilter(e.target.value)}
              className={`w-full appearance-none bg-surface text-sm rounded-lg px-3 py-2.5 pr-8 outline-none border transition-colors cursor-pointer ${roastFilter !== 'All'
                ? 'border-primary text-primary'
                : 'border-transparent text-textMain'
                }`}
            >
              {roastLevels.map(level => (
                <option key={level} value={level}>
                  {level === 'All' ? '배전도 전체' : level}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-textSub text-[18px] pointer-events-none">
              expand_more
            </span>
          </div>

          {/* 원두량 드롭다운 */}
          <div className="relative">
            <select
              value={amountFilter}
              onChange={(e) => setAmountFilter(e.target.value)}
              className={`w-full appearance-none bg-surface text-sm rounded-lg px-3 py-2.5 pr-8 outline-none border transition-colors cursor-pointer ${amountFilter !== 'All'
                ? 'border-primary text-primary'
                : 'border-transparent text-textMain'
                }`}
            >
              {beanAmounts.map(amount => (
                <option key={amount} value={amount}>
                  {amount === 'All' ? '원두량 전체' : `${amount}g`}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-textSub text-[18px] pointer-events-none">
              expand_more
            </span>
          </div>
        </div>

        {/* 필터 활성화 표시 & 초기화 */}
        {activeFilterCount > 0 && (
          <div className="flex items-center justify-between mt-2">
            <span className="text-textSub text-xs">
              {activeFilterCount}개 필터 적용 중 · {filteredRecipes.length}개 레시피
            </span>
            <button
              onClick={resetFilters}
              className="text-primary text-xs font-medium flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">refresh</span>
              초기화
            </button>
          </div>
        )}
      </div>

      {/* 레시피 목록 */}
      <div className="flex flex-col gap-4 px-4">
        {filteredRecipes.map((recipe) => (
          <div
            key={recipe.id}
            onClick={() => navigate(`/recipes/${recipe.id}`)}
            className="group relative h-48 w-full rounded-2xl overflow-hidden cursor-pointer shadow-lg active:scale-[0.98] transition-transform"
          >
            {/* 썸네일 */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url(${getYoutubeThumbnail(recipe.youtubeId)})` }}
            />

            {/* 상단 어두운 오버레이 - 태그 가독성 */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent"></div>

            {/* 태그 - 좌측 상단 */}
            <div className="absolute top-0 left-0 w-full p-4 flex flex-col gap-2">
              {/* 태그 */}
              <div className="flex flex-wrap gap-1.5">
                <span className={`px-2 py-0.5 rounded text-xs font-bold text-black ${recipe.type === 'Hot' ? 'bg-primary' :
                  recipe.type === 'Iced' ? 'bg-blue-400' :
                    'bg-gradient-to-r from-primary to-blue-400'
                  }`}>
                  {recipe.type}
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-medium text-white bg-black/60 backdrop-blur-sm">
                  {recipe.dripper}
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-medium text-white bg-black/60 backdrop-blur-sm">
                  {recipe.roastLevel.join(', ')}
                </span>
              </div>

              {/* 제목 - 필요시 주석 해제
              <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 self-start max-w-[90%]">
                <h2 className="text-white text-lg font-bold leading-tight">
                  {recipe.title}
                </h2>
              </div>
              */}
            </div>
          </div>
        ))}

        {filteredRecipes.length === 0 && (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-textSub text-[48px]">search_off</span>
            <p className="text-textSub mt-2">조건에 맞는 레시피가 없습니다</p>
            <button
              onClick={resetFilters}
              className="mt-4 text-primary text-sm font-medium"
            >
              필터 초기화
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeList;
