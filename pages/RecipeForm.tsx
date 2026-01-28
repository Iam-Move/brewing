import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Recipe, PourStep } from '../types';

const RecipeForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { addRecipe, updateRecipe, recipes } = useData();

    // Form state with number | string to handle empty inputs
    const [formData, setFormData] = useState<Omit<Recipe, 'id' | 'steps' | 'waterTemp' | 'beanAmount' | 'waterAmount' | 'youtubeStart'> & {
        waterTemp: number | string;
        beanAmount: number | string;
        waterAmount: number | string;
        youtubeStart?: number | string;
    }>({
        title: '',
        type: 'Hot',
        roastLevel: ['Medium'],
        dripper: '',
        filter: '',
        grinder: '',
        grindSetting: '',
        waterTemp: 90,
        beanAmount: 20,
        waterAmount: 300,
        youtubeId: '',
        youtubeStart: 0,
        pouringMethod: '',
        flowRate: '',
        waterInfo: '',
        micron: ''
    });

    const [steps, setSteps] = useState<PourStep[]>([]);
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Load existing data
    React.useEffect(() => {
        if (id) {
            const existingRecipe = recipes.find(r => r.id === id);
            if (existingRecipe) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { id: _, steps: existingSteps, ...rest } = existingRecipe;
                setFormData(rest);
                setSteps(existingSteps);
                // Expand advanced section if data exists
                if (existingRecipe.pouringMethod || existingRecipe.flowRate || existingRecipe.waterInfo) {
                    setShowAdvanced(true);
                }
            }
        }
    }, [id, recipes]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'waterTemp' || name === 'beanAmount' || name === 'waterAmount' || name === 'youtubeStart'
                ? (value === '' ? '' : Number(value))
                : value
        }));
    };

    const handleRoastChange = (level: string) => {
        setFormData(prev => {
            if (prev.roastLevel.includes(level)) {
                return { ...prev, roastLevel: prev.roastLevel.filter(l => l !== level) };
            } else {
                return { ...prev, roastLevel: [...prev.roastLevel, level] };
            }
        });
    };

    // Step Management
    const addStep = () => {
        const lastStep = steps[steps.length - 1];
        const startTime = lastStep ? lastStep.endTime : 0;

        setSteps([
            ...steps,
            {
                label: '',
                startTime,
                endTime: startTime + 30,
                waterAmount: (lastStep?.waterAmount || 0) + 50,
                addedAmount: 50
            }
        ]);
    };

    const removeStep = (index: number) => {
        setSteps(steps.filter((_, i) => i !== index));
    };

    const updateStep = (index: number, field: keyof PourStep, value: string | number) => {
        const newSteps = [...steps];
        newSteps[index] = { ...newSteps[index], [field]: value };
        setSteps(newSteps);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const submitData: Omit<Recipe, 'id'> = {
            ...formData,
            waterTemp: Number(formData.waterTemp),
            beanAmount: Number(formData.beanAmount),
            waterAmount: Number(formData.waterAmount),
            youtubeStart: Number(formData.youtubeStart || 0),
            steps
        };

        if (id) {
            updateRecipe({ ...submitData, id });
        } else {
            addRecipe(submitData);
        }
        navigate('/recipes');
    };

    return (
        <div className="flex flex-col min-h-screen bg-background" style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))' }}>
            {/* Safe Area 상단 배경 */}
            <div className="fixed top-0 left-0 right-0 bg-background z-30" style={{ height: 'env(safe-area-inset-top, 0px)' }} />

            <header
                className="sticky z-20 bg-background/95 backdrop-blur-md border-b border-white/5"
                style={{ top: 'env(safe-area-inset-top, 0px)' }}
            >
                <div className="px-4 h-11 flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="text-textMain p-1">
                        <span className="material-symbols-outlined">arrow_back_ios_new</span>
                    </button>
                    <h1 className="text-lg font-bold text-textMain">{id ? '레시피 수정' : '새 레시피 등록'}</h1>
                    <div className="w-8"></div>
                </div>
            </header>

            {/* 헤더 높이만큼 여백 */}
            <div style={{ height: 'env(safe-area-inset-top, 0px)' }} />

            <form onSubmit={handleSubmit} className="p-4 space-y-6">

                {/* 기본 정보 */}
                <section className="space-y-4">
                    <h2 className="text-textSub font-bold text-sm">기본 정보</h2>
                    <div className="bg-surface rounded-xl p-4 space-y-4">
                        <Input label="레시피 제목" name="title" value={formData.title} onChange={handleChange} required placeholder="필수 입력..." />

                        <div className="flex flex-col gap-1">
                            <label className="text-textSub text-xs">음료 타입</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full bg-background text-textMain rounded-lg p-3 border border-white/10 focus:border-primary outline-none"
                            >
                                <option value="Hot">Hot</option>
                                <option value="Iced">Iced</option>
                                <option value="Hot/Iced">Hot/Iced</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-textSub text-xs">권장 로스팅 포인트 (다중 선택)</label>
                            <div className="flex flex-wrap gap-2">
                                {['Light', 'Medium Light', 'Medium', 'Medium Dark', 'Dark'].map(level => (
                                    <button
                                        key={level}
                                        type="button"
                                        onClick={() => handleRoastChange(level)}
                                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${formData.roastLevel.includes(level)
                                            ? 'bg-primary text-background'
                                            : 'bg-background text-textSub border border-white/10'
                                            }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Input label="드리퍼" name="dripper" value={formData.dripper} onChange={handleChange} required placeholder="필수 입력..." />
                        <Input label="필터" name="filter" value={formData.filter} onChange={handleChange} />
                        <Input label="그라인더" name="grinder" value={formData.grinder} onChange={handleChange} />
                        <Input label="분쇄도" name="grindSetting" value={formData.grindSetting} onChange={handleChange} placeholder="예: 28 click" />
                        <Input label="물 온도(°C)" name="waterTemp" type="number" value={formData.waterTemp} onChange={handleChange} />
                        <Input label="원두 양(g)" name="beanAmount" type="number" value={formData.beanAmount} onChange={handleChange} />
                        <Input label="총 물 사용량(g)" name="waterAmount" type="number" value={formData.waterAmount} onChange={handleChange} />
                        <Input label="유튜브 ID" name="youtubeId" value={formData.youtubeId} onChange={handleChange} placeholder="영상 ID (예: bVh1yP9imQk)" />
                        <Input label="유튜브 영상 시작 시간(초)" name="youtubeStart" type="number" value={formData.youtubeStart} onChange={handleChange} />
                    </div>
                </section>

                {/* 고급 정보 */}
                <section className="space-y-4">
                    <button
                        type="button"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="flex items-center gap-2 text-textSub font-bold text-sm hover:text-textMain transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">
                            {showAdvanced ? 'expand_less' : 'expand_more'}
                        </span>
                        고급
                    </button>

                    {showAdvanced && (
                        <div className="bg-surface rounded-xl p-4 space-y-4 animation-slide-down">
                            <Input label="푸어링 방식" name="pouringMethod" value={formData.pouringMethod || ''} onChange={handleChange} placeholder="예: 센터 푸어" />
                            <Input label="유량(g/초)" name="flowRate" value={formData.flowRate || ''} onChange={handleChange} placeholder="예: 8.5" />
                            <Input label="분쇄도(마이크론, µm)" name="micron" value={formData.micron || ''} onChange={handleChange} placeholder="예: 1000~1050" />
                            <Input label="물 정보" name="waterInfo" value={formData.waterInfo || ''} onChange={handleChange} placeholder="예: 평창수" />
                        </div>
                    )}
                </section>

                {/* 푸어링 단계 */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-textSub font-bold text-sm">푸어링 단계</h2>
                        <button
                            type="button"
                            onClick={addStep}
                            className="text-primary text-xs font-bold flex items-center gap-1"
                        >
                            <span className="material-symbols-outlined text-[14px]">add</span>
                            단계 추가
                        </button>
                    </div>

                    <div className="space-y-3">
                        {steps.map((step, index) => (
                            <div key={index} className="bg-surface rounded-xl p-4 space-y-3 relative">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-primary font-bold text-sm">Step {index + 1}</span>
                                    <button type="button" onClick={() => removeStep(index)} className="text-textSub hover:text-red-400">
                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                    </button>
                                </div>

                                <Input
                                    label="단계 이름"
                                    value={step.label}
                                    onChange={(e) => updateStep(index, 'label', e.target.value)}
                                    placeholder="예: 뜸들이기"
                                />

                                <div className="grid grid-cols-2 gap-3">
                                    <Input
                                        label="시작 시간(초)"
                                        type="number"
                                        value={step.startTime}
                                        onChange={(e) => updateStep(index, 'startTime', Number(e.target.value))}
                                    />
                                    <Input
                                        label="종료 시간(초)"
                                        type="number"
                                        value={step.endTime}
                                        onChange={(e) => updateStep(index, 'endTime', Number(e.target.value))}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <Input
                                        label="누적 물 양(g)"
                                        type="number"
                                        value={step.waterAmount}
                                        onChange={(e) => updateStep(index, 'waterAmount', Number(e.target.value))}
                                    />
                                    <Input
                                        label="추가한 물(g)"
                                        type="number"
                                        value={step.addedAmount}
                                        onChange={(e) => updateStep(index, 'addedAmount', Number(e.target.value))}
                                    />
                                </div>
                            </div>
                        ))}
                        {steps.length === 0 && (
                            <div className="text-center text-textSub py-4 bg-surface rounded-xl border border-dashed border-white/10">
                                단계를 추가해주세요
                            </div>
                        )}
                    </div>
                </section>

                {/* 저장 버튼 - 하단 이동 */}
                <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-primary text-background font-bold text-lg shadow-lg active:scale-[0.98] transition-transform"
                >
                    저장
                </button>

                <div className="h-10"></div>
            </form>
        </div>
    );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const Input: React.FC<InputProps> = ({ label, className, ...props }) => (
    <div className="flex flex-col gap-1">
        <label className="text-textSub text-xs">{label}</label>
        <input
            className={`w-full bg-background text-textMain rounded-lg p-3 border border-white/10 focus:border-primary outline-none ${props.disabled ? 'opacity-50' : ''} ${className}`}
            {...props}
        />
    </div>
);

export default RecipeForm;
