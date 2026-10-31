import React, { useState, useEffect } from 'react';
import { Discipline } from '../../types/index.ts';
import { PRESET_DISCIPLINE_COLORS } from '../../data/initialData.ts';
import { X, AlertCircle } from 'lucide-react';

interface DisciplineFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (disciplineData: Omit<Discipline, 'id'>, disciplineId?: string) => void;
  editingDiscipline?: Discipline | null;
}

export const DisciplineFormModal: React.FC<DisciplineFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingDiscipline,
}) => {
  const [name, setName] = useState('');
  const [professor, setProfessor] = useState('');
  const [code, setCode] = useState('');
  const [room, setRoom] = useState('');
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingDiscipline) {
      setName(editingDiscipline.name);
      setProfessor(editingDiscipline.professor);
      setCode(editingDiscipline.code || '');
      setRoom(editingDiscipline.room || '');
      const foundIdx = PRESET_DISCIPLINE_COLORS.findIndex(
        (c) => c.color.toLowerCase() === editingDiscipline.color.toLowerCase()
      );
      setSelectedColorIndex(foundIdx >= 0 ? foundIdx : 0);
    } else {
      setName('');
      setProfessor('');
      setCode('');
      setRoom('');
      setSelectedColorIndex(0);
    }
    setError('');
  }, [editingDiscipline, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor, informe o nome da disciplina.');
      return;
    }
    if (!professor.trim()) {
      setError('Por favor, informe o nome do(a) professor(a).');
      return;
    }

    const preset = PRESET_DISCIPLINE_COLORS[selectedColorIndex];

    onSave(
      {
        name: name.trim(),
        professor: professor.trim(),
        code: code.trim() || undefined,
        room: room.trim() || undefined,
        color: preset.color,
        bgClass: preset.bgClass,
        textClass: preset.textClass,
        borderClass: preset.borderClass,
        accentClass: preset.accentClass,
      },
      editingDiscipline ? editingDiscipline.id : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
              {editingDiscipline ? 'Editar Disciplina' : 'Cadastrar Nova Disciplina'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              {editingDiscipline
                ? 'Atualize o docente, código ou cor de identificação'
                : 'Adicione uma matéria da sua grade acadêmica'}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nome da Disciplina <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="Ex: Álgebra Linear, Algoritmos, Estatística..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Professor(a) responsável <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={professor}
              onChange={(e) => {
                setProfessor(e.target.value);
                setError('');
              }}
              placeholder="Ex: Prof. Dr. Carlos Eduardo Rocha"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Código da Matéria <span className="text-slate-400 font-normal">(opcional)</span>
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Ex: MAT-101"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sala / Local <span className="text-slate-400 font-normal">(opcional)</span>
              </label>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="Ex: Sala 204, Bloco B"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Color Identification */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Cor de Identificação Visual (Mantida em todo o app)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRESET_DISCIPLINE_COLORS.map((preset, idx) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => setSelectedColorIndex(idx)}
                  className={`min-h-[44px] p-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                    selectedColorIndex === idx
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0"
                    style={{ backgroundColor: preset.color }}
                  />
                  <span className="truncate text-xs text-slate-700">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
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
              {editingDiscipline ? 'Salvar Alterações' : 'Cadastrar Disciplina'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
