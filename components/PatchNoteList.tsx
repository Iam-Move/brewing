import React, { useState } from 'react';
import { PATCH_NOTES } from '../utils/patchNotes';

const PatchNoteList: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const displayNotes = isExpanded ? PATCH_NOTES : PATCH_NOTES.slice(0, 1);

    return (
        <div className="bg-surface rounded-xl p-5 border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-textMain font-bold text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">update</span>
                    업데이트 내역
                </h3>
                {PATCH_NOTES.length > 1 && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-textSub text-xs flex items-center gap-1 hover:text-white transition-colors"
                    >
                        {isExpanded ? '접기' : '더보기'}
                        <span className="material-symbols-outlined text-[16px]">
                            {isExpanded ? 'expand_less' : 'expand_more'}
                        </span>
                    </button>
                )}
            </div>

            <div className="space-y-6 relative">
                {/* 타임라인 선 (디자인 요소) */}
                <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-white/5 z-0"></div>

                {displayNotes.map((note, index) => (
                    <div key={note.version} className="relative z-10 pl-6">
                        {/* 타임라인 점 */}
                        <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 ${index === 0 ? 'bg-primary border-primary shadow-[0_0_8px_rgba(255,165,0,0.5)]' : 'bg-surface border-white/20'}`}></div>

                        <div className="flex items-baseline gap-2 mb-1">
                            <span className={`text-sm font-bold ${index === 0 ? 'text-primary' : 'text-textMain'}`}>v{note.version}</span>
                            <span className="text-textSub text-xs">{note.date}</span>
                        </div>
                        <ul className="space-y-1">
                            {note.changes.map((change, i) => (
                                <li key={i} className="text-textSub text-xs leading-relaxed flex items-start gap-1.5">
                                    <span className="block w-1 h-1 rounded-full bg-white/20 mt-1.5 shrink-0"></span>
                                    {change}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PatchNoteList;
