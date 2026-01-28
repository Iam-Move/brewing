import React, { useRef } from 'react';
import { storage } from '../utils/storage';
import PatchNoteList from '../components/PatchNoteList';

const CURRENT_VERSION = '1.2.0';

const Settings: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [latestVersion, setLatestVersion] = React.useState<string | null>(null);

    React.useEffect(() => {
        fetch('/version.json?t=' + new Date().getTime())
            .then(res => res.json())
            .then(data => setLatestVersion(data.version))
            .catch(err => console.error('Failed to fetch version:', err));
    }, []);

    const handleBackup = () => {
        const data = storage.exportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `brewnote_backup_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleRestoreClick = () => {
        if (window.confirm('복원하면 현재 저장된 모든 데이터가 삭제되고 백업 파일의 내용으로 교체됩니다. 계속하시겠습니까?')) {
            fileInputRef.current?.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);
                storage.importData(json);
                alert('데이터가 성공적으로 복원되었습니다. 앱을 새로고침합니다.');
                window.location.reload();
            } catch (error) {
                console.error(error);
                alert('복원에 실패했습니다. 올바른 백업 파일인지 확인해주세요.');
            }
        };
        reader.readAsText(file);
        // Reset input
        e.target.value = '';
    };

    const handleForceReload = () => {
        if (window.confirm('최신 버전을 받아오기 위해 페이지를 새로고침 하시겠습니까?')) {
            window.location.href = window.location.pathname + '?t=' + new Date().getTime();
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background" style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))' }}>
            {/* Safe Area 상단 배경 */}
            <div className="fixed top-0 left-0 right-0 bg-background z-30" style={{ height: 'env(safe-area-inset-top, 0px)' }} />

            <header
                className="sticky z-20 bg-background/95 backdrop-blur-md border-b border-white/5"
                style={{ top: 'env(safe-area-inset-top, 0px)' }}
            >
                <div className="px-4 h-11 flex items-center justify-center">
                    <h1 className="text-lg font-bold text-textMain">설정</h1>
                </div>
            </header>

            {/* 헤더 높이만큼 여백 */}
            <div style={{ height: 'env(safe-area-inset-top, 0px)' }} />

            <div className="p-4 space-y-6">

                {/* 1. 업데이트 및 가이드 (가장 상단으로 이동) */}
                <section className="space-y-3">
                    <button
                        onClick={handleForceReload}
                        className="w-full bg-surface hover:bg-surfaceLight p-4 rounded-xl border border-white/5 flex items-center justify-between group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-green-400 text-[20px]">refresh</span>
                            </div>
                            <div className="text-left">
                                <span className="text-textMain font-bold text-sm flex items-center gap-2">
                                    업데이트 확인 (새로고침)
                                    {latestVersion && latestVersion !== CURRENT_VERSION && (
                                        <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full animate-pulse">NEW</span>
                                    )}
                                </span>
                                <span className="text-textSub text-xs">최신 버전이 안 보일 때</span>
                            </div>
                        </div>
                        <span className="material-symbols-outlined text-textSub group-hover:text-white">chevron_right</span>
                    </button>

                    <a
                        href="/guide.html"
                        target="_blank"
                        className="w-full bg-surface hover:bg-surfaceLight p-4 rounded-xl border border-white/5 flex items-center justify-between group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-yellow-400 text-[20px]">menu_book</span>
                            </div>
                            <div className="text-left">
                                <span className="text-textMain font-bold text-sm block">사용자 가이드</span>
                                <span className="text-textSub text-xs">앱 설치 및 사용법 안내</span>
                            </div>
                        </div>
                        <span className="material-symbols-outlined text-textSub group-hover:text-white">open_in_new</span>
                    </a>

                    <PatchNoteList />
                </section>

                {/* 2. 백업 및 복원 */}
                <section className="space-y-3">
                    <h2 className="text-textMain font-bold text-lg">데이터 백업/복원</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={handleBackup}
                            className="flex flex-col items-center justify-center gap-2 bg-surface hover:bg-surfaceLight active:scale-[0.98] transition-all p-6 rounded-xl border border-white/5 group"
                        >
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                                <span className="material-symbols-outlined text-primary text-[28px]">download</span>
                            </div>
                            <span className="text-textMain font-bold text-sm">내 데이터 백업</span>
                            <span className="text-textSub text-xs">파일로 저장</span>
                        </button>

                        <button
                            onClick={handleRestoreClick}
                            className="flex flex-col items-center justify-center gap-2 bg-surface hover:bg-surfaceLight active:scale-[0.98] transition-all p-6 rounded-xl border border-white/5 group"
                        >
                            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                                <span className="material-symbols-outlined text-blue-400 text-[28px]">upload</span>
                            </div>
                            <span className="text-textMain font-bold text-sm">데이터 복원</span>
                            <span className="text-textSub text-xs">파일 불러오기</span>
                        </button>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".json"
                    />
                </section>

                {/* 3. 데이터 관리 가이드 (하단으로 이동) */}
                <section className="space-y-3">
                    <div className="bg-surface rounded-xl p-5 space-y-3 border border-white/5 opacity-80">
                        <div className="flex gap-3">
                            <span className="material-symbols-outlined text-textSub shrink-0">info</span>
                            <div>
                                <h3 className="text-textMain font-bold text-sm mb-1">모든 데이터는 휴대폰에만 저장됩니다</h3>
                                <p className="text-textSub text-xs leading-relaxed">
                                    이 앱은 별도의 서버가 없습니다. (해킹 걱정 NO!)<br />
                                    대신 <strong>인터넷 캐시를 삭제</strong>하거나 <strong>앱을 삭제</strong>하면 데이터가 지워질 수 있으니, 중요한 기록은 꼭 <strong>백업</strong>해주세요.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="text-center text-textSub/30 text-xs mt-10">
                    BrewNote v{CURRENT_VERSION} {latestVersion ? `(Server: v${latestVersion})` : ''}
                </div>
            </div>
        </div>
    );
};

export default Settings;
