import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import { useData } from '../contexts/DataContext';
import { Bean } from '../types';
import getCroppedImg from '../utils/image';

const BeanForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { addBean, updateBean, beans } = useData();

    // State with number | string to handle empty inputs
    const [formData, setFormData] = useState<Omit<Bean, 'id' | 'price' | 'score'> & {
        price: number | string;
        score: number | string;
    }>({
        name: '',
        roastery: '',
        country: '',
        region: '',
        farm: '',
        producer: '',
        variety: '',
        altitude: '',
        process: '',
        roastLevel: 'Medium',
        roastDate: new Date().toISOString().split('T')[0],
        price: 0,
        imageUrl: '',
        tastingNotes: [],
        myNotes: [],
        score: 0,
        memo: '',
        purchaseUrl: ''
    });

    const [tastingNoteInput, setTastingNoteInput] = useState('');
    const [myNoteInput, setMyNoteInput] = useState('');

    // Image Crop State
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [isCropping, setIsCropping] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load existing data for edit mode
    useEffect(() => {
        if (id) {
            const existingBean = beans.find(b => b.id === id);
            if (existingBean) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { id: _, ...rest } = existingBean;
                setFormData(rest);
            }
        }
    }, [id, beans]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'score'
                ? (value === '' ? '' : Number(value))
                : value
        }));
    };

    const handleAddTag = (type: 'tastingNotes' | 'myNotes', value: string) => {
        if (!value.trim()) return;
        setFormData(prev => ({
            ...prev,
            [type]: [...prev[type], value.trim()]
        }));
    };

    const handleRemoveTag = (type: 'tastingNotes' | 'myNotes', index: number) => {
        setFormData(prev => ({
            ...prev,
            [type]: prev[type].filter((_, i) => i !== index)
        }));
    };

    const handleKeyDown = (e: React.KeyboardEvent, type: 'tastingNotes' | 'myNotes', value: string, setValue: (v: string) => void) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag(type, value);
            setValue('');
        }
    };

    // Image Handlers
    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const imageDataUrl = await readFile(file);
            setImageSrc(imageDataUrl as string);
            setIsCropping(true);
        }
    };

    const readFile = (file: File) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.addEventListener('load', () => resolve(reader.result), false);
            reader.readAsDataURL(file);
        });
    };

    const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const showCroppedImage = async () => {
        try {
            if (imageSrc && croppedAreaPixels) {
                const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
                setFormData(prev => ({ ...prev, imageUrl: croppedImage }));
                setIsCropping(false);
                setImageSrc(null);
            }
        } catch (e) {
            console.error(e);
            alert('이미지 크롭 중 오류가 발생했습니다.');
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const submitData: Omit<Bean, 'id'> = {
            ...formData,
            price: Number(formData.price),
            score: Number(formData.score)
        };

        if (id) {
            updateBean({ ...submitData, id });
        } else {
            addBean(submitData);
        }
        navigate('/beans');
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
                    <button onClick={() => navigate(-1)} className="text-textSub p-1">
                        <span className="material-symbols-outlined">arrow_back_ios_new</span>
                    </button>
                    <h1 className="text-lg font-bold text-textMain">{id ? '원두 수정' : '새 원두 등록'}</h1>
                    <div className="w-8"></div>
                </div>
            </header>

            {/* 헤더 높이만큼 여백 */}
            <div style={{ height: 'env(safe-area-inset-top, 0px)' }} />

            {/* Crop Modal */}
            {isCropping && imageSrc && (
                <div className="fixed inset-0 z-[60] bg-black flex flex-col h-[100dvh]">
                    <div className="relative flex-1 w-full bg-black">
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                            objectFit="contain"
                        />
                    </div>

                    {/* Controls */}
                    <div className="bg-black/90 p-4 pb-[calc(16px+env(safe-area-inset-bottom,20px))]">
                        <div className="flex gap-4 max-w-md mx-auto">
                            <button
                                type="button"
                                onClick={() => { setIsCropping(false); setImageSrc(null); }}
                                className="flex-1 py-4 rounded-xl bg-surface border border-white/20 text-white font-bold transition-all active:scale-95"
                            >
                                취소
                            </button>
                            <button
                                type="button"
                                onClick={showCroppedImage}
                                className="flex-1 py-4 rounded-xl bg-primary text-background font-bold shadow-lg transition-all active:scale-95"
                            >
                                완료
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="p-4 space-y-6">

                {/* 이미지 업로드 */}
                <div className="flex justify-center">
                    <div
                        onClick={handleImageClick}
                        className="w-32 h-32 rounded-2xl bg-surface border border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative"
                    >
                        {formData.imageUrl ? (
                            <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-textSub text-[32px] mb-1">add_a_photo</span>
                                <span className="text-textSub text-xs">사진 추가</span>
                            </>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={onFileChange}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>
                </div>

                {/* 기본 정보 */}
                <section className="space-y-4">
                    <h2 className="text-textSub font-bold text-sm">기본 정보</h2>
                    <div className="bg-surface rounded-xl p-4 space-y-4">
                        <Input label="원두명(필수입력)" name="name" value={formData.name} onChange={handleChange} required />
                        <Input label="로스터리(필수입력)" name="roastery" value={formData.roastery} onChange={handleChange} required />
                        <Input label="국가(필수입력)" name="country" value={formData.country} onChange={handleChange} required />
                        <Input label="지역" name="region" value={formData.region} onChange={handleChange} />
                        <Input label="농장" name="farm" value={formData.farm} onChange={handleChange} />
                        <Input label="생산자" name="producer" value={formData.producer} onChange={handleChange} />
                    </div>
                </section>

                {/* 상세 정보 */}
                <section className="space-y-4">
                    <h2 className="text-textSub font-bold text-sm">상세 정보</h2>
                    <div className="bg-surface rounded-xl p-4 space-y-4">
                        <Input label="품종" name="variety" value={formData.variety} onChange={handleChange} />
                        <Input label="고도" name="altitude" value={formData.altitude} onChange={handleChange} placeholder="예: 1800-2000" />
                        <Input label="가공 방식(필수입력)" name="process" value={formData.process} onChange={handleChange} required />

                        <div className="flex flex-col gap-1">
                            <label className="text-textSub text-xs">로스팅 포인트</label>
                            <select
                                name="roastLevel"
                                value={formData.roastLevel}
                                onChange={handleChange}
                                className="w-full bg-background text-textMain rounded-lg p-3 border border-white/10 focus:border-primary outline-none"
                            >
                                {['Light', 'Medium Light', 'Medium', 'Medium Dark', 'Dark'].map(r => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                        </div>

                        <Input label="로스팅 날짜" name="roastDate" type="date" value={formData.roastDate} onChange={handleChange} />
                        <Input label="가격(원)" name="price" type="number" value={formData.price} onChange={handleChange} />
                        <Input label="구매 링크" name="purchaseUrl" value={formData.purchaseUrl} onChange={handleChange} placeholder="https://..." />
                    </div>
                </section>

                {/* 노트 및 평가 */}
                <section className="space-y-4">
                    <h2 className="text-textSub font-bold text-sm">노트 및 평가</h2>
                    <div className="bg-surface rounded-xl p-4 space-y-4">

                        {/* 로스터리 컵노트 태그 입력 */}
                        <div className="flex flex-col gap-2">
                            <label className="text-textSub text-xs">로스터리 컵노트</label>
                            <div className="flex flex-wrap gap-2 mb-1">
                                {formData.tastingNotes.map((note, idx) => (
                                    <span key={idx} className="bg-primary/20 text-primary px-2 py-1 rounded text-sm flex items-center gap-1">
                                        {note}
                                        <button type="button" onClick={() => handleRemoveTag('tastingNotes', idx)} className="hover:text-white">x</button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    value={tastingNoteInput}
                                    onChange={(e) => setTastingNoteInput(e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e, 'tastingNotes', tastingNoteInput, setTastingNoteInput)}
                                    className="flex-1 bg-background text-textMain rounded-lg p-3 border border-white/10 focus:border-primary outline-none"
                                    placeholder="입력 후 추가 버튼 또는 엔터"
                                />
                                <button
                                    type="button"
                                    onClick={() => { handleAddTag('tastingNotes', tastingNoteInput); setTastingNoteInput(''); }}
                                    className="bg-surfaceLight hover:bg-white/10 text-textMain px-4 rounded-lg font-bold text-sm border border-white/10 transition-colors"
                                >
                                    추가
                                </button>
                            </div>
                        </div>

                        {/* 나의 노트 태그 입력 */}
                        <div className="flex flex-col gap-2">
                            <label className="text-textSub text-xs">나의 노트</label>
                            <div className="flex flex-wrap gap-2 mb-1">
                                {formData.myNotes.map((note, idx) => (
                                    <span key={idx} className="bg-secondary/20 text-secondary px-2 py-1 rounded text-sm flex items-center gap-1">
                                        {note}
                                        <button type="button" onClick={() => handleRemoveTag('myNotes', idx)} className="hover:text-white">x</button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    value={myNoteInput}
                                    onChange={(e) => setMyNoteInput(e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e, 'myNotes', myNoteInput, setMyNoteInput)}
                                    className="flex-1 bg-background text-textMain rounded-lg p-3 border border-white/10 focus:border-primary outline-none"
                                    placeholder="입력 후 추가 버튼 또는 엔터"
                                />
                                <button
                                    type="button"
                                    onClick={() => { handleAddTag('myNotes', myNoteInput); setMyNoteInput(''); }}
                                    className="bg-surfaceLight hover:bg-white/10 text-textMain px-4 rounded-lg font-bold text-sm border border-white/10 transition-colors"
                                >
                                    추가
                                </button>
                            </div>
                        </div>

                        <Input label="점수 (0-100)" name="score" type="number" value={formData.score} onChange={handleChange} max={100} min={0} step="0.1" />

                        <div className="flex flex-col gap-1">
                            <label className="text-textSub text-xs">메모</label>
                            <textarea
                                name="memo"
                                value={formData.memo}
                                onChange={handleChange}
                                rows={4}
                                className="w-full bg-background text-textMain rounded-lg p-3 border border-white/10 focus:border-primary outline-none resize-none"
                            />
                        </div>

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
            className={`w-full bg-background text-textMain rounded-lg p-3 border border-white/10 focus:border-primary outline-none ${className}`}
            {...props}
        />
    </div>
);

export default BeanForm;
