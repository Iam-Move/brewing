import React, { useState, useEffect } from 'react';

const InstallPrompt: React.FC = () => {
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const [showAndroidPrompt, setShowAndroidPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // 이미 설치된 경우 표시하지 않음
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone === true;
    
    if (isStandalone) return;

    // 이미 닫았는지 확인 (24시간 동안 다시 표시하지 않음)
    const dismissed = localStorage.getItem('installPromptDismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      if (Date.now() - dismissedTime < 24 * 60 * 60 * 1000) {
        return;
      }
    }

    // iOS 감지
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    
    if (isIOS && isSafari) {
      // 약간의 딜레이 후 표시
      setTimeout(() => setShowIOSPrompt(true), 2000);
    }

    // Android/Chrome 설치 프롬프트 감지
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setShowAndroidPrompt(true), 2000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleDismiss = () => {
    setShowIOSPrompt(false);
    setShowAndroidPrompt(false);
    localStorage.setItem('installPromptDismissed', Date.now().toString());
  };

  const handleAndroidInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowAndroidPrompt(false);
    }
    setDeferredPrompt(null);
  };

  // iOS 안내 팝업
  if (showIOSPrompt) {
    return (
      <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-surface rounded-2xl p-5 w-full max-w-sm mb-4 shadow-2xl animate-slide-up relative">
          {/* 닫기 버튼 */}
          <button 
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-textSub"
          >
            <span className="material-symbols-outlined">close</span>
          </button>

          {/* 아이콘 */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[32px] filled">coffee</span>
            </div>
          </div>

          {/* 제목 */}
          <h3 className="text-textMain text-lg font-bold text-center mb-2">
            Brew Note 앱 설치하기
          </h3>
          
          <p className="text-textSub text-sm text-center mb-5">
            홈 화면에 추가하면 앱처럼 사용할 수 있어요!
          </p>

          {/* 단계 안내 */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <span className="text-primary font-bold text-sm">1</span>
              </div>
              <div className="flex items-center gap-2 text-textMain text-sm">
                <span>하단의</span>
                <span className="material-symbols-outlined text-[20px]">ios_share</span>
                <span>공유 버튼 누르기</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <span className="text-primary font-bold text-sm">2</span>
              </div>
              <div className="flex items-center gap-2 text-textMain text-sm">
                <span className="material-symbols-outlined text-[20px]">add_box</span>
                <span>"홈 화면에 추가" 선택</span>
              </div>
            </div>
          </div>

          {/* 브라우저 안내 */}
          <div className="bg-surfaceLight rounded-lg p-3 mb-4">
            <p className="text-textSub text-xs text-center">
              💡 <span className="text-primary font-medium">Safari</span>에서 설치해 주세요!
              <br />
              다른 브라우저는 설치가 느릴 수 있어요.
            </p>
          </div>

          {/* 하단 화살표 */}
          <div className="flex justify-center">
            <div className="animate-bounce">
              <span className="material-symbols-outlined text-primary text-[32px]">keyboard_arrow_down</span>
            </div>
          </div>

          {/* 나중에 버튼 */}
          <button 
            onClick={handleDismiss}
            className="w-full mt-4 py-2 text-textSub text-sm"
          >
            나중에 하기
          </button>
        </div>

        <style>{`
          @keyframes slide-up {
            from {
              transform: translateY(100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          .animate-slide-up {
            animation: slide-up 0.3s ease-out;
          }
        `}</style>
      </div>
    );
  }

  // Android 설치 팝업
  if (showAndroidPrompt) {
    return (
      <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-surface rounded-2xl p-5 w-full max-w-sm mb-4 shadow-2xl animate-slide-up">
          {/* 닫기 버튼 */}
          <button 
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-textSub"
          >
            <span className="material-symbols-outlined">close</span>
          </button>

          {/* 아이콘 */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[32px] filled">coffee</span>
            </div>
          </div>

          {/* 제목 */}
          <h3 className="text-textMain text-lg font-bold text-center mb-2">
            Brew Note 앱 설치하기
          </h3>
          
          <p className="text-textSub text-sm text-center mb-4">
            홈 화면에 추가하면 앱처럼 사용할 수 있어요!
          </p>

          {/* 브라우저 안내 */}
          <div className="bg-surfaceLight rounded-lg p-3 mb-5">
            <p className="text-textSub text-xs text-center">
              💡 <span className="text-primary font-medium">Chrome</span>에서 설치하면 빨라요!
              <br />
              삼성 인터넷은 설치가 느릴 수 있어요.
            </p>
          </div>

          {/* 설치 버튼 */}
          <button 
            onClick={handleAndroidInstall}
            className="w-full bg-primary text-background font-bold py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">download</span>
            앱 설치하기
          </button>

          {/* 나중에 버튼 */}
          <button 
            onClick={handleDismiss}
            className="w-full mt-3 py-2 text-textSub text-sm"
          >
            나중에 하기
          </button>
        </div>

        <style>{`
          @keyframes slide-up {
            from {
              transform: translateY(100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          .animate-slide-up {
            animation: slide-up 0.3s ease-out;
          }
        `}</style>
      </div>
    );
  }

  return null;
};

export default InstallPrompt;
