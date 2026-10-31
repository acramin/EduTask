import React from 'react';
import { GraduationCap, Sparkles } from 'lucide-react';

interface EduLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const EduLogo: React.FC<EduLogoProps> = ({ size = 'md', showSubtitle = false }) => {
  const iconSizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-8.5 h-8.5 text-sm',
    lg: 'w-11 h-11 text-base',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <div className="flex items-center gap-2.5 select-none group cursor-pointer">
      <div
        className={`${iconSizes[size]} rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-xs shadow-blue-500/20 relative shrink-0 transition-transform duration-200 group-hover:scale-105`}
      >
        <GraduationCap className={size === 'lg' ? 'w-6 h-6' : size === 'sm' ? 'w-4 h-4' : 'w-4.5 h-4.5'} />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-white" />
      </div>

      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5">
          <span className={`${textSizes[size]} font-extrabold tracking-tight text-slate-900`}>
            edu<span className="text-blue-600">task</span>
          </span>
          <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50/90 border border-indigo-200/60 px-1.5 py-0.5 rounded-md tracking-wide uppercase">
            acadêmico
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[11px] text-slate-500 font-medium tracking-normal mt-1">
            Gestão inteligente da rotina universitária
          </span>
        )}
      </div>
    </div>
  );
};

