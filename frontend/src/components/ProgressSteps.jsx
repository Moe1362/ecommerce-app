import React from 'react';
import { User, Truck, ClipboardCheck } from 'lucide-react';

const StepIcon = ({ isActive, Icon }) => (
  <div className={`
    w-16 h-16 rounded-xl border flex items-center justify-center
    transition-all duration-300 hover:scale-105
    ${isActive 
      ? 'bg-white/5 border-emerald-500/50' 
      : 'bg-zinc-900/50 border-zinc-800'}
  `}>
    <Icon className={`
      w-8 h-8 transition-all duration-300
      ${isActive 
        ? 'text-emerald-400' 
        : 'text-zinc-600'}
    `} />
  </div>
);

const StepLabel = ({ isActive, label }) => (
  <span className={`
    mt-3 text-lg font-semibold tracking-wide transition-all duration-300
    ${isActive ? 'text-emerald-400' : 'text-zinc-600'}
  `}>
    {label}
  </span>
);

const ProgressLine = ({ isActive, showGlow }) => (
  <div className="w-32 h-0.5 mx-4 relative overflow-hidden">
    <div className={`
      h-full transition-all duration-500 ease-out
      ${isActive ? 'bg-emerald-500/50' : 'bg-zinc-800'}
      ${isActive ? 'w-full' : 'w-0'}
    `} />
    {isActive && showGlow && (
      <div className="absolute inset-0">
        <div className="w-20 h-full bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent animate-shine" />
      </div>
    )}
  </div>
);

const ProgressSteps = ({ step1, step2, step3 }) => {
  return (
    <div className="flex justify-center items-center p-8">
      <div className="flex items-center">
        {/* Step 1 */}
        <div className="flex flex-col items-center">
          <StepIcon isActive={step1} Icon={User} />
          <StepLabel isActive={step1} label="Login" />
        </div>

        {/* Line 1 */}
        <ProgressLine isActive={step1} showGlow={step1 && step2} />

        {/* Step 2 */}
        <div className="flex flex-col items-center">
          <StepIcon isActive={step2} Icon={Truck} />
          <StepLabel isActive={step2} label="Shipping" />
        </div>

        {/* Line 2 */}
        <ProgressLine isActive={step2} showGlow={step2 && step3} />

        {/* Step 3 */}
        <div className="flex flex-col items-center">
          <StepIcon isActive={step3} Icon={ClipboardCheck} />
          <StepLabel isActive={step3} label="Summary" />
        </div>
      </div>

      <style jsx global>{`
        @keyframes shine {
          from { transform: translateX(-100%); }
          to { transform: translateX(200%); }
        }
        .animate-shine {
          animation: shine 2s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};

export default ProgressSteps;