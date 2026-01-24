import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';

const getYoutubeThumbnail = (youtubeId: string) => {
  return `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`;
};

const PouringRecipeSelect: React.FC = () => {
  const navigate = useNavigate();
  const { recipes } = useData();

  return (
    <div className="flex flex-col min-h-screen bg-background" style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))' }}>
      {/* Safe Area 상단 배경 */}
      <div className="fixed top-0 left-0 right-0 bg-background z-30" style={{ height: 'env(safe-area-inset-top, 0px)' }} />

      <header
        className="sticky z-20 bg-background/95 backdrop-blur-md border-b border-white/5"
        style={{ top: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="px-4 h-11 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-textSub p-1">
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <h1 className="text-lg font-bold text-textMain">레시피 선택</h1>
          <div className="w-8"></div>
        </div>
      </header>

      {/* 헤더 높이만큼 여백 */}
      <div style={{ height: 'env(safe-area-inset-top, 0px)' }} />

      <div className="flex flex-col gap-4 p-4">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            onClick={() => navigate(`/pouring/recipe/${recipe.id}`)}
            className="flex bg-surface rounded-xl overflow-hidden active:scale-[0.98] transition-transform cursor-pointer"
          >
            <div
              className="w-28 h-20 bg-cover bg-center shrink-0"
              style={{ backgroundImage: `url(${getYoutubeThumbnail(recipe.youtubeId)})` }}
            />
            <div className="flex flex-col justify-center p-3 flex-1 min-w-0">
              <h3 className="text-textMain font-bold text-sm leading-tight truncate">{recipe.title}</h3>
              <div className="flex gap-2 mt-2">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${recipe.type === 'Hot' ? 'bg-primary/20 text-primary' : 'bg-blue-400/20 text-blue-400'}`}>
                  {recipe.type}
                </span>
                <span className="text-textSub text-xs">{recipe.beanAmount}g / {recipe.waterAmount}g</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PouringRecipeSelect;
