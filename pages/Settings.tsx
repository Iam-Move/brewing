import React, { useRef } from 'react';
import { storage } from '../utils/storage';

const Settings: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);

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

                {/* 안내 문구 섹션 */}
                <section className="space-y-3">
                    <h2 className="text-textMain font-bold text-lg">데이터 관리 가이드</h2>
                    <div className="bg-surface rounded-xl p-5 space-y-3 border border-white/5">
                        <div className="flex gap-3">
                            <span className="material-symbols-outlined text-yellow-400 shrink-0">warning</span>
                            <div>
                                <h3 className="text-textMain font-bold text-sm mb-1">데이터가 사라질 수 있어요!</h3>
                                <p className="text-textSub text-sm leading-relaxed">
                                    이 앱은 서버가 없는 "1인용 앱"입니다. 모든 원두와 레시피는 고객님의 휴대폰(브라우저)에만 저장됩니다.<br /><br />
                                    따라서 <strong>캐시 삭제</strong>를 하거나 <strong>브라우저를 삭제</strong>하면 소중한 기록이 모두 지워질 수 있습니다.
                                </p>
                            </div>
                        </div>

                        <div className="h-px bg-white/10 w-full my-1"></div>

                        <div className="flex gap-3">
                            <span className="material-symbols-outlined text-blue-400 shrink-0">phonelink_setup</span>
                            <div>
                                <h3 className="text-textMain font-bold text-sm mb-1">기기를 변경할 때</h3>
                                <p className="text-textSub text-sm leading-relaxed">
                                    새 핸드폰을 사더라도 데이터가 자동으로 따라오지 않습니다.<br />
                                    기기 변경 전 반드시 <strong>[백업]</strong> 기능을 이용해 파일을 저장해두고, 새 기기에서 <strong>[복원]</strong> 해주세요.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 백업/복원 버튼 섹션 */}
                <section className="space-y-3">
                    <h2 className="text-textMain font-bold text-lg">백업 및 복원</h2>
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

                <div className="text-center text-textSub/30 text-xs mt-10">
                    BrewNote v1.0.0
                </div>
            </div>
        </div>
    );
};

export default Settings;
