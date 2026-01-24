import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Splash: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/beans');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background w-full relative overflow-hidden">
      <div className="flex flex-col items-center z-10">
        <span className="material-symbols-outlined text-primary" style={{ fontSize: '80px', fontVariationSettings: "'FILL' 1" }}>coffee</span>
        <h1 className="text-textMain text-3xl font-bold mt-6 tracking-wide">Brew Note</h1>
      </div>
      <div className="absolute bottom-20 w-64">
        <div className="h-1 w-full bg-surfaceLight rounded-full overflow-hidden">
          <div className="h-full bg-primary animate-[loading_2s_ease-in-out_infinite]" style={{ width: '30%' }}></div>
        </div>
      </div>
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
};

export default Splash;
