export interface PatchNote {
    version: string;
    date: string;
    changes: string[];
}

export const PATCH_NOTES: PatchNote[] = [
    {
        version: '1.1.0',
        date: '2026-01-24',
        changes: [
            '원두 점수 입력 시 소수점(0.1 단위) 입력이 가능해졌습니다.',
            '레시피 작성 시 원두 양, 물 온도 등 숫자 입력이 더 편해졌습니다. (0이 자동으로 생기지 않아요!)',
            '설정 페이지에 업데이트 내역(패치 노트) 기능이 추가되었습니다.'
        ]
    },
    {
        version: '1.0.2',
        date: '2024-03-20',
        changes: [
            '기본 기능 안정화 및 버그 수정',
            '초기 데이터 백업 기능 추가'
        ]
    }
];
