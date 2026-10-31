import React, { useState } from 'react';
import { Discipline, Task } from '../../types/index.ts';
import { DisciplineFormModal } from './DisciplineFormModal.tsx';
import { ConfirmModal } from '../common/ConfirmModal.tsx';
import {
  Plus,
  BookOpen,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  ListTodo,
  MapPin,
  User,
  ArrowRight,
} from 'lucide-react';

interface DisciplinesViewProps {
  disciplines: Discipline[];
  tasks: Task[];
  onSaveDiscipline: (disciplineData: Omit<Discipline, 'id'>, disciplineId?: string) => void;
  onDeleteDiscipline: (disciplineId: string) => void;
  onNavigateToTasksWithFilter: (disciplineId: string) => void;
  onOpenNewTaskWithDiscipline: (disciplineId: string) => void;
}

export const DisciplinesView: React.FC<DisciplinesViewProps> = ({
  disciplines,
  tasks,
  onSaveDiscipline,
  onDeleteDiscipline,
  onNavigateToTasksWithFilter,
  onOpenNewTaskWithDiscipline,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDiscipline, setEditingDiscipline] = useState<Discipline | null>(null);
  const [disciplineToDelete, setDisciplineToDelete] = useState<Discipline | null>(null);

  const handleCreate = () => {
    setEditingDiscipline(null);
    setIsModalOpen(true);
  };

  const handleEdit = (disc: Discipline) => {
    setEditingDiscipline(disc);
    setIsModalOpen(true);
  };

  const handleDeletePrompt = (disc: Discipline) => {
    setDisciplineToDelete(disc);
  };

  const confirmDelete = () => {
    if (disciplineToDelete) {
      onDeleteDiscipline(disciplineToDelete.id);
      setDisciplineToDelete(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Grade Curricular do Semestre
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
            Gerencie os professores, códigos e acompanhe a carga de entregas por matéria.
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs shadow-blue-600/20 transition-all duration-150 flex items-center gap-2 cursor-pointer shrink-0 btn-press"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Disciplina</span>
        </button>
      </div>

      {/* Disciplines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {disciplines.map((disc) => {
          const discTasks = tasks.filter((t) => t.disciplineId === disc.id);
          const pendingCount = discTasks.filter((t) => t.status === 'pendente').length;
          const completedCount = discTasks.filter((t) => t.status === 'concluida').length;
          const progressPercent =
            discTasks.length > 0 ? Math.round((completedCount / discTasks.length) * 100) : 0;

          return (
            <div
              key={disc.id}
              className="bg-white rounded-3xl border border-slate-200/80 hover:border-slate-300/90 shadow-2xs hover:shadow-xs transition-all duration-150 flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Header with Discipline Accent Bar */}
              <div>
                <div
                  className="h-2 w-full transition-opacity"
                  style={{ backgroundColor: disc.color }}
                />

                <div className="p-6">
                  {/* Top row: Code + Actions */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${disc.bgClass} ${disc.textClass} ${disc.borderClass} tracking-wide`}
                    >
                      {disc.code || 'GERAL'}
                    </span>

                    <div className="flex items-center gap-1 opacity-100 sm:opacity-80 sm:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(disc)}
                        className="min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl transition-colors cursor-pointer"
                        title="Editar disciplina"
                        aria-label="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePrompt(disc)}
                        className="min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50/80 rounded-xl transition-colors cursor-pointer"
                        title="Excluir disciplina"
                        aria-label="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Discipline Name */}
                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                    {disc.name}
                  </h3>

                  {/* Professor info */}
                  <div className="mt-2.5 flex items-center gap-2 text-xs text-slate-600 font-medium">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{disc.professor}</span>
                  </div>

                  {/* Room / Location */}
                  {disc.room && (
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{disc.room}</span>
                    </div>
                  )}

                  {/* Task counts badge strip */}
                  <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 sm:p-2.5 rounded-2xl bg-slate-50/80 border border-slate-100">
                      <div className="text-[10px] sm:text-[11px] text-slate-400 font-bold uppercase tracking-wider">Total</div>
                      <div className="text-base font-extrabold text-slate-900 tabular-nums">
                        {discTasks.length}
                      </div>
                    </div>

                    <div className="p-2 sm:p-2.5 rounded-2xl bg-blue-50/60 border border-blue-100/60">
                      <div className="text-[10px] sm:text-[11px] text-blue-700 font-bold uppercase tracking-wider">Pendentes</div>
                      <div className="text-base font-extrabold text-blue-700 tabular-nums">
                        {pendingCount}
                      </div>
                    </div>

                    <div className="p-2 sm:p-2.5 rounded-2xl bg-emerald-50/60 border border-emerald-100/60">
                      <div className="text-[10px] sm:text-[11px] text-emerald-700 font-bold uppercase tracking-wider">Feitas</div>
                      <div className="text-base font-extrabold text-emerald-700 tabular-nums">
                        {completedCount}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-medium">
                      <span>Progresso do semestre</span>
                      <span className="font-bold tabular-nums text-slate-700">
                        {progressPercent}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${progressPercent}%`,
                          backgroundColor: disc.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer: Quick links */}
              <div className="p-3 sm:p-3.5 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onOpenNewTaskWithDiscipline(disc.id)}
                  className="min-h-[40px] px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-white rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nova Tarefa</span>
                </button>

                <button
                  onClick={() => onNavigateToTasksWithFilter(disc.id)}
                  className="min-h-[40px] px-3 py-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Ver {discTasks.length} tarefas</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {disciplines.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">
            Nenhuma disciplina cadastrada
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Cadastre as disciplinas da sua grade acadêmica para associar tarefas, provas e relatórios.
          </p>
          <button
            onClick={handleCreate}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            Cadastrar Primeira Disciplina
          </button>
        </div>
      )}

      {/* Create / Edit Modal */}
      <DisciplineFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onSaveDiscipline}
        editingDiscipline={editingDiscipline}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!disciplineToDelete}
        title="Excluir Disciplina"
        message={
          disciplineToDelete
            ? `Tem certeza que deseja excluir a disciplina "${disciplineToDelete.name}"? As tarefas vinculadas a ela também serão desvinculadas ou removidas.`
            : ''
        }
        confirmText="Sim, excluir disciplina"
        cancelText="Cancelar"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDisciplineToDelete(null)}
      />
    </div>
  );
};
