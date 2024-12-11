import React from 'react';
import { User, Truck, ClipboardCheck } from 'lucide-react';

const ProgressSteps = ({ step1, step2, step3 }) => {
  return (
    <div className="flex justify-center items-center p-8 font-mono">
      <div className="flex items-center">
        {/* Step 1 */}
        <div className="flex flex-col items-center">
          <div className={`
            w-14 h-14 rounded-xl border-2 flex items-center justify-center
            transition-all duration-500 ease-out hover:rotate-6
            shadow-lg hover:shadow-xl bg-violet-200/90
            ${step1 
              ? 'border-pink-400 animate-bounce' 
              : 'border-gray-300'}
          `}>
            <User className={`
              w-6 h-6 transition-all duration-500 transform
              ${step1 
                ? 'text-zinc-950 scale-110 animate-pulse' 
                : 'text-gray-400'}
            `} />
          </div>
          <span className={`
            mt-2 font-extrabold transition-all duration-500
            ${step1 ? 'text-zinc-950' : 'text-gray-400'}
            relative after:absolute after:bottom-0 after:left-0 after:h-0.5 
            after:bg-pink-400 after:transition-all after:duration-500
            ${step1 ? 'after:w-full' : 'after:w-0'}
          `}>
            Login
          </span>
        </div>

        {/* Line 1 */}
        <div className="w-32 h-1 mx-2 relative overflow-hidden">
          <div className={`
            h-full transition-all duration-700 ease-out
            ${step1 && step2 ? 'bg-pink-400' : 'bg-gray-300'}
            ${step1 ? 'w-full' : 'w-0'}
          `} />
          {step1 && step2 && (
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="w-20 h-full bg-yellow-300/30 animate-shine" />
            </div>
          )}
        </div>

        {/* Step 2 */}
        <div className="flex flex-col items-center">
          <div className={`
            w-14 h-14 rounded-xl border-2 flex items-center justify-center
            transition-all duration-500 ease-out hover:rotate-6
            shadow-lg hover:shadow-xl bg-violet-200/90
            ${step2 
              ? 'border-pink-400 animate-bounce' 
              : 'border-gray-300'}
          `}>
            <Truck className={`
              w-6 h-6 transition-all duration-500 transform
              ${step2 
                ? 'text-zinc-950 scale-110 animate-pulse' 
                : 'text-gray-400'}
            `} />
          </div>
          <span className={`
            mt-2 font-extrabold transition-all duration-500
            ${step2 ? 'text-zinc-950' : 'text-gray-400'}
            relative after:absolute after:bottom-0 after:left-0 after:h-0.5 
            after:bg-pink-400 after:transition-all after:duration-500
            ${step2 ? 'after:w-full' : 'after:w-0'}
          `}>
            Shipping
          </span>
        </div>

        {/* Line 2 */}
        <div className="w-32 h-1 mx-2 relative overflow-hidden">
          <div className={`
            h-full transition-all duration-700 ease-out
            ${step2 && step3 ? 'bg-pink-400' : 'bg-gray-300'}
            ${step2 ? 'w-full' : 'w-0'}
          `} />
          {step2 && step3 && (
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="w-20 h-full bg-yellow-300/30 animate-shine" />
            </div>
          )}
        </div>

        {/* Step 3 */}
        <div className="flex flex-col items-center">
          <div className={`
            w-14 h-14 rounded-xl border-2 flex items-center justify-center
            transition-all duration-500 ease-out hover:rotate-6
            shadow-lg hover:shadow-xl bg-violet-200/90
            ${step3 
              ? 'border-pink-400 animate-bounce' 
              : 'border-gray-300'}
          `}>
            <ClipboardCheck className={`
              w-6 h-6 transition-all duration-500 transform
              ${step3 
                ? 'text-zinc-950 scale-110 animate-pulse' 
                : 'text-gray-400'}
            `} />
          </div>
          <span className={`
            mt-2 font-extrabold transition-all duration-500
            ${step3 ? 'text-zinc-950' : 'text-gray-400'}
            relative after:absolute after:bottom-0 after:left-0 after:h-0.5 
            after:bg-pink-400 after:transition-all after:duration-500
            ${step3 ? 'after:w-full' : 'after:w-0'}
          `}>
            Summary
          </span>
        </div>
      </div>
    </div>
  );
};

// Add shine animation
const style = document.createElement('style');
style.textContent = `
  @keyframes shine {
    from { transform: translateX(-100%); }
    to { transform: translateX(200%); }
  }
  .animate-shine {
    animation: shine 2s infinite linear;
  }
`;
document.head.appendChild(style);

export default ProgressSteps;