import React from 'react';
import { Discipline, StudentProfile, Task } from '../../types/index.ts';
import { isOverdue, getDaysDifference, formatDateShort, formatFullCurrentDate } from '../../utils/dateUtils.ts';
import { PriorityBadge } from '../common/PriorityBadge.tsx';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  PlusCircle,
  ArrowRight,
  BookOpen,
  Sparkles,
  ChevronRight,
  Flame,
} from 'lucide-react';

interface OverviewViewProps {
  tasks: Task[];
  disciplines: Discipline[];
  profile: StudentProfile;
  onOpenNewTask: () => void;
  onToggleTaskStatus: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onNavigateToTasks: (filterDisciplineId?: string, filterStatus?: string) => void;
  onNavigateToDisciplines: () => void;
  onNavigateToCalendar: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  tasks,
  disciplines,
  profile,
  onOpenNewTask,
  onToggleTaskStatus,
  onEditTask,
  onNavigateToTasks,
  onNavigateToDisciplines,
  onNavigateToCalendar,
}) => {
  // Metrics calculation
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => t.status === 'pendente');
  const completedTasks = tasks.filter((t) => t.status === 'concluida');
  const overdueTasks = tasks.filter((t) => isOverdue(t.dueDate, t.status));
  
  // Upcoming within 7 days
  const upcomingTasks = pendingTasks.filter((t) => {
    const diff = getDaysDifference(t.dueDate);
    return diff >= 0 && diff <= 7;
  });

  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  // Urgent attention tasks: Overdue tasks first, then high-priority pending tasks due within 7 days
  const priorityAttentionTasks = [
    ...overdueTasks,
    ...upcomingTasks.filter((t) => t.priority === 'alta' && !overdueTasks.some((ot) => ot.id === t.id)),
    ...upcomingTasks.filter((t) => t.priority !== 'alta' && !overdueTasks.some((ot) => ot.id === t.id)),
  ].slice(0, 5);

  const getDiscipline = (id: string) => disciplines.find((d) => d.id === id);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-6 sm:p-8 text-white shadow-xs shadow-blue-600/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white/95 backdrop-blur-xs text-xs font-bold mb-3 tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
            <span>{formatFullCurrentDate()}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Olá, {profile.name.split(' ')[0]}! 👋
          </h2>
          <p className="text-blue-100 text-xs sm:text-sm mt-2 leading-relaxed font-medium">
            {overdueTasks.length > 0 ? (
              <>
                Você tem <strong className="text-white font-bold">{overdueTasks.length} tarefa pendente atrasada</strong> e{' '}
                <strong className="text-white font-bold">{upcomingTasks.length} entregas previstas</strong> para esta semana.
              </>
            ) : (
              <>
                Tudo em ordem! Você tem <strong className="text-white font-bold">{upcomingTasks.length} entregas acadêmicas</strong> para esta semana.
              </>
            )}
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <button
            onClick={onOpenNewTask}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer btn-press"
          >
            <PlusCircle className="w-4 h-4 text-blue-600" />
            <span>Adicionar Tarefa</span>
          </button>
          <button
            onClick={onNavigateToCalendar}
            className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm rounded-xl backdrop-blur-xs transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer btn-press"
          >
            <Calendar className="w-4 h-4" />
            <span>Calendário</span>
          </button>
        </div>

        {/* Decorative background blur shapes */}
        <div className="absolute -right-8 -top-8 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-32 -bottom-10 w-44 h-44 bg-indigo-400/20 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Tasks */}
        <div
          onClick={() => onNavigateToTasks(undefined, 'pendente')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-blue-300 shadow-2xs hover:shadow-xs transition-all duration-150 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Pendentes
            </span>
            <div className="w-8.5 h-8.5 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-150">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tabular-nums tracking-tight">
              {pendingTasks.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">em aberto</span>
          </div>
          <div className="mt-3 text-xs text-blue-600 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform duration-150">
            <span>Ver pendentes</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Overdue Tasks */}
        <div
          onClick={() => onNavigateToTasks(undefined, 'atrasada')}
          className={`p-5 rounded-2xl border transition-all duration-150 cursor-pointer group shadow-2xs hover:shadow-xs ${
            overdueTasks.length > 0
              ? 'border-rose-200/90 bg-rose-50/20 hover:border-rose-300'
              : 'border-slate-200/80 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Atrasadas
            </span>
            <div
              className={`w-8.5 h-8.5 rounded-xl flex items-center justify-center transition-colors duration-150 ${
                overdueTasks.length > 0
                  ? 'bg-rose-100 text-rose-600 group-hover:bg-rose-600 group-hover:text-white'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span
              className={`text-3xl font-extrabold tabular-nums tracking-tight ${
                overdueTasks.length > 0 ? 'text-rose-600' : 'text-slate-900'
              }`}
            >
              {overdueTasks.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {overdueTasks.length === 1 ? 'prazo vencido' : 'prazos vencidos'}
            </span>
          </div>
          <div className="mt-3 text-xs font-semibold flex items-center gap-1">
            {overdueTasks.length > 0 ? (
              <span className="text-rose-600 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                <span>Atenção prioritária</span>
              </span>
            ) : (
              <span className="text-emerald-600">Sem pendências vencidas</span>
            )}
          </div>
        </div>

        {/* Upcoming in 7 days */}
        <div
          onClick={() => onNavigateToCalendar()}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-amber-300 shadow-2xs hover:shadow-xs transition-all duration-150 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Próximos 7 Dias
            </span>
            <div className="w-8.5 h-8.5 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors duration-150">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tabular-nums tracking-tight">
              {upcomingTasks.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">nesta semana</span>
          </div>
          <div className="mt-3 text-xs text-amber-700 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform duration-150">
            <span>Abrir calendário</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Completed Tasks */}
        <div
          onClick={() => onNavigateToTasks(undefined, 'concluida')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-emerald-300 shadow-2xs hover:shadow-xs transition-all duration-150 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Concluídas
            </span>
            <div className="w-8.5 h-8.5 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-150">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tabular-nums tracking-tight">
              {completedTasks.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              de {totalTasks} ({completionRate}%)
            </span>
          </div>
          {/* Visual Mini Progress Bar */}
          <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Priority Attention Tasks + Discipline Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Priority Attention (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                  Tarefas que precisam de atenção
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  Atividades atrasadas ou com vencimento mais próximo
                </p>
              </div>
              <button
                onClick={() => onNavigateToTasks()}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Ver todas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {priorityAttentionTasks.length === 0 ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-800">Parabéns!</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Não há tarefas atrasadas ou urgentes pendentes no momento.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {priorityAttentionTasks.map((task) => {
                  const discipline = getDiscipline(task.disciplineId);
                  const isTaskOverdue = isOverdue(task.dueDate, task.status);
                  const daysDiff = getDaysDifference(task.dueDate);

                  return (
                    <div
                      key={task.id}
                      className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-150 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 ${
                        isTaskOverdue
                          ? 'border-rose-200/90 bg-rose-50/25 hover:border-rose-300'
                          : 'border-slate-200/80 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                        {/* Checkbox toggle with 44px hit zone */}
                        <div className="shrink-0 -mt-1 -ml-1 sm:mt-0 sm:ml-0">
                          <button
                            type="button"
                            onClick={() => onToggleTaskStatus(task.id)}
                            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl cursor-pointer hover:bg-slate-100/50 transition-colors"
                            aria-label={task.status === 'concluida' ? 'Reabrir tarefa' : 'Concluir tarefa'}
                          >
                            <div
                              className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                                task.status === 'concluida'
                                  ? 'bg-emerald-600 border-emerald-600 text-white'
                                  : 'border-slate-300 hover:border-blue-600 bg-white'
                              }`}
                            >
                              {task.status === 'concluida' && <CheckCircle2 className="w-3.5 h-3.5" />}
                            </div>
                          </button>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              onClick={() => onEditTask(task)}
                              className={`text-sm font-bold tracking-tight hover:text-blue-600 transition-colors cursor-pointer ${
                                task.status === 'concluida'
                                  ? 'line-through text-slate-400'
                                  : 'text-slate-900'
                              }`}
                            >
                              {task.title}
                            </span>

                            {isTaskOverdue && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200/80">
                                Atrasada
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1 font-medium">
                            {discipline && (
                              <span
                                className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${discipline.bgClass} ${discipline.textClass} border ${discipline.borderClass}`}
                              >
                                {discipline.name}
                              </span>
                            )}
                            <span aria-hidden="true">·</span>
                            <span
                              className={`tabular-nums ${
                                isTaskOverdue ? 'text-rose-600 font-bold' : ''
                              }`}
                            >
                              {isTaskOverdue
                                ? `Venceu em ${formatDateShort(task.dueDate)}`
                                : daysDiff === 0
                                ? 'Vence hoje'
                                : daysDiff === 1
                                ? 'Vence amanhã'
                                : `Vence em ${formatDateShort(task.dueDate)}`}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <PriorityBadge priority={task.priority} compact />
                        <button
                          onClick={() => onEditTask(task)}
                          className="min-h-[38px] px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-slate-200/60"
                        >
                          Detalhes
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Disciplines Overview Progress (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                  Disciplinas do Semestre
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Carga e entregas por matéria
                </p>
              </div>
              <button
                onClick={onNavigateToDisciplines}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                Gerenciar
              </button>
            </div>

            <div className="space-y-3">
              {disciplines.map((disc) => {
                const discTasks = tasks.filter((t) => t.disciplineId === disc.id);
                const discCompleted = discTasks.filter((t) => t.status === 'concluida').length;
                const discPending = discTasks.filter((t) => t.status === 'pendente').length;
                const discPercent = discTasks.length > 0 ? Math.round((discCompleted / discTasks.length) * 100) : 0;

                return (
                  <div
                    key={disc.id}
                    onClick={() => onNavigateToTasks(disc.id)}
                    className="p-3 rounded-2xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50/60 transition-all duration-150 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: disc.color }}
                        />
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {disc.name}
                        </span>
                        {disc.code && (
                          <span className="text-[10px] text-slate-400 font-mono font-semibold">
                            {disc.code}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 tabular-nums shrink-0">
                        {discPending} pendente{discPending !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Progress line */}
                    <div className="mt-2.5 flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${discPercent}%`,
                            backgroundColor: disc.color,
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 tabular-nums">
                        {discPercent}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={onNavigateToDisciplines}
              className="w-full mt-4 py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200/80 transition-colors flex items-center justify-center gap-1.5 cursor-pointer btn-press"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              <span>Ver todas as disciplinas</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
