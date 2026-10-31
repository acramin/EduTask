import React from 'react';
import { PageView, StudentProfile } from '../../types/index.ts';
import { EduLogo } from '../common/EduLogo.tsx';
import { UserAvatar } from '../common/UserAvatar.tsx';
import {
  LayoutDashboard,
  BookOpen,
  CheckSquare,
  Calendar as CalendarIcon,
  User,
  Plus,
  PlusCircle,
  LogOut,
  X,
  Sparkles,
} from 'lucide-react';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  onOpenNewTask: () => void;
  profile: StudentProfile;
  pendingCount: number;
  overdueCount: number;
  onLogout: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  currentPage,
  onNavigate,
  onOpenNewTask,
  profile,
  pendingCount,
  overdueCount,
  onLogout,
}) => {
  if (!isOpen) return null;

  const navItems = [
    {
      id: 'overview' as PageView,
      label: 'Visão geral',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'disciplines' as PageView,
      label: 'Minhas disciplinas',
      icon: BookOpen,
      badge: null,
    },
    {
      id: 'tasks' as PageView,
      label: 'Minhas tarefas',
      icon: CheckSquare,
      badge: overdueCount > 0 ? `${overdueCount} atrasada(s)` : `${pendingCount}`,
      badgeColor: overdueCount > 0 ? 'bg-rose-100 text-rose-700 font-semibold' : 'bg-blue-100 text-blue-700',
    },
    {
      id: 'calendar' as PageView,
      label: 'Calendário',
      icon: CalendarIcon,
      badge: null,
    },
    {
      id: 'profile' as PageView,
      label: 'Meu perfil',
      icon: User,
      badge: null,
    },
  ];

  const handleItemClick = (page: PageView) => {
    onNavigate(page);
    onClose();
  };

  const handleNewTaskClick = () => {
    onClose();
    onOpenNewTask();
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <EduLogo size="sm" showSubtitle={false} />
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <button
            onClick={handleNewTaskClick}
            className="w-full min-h-[44px] py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs shadow-blue-600/20 transition-all cursor-pointer btn-press"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Tarefa</span>
          </button>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-blue-600' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold tabular-nums ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="mt-4 p-3 bg-blue-50/60 rounded-xl border border-blue-100/70">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-xs mb-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Semestre 2026.2</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Data de hoje: 31 de Outubro de 2026.
            </p>
          </div>
        </nav>

        {/* User Card */}
        <div className="p-3 border-t border-slate-100 bg-slate-50">
          <div className="flex items-center justify-between gap-2 p-1.5">
            <button
              onClick={() => handleItemClick('profile')}
              className="flex items-center gap-2.5 min-w-0 text-left flex-1 min-h-[44px] py-1"
            >
              <UserAvatar
                name={profile.name}
                avatarUrl={profile.avatarUrl}
                className="w-8 h-8 rounded-lg ring-1 ring-blue-500/20 shrink-0"
                fallbackTextClassName="text-[11px] font-bold text-blue-700"
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {profile.name}
                </div>
                <div className="text-[11px] text-slate-500 truncate font-medium">
                  {profile.course}
                </div>
              </div>
            </button>
            <button
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
              title="Sair"
              aria-label="Sair da conta"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
