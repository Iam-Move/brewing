import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';

const BeanDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { beans, deleteBean } = useData();
  const bean = beans.find(b => b.id === id);

  const handleDelete = () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      if (bean) {
        deleteBean(bean.id);
        navigate('/beans');
      }
    }
  };

  if (!bean) return <div className="text-white p-4">Bean not found</div>;

  const handlePurchase = () => {
    if (bean.purchaseUrl) {
      window.open(bean.purchaseUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background" style={{ paddingBottom: 'calc(100px + env(safe-area-inset-bottom, 0px))' }}>
      {/* Safe Area 상단 배경 */}
      <div className="fixed top-0 left-0 right-0 bg-background z-30" style={{ height: 'env(safe-area-inset-top, 0px)' }} />

      <header
        className="sticky z-20 bg-background/95 backdrop-blur-md border-b border-white/5"
        style={{ top: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="px-4 h-11 flex items-center justify-between">
          <div className="flex items-center flex-1 min-w-0 mr-2">
            <button onClick={() => navigate(-1)} className="text-textSub p-1 -ml-1">
              <span className="material-symbols-outlined">arrow_back_ios_new</span>
            </button>
            <h1 className="text-sm font-semibold text-textMain truncate px-2">{bean.name}</h1>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button onClick={() => navigate(`/beans/${id}/edit`)} className="p-2 bg-surfaceLight hover:bg-white/10 rounded-full transition-colors text-textMain">
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

      <div className="p-4 space-y-6">
        {bean.imageUrl && (
          <div className="aspect-square w-full rounded-2xl bg-cover bg-center" style={{ backgroundImage: `url(${bean.imageUrl})` }} />
        )}

        <div className="bg-surface rounded-xl p-4 space-y-3">
          <InfoRow label="로스터리" value={bean.roastery} />
          <InfoRow label="국가 (Country)" value={bean.country} />
          {bean.region && <InfoRow label="지역 (Region)" value={bean.region} />}
          {bean.farm && <InfoRow label="농장 (Farm)" value={bean.farm} />}
          {bean.producer && <InfoRow label="생산자 (Producer)" value={bean.producer} />}
          {bean.variety && <InfoRow label="품종 (Variety)" value={bean.variety} />}
          {bean.altitude && <InfoRow label="고도 (Altitude)" value={`${bean.altitude}m`} />}
          <InfoRow label="가공 방식" value={bean.process} />
          <InfoRow label="로스팅 포인트" value={bean.roastLevel} />
          <InfoRow label="로스팅 날짜" value={bean.roastDate} />
          <InfoRow label="가격(100g당)" value={`₩${bean.price.toLocaleString()}`} />
        </div>

        <div>
          <h3 className="text-textSub font-semibold text-sm mb-3">로스터리 컵노트</h3>
          <div className="flex flex-wrap gap-2">
            {bean.tastingNotes.map((note, idx) => (
              <span key={idx} className="bg-surfaceLight text-textMain px-3 py-1.5 rounded-full text-sm">{note}</span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-textSub font-semibold text-sm mb-3">내가 느낀 컵노트</h3>
          <div className="flex flex-wrap gap-2">
            {bean.myNotes.map((note, idx) => (
              <span key={idx} className="bg-surfaceLight text-textMain px-3 py-1.5 rounded-full text-sm">{note}</span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-textMain font-bold text-lg mb-3">개인 기록</h3>
          <div className="bg-surface rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-textSub text-sm">점수</span>
              <span className="text-primary font-bold text-lg">{bean.score} / 100</span>
            </div>
            <div className="h-px bg-white/10 w-full"></div>
            <div>
              <p className="text-textSub text-sm mb-2">메모</p>
              <p className="text-textMain text-sm leading-relaxed whitespace-pre-wrap">{bean.memo}</p>
            </div>
          </div>
        </div>

        {bean.purchaseUrl && (
          <button
            onClick={handlePurchase}
            className="w-full bg-primary text-background font-bold text-base py-4 rounded-xl flex items-center justify-center gap-2 active:opacity-90 transition-opacity"
          >
            <span>원두 구입처 바로가기</span>
            <span className="material-symbols-outlined text-[20px]">open_in_new</span>
          </button>
        )}
      </div>
    </div>
  );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-textSub text-sm">{label}</span>
    <span className="text-textMain font-medium text-right text-sm">{value}</span>
  </div>
);

export default BeanDetail;
