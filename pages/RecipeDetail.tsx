import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { recipes, deleteRecipe } = useData();
  const recipe = recipes.find(r => r.id === id);

  const handleDelete = () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      if (recipe) {
        deleteRecipe(recipe.id);
        navigate('/recipes');
      }
    }
  };

  if (!recipe) return <div className="text-white p-4">Recipe not found</div>;

  const handleStartPouring = () => {
    navigate(`/pouring/recipe/${recipe.id}`);
  };

  const youtubeEmbedUrl = recipe.youtubeStart
    ? `https://www.youtube.com/embed/${recipe.youtubeId}?start=${recipe.youtubeStart}`
    : `https://www.youtube.com/embed/${recipe.youtubeId}`;

  return (
    <div className="flex flex-col min-h-screen bg-background" style={{ paddingBottom: 'calc(160px + env(safe-area-inset-bottom, 0px))' }}>
      {/* Safe Area 상단 배경 */}
      <div className="fixed top-0 left-0 right-0 bg-background z-30" style={{ height: 'env(safe-area-inset-top, 0px)' }} />

      <header
        className="sticky z-20 bg-background/95 backdrop-blur-md border-b border-white/5"
        style={{ top: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="px-4 h-11 flex items-center justify-between">
          <div className="flex items-center flex-1 min-w-0 mr-2">
            <button onClick={() => navigate(-1)} className="text-textMain p-1 -ml-1">
              <span className="material-symbols-outlined">arrow_back_ios_new</span>
            </button>
            <h1 className="text-sm font-bold text-textMain truncate px-2">{recipe.title}</h1>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button onClick={() => navigate(`/recipes/${id}/edit`)} className="p-2 bg-surfaceLight hover:bg-white/10 rounded-full transition-colors text-textMain">
              <span className="material-symbols-outlined text-[20px]">edit</span>
            </button>
            <button onClick={handleDelete} className="p-2 bg-surfaceLight hover:bg-red-500/20 rounded-full transition-colors text-textSub hover:text-red-400">
              <span className="material-symbols-outlined text-[20px]">delete</span>
            </button>
          </div>
        </div>
      </header>

      {/* 헤더 높이만큼 여백 */}
      <div style={{ height: 'env(safe-area-inset-top, 0px)' }} />

      <div className="w-full aspect-video bg-black">
        <iframe
          className="w-full h-full"
          src={youtubeEmbedUrl}
          title={recipe.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div className="px-4 mt-4">
        <div className="grid grid-cols-2 bg-surface rounded-xl overflow-hidden border border-white/5">
          <GridItem label="음료 타입" value={recipe.type} />
          <GridItem label="드리퍼" value={recipe.dripper} isRight />
          <GridItem label="필터" value={recipe.filter} isTop />
          <GridItem label="권장 로스팅포인트" value={recipe.roastLevel.join(', ')} isTop isRight />
          <GridItem label="그라인더 / 분쇄도" value={`${recipe.grinder} / ${recipe.grindSetting}`} isTop />
          <GridItem label="물 온도" value={`${recipe.waterTemp}°C`} isTop isRight />
          <GridItem label="총 원두량" value={`${recipe.beanAmount}g`} isTop />
          <GridItem label="총 물 사용량" value={`${recipe.waterAmount}g`} isTop isRight />
        </div>
      </div>

      <div className="px-4 mt-6">
        <h3 className="text-lg font-bold text-textMain mb-4">푸어링 단계별 가이드</h3>
        <div className="flex flex-col">
          {recipe.steps.map((step, index) => {
            const isLast = index === recipe.steps.length - 1;
            return (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold text-sm">{index + 1}</span>
                  </div>
                  {!isLast && <div className="w-px flex-1 bg-white/10 my-1"></div>}
                </div>
                <div className="flex flex-col pb-6">
                  <h4 className="text-base font-semibold text-textMain">{step.label}</h4>
                  <p className="text-textSub text-sm mt-1">
                    {formatTime(step.startTime)} ~ {formatTime(step.endTime)}
                    {step.addedAmount > 0 && (
                      <span className="text-primary font-semibold ml-2">(+{step.addedAmount}g → 총 {step.waterAmount}g)</span>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Start 버튼 - 하단 네비 위에 */}
      <div
        className="fixed left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent z-10"
        style={{ bottom: 'calc(65px + env(safe-area-inset-bottom, 0px))' }}
      >
        <button
          onClick={handleStartPouring}
          className="w-full max-w-md mx-auto bg-primary text-background font-bold text-base py-3 rounded-full flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[20px] filled">play_arrow</span>
          Start Brewing
        </button>
      </div>
    </div>
  );
};

const GridItem: React.FC<{ label: string; value: string; isTop?: boolean; isRight?: boolean }> = ({ label, value, isTop, isRight }) => (
  <div className={`p-3 ${isTop ? 'border-t border-white/5' : ''} ${isRight ? 'border-l border-white/5' : ''}`}>
    <p className="text-textSub text-xs mb-1">{label}</p>
    <p className="text-textMain font-medium text-sm">{value}</p>
  </div>
);

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export default RecipeDetail;
