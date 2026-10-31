import React, { useState } from 'react';
import { Discipline, StudentProfile, Task } from '../../types/index.ts';
import { ConfirmModal } from '../common/ConfirmModal.tsx';
import { UserAvatar } from '../common/UserAvatar.tsx';
import {
  User,
  Mail,
  GraduationCap,
  Building,
  Calendar,
  Hash,
  MapPin,
  CheckCircle2,
  Clock,
  RotateCcw,
  Save,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface ProfileViewProps {
  profile: StudentProfile;
  tasks: Task[];
  disciplines: Discipline[];
  onSaveProfile: (updatedProfile: StudentProfile) => void;
  onResetData: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  tasks,
  disciplines,
  onSaveProfile,
  onResetData,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<StudentProfile>(profile);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState(false);

  const completedCount = tasks.filter((t) => t.status === 'concluida').length;
  const pendingCount = tasks.filter((t) => t.status === 'pendente').length;
  const totalCount = tasks.length;
  const rate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setIsEditing(false);
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Banner Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
          <div className="absolute right-6 bottom-4 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white text-xs font-bold flex items-center gap-1.5 tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ano Letivo 2026</span>
          </div>
        </div>

        <div className="px-6 pb-6 pt-0 sm:flex sm:items-end sm:justify-between relative">
          <div className="sm:flex sm:items-center sm:space-x-5 -mt-12 sm:-mt-14">
            <UserAvatar
              name={profile.name}
              avatarUrl={profile.avatarUrl}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl ring-4 ring-white shadow-md shrink-0"
              fallbackTextClassName="text-3xl font-extrabold text-blue-700"
            />

            <div className="mt-4 sm:mt-0">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {profile.name}
              </h2>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500 font-medium">
                <span className="font-bold text-blue-600">{profile.course}</span>
                <span aria-hidden="true">·</span>
                <span>{profile.institution}</span>
                <span aria-hidden="true">·</span>
                <span>{profile.semester}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full sm:w-auto min-h-[40px] px-4 py-2 bg-slate-100/80 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all duration-150 cursor-pointer btn-press text-center"
              >
                Editar Informações
              </button>
            ) : (
              <button
                onClick={() => {
                  setFormData(profile);
                  setIsEditing(false);
                }}
                className="w-full sm:w-auto min-h-[40px] px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all duration-150 cursor-pointer btn-press text-center"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>

        {saveFeedback && (
          <div className="mx-6 mb-4 p-3 bg-emerald-50 border border-emerald-200/80 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Perfil acadêmico atualizado com sucesso!</span>
          </div>
        )}
      </div>

      {/* Academic Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Disciplinas Ativas</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 tabular-nums tracking-tight">
            {disciplines.length}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Matriculada no semestre
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Entregas Concluídas</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 tabular-nums tracking-tight">
            {completedCount} <span className="text-xs font-medium text-slate-400">de {totalCount}</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">
            {rate}% de taxa de entrega
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Tarefas Pendentes</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 tabular-nums tracking-tight">
            {pendingCount}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Em andamento no semestre
          </div>
        </div>
      </div>

      {/* Profile Details or Edit Form */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
        <div className="border-b border-slate-100 pb-4 mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
              {isEditing ? 'Editar Dados Acadêmicos' : 'Informações do Perfil'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Dados utilizados para identificação no sistema e relatórios
            </p>
          </div>
        </div>

        {!isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-slate-100 text-slate-600 shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Nome Completo</div>
                <div className="text-sm font-semibold text-slate-900 mt-0.5">{profile.name}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-slate-100 text-slate-600 shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">E-mail Acadêmico</div>
                <div className="text-sm font-semibold text-slate-900 mt-0.5">{profile.email}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-slate-100 text-slate-600 shrink-0">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Curso de Graduação</div>
                <div className="text-sm font-semibold text-slate-900 mt-0.5">{profile.course}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-slate-100 text-slate-600 shrink-0">
                <Building className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Instituição de Ensino</div>
                <div className="text-sm font-semibold text-slate-900 mt-0.5">{profile.institution}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-slate-100 text-slate-600 shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Período / Semestre</div>
                <div className="text-sm font-semibold text-slate-900 mt-0.5">{profile.semester}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-slate-100 text-slate-600 shrink-0">
                <Hash className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Matrícula / RA</div>
                <div className="text-sm font-semibold font-mono text-slate-900 mt-0.5">{profile.registrationNumber}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-slate-100 text-slate-600 shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Campus Universitário</div>
                <div className="text-sm font-semibold text-slate-900 mt-0.5">{profile.campus}</div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  E-mail Acadêmico
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Curso de Graduação
                </label>
                <input
                  type="text"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Instituição de Ensino
                </label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Semestre / Período
                </label>
                <input
                  type="text"
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Matrícula / RA
                </label>
                <input
                  type="text"
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Campus Universitário
                </label>
                <input
                  type="text"
                  value={formData.campus}
                  onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setFormData(profile);
                  setIsEditing(false);
                }}
                className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer text-center"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Alterações</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Danger Zone / Reset Demo Data */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900">
            Restaurar Dados Iniciais de Demonstração
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Restaura as 5 disciplinas padrão (Cálculo I, Física I, Geometria Analítica, Química I, Lógica) e as 14 tarefas iniciais do protótipo.
          </p>
        </div>

        <button
          onClick={() => setShowResetConfirm(true)}
          className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 bg-slate-50 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restaurar Dados</span>
        </button>
      </div>

      <ConfirmModal
        isOpen={showResetConfirm}
        title="Restaurar Dados Iniciais?"
        message="Esta ação substituirá suas disciplinas, tarefas e perfil atuais pelos dados de demonstração da estudante Beatriz Mendonça. Deseja continuar?"
        confirmText="Sim, restaurar dados iniciais"
        cancelText="Cancelar"
        danger
        onConfirm={() => {
          onResetData();
          setShowResetConfirm(false);
        }}
        onCancel={() => setShowResetConfirm(false)}
      />
    </div>
  );
};
