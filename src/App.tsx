/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Discipline, PageView, StudentProfile, Task } from './types/index.ts';
import { storageService } from './services/storage.ts';
import { isOverdue } from './utils/dateUtils.ts';
import { LoginView } from './components/auth/LoginView.tsx';
import { Sidebar } from './components/layout/Sidebar.tsx';
import { Navbar } from './components/layout/Navbar.tsx';
import { MobileNav } from './components/layout/MobileNav.tsx';
import { OverviewView } from './components/dashboard/OverviewView.tsx';
import { DisciplinesView } from './components/disciplines/DisciplinesView.tsx';
import { TasksView } from './components/tasks/TasksView.tsx';
import { CalendarView } from './components/calendar/CalendarView.tsx';
import { ProfileView } from './components/profile/ProfileView.tsx';
import { TaskFormModal } from './components/tasks/TaskFormModal.tsx';

import { ToastContainer, ToastMessage } from './components/common/Toast.tsx';

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => storageService.getAuth());

  // Navigation State
  const [currentPage, setCurrentPage] = useState<PageView>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Core Academic Data
  const [disciplines, setDisciplines] = useState<Discipline[]>(() => storageService.getDisciplines());
  const [tasks, setTasks] = useState<Task[]>(() => storageService.getTasks());
  const [profile, setProfile] = useState<StudentProfile>(() => storageService.getProfile());

  // Toast Feedback State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (
    text: string,
    type: 'success' | 'error' | 'info' = 'success',
    actionText?: string,
    onAction?: () => void
  ) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, text, type, actionText, onAction }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Task Form Modal State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskModalInitialDate, setTaskModalInitialDate] = useState<string | undefined>(undefined);
  const [taskModalDefaultDisciplineId, setTaskModalDefaultDisciplineId] = useState<string | undefined>(undefined);

  // Filter cross-navigation parameters for Tasks view
  const [taskViewDisciplineFilter, setTaskViewDisciplineFilter] = useState('all');
  const [taskViewStatusFilter, setTaskViewStatusFilter] = useState('all');

  // Sync to LocalStorage
  useEffect(() => {
    storageService.saveDisciplines(disciplines);
  }, [disciplines]);

  useEffect(() => {
    storageService.saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    storageService.saveProfile(profile);
  }, [profile]);

  useEffect(() => {
    storageService.setAuth(isAuthenticated);
  }, [isAuthenticated]);

  // Auth handlers
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    storageService.setAuth(true);
    addToast('Boas-vindas ao EduTask! Sessão iniciada.', 'info');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    storageService.setAuth(false);
  };

  // Task Management
  const handleToggleTaskStatus = (taskId: string) => {
    let toggledTaskTitle = '';
    let becameCompleted = false;

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          toggledTaskTitle = t.title;
          const nextStatus = t.status === 'concluida' ? 'pendente' : 'concluida';
          becameCompleted = nextStatus === 'concluida';
          return {
            ...t,
            status: nextStatus,
            completedAt: nextStatus === 'concluida' ? '2026-10-31' : undefined,
          };
        }
        return t;
      })
    );

    if (becameCompleted) {
      addToast(
        `"${toggledTaskTitle}" concluída! 🎉`,
        'success',
        'Desfazer',
        () => handleToggleTaskStatus(taskId)
      );
    } else {
      addToast(
        `"${toggledTaskTitle}" reaberta como pendente.`,
        'info',
        'Desfazer',
        () => handleToggleTaskStatus(taskId)
      );
    }
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt'>, taskId?: string) => {
    if (taskId) {
      // Edit
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, ...taskData } : t))
      );
      addToast(`Tarefa "${taskData.title}" atualizada com sucesso!`, 'success');
    } else {
      // Create
      const newTask: Task = {
        ...taskData,
        id: `task-${Date.now()}`,
        createdAt: '2026-10-31',
      };
      setTasks((prev) => [newTask, ...prev]);
      addToast(`Tarefa "${taskData.title}" cadastrada!`, 'success');
    }
  };

  const handleDeleteTask = (taskId: string) => {
    const deleted = tasks.find((t) => t.id === taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (deleted) {
      addToast(`Tarefa "${deleted.title}" removida.`, 'info', 'Desfazer', () => {
        setTasks((prev) => [deleted, ...prev]);
        addToast(`Tarefa restaurada!`, 'success');
      });
    }
  };

  const handleOpenNewTask = (defaultDisciplineId?: string, initialDate?: string) => {
    setEditingTask(null);
    setTaskModalDefaultDisciplineId(defaultDisciplineId);
    setTaskModalInitialDate(initialDate);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskModalDefaultDisciplineId(undefined);
    setTaskModalInitialDate(undefined);
    setIsTaskModalOpen(true);
  };

  // Discipline Management
  const handleSaveDiscipline = (disciplineData: Omit<Discipline, 'id'>, disciplineId?: string) => {
    if (disciplineId) {
      setDisciplines((prev) =>
        prev.map((d) => (d.id === disciplineId ? { ...d, ...disciplineData } : d))
      );
      addToast(`Disciplina "${disciplineData.name}" atualizada!`, 'success');
    } else {
      const newDiscipline: Discipline = {
        ...disciplineData,
        id: `disc-${Date.now()}`,
      };
      setDisciplines((prev) => [...prev, newDiscipline]);
      addToast(`Disciplina "${disciplineData.name}" adicionada com sucesso!`, 'success');
    }
  };

  const handleDeleteDiscipline = (disciplineId: string) => {
    const disc = disciplines.find((d) => d.id === disciplineId);
    setDisciplines((prev) => prev.filter((d) => d.id !== disciplineId));
    // Also remove associated tasks
    setTasks((prev) => prev.filter((t) => t.disciplineId !== disciplineId));
    if (taskViewDisciplineFilter === disciplineId) {
      setTaskViewDisciplineFilter('all');
    }
    addToast(`Disciplina ${disc ? `"${disc.name}"` : ''} excluída.`, 'info');
  };

  // Profile Save
  const handleSaveProfile = (updatedProfile: StudentProfile) => {
    setProfile(updatedProfile);
    addToast('Perfil acadêmico atualizado com sucesso!', 'success');
  };

  // Navigation with filter presets
  const handleNavigateToTasks = (disciplineId?: string, status?: string) => {
    setTaskViewDisciplineFilter(disciplineId || 'all');
    setTaskViewStatusFilter(status || 'all');
    setCurrentPage('tasks');
  };

  // Reset to initial demo data
  const handleResetData = () => {
    const fresh = storageService.resetToInitialData();
    setDisciplines(fresh.disciplines);
    setTasks(fresh.tasks);
    setProfile(fresh.profile);
    setTaskViewDisciplineFilter('all');
    setTaskViewStatusFilter('all');
    addToast('Dados de demonstração restaurados com sucesso!', 'info');
  };

  // Global counts for badges
  const pendingCount = tasks.filter((t) => t.status === 'pendente').length;
  const overdueCount = tasks.filter((t) => isOverdue(t.dueDate, t.status)).length;

  // If not authenticated, render LoginView
  if (!isAuthenticated) {
    return (
      <>
        <LoginView
          onLoginSuccess={handleLoginSuccess}
          defaultEmail={profile.email}
        />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex overflow-x-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0">
        <Sidebar
          currentPage={currentPage}
          onNavigate={(page) => setCurrentPage(page)}
          onOpenNewTask={() => handleOpenNewTask()}
          profile={profile}
          pendingCount={pendingCount}
          overdueCount={overdueCount}
          onLogout={handleLogout}
        />
      </div>

      {/* Mobile Drawer */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        currentPage={currentPage}
        onNavigate={(page) => setCurrentPage(page)}
        onOpenNewTask={() => handleOpenNewTask()}
        profile={profile}
        pendingCount={pendingCount}
        overdueCount={overdueCount}
        onLogout={handleLogout}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <Navbar
          currentPage={currentPage}
          profile={profile}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenNewTask={() => handleOpenNewTask()}
          onNavigateProfile={() => setCurrentPage('profile')}
        />

        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden">
          {currentPage === 'overview' && (
            <OverviewView
              tasks={tasks}
              disciplines={disciplines}
              profile={profile}
              onOpenNewTask={() => handleOpenNewTask()}
              onToggleTaskStatus={handleToggleTaskStatus}
              onEditTask={handleEditTask}
              onNavigateToTasks={handleNavigateToTasks}
              onNavigateToDisciplines={() => setCurrentPage('disciplines')}
              onNavigateToCalendar={() => setCurrentPage('calendar')}
            />
          )}

          {currentPage === 'disciplines' && (
            <DisciplinesView
              disciplines={disciplines}
              tasks={tasks}
              onSaveDiscipline={handleSaveDiscipline}
              onDeleteDiscipline={handleDeleteDiscipline}
              onNavigateToTasksWithFilter={(discId) => handleNavigateToTasks(discId, 'all')}
              onOpenNewTaskWithDiscipline={(discId) => handleOpenNewTask(discId)}
            />
          )}

          {currentPage === 'tasks' && (
            <TasksView
              tasks={tasks}
              disciplines={disciplines}
              onToggleTaskStatus={handleToggleTaskStatus}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onOpenNewTask={(discId) => handleOpenNewTask(discId)}
              initialDisciplineFilter={taskViewDisciplineFilter}
              initialStatusFilter={taskViewStatusFilter}
            />
          )}

          {currentPage === 'calendar' && (
            <CalendarView
              tasks={tasks}
              disciplines={disciplines}
              onOpenNewTaskWithDate={(dateStr) => handleOpenNewTask(undefined, dateStr)}
              onEditTask={handleEditTask}
              onToggleTaskStatus={handleToggleTaskStatus}
              onDeleteTask={handleDeleteTask}
              onNavigateToTasks={handleNavigateToTasks}
            />
          )}

          {currentPage === 'profile' && (
            <ProfileView
              profile={profile}
              tasks={tasks}
              disciplines={disciplines}
              onSaveProfile={handleSaveProfile}
              onResetData={handleResetData}
            />
          )}
        </main>
      </div>

      {/* Global Task Create/Edit Modal */}
      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        editingTask={editingTask}
        disciplines={disciplines}
        initialDate={taskModalInitialDate}
        defaultDisciplineId={taskModalDefaultDisciplineId}
        onRequestCreateDiscipline={() => {
          setIsTaskModalOpen(false);
          setCurrentPage('disciplines');
        }}
      />

      {/* Toast Feedback notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
