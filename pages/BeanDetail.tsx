import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Bean, TastingRecord } from '../types';

const BeanDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { beans, deleteBean, updateBean } = useData();
  const bean = beans.find(b => b.id === id);

  // State for adding/editing records
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split('T')[0]);
  const [newScore, setNewScore] = useState<number | ''>('');
  const [newMemo, setNewMemo] = useState('');

  const handleDelete = () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      if (bean) {
        deleteBean(bean.id);
        navigate('/beans');
      }
    }
  };

  const handleStartEdit = (record: TastingRecord) => {
    setEditingRecordId(record.id);
    setRecordDate(record.date.split('T')[0]);
    setNewScore(record.score);
    setNewMemo(record.memo);
    setIsAddingRecord(true);
  };

  const handleDeleteRecord = (recordId: string) => {
    if (window.confirm('기록을 삭제하시겠습니까?')) {
      const updatedRecords = (bean?.tastingRecords || []).filter(r => r.id !== recordId);
      updateBean({ ...bean!, tastingRecords: updatedRecords });
    }
  };

  const handleSaveRecord = () => {
    if (!bean) return;
    if (newScore === '' || newMemo.trim() === '') {
      alert('점수와 메모를 모두 입력해주세요.');
      return;
    }

    const record: TastingRecord = {
      id: editingRecordId || Date.now().toString(),
      date: new Date(recordDate).toISOString(),
      score: Number(newScore),
      memo: newMemo,
      tastingNotes: [] // Future proofing
    };

    let updatedRecords;
    if (editingRecordId) {
      updatedRecords = (bean.tastingRecords || []).map(r => r.id === editingRecordId ? record : r);
    } else {
      updatedRecords = [record, ...(bean.tastingRecords || [])];
    }

    updateBean({ ...bean, tastingRecords: updatedRecords });

    // Reset Form
    setIsAddingRecord(false);
    setEditingRecordId(null);
    setRecordDate(new Date().toISOString().split('T')[0]);
    setNewScore('');
    setNewMemo('');
  };

  const handleCancelRecord = () => {
    setIsAddingRecord(false);
    setEditingRecordId(null);
    setRecordDate(new Date().toISOString().split('T')[0]);
    setNewScore('');
    setNewMemo('');
  };

  if (!bean) return <div className="text-white p-4">Bean not found</div>;

  const handlePurchase = () => {
    if (bean.purchaseUrl) {
      window.open(bean.purchaseUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const hasLegacyData = bean.score > 0 || bean.memo || (bean.myNotes && bean.myNotes.length > 0);

  const sortedRecords = [...(bean.tastingRecords || [])].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="flex flex-col min-h-screen bg-background" style={{ paddingBottom: 'calc(100px + env(safe-area-inset-bottom, 0px))' }}>
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

        {/* Removed "내가 느낀 컵노트" tab */}

        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-textMain font-bold text-lg">시음 기록</h3>
            <button
              onClick={() => {
                if (isAddingRecord) handleCancelRecord();
                else setIsAddingRecord(true);
              }}
              className="px-3 py-1.5 bg-primary/20 text-primary text-sm font-bold rounded-lg hover:bg-primary/30 transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">{isAddingRecord ? 'close' : 'add'}</span>
              <span>{isAddingRecord ? '취소' : '추가'}</span>
            </button>
          </div>

          {isAddingRecord && (
            <div className="bg-surface rounded-xl p-5 mb-4 border border-primary/30 animation-fade-in">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-textSub text-sm font-bold">날짜</label>
                  <input
                    type="date"
                    value={recordDate}
                    onChange={(e) => setRecordDate(e.target.value)}
                    className="bg-background text-textMain p-2 rounded-lg border border-white/10 focus:border-primary text-sm"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <label className="text-textSub text-sm font-bold">점수(최대 100점. 소수점 가능)</label>
                  <input
                    type="number"
                    value={newScore}
                    onChange={(e) => setNewScore(e.target.value ? Number(e.target.value) : '')}
                    className="w-20 bg-background text-textMain p-2 rounded-lg border border-white/10 focus:border-primary text-right"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-textSub text-sm font-bold">메모</label>
                  <textarea
                    value={newMemo}
                    onChange={(e) => setNewMemo(e.target.value)}
                    className="w-full bg-background text-textMain p-3 rounded-lg border border-white/10 focus:border-primary h-24 resize-none"
                    placeholder="오늘의 맛은 어땠나요?"
                  />
                </div>
                <button
                  onClick={handleSaveRecord}
                  className="w-full bg-primary text-background font-bold py-3 rounded-lg"
                >
                  {editingRecordId ? '수정하기' : '저장하기'}
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {sortedRecords.map((record) => (
              <RecordCard
                key={record.id}
                record={record}
                onEdit={() => handleStartEdit(record)}
                onDelete={() => handleDeleteRecord(record.id)}
              />
            ))}

            {hasLegacyData && <LegacyRecordCard bean={bean} />}

            {!hasLegacyData && sortedRecords.length === 0 && !isAddingRecord && (
              <div className="text-center py-8 text-textSub bg-surface rounded-xl border border-dashed border-white/5">
                아직 시음 기록이 없습니다.
              </div>
            )}
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

const RecordCard: React.FC<{ record: TastingRecord; onEdit: () => void; onDelete: () => void }> = ({ record, onEdit, onDelete }) => {
  const dateStr = new Date(record.date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Seoul'
  }).replace(/\. /g, '-').replace('.', '');

  return (
    <div className="bg-surface rounded-xl p-5 space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-textSub text-xs mb-1">{dateStr}</span>
          {record.tastingNotes && record.tastingNotes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {record.tastingNotes.slice(0, 3).map((note, i) => (
                <span key={i} className="text-[10px] bg-surfaceLight px-1.5 py-0.5 rounded text-textSub">{note}</span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-primary font-bold text-lg">{record.score} <span className="text-xs text-textSub font-normal">/ 100</span></span>
          <div className="flex gap-2 ml-1">
            <button onClick={onEdit} className="text-textSub hover:text-textMain">
              <span className="material-symbols-outlined text-[18px]">edit</span>
            </button>
            <button onClick={onDelete} className="text-textSub hover:text-red-400">
              <span className="material-symbols-outlined text-[18px]">delete</span>
            </button>
          </div>
        </div>

      </div>
      <div className="h-px bg-white/5 w-full"></div>
      <p className="text-textMain text-sm leading-relaxed whitespace-pre-wrap">{record.memo}</p>
    </div>
  );
};

const LegacyRecordCard: React.FC<{ bean: Bean }> = ({ bean }) => (
  <div className="bg-surface rounded-xl p-5 space-y-4 border border-white/5 opacity-80">
    <div className="flex justify-between items-start">
      <div className="flex flex-col">
        <span className="text-textSub text-xs mb-1">기존 기록</span>
        {bean.myNotes && bean.myNotes.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {bean.myNotes.map((note, i) => (
              <span key={i} className="text-[10px] bg-surfaceLight px-1.5 py-0.5 rounded text-textSub">{note}</span>
            ))}
          </div>
        )}
      </div>
      <span className="text-primary font-bold text-lg">{bean.score} <span className="text-xs text-textSub font-normal">/ 100</span></span>
    </div>
    <div className="h-px bg-white/5 w-full"></div>
    <p className="text-textMain text-sm leading-relaxed whitespace-pre-wrap">{bean.memo}</p>
  </div>
);

export default BeanDetail;
