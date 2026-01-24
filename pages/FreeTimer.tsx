import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const FreeTimer: React.FC = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
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

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setCurrentTime(prev => prev + 1);
      }, 100);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  const formatTimeDisplay = (totalTenths: number) => {
    const totalSeconds = Math.floor(totalTenths / 10);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    const tenths = totalTenths % 10;
    return { main: `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`, decimal: `.${tenths}` };
  };

  const toggleTimer = () => {
    if (!hasStarted) setHasStarted(true);
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setCurrentTime(0);
    setHasStarted(false);
  };

  const time = formatTimeDisplay(currentTime);

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const secondsInCycle = (currentTime / 10) % 60;
  const progressPercent = secondsInCycle / 60;
  const strokeDashoffset = circumference - (progressPercent * circumference);

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
          <h1 className="text-lg font-bold text-textMain">프리 타이머</h1>
          <div className="w-8"></div>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="relative w-72 h-72 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle cx="144" cy="144" r={radius} fill="transparent" stroke="#3a3a3c" strokeWidth="6" />
          </svg>
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle 
              cx="144" cy="144" r={radius} 
              fill="transparent" stroke="#f5c538" strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-[stroke-dashoffset] duration-100 ease-linear"
            />
          </svg>
          <div className="absolute flex items-baseline justify-center">
            <h1 className="text-7xl font-bold text-textMain tracking-tighter tabular-nums">{time.main}</h1>
            <span className="text-3xl font-medium text-textSub tabular-nums">{time.decimal}</span>
          </div>
        </div>

        <p className="text-textSub mt-6 text-center">
          {!hasStarted ? '시작 버튼을 눌러주세요' : isActive ? '추출 중...' : '일시정지됨'}
        </p>
      </div>

      <div 
        className="shrink-0 p-4 flex gap-3"
        style={{ paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }}
      >
        <button 
          onClick={resetTimer}
          className="flex-1 bg-surface text-textMain h-14 rounded-full flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[24px]">refresh</span>
          <span className="text-lg font-bold">리셋</span>
        </button>
        <button 
          onClick={toggleTimer}
          className="flex-[2] bg-primary text-background h-14 rounded-full flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[24px]">{isActive ? 'pause' : 'play_arrow'}</span>
          <span className="text-lg font-bold">{isActive ? '일시정지' : hasStarted ? '재개' : '시작'}</span>
        </button>
      </div>
    </div>
  );
};

export default FreeTimer;
