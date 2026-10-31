import React, { useState, useMemo } from 'react';
import { Discipline, Priority, Task, TaskStatus } from '../../types/index.ts';
import { isOverdue, formatDatePtBr, formatDateShort, getDaysDifference } from '../../utils/dateUtils.ts';
import { PriorityBadge } from '../common/PriorityBadge.tsx';
import { ConfirmModal } from '../common/ConfirmModal.tsx';
import {
  Search,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  Edit2,
  Trash2,
  ChevronDown,
  ArrowUpDown,
  ListFilter,
  Check,
  RefreshCw,
} from 'lucide-react';

interface TasksViewProps {
  tasks: Task[];
  disciplines: Discipline[];
  onToggleTaskStatus: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenNewTask: (defaultDisciplineId?: string) => void;
  initialDisciplineFilter?: string;
  initialStatusFilter?: string;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  disciplines,
  onToggleTaskStatus,
  onEditTask,
  onDeleteTask,
  onOpenNewTask,
  initialDisciplineFilter = 'all',
  initialStatusFilter = 'all',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [disciplineFilter, setDisciplineFilter] = useState(initialDisciplineFilter);
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter); // 'all' | 'pendente' | 'concluida' | 'atrasada'
  const [priorityFilter, setPriorityFilter] = useState<string>('all'); // 'all' | 'alta' | 'media' | 'baixa'
  const [sortBy, setSortBy] = useState<'dueDateAsc' | 'dueDateDesc' | 'priority' | 'title'>('dueDateAsc');
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  React.useEffect(() => {
    if (initialDisciplineFilter) {
      setDisciplineFilter(initialDisciplineFilter);
    }
  }, [initialDisciplineFilter]);

  React.useEffect(() => {
    if (initialStatusFilter) {
      setStatusFilter(initialStatusFilter);
    }
  }, [initialStatusFilter]);

  const getDiscipline = (id: string) => disciplines.find((d) => d.id === id);

  // Filter & Sort Pipeline
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Search text
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(q);
          const matchDesc = task.description.toLowerCase().includes(q);
          const disc = getDiscipline(task.disciplineId);
          const matchDisc = disc ? disc.name.toLowerCase().includes(q) : false;
          if (!matchTitle && !matchDesc && !matchDisc) return false;
        }

        // Discipline filter
        if (disciplineFilter !== 'all' && task.disciplineId !== disciplineFilter) {
          return false;
        }

        // Priority filter
        if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
          return false;
        }

        // Status filter
        if (statusFilter === 'pendente') {
          return task.status === 'pendente';
        }
        if (statusFilter === 'concluida') {
          return task.status === 'concluida';
        }
        if (statusFilter === 'atrasada') {
          return isOverdue(task.dueDate, task.status);
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'dueDateAsc') {
          return a.dueDate.localeCompare(b.dueDate);
        }
        if (sortBy === 'dueDateDesc') {
          return b.dueDate.localeCompare(a.dueDate);
        }
        if (sortBy === 'priority') {
          const weight: Record<Priority, number> = { alta: 3, media: 2, baixa: 1 };
          return weight[b.priority] - weight[a.priority];
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [tasks, searchQuery, disciplineFilter, statusFilter, priorityFilter, sortBy, disciplines]);

  const overdueCount = tasks.filter((t) => isOverdue(t.dueDate, t.status)).length;
  const pendingCount = tasks.filter((t) => t.status === 'pendente').length;
  const completedCount = tasks.filter((t) => t.status === 'concluida').length;

  const handleResetFilters = () => {
    setSearchQuery('');
    setDisciplineFilter('all');
    setStatusFilter('all');
    setPriorityFilter('all');
    setSortBy('dueDateAsc');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Controls & Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Gerenciador de Tarefas Acadêmicas
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
              Controle listas de exercícios, entregas de relatórios, provas e projetos.
            </p>
          </div>

          <button
            onClick={() => onOpenNewTask(disciplineFilter !== 'all' ? disciplineFilter : undefined)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs shadow-blue-600/20 transition-all duration-150 flex items-center gap-2 cursor-pointer shrink-0 btn-press"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Tarefa</span>
          </button>
        </div>

        {/* Search input + Filter tabs */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 pt-2 border-t border-slate-100">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar por título, orientação ou disciplina..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-slate-50/40 hover:bg-white transition-all font-medium"
            />
          </div>

          {/* Quick status tabs (Segmented controls) */}
          <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl overflow-x-auto touch-pan-x shrink-0 max-w-full">
            <button
              onClick={() => setStatusFilter('all')}
              className={`min-h-[36px] px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-150 cursor-pointer whitespace-nowrap ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todas ({tasks.length})
            </button>
            <button
              onClick={() => setStatusFilter('pendente')}
              className={`min-h-[36px] px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-150 cursor-pointer whitespace-nowrap ${
                statusFilter === 'pendente'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pendentes ({pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter('concluida')}
              className={`min-h-[36px] px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-150 cursor-pointer whitespace-nowrap ${
                statusFilter === 'concluida'
                  ? 'bg-white text-emerald-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Concluídas ({completedCount})
            </button>
            <button
              onClick={() => setStatusFilter('atrasada')}
              className={`min-h-[36px] px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-150 cursor-pointer whitespace-nowrap ${
                statusFilter === 'atrasada'
                  ? 'bg-white text-rose-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Atrasadas ({overdueCount})
            </button>
          </div>
        </div>

        {/* Dropdowns row: Discipline filter, Priority filter, Sort */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2 text-xs">
          {/* Discipline selector */}
          <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] shrink-0">Disciplina:</span>
            <select
              value={disciplineFilter}
              onChange={(e) => setDisciplineFilter(e.target.value)}
              className="flex-1 sm:flex-none px-3 py-2 min-h-[38px] rounded-xl border border-slate-200 bg-white text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              <option value="all">Todas as Disciplinas</option>
              {disciplines.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} {d.code ? `(${d.code})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Priority selector */}
          <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] shrink-0">Prioridade:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="flex-1 sm:flex-none px-3 py-2 min-h-[38px] rounded-xl border border-slate-200 bg-white text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              <option value="all">Todas as Prioridades</option>
              <option value="alta">Alta</option>
              <option value="media">Média</option>
              <option value="baixa">Baixa</option>
            </select>
          </div>

          {/* Sort selector */}
          <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto sm:ml-auto">
            <div className="flex items-center gap-1.5 shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Ordenar:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="flex-1 sm:flex-none px-3 py-2 min-h-[38px] rounded-xl border border-slate-200 bg-white text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              <option value="dueDateAsc">Vencimento (Mais próximas)</option>
              <option value="dueDateDesc">Vencimento (Mais distantes)</option>
              <option value="priority">Maior Prioridade</option>
              <option value="title">Título (A-Z)</option>
            </select>
          </div>

          {/* Reset Filters button */}
          {(searchQuery || disciplineFilter !== 'all' || statusFilter !== 'all' || priorityFilter !== 'all') && (
            <button
              onClick={handleResetFilters}
              className="min-h-[38px] px-3 py-2 text-slate-600 hover:text-slate-900 bg-slate-100/80 hover:bg-slate-200/80 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-bold w-full sm:w-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Limpar filtros</span>
            </button>
          )}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <ListFilter className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">
              Nenhuma tarefa encontrada
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Nenhuma atividade corresponde aos filtros atuais. Tente ajustar os parâmetros de busca ou adicione uma nova tarefa.
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Limpar Filtros
              </button>
              <button
                onClick={() => onOpenNewTask()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cadastrar Tarefa
              </button>
            </div>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const discipline = getDiscipline(task.disciplineId);
            const isTaskOverdue = isOverdue(task.dueDate, task.status);
            const isCompleted = task.status === 'concluida';
            const daysDiff = getDaysDifference(task.dueDate);

            return (
              <div
                key={task.id}
                className={`rounded-3xl border transition-all duration-150 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs hover:shadow-xs ${
                  isTaskOverdue
                    ? 'border-rose-200/90 bg-rose-50/20 hover:border-rose-300'
                    : isCompleted
                    ? 'border-slate-200/60 bg-slate-50/40'
                    : 'bg-white border-slate-200/80 hover:border-slate-300'
                }`}
              >
                {/* Left section: Checkbox, Title, Details */}
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  {/* Status Toggle Button with 44px tap zone */}
                  <div className="shrink-0 -mt-1 -ml-1">
                    <button
                      type="button"
                      onClick={() => onToggleTaskStatus(task.id)}
                      className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl cursor-pointer transition-colors hover:bg-slate-100/60`}
                      title={isCompleted ? 'Clique para reabrir tarefa' : 'Clique para marcar como concluída'}
                      aria-label={isCompleted ? 'Reabrir tarefa' : 'Marcar como concluída'}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                          isCompleted
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xs'
                            : 'border-slate-300 hover:border-blue-600 bg-white hover:bg-blue-50/40'
                        }`}
                      >
                        {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  </div>

                  {/* Task Content */}
                  <div className="min-w-0 flex-1 pt-1 sm:pt-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        onClick={() => onEditTask(task)}
                        className={`text-sm sm:text-base font-extrabold tracking-tight cursor-pointer hover:text-blue-600 transition-colors ${
                          isCompleted
                            ? 'line-through text-slate-400 font-semibold'
                            : 'text-slate-900'
                        }`}
                      >
                        {task.title}
                      </h3>

                      {isTaskOverdue && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Atrasada</span>
                        </span>
                      )}

                      {isCompleted && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Concluída
                        </span>
                      )}
                    </div>

                    {task.description && (
                      <p
                        className={`text-xs mt-1 leading-relaxed line-clamp-2 font-medium ${
                          isCompleted ? 'text-slate-400' : 'text-slate-600'
                        }`}
                      >
                        {task.description}
                      </p>
                    )}

                    {/* Meta info: Discipline badge & Due date */}
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-500 font-medium">
                      {discipline && (
                        <span
                          className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${discipline.bgClass} ${discipline.textClass} ${discipline.borderClass} tracking-wide`}
                        >
                          {discipline.name}
                        </span>
                      )}

                      <span aria-hidden="true" className="text-slate-300">·</span>

                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span
                          className={`tabular-nums ${
                            isTaskOverdue
                              ? 'text-rose-600 font-bold'
                              : isCompleted
                              ? 'text-slate-400'
                              : daysDiff <= 2
                              ? 'text-amber-700 font-bold'
                              : 'text-slate-600'
                          }`}
                        >
                          Vencimento: {formatDateShort(task.dueDate)}
                        </span>
                      </div>

                      {daysDiff >= 0 && daysDiff <= 7 && !isCompleted && (
                        <>
                          <span aria-hidden="true" className="text-slate-300">·</span>
                          <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80">
                            {daysDiff === 0 ? 'Vence hoje!' : daysDiff === 1 ? 'Amanhã' : `Em ${daysDiff} dias`}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right section: Priority badge + Action buttons */}
                <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto justify-between sm:justify-end">
                  <PriorityBadge priority={task.priority} />

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditTask(task)}
                      className="min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl transition-colors cursor-pointer"
                      title="Editar tarefa"
                      aria-label="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setTaskToDelete(task)}
                      className="min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50/80 rounded-xl transition-colors cursor-pointer"
                      title="Excluir tarefa"
                      aria-label="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Task Confirmation Modal */}
      <ConfirmModal
        isOpen={!!taskToDelete}
        title="Excluir Tarefa Acadêmica"
        message={
          taskToDelete
            ? `Tem certeza que deseja remover a tarefa "${taskToDelete.title}"? Esta ação não poderá ser desfeita.`
            : ''
        }
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        danger
        onConfirm={() => {
          if (taskToDelete) {
            onDeleteTask(taskToDelete.id);
            setTaskToDelete(null);
          }
        }}
        onCancel={() => setTaskToDelete(null)}
      />
    </div>
  );
};
