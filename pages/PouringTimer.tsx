import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';

const PouringTimer: React.FC = () => {
  const { recipeId } = useParams<{ recipeId: string }>();
  const navigate = useNavigate();
  const { recipes } = useData();
  const recipe = recipes.find(r => r.id === recipeId);

  const [currentTime, setCurrentTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wakeLockRef = useRef<any>(null);

  useEffect(() => {
    const requestWakeLock = async () => {
      if ('wakeLock' in navigator && isActive) {
        try {
          wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
        } catch (err) {
          console.log('Wake Lock failed:', err);
        }
      }
    };
    const releaseWakeLock = () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    };
    if (isActive) requestWakeLock();
    else releaseWakeLock();
    return () => releaseWakeLock();
  }, [isActive]);

  if (!recipe) return <div className="text-white p-4">레시피를 찾을 수 없습니다.</div>;

  const totalTime = recipe.steps[recipe.steps.length - 1].endTime;
  const currentStepIndex = recipe.steps.findIndex(step =>
    (currentTime / 10) >= step.startTime && (currentTime / 10) < step.endTime
  );
  const activeIndex = currentStepIndex === -1
    ? ((currentTime / 10) >= totalTime ? recipe.steps.length - 1 : 0)
    : currentStepIndex;
  const currentStep = recipe.steps[activeIndex];

  useEffect(() => {
    if (isActive && !isFinished) {
      timerRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const next = prev + 1;
          if (next / 10 >= totalTime) {
            setIsFinished(true);
            setIsActive(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return totalTime * 10;
          }
          return next;
        });
      }, 100);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isFinished, totalTime]);

  const formatTimeDisplay = (totalTenths: number) => {
    const totalSeconds = Math.floor(totalTenths / 10);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    if (isFinished) {
      setCurrentTime(0);
      setIsFinished(false);
      setHasStarted(true);
      setIsActive(true);
    } else {
      if (!hasStarted) setHasStarted(true);
      setIsActive(!isActive);
    }
  };

  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const stepDuration = currentStep.endTime - currentStep.startTime;
  const timeInStep = (currentTime / 10) - currentStep.startTime;
  const progressPercent = Math.min(Math.max(timeInStep / stepDuration, 0), 1);
  const strokeDashoffset = circumference - (progressPercent * circumference);

  const getButtonText = () => {
    if (isFinished) return '다시 시작';
    if (!hasStarted) return '시작';
    if (isActive) return '일시정지';
    return '재개';
  };

  const getButtonIcon = () => {
    if (isFinished) return 'refresh';
    if (isActive) return 'pause';
    return 'play_arrow';
  };

  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden">
      {/* Safe Area 상단 배경 */}
      <div className="fixed top-0 left-0 right-0 bg-background z-30" style={{ height: 'env(safe-area-inset-top, 0px)' }} />

      <header
        className="shrink-0 z-20 bg-background"
        style={{ marginTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="px-4 h-11 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-textSub p-1">
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <h1 className="text-lg font-bold text-textMain">푸어링</h1>
          <div className="w-8"></div>
        </div>
      </header>

      {/* 메인 컨텐츠 - 상단 정렬 -> 중앙 정렬로 변경 */}
      <div className="relative w-[300px] h-[300px] flex items-center justify-center shrink-0">
        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
          <circle cx="150" cy="150" r={radius} fill="transparent" stroke="#3a3a3c" strokeWidth="5" />
        </svg>
        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
          <circle
            cx="150" cy="150" r={radius}
            fill="transparent" stroke="#f5c538" strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-[stroke-dashoffset] duration-100 ease-linear"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <p className="text-textSub text-lg mb-2 font-medium">{currentStep.label}</p>
          <h1 className="text-6xl font-black text-textMain tracking-tighter tabular-nums leading-none">
            {formatTimeDisplay(currentTime)}
          </h1>
          <p className="text-primary text-xl font-bold mt-2">
            {currentStep.addedAmount > 0
              ? `+${currentStep.addedAmount}g → 총 ${currentStep.waterAmount}g`
              : '기다리기'
            }
          </p>
        </div>
      </div>

      {/* Step List - 전체 표시, 스크롤 없이 */}
      <div className="w-full mt-4 flex flex-col gap-1 items-center">
        {recipe.steps.map((step, idx) => {
          const isCurrent = idx === activeIndex;
          const isPast = idx < activeIndex;
          return (
            <div
              key={idx}
              className={`px-4 py-2 rounded-xl transition-all duration-300 ${isCurrent ? 'bg-primary/20 scale-105' : ''}`}
            >
              <span className={`text-sm ${isCurrent ? 'font-bold text-primary' :
                isPast ? 'text-textSub/50' : 'text-textSub'
                }`}>
                {formatTime(step.startTime * 10)}~{formatTime(step.endTime * 10)} {step.label} ({step.addedAmount > 0 ? `+${step.addedAmount}g` : '대기'})
              </span>
            </div>
          );
        })}
      </div>

      {/* Control Button - 하단 고정 */}
      <div
        className="shrink-0 p-4 bg-background"
        style={{ paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }}
      >
        <button
          onClick={toggleTimer}
          className="w-full max-w-[400px] mx-auto bg-primary text-background h-14 rounded-full flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[24px]">{getButtonIcon()}</span>
          <span className="text-lg font-bold">{getButtonText()}</span>
        </button>
      </div>
    </div>
  );
};

const formatTime = (tenths: number) => {
  const totalSeconds = Math.floor(tenths / 10);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export default PouringTimer;
