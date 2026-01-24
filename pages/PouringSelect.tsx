import React from 'react';
import { useNavigate } from 'react-router-dom';

const PouringSelect: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-background" style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))' }}>
      {/* Safe Area 상단 배경 */}
      <div className="fixed top-0 left-0 right-0 bg-background z-30" style={{ height: 'env(safe-area-inset-top, 0px)' }} />
      
      <header 
        className="sticky z-20 bg-background/95 backdrop-blur-md border-b border-white/5"
        style={{ top: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="px-4 h-11 flex items-center justify-center">
          <h1 className="text-lg font-bold text-textMain">푸어링</h1>
        </div>
      </header>

      {/* 헤더 높이만큼 여백 */}
      <div style={{ height: 'env(safe-area-inset-top, 0px)' }} />

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
        <div className="text-center mb-8">
          <span className="material-symbols-outlined text-primary text-[64px] filled">local_cafe</span>
          <h2 className="text-2xl font-bold text-textMain mt-4">푸어링 모드 선택</h2>
          <p className="text-textSub mt-2">원하는 방식을 선택하세요</p>
        </div>

        <button
          onClick={() => navigate('/pouring/select-recipe')}
          className="w-full max-w-sm bg-primary text-background py-5 rounded-2xl flex flex-col items-center gap-2 active:scale-[0.98] transition-transform"
        >
          <span className="material-symbols-outlined text-[32px]">receipt_long</span>
          <span className="text-xl font-bold">레시피 참고하기</span>
          <span className="text-sm opacity-80">저장된 레시피로 푸어링</span>
        </button>

        <button
          onClick={() => navigate('/pouring/free')}
          className="w-full max-w-sm bg-surface text-textMain py-5 rounded-2xl flex flex-col items-center gap-2 active:scale-[0.98] transition-transform border border-white/10"
        >
          <span className="material-symbols-outlined text-[32px]">timer</span>
          <span className="text-xl font-bold">프리 타이머</span>
          <span className="text-sm text-textSub">자유롭게 시간만 측정</span>
        </button>
      </div>
    </div>
  );
};

export default PouringSelect;
