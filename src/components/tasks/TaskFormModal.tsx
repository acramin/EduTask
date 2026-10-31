import React, { useState, useEffect } from 'react';
import { Discipline, Priority, Task, TaskStatus } from '../../types/index.ts';
import { X, Calendar, AlertCircle } from 'lucide-react';
import { CURRENT_DATE_STR } from '../../data/initialData.ts';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<Task, 'id' | 'createdAt'>, taskId?: string) => void;
  editingTask?: Task | null;
  disciplines: Discipline[];
  initialDate?: string;
  defaultDisciplineId?: string;
  onRequestCreateDiscipline?: () => void;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingTask,
  disciplines,
  initialDate,
  defaultDisciplineId,
  onRequestCreateDiscipline,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [disciplineId, setDisciplineId] = useState('');
  const [dueDate, setDueDate] = useState(CURRENT_DATE_STR);
  const [priority, setPriority] = useState<Priority>('media');
  const [status, setStatus] = useState<TaskStatus>('pendente');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setDisciplineId(editingTask.disciplineId);
      setDueDate(editingTask.dueDate);
      setPriority(editingTask.priority);
      setStatus(editingTask.status);
    } else {
      setTitle('');
      setDescription('');
      setDisciplineId(defaultDisciplineId || (disciplines.length > 0 ? disciplines[0].id : ''));
      setDueDate(initialDate || CURRENT_DATE_STR);
      setPriority('media');
      setStatus('pendente');
    }
    setError('');
  }, [editingTask, isOpen, disciplines, initialDate, defaultDisciplineId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Por favor, informe o título da tarefa acadêmica.');
      return;
    }
    if (!disciplineId) {
      setError('Selecione uma disciplina vinculada. Se não houver, cadastre uma disciplina primeiro.');
      return;
    }
    if (!dueDate) {
      setError('Informe a data de vencimento da entrega.');
      return;
    }

    onSave(
      {
        title: title.trim(),
        description: description.trim(),
        disciplineId,
        dueDate,
        priority,
        status,
        completedAt: status === 'concluida' ? (editingTask?.completedAt || CURRENT_DATE_STR) : undefined,
      },
      editingTask ? editingTask.id : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
              {editingTask ? 'Editar Tarefa Acadêmica' : 'Nova Tarefa Acadêmica'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              {editingTask
                ? 'Atualize os detalhes, prioridade ou prazo da atividade'
                : 'Cadastre uma nova entrega, lista de exercícios, prova ou relatório'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning if no disciplines exist */}
        {disciplines.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-extrabold text-slate-900 tracking-tight">
              Nenhuma disciplina cadastrada
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              Toda tarefa acadêmica deve pertencer a uma disciplina. Cadastre sua primeira matéria antes de criar tarefas.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer btn-press"
              >
                Cancelar
              </button>
              {onRequestCreateDiscipline && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onRequestCreateDiscipline();
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl cursor-pointer btn-press"
                >
                  Cadastrar Disciplina Agora
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Form Body */
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Título da atividade <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError('');
              }}
              placeholder="Ex: Lista 4 - Derivadas Parciais, Relatório de Física..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400"
              autoFocus
            />
          </div>

          {/* Discipline & Due Date row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Disciplina vinculada <span className="text-rose-500">*</span>
              </label>
              <select
                value={disciplineId}
                onChange={(e) => setDisciplineId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
              >
                {disciplines.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} {d.code ? `(${d.code})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Data de vencimento <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                />
              </div>
            </div>
          </div>

          {/* Priority Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nível de Prioridade
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPriority('baixa')}
                className={`min-h-[44px] py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  priority === 'baixa'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Baixa</span>
              </button>

              <button
                type="button"
                onClick={() => setPriority('media')}
                className={`min-h-[44px] py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  priority === 'media'
                    ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Média</span>
              </button>

              <button
                type="button"
                onClick={() => setPriority('alta')}
                className={`min-h-[44px] py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  priority === 'alta'
                    ? 'bg-rose-50 border-rose-300 text-rose-800 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Alta</span>
              </button>
            </div>
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Status da Atividade
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatus('pendente')}
                className={`min-h-[44px] py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center ${
                  status === 'pendente'
                    ? 'bg-blue-50 border-blue-300 text-blue-800 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Pendente
              </button>

              <button
                type="button"
                onClick={() => setStatus('concluida')}
                className={`min-h-[44px] py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center ${
                  status === 'concluida'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Concluída
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Orientações ou descrição detalhada <span className="text-slate-400 font-normal">(opcional)</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Entregar pelo portal acadêmico até 23h59. Focar nos exercícios ímpares da lista..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400 resize-none"
            />
          </div>

          {/* Footer buttons */}
          <div className="pt-3 border-t border-slate-100 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer btn-press text-center"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-xs shadow-blue-600/20 transition-colors cursor-pointer btn-press text-center"
            >
              {editingTask ? 'Salvar Alterações' : 'Cadastrar Tarefa'}
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};
