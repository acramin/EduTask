import React, { useState } from 'react';
import { Discipline, Task } from '../../types/index.ts';
import { CURRENT_DATE_STR } from '../../data/initialData.ts';
import { isOverdue, formatDatePtBr, formatDateShort } from '../../utils/dateUtils.ts';
import { PriorityBadge } from '../common/PriorityBadge.tsx';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  Edit2,
  Trash2,
} from 'lucide-react';

interface CalendarViewProps {
  tasks: Task[];
  disciplines: Discipline[];
  onOpenNewTaskWithDate: (dateStr: string) => void;
  onEditTask: (task: Task) => void;
  onToggleTaskStatus: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onNavigateToTasks?: (disciplineId?: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  disciplines,
  onOpenNewTaskWithDate,
  onEditTask,
  onToggleTaskStatus,
  onDeleteTask,
  onNavigateToTasks,
}) => {
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  // Anchor date: Current prototype date is 2026-10-31
  const [currentDate, setCurrentDate] = useState(() => new Date('2026-10-31T12:00:00'));
  const [selectedDateStr, setSelectedDateStr] = useState<string>(CURRENT_DATE_STR);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const getDiscipline = (id: string) => disciplines.find((d) => d.id === id);

  // Month navigation helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrev = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month - 1, 1, 12, 0, 0));
    } else {
      const prevWeek = new Date(currentDate);
      prevWeek.setDate(prevWeek.getDate() - 7);
      setCurrentDate(prevWeek);
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month + 1, 1, 12, 0, 0));
    } else {
      const nextWeek = new Date(currentDate);
      nextWeek.setDate(nextWeek.getDate() + 7);
      setCurrentDate(nextWeek);
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date('2026-10-31T12:00:00'));
    setSelectedDateStr(CURRENT_DATE_STR);
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Calculate days for Month View
  const monthDays = React.useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    const days = [];

    // Previous month filler days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthLastDay - i;
      const m = month === 0 ? 12 : month;
      const y = month === 0 ? year - 1 : year;
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        dayNumber: d,
        dateStr,
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let d = 1; d <= lastDayOfMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        dayNumber: d,
        dateStr,
        isCurrentMonth: true,
      });
    }

    // Next month filler days to complete 35 or 42 cells
    const remaining = 35 - days.length >= 0 ? 35 - days.length : 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const m = month + 2 > 12 ? 1 : month + 2;
      const y = month + 2 > 12 ? year + 1 : year;
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        dayNumber: i,
        dateStr,
        isCurrentMonth: false,
      });
    }

    return days;
  }, [year, month]);

  // Calculate days for Week View
  const weekDaysList = React.useMemo(() => {
    const curr = new Date(currentDate);
    const dayOfWeek = curr.getDay(); // 0 is Sunday
    const startOfWeek = new Date(curr);
    startOfWeek.setDate(curr.getDate() - dayOfWeek);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      const dateNum = d.getDate();
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(dateNum).padStart(2, '0')}`;
      days.push({
        dayNumber: dateNum,
        dayName: weekDays[i],
        dateStr,
        isToday: dateStr === CURRENT_DATE_STR,
      });
    }
    return days;
  }, [currentDate]);

  // Tasks on selected date for Mobile Agenda
  const selectedDayTasks = React.useMemo(() => {
    return tasks.filter((t) => t.dueDate === selectedDateStr);
  }, [tasks, selectedDateStr]);

  return (
    <div className="space-y-5 sm:space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Controls */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        {/* Left: Navigation and Month Label */}
        <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3">
          <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl">
            <button
              onClick={handlePrev}
              className="min-h-[36px] min-w-[36px] flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors cursor-pointer"
              title="Período anterior"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="min-h-[36px] min-w-[36px] flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors cursor-pointer"
              title="Próximo período"
              aria-label="Próximo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight truncate">
            {monthNames[month]} de {year}
          </h2>

          <button
            onClick={handleToday}
            className="px-2.5 sm:px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100/90 text-xs font-bold rounded-xl border border-blue-200/60 transition-colors cursor-pointer shrink-0"
          >
            Hoje
          </button>
        </div>

        {/* Right: View Mode Toggle (Mês / Semana) + Nova Tarefa */}
        <div className="flex items-center gap-2 sm:gap-3 justify-between sm:justify-end">
          <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl flex-1 sm:flex-none">
            <button
              onClick={() => setViewMode('month')}
              className={`flex-1 sm:flex-none px-3 sm:px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all duration-150 cursor-pointer text-center ${
                viewMode === 'month'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Visão Mensal
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`flex-1 sm:flex-none px-3 sm:px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all duration-150 cursor-pointer text-center ${
                viewMode === 'week'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Visão Semanal
            </button>
          </div>

          <button
            onClick={() => onOpenNewTaskWithDate(selectedDateStr || CURRENT_DATE_STR)}
            className="min-h-[38px] px-3 sm:px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-xs shadow-blue-600/20 transition-all duration-150 flex items-center gap-1.5 cursor-pointer shrink-0 btn-press"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nova Tarefa</span>
          </button>
        </div>
      </div>

      {/* MONTH VIEW */}
      {viewMode === 'month' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            {/* Weekday Header */}
            <div className="grid grid-cols-7 border-b border-slate-200/70 bg-slate-50/70 text-center text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider py-2 sm:py-3">
              {weekDays.map((wd) => (
                <div key={wd}>{wd}</div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 divide-x divide-y divide-slate-100">
              {monthDays.map((cell, idx) => {
                const dayTasks = tasks.filter((t) => t.dueDate === cell.dateStr);
                const isCellToday = cell.dateStr === CURRENT_DATE_STR;
                const isSelected = cell.dateStr === selectedDateStr;

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedDateStr(cell.dateStr)}
                    className={`min-h-[56px] sm:min-h-[125px] p-1.5 sm:p-2 flex flex-col justify-between transition-colors group cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/70 ring-2 ring-inset ring-blue-500 sm:ring-0 sm:bg-blue-50/30'
                        : !cell.isCurrentMonth
                        ? 'bg-slate-50/30 text-slate-300'
                        : isCellToday
                        ? 'bg-blue-50/25'
                        : 'bg-white hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center tabular-nums ${
                          isCellToday
                            ? 'bg-blue-600 text-white shadow-2xs font-extrabold'
                            : isSelected
                            ? 'text-blue-700 font-extrabold sm:text-slate-800'
                            : cell.isCurrentMonth
                            ? 'text-slate-800'
                            : 'text-slate-400'
                        }`}
                      >
                        {cell.dayNumber}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenNewTaskWithDate(cell.dateStr);
                        }}
                        className="opacity-0 group-hover:opacity-100 hover:opacity-100 p-1 text-slate-400 hover:text-blue-600 rounded transition-opacity hidden sm:block"
                        title="Adicionar tarefa neste dia"
                        aria-label="Adicionar tarefa neste dia"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Mobile Task Dots Indicator */}
                    <div className="sm:hidden mt-1 flex flex-wrap items-center justify-center gap-1 min-h-[12px]">
                      {dayTasks.slice(0, 3).map((t) => {
                        const disc = getDiscipline(t.disciplineId);
                        return (
                          <span
                            key={t.id}
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: disc?.color || '#3b82f6' }}
                          />
                        );
                      })}
                      {dayTasks.length > 3 && (
                        <span className="text-[9px] font-extrabold text-slate-500 tabular-nums">
                          +{dayTasks.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Desktop/Tablet Tasks on this day */}
                    <div className="hidden sm:block mt-1 space-y-1 overflow-y-auto max-h-[85px]">
                      {dayTasks.map((t) => {
                        const disc = getDiscipline(t.disciplineId);
                        const isTaskOverdue = isOverdue(t.dueDate, t.status);
                        const isCompleted = t.status === 'concluida';

                        return (
                          <button
                            key={t.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTask(t);
                            }}
                            className={`w-full text-left px-2 py-1 rounded-md text-[11px] font-bold truncate flex items-center gap-1.5 border transition-all duration-150 cursor-pointer ${
                              isCompleted
                                ? 'bg-slate-100/80 border-slate-200 text-slate-400 line-through'
                                : isTaskOverdue
                                ? 'bg-rose-50 border-rose-200/80 text-rose-800'
                                : disc
                                ? `${disc.bgClass} ${disc.textClass} ${disc.borderClass}`
                                : 'bg-blue-50 border-blue-200 text-blue-800'
                            }`}
                            title={`${t.title} - ${disc?.name || ''}`}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full shrink-0"
                              style={{ backgroundColor: disc?.color || '#3b82f6' }}
                            />
                            <span className="truncate">{t.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Agenda Drawer for Selected Day */}
          <div className="sm:hidden bg-white rounded-3xl border border-slate-200/80 shadow-xs p-4 space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Agenda do Dia Selecionado
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 mt-0.5">
                  {formatDatePtBr(selectedDateStr)}
                </h3>
              </div>
              <button
                onClick={() => onOpenNewTaskWithDate(selectedDateStr)}
                className="px-2.5 py-1.5 min-h-[36px] bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl flex items-center gap-1 border border-blue-200/60 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nova Tarefa</span>
              </button>
            </div>

            {selectedDayTasks.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-400 font-medium">
                Nenhuma atividade acadêmica agendada para este dia.
              </div>
            ) : (
              <div className="space-y-2">
                {selectedDayTasks.map((t) => {
                  const disc = getDiscipline(t.disciplineId);
                  const isTaskOverdue = isOverdue(t.dueDate, t.status);
                  const isCompleted = t.status === 'concluida';

                  return (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTask(t)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isCompleted
                          ? 'bg-slate-50/70 border-slate-200 opacity-70'
                          : isTaskOverdue
                          ? 'bg-rose-50/40 border-rose-200'
                          : 'bg-white border-slate-200/80 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleTaskStatus(t.id);
                          }}
                          className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 min-h-[36px] min-w-[36px] cursor-pointer ${
                            isCompleted
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                          aria-label={isCompleted ? 'Reabrir' : 'Concluir'}
                        >
                          {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </button>

                        <div className="min-w-0 flex-1">
                          <div
                            className={`text-xs font-bold truncate ${
                              isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
                            }`}
                          >
                            {t.title}
                          </div>
                          {disc && (
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span
                                className="w-1.5 h-1.5 rounded-full shrink-0"
                                style={{ backgroundColor: disc.color }}
                              />
                              <span className="text-[10px] text-slate-500 font-medium truncate">
                                {disc.name}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-1.5">
                        <PriorityBadge priority={t.priority} compact />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* WEEK VIEW */}
      {viewMode === 'week' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-7 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {weekDaysList.map((day) => {
              const dayTasks = tasks.filter((t) => t.dueDate === day.dateStr);

              return (
                <div
                  key={day.dateStr}
                  className={`min-h-[140px] md:min-h-[340px] p-3 sm:p-4 flex flex-col ${
                    day.isToday ? 'bg-blue-50/30' : 'bg-white'
                  }`}
                >
                  {/* Day Header */}
                  <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {day.dayName}
                      </div>
                      <div
                        className={`text-base font-extrabold tabular-nums ${
                          day.isToday ? 'text-blue-600' : 'text-slate-900'
                        }`}
                      >
                        {formatDateShort(day.dateStr)}
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenNewTaskWithDate(day.dateStr)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      title="Adicionar tarefa neste dia"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Tasks List */}
                  <div className="mt-3 flex-1 space-y-2 overflow-y-auto">
                    {dayTasks.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-400">
                        Nenhum prazo
                      </div>
                    ) : (
                      dayTasks.map((t) => {
                        const disc = getDiscipline(t.disciplineId);
                        const isTaskOverdue = isOverdue(t.dueDate, t.status);
                        const isCompleted = t.status === 'concluida';

                        return (
                          <div
                            key={t.id}
                            onClick={() => setSelectedTask(t)}
                            className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all hover:shadow-xs ${
                              isCompleted
                                ? 'bg-slate-50 border-slate-200 opacity-70'
                                : isTaskOverdue
                                ? 'bg-rose-50/60 border-rose-200'
                                : 'bg-white border-slate-200/80 hover:border-blue-300'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1 mb-1">
                              {disc && (
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${disc.bgClass} ${disc.textClass}`}
                                >
                                  {disc.name}
                                </span>
                              )}
                              <PriorityBadge priority={t.priority} compact />
                            </div>

                            <h4
                              className={`font-semibold mt-1 leading-snug line-clamp-2 ${
                                isCompleted
                                  ? 'line-through text-slate-400'
                                  : 'text-slate-900'
                              }`}
                            >
                              {t.title}
                            </h4>

                            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                              <span>
                                {isCompleted
                                  ? 'Concluída'
                                  : isTaskOverdue
                                  ? 'Atrasada'
                                  : 'Pendente'}
                              </span>
                              <span className="text-blue-600 font-semibold hover:underline">
                                Ver
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Task Details Popup Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-xl border border-slate-200/90">
            <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-slate-100">
              <div className="flex flex-wrap items-center gap-2">
                {(() => {
                  const disc = getDiscipline(selectedTask.disciplineId);
                  return (
                    disc && (
                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${disc.bgClass} ${disc.textClass} ${disc.borderClass} tracking-wide`}
                      >
                        {disc.name}
                      </span>
                    )
                  );
                })()}
                <PriorityBadge priority={selectedTask.priority} />
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <h3
                className={`text-lg font-extrabold tracking-tight ${
                  selectedTask.status === 'concluida'
                    ? 'line-through text-slate-400'
                    : 'text-slate-900'
                }`}
              >
                {selectedTask.title}
              </h3>

              {selectedTask.description ? (
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 font-medium">
                  {selectedTask.description}
                </p>
              ) : (
                <p className="text-xs text-slate-400 italic">Sem orientações cadastradas.</p>
              )}

              <div className="pt-2 flex items-center justify-between text-xs text-slate-600 font-medium">
                <span>Data de Vencimento:</span>
                <span className="font-extrabold tabular-nums text-slate-900">
                  {formatDatePtBr(selectedTask.dueDate)} ({formatDateShort(selectedTask.dueDate)})
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                <span>Status da Atividade:</span>
                <span
                  className={`font-bold ${
                    selectedTask.status === 'concluida'
                      ? 'text-emerald-600'
                      : isOverdue(selectedTask.dueDate, selectedTask.status)
                      ? 'text-rose-600'
                      : 'text-blue-600'
                  }`}
                >
                  {selectedTask.status === 'concluida'
                    ? 'Concluída'
                    : isOverdue(selectedTask.dueDate, selectedTask.status)
                    ? 'Atrasada'
                    : 'Pendente'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                onClick={() => {
                  onToggleTaskStatus(selectedTask.id);
                  setSelectedTask((prev) =>
                    prev
                      ? {
                          ...prev,
                          status: prev.status === 'concluida' ? 'pendente' : 'concluida',
                        }
                      : null
                  );
                }}
                className={`w-full sm:w-auto min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer btn-press ${
                  selectedTask.status === 'concluida'
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-2xs'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {selectedTask.status === 'concluida' ? 'Reabrir Tarefa' : 'Marcar como Concluída'}
                </span>
              </button>

              <div className="flex items-center justify-between sm:justify-end gap-2">
                {onNavigateToTasks && (
                  <button
                    onClick={() => {
                      const discId = selectedTask.disciplineId;
                      setSelectedTask(null);
                      onNavigateToTasks(discId);
                    }}
                    className="flex-1 sm:flex-none min-h-[44px] px-3 py-2 text-xs font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50/80 rounded-xl transition-colors cursor-pointer text-center"
                    title="Ver na lista de tarefas"
                  >
                    Ver na Lista
                  </button>
                )}
                <button
                  onClick={() => {
                    const task = selectedTask;
                    setSelectedTask(null);
                    onEditTask(task);
                  }}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl transition-colors cursor-pointer"
                  title="Editar tarefa"
                  aria-label="Editar tarefa"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    const id = selectedTask.id;
                    setSelectedTask(null);
                    onDeleteTask(id);
                  }}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-500 hover:text-rose-600 hover:bg-rose-50/80 rounded-xl transition-colors cursor-pointer"
                  title="Excluir tarefa"
                  aria-label="Excluir tarefa"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
