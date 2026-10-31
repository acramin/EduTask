export type Priority = 'alta' | 'media' | 'baixa';
export type TaskStatus = 'pendente' | 'concluida';

export interface Discipline {
  id: string;
  name: string;
  professor: string;
  code?: string;
  color: string; // e.g., hex or color identifier
  bgClass: string;
  textClass: string;
  borderClass: string;
  accentClass: string;
  room?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  disciplineId: string;
  dueDate: string; // YYYY-MM-DD
  priority: Priority;
  status: TaskStatus;
  createdAt: string;
  completedAt?: string;
}

export interface StudentProfile {
  name: string;
  email: string;
  course: string;
  institution: string;
  semester: string;
  registrationNumber: string;
  campus: string;
  avatarUrl?: string;
}

export type PageView = 'overview' | 'disciplines' | 'tasks' | 'calendar' | 'profile';
