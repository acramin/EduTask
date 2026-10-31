import React from 'react';
import { PageView, StudentProfile } from '../../types/index.ts';
import { formatFullCurrentDate } from '../../utils/dateUtils.ts';
import { UserAvatar } from '../common/UserAvatar.tsx';
import { Calendar, Plus, Menu } from 'lucide-react';

interface NavbarProps {
  currentPage: PageView;
  profile: StudentProfile;
  onOpenMobileMenu: () => void;
  onOpenNewTask: () => void;
  onNavigateProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  profile,
  onOpenMobileMenu,
  onOpenNewTask,
  onNavigateProfile,
}) => {
  const pageTitles: Record<PageView, { title: string; subtitle: string }> = {
    overview: {
      title: 'Visão Geral',
      subtitle: 'Acompanhe seu progresso acadêmico, alertas e entregas prioritárias',
    },
    disciplines: {
      title: 'Minhas Disciplinas',
      subtitle: 'Gerenciamento dos componentes curriculares e carga de atividades',
    },
    tasks: {
      title: 'Minhas Tarefas',
      subtitle: 'Lista centralizada de exercícios, relatórios, estudos e projetos',
    },
    calendar: {
      title: 'Calendário Integrado',
      subtitle: 'Visualização cronológica mensal e semanal dos prazos acadêmicos',
    },
    profile: {
      title: 'Meu Perfil Acadêmico',
      subtitle: 'Informações do curso, dados de matrícula e preferências',
    },
  };

  const { title, subtitle } = pageTitles[currentPage];

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 transition-all">
      {/* Left: Mobile trigger & Page Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          aria-label="Abrir menu lateral"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight truncate">
            {title}
          </h1>
          <p className="text-[11px] text-slate-500 hidden sm:block truncate mt-0.5 font-medium">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right: Date badge, Quick Add, Profile */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Date indication */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100/70 border border-slate-200/60 rounded-xl text-xs font-semibold text-slate-600">
          <Calendar className="w-3.5 h-3.5 text-blue-600" />
          <span>{formatFullCurrentDate()}</span>
        </div>

        {/* Quick Add Task button */}
        <button
          onClick={onOpenNewTask}
          className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 min-h-[40px] bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold rounded-xl shadow-xs shadow-blue-600/20 transition-all duration-150 cursor-pointer btn-press"
          aria-label="Nova Tarefa"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nova Tarefa</span>
        </button>

        {/* Profile Avatar Quick Link */}
        <button
          onClick={onNavigateProfile}
          className="flex items-center gap-2 p-1.5 min-h-[40px] rounded-xl hover:bg-slate-100/80 transition-colors cursor-pointer border border-transparent hover:border-slate-200/60"
          title="Ver perfil"
          aria-label="Meu Perfil"
        >
          <UserAvatar
            name={profile.name}
            avatarUrl={profile.avatarUrl}
            className="w-7 h-7 rounded-lg ring-1 ring-blue-500/20 shadow-2xs"
            fallbackTextClassName="text-[10px] font-bold text-blue-700"
          />
          <span className="text-xs font-semibold text-slate-700 hidden lg:inline max-w-[100px] truncate">
            {profile.name.split(' ')[0]}
          </span>
        </button>
      </div>
    </header>
  );
};
