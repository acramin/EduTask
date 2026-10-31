import React, { useState } from 'react';
import { EduLogo } from '../common/EduLogo.tsx';
import { Eye, EyeOff, ArrowRight, Sparkles, BookOpen, Calendar, CheckCircle2, ShieldCheck, Info } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: () => void;
  defaultEmail?: string;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  defaultEmail = 'beatriz.mendonca@universidade.edu.br',
}) => {
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState('eng2026!senha');
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Por favor, informe seu e-mail acadêmico.');
      return;
    }
    // Simulated login accepts credentials
    onLoginSuccess();
  };

  const handleDemoAccess = () => {
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between py-2">
        <EduLogo size="md" />
        <button
          onClick={handleDemoAccess}
          className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-800 bg-blue-50/80 hover:bg-blue-100/80 px-3.5 py-1.5 rounded-xl border border-blue-200/60 transition-colors cursor-pointer btn-press"
        >
          Acessar modo demonstração →
        </button>
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl w-full mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6">
        {/* Left Side: Welcoming Brand Narrative */}
        <div className="lg:col-span-7 space-y-6 lg:pr-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 text-xs font-bold tracking-tight">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Gerenciador Acadêmico Universitário</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
            Sua rotina acadêmica <br className="hidden sm:inline" />
            organizada, leve e <span className="text-blue-600 underline decoration-blue-200 decoration-wavy decoration-2">sem estresse</span>.
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl font-medium">
            Centralize disciplinas, controle listas de exercícios, acompanhe relatórios e visualize provas em um calendário interativo feito especialmente para estudantes universitários.
          </p>

          {/* Quick value props featuring the 4 harmonious colors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:border-blue-200 transition-all flex items-start gap-2.5">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Por Disciplina</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Cálculo, Física e Lógica organizadas.</p>
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:border-emerald-200 transition-all flex items-start gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Status & Prazos</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Identifique atrasos e pendências.</p>
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:border-purple-200 transition-all flex items-start gap-2.5">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600 shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Calendário</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Visão mensal e semanal sincronizada.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/30 p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Boas-vindas ao EduTask
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Acesse sua área acadêmica para visualizar seus prazos.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  E-mail acadêmico ou institucional
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="exemplo@universidade.edu.br"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all bg-slate-50/40 hover:bg-white"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Senha de acesso
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordModal(true)}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    Esqueceu?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 pr-12 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all bg-slate-50/40 hover:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                    title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                    aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full mt-2 min-h-[44px] py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs shadow-blue-600/20 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer btn-press"
              >
                <span>Entrar no EduTask</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200/80" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-3 text-slate-400 font-semibold">ou experimente agora</span>
                </div>
              </div>

              {/* Instant Demo Access Button */}
              <button
                type="button"
                onClick={handleDemoAccess}
                className="w-full min-h-[44px] py-2.5 px-4 bg-emerald-50/90 hover:bg-emerald-100/90 active:bg-emerald-200/80 text-emerald-800 border border-emerald-200/80 font-bold text-xs sm:text-sm rounded-xl transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer btn-press text-center"
              >
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Acessar diretamente como demonstração</span>
              </button>

              {/* Visual register link */}
              <div className="text-center pt-2">
                <p className="text-xs text-slate-500 font-medium">
                  Ainda não tem conta?{' '}
                  <button
                    type="button"
                    onClick={() => setShowRegisterModal(true)}
                    className="font-bold text-blue-600 hover:text-blue-700 cursor-pointer underline underline-offset-2"
                  >
                    Criar conta universitária
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center py-3 text-xs text-slate-400 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© 2026 EduTask · Gerenciador de Tarefas Acadêmicas para Universitários.</p>
        <div className="flex items-center gap-2 text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Protótipo funcional com armazenamento local</span>
        </div>
      </footer>

      {/* Visual Register Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-xl border border-slate-200/90 animate-in fade-in zoom-in-95">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Criar Conta Universitária</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
              No EduTask, este protótipo já vem 100% pré-configurado com os dados acadêmicos da estudante de Engenharia Beatriz Mendonça (Cálculo I, Física I, Geometria Analítica, Química I e Lógica de Programação).
            </p>
            <div className="mt-4 p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/70 text-xs text-slate-600 space-y-1 font-medium">
              <p className="font-bold text-slate-800">Você pode:</p>
              <p>• Acessar diretamente em modo demonstração.</p>
              <p>• Criar, editar e excluir tarefas e disciplinas à vontade.</p>
              <p>• Personalizar seu perfil e nome a qualquer momento.</p>
            </div>
            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowRegisterModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer btn-press"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowRegisterModal(false);
                  onLoginSuccess();
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl cursor-pointer btn-press"
              >
                Entrar com Dados Prontos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-xl border border-slate-200/90 animate-in fade-in zoom-in-95">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Info className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Recuperação de Senha</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
              Por ser um protótipo acadêmico funcional com persistência local, não é necessário recuperar senha. Você pode entrar com qualquer senha ou clicar diretamente no botão de demonstração.
            </p>
            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowForgotPasswordModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer btn-press"
              >
                Entendi
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForgotPasswordModal(false);
                  onLoginSuccess();
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl cursor-pointer btn-press"
              >
                Acessar Demonstração
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
