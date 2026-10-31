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
  LogOut,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  onOpenNewTask: () => void;
  profile: StudentProfile;
  pendingCount: number;
  overdueCount: number;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  onOpenNewTask,
  profile,
  pendingCount,
  overdueCount,
  onLogout,
}) => {
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
      badge: overdueCount > 0 ? `${overdueCount}` : `${pendingCount}`,
      badgeColor:
        overdueCount > 0
          ? 'bg-rose-100/90 text-rose-700 font-bold border border-rose-200/60'
          : 'bg-slate-100 text-slate-600 font-semibold',
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

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col h-screen sticky top-0 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 pb-4 border-b border-slate-100/80 flex items-center justify-between">
        <EduLogo size="md" showSubtitle={false} />
      </div>

      {/* Primary Action Button */}
      <div className="p-4 pb-2">
        <button
          onClick={onOpenNewTask}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs shadow-blue-600/25 transition-all duration-150 cursor-pointer btn-press group"
        >
          <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200" />
          <span>Nova Tarefa</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 pt-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          Navegação
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer text-left ${
                isActive
                  ? 'bg-blue-50/90 text-blue-700 shadow-2xs border border-blue-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full tabular-nums ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Academic Semester Pill Box */}
        <div className="mt-6 mx-1 p-3.5 bg-gradient-to-br from-blue-50/60 via-indigo-50/40 to-purple-50/50 rounded-2xl border border-blue-100/70">
          <div className="flex items-center gap-2 text-indigo-950 font-bold text-xs mb-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>Semestre 2026.2</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Data atual do protótipo: <strong className="text-slate-800">31/10/2026</strong>.
          </p>
        </div>
      </nav>

      {/* User Card & Logout */}
      <div className="p-3 border-t border-slate-100/90 bg-slate-50/40">
        <div className="flex items-center justify-between gap-2.5 p-2 rounded-xl hover:bg-white transition-all border border-transparent hover:border-slate-200/70">
          <button
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-2.5 min-w-0 text-left flex-1 cursor-pointer"
          >
            <UserAvatar
              name={profile.name}
              avatarUrl={profile.avatarUrl}
              className="w-9 h-9 rounded-xl ring-2 ring-blue-500/15 shadow-2xs"
              fallbackTextClassName="text-xs font-bold text-blue-700"
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
            onClick={onLogout}
            title="Sair do EduTask"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            aria-label="Sair"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

