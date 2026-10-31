import { Discipline, StudentProfile, Task } from '../types/index.ts';
import { INITIAL_DISCIPLINES, INITIAL_PROFILE, INITIAL_TASKS, DEFAULT_BEATRIZ_AVATAR } from '../data/initialData.ts';

const STORAGE_KEYS = {
  DISCIPLINES: 'edutask_disciplines_v1',
  TASKS: 'edutask_tasks_v1',
  PROFILE: 'edutask_profile_v1',
  AUTH: 'edutask_authenticated_v1',
};

export const storageService = {
  getDisciplines(): Discipline[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DISCIPLINES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.DISCIPLINES, JSON.stringify(INITIAL_DISCIPLINES));
        return INITIAL_DISCIPLINES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_DISCIPLINES;
    }
  },

  saveDisciplines(disciplines: Discipline[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.DISCIPLINES, JSON.stringify(disciplines));
    } catch (err) {
      console.error('Failed to save disciplines to localStorage', err);
    }
  },

  getTasks(): Task[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
        return INITIAL_TASKS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_TASKS;
    }
  },

  saveTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (err) {
      console.error('Failed to save tasks to localStorage', err);
    }
  },

  getProfile(): StudentProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(INITIAL_PROFILE));
        return INITIAL_PROFILE;
      }
      const parsed: StudentProfile = JSON.parse(data);
      // Migrate legacy development path or broken relative path in localStorage
      if (!parsed.avatarUrl || parsed.avatarUrl.includes('/src/assets/')) {
        parsed.avatarUrl = DEFAULT_BEATRIZ_AVATAR;
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(parsed));
      }
      return parsed;
    } catch {
      return INITIAL_PROFILE;
    }
  },

  saveProfile(profile: StudentProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (err) {
      console.error('Failed to save profile to localStorage', err);
    }
  },

  getAuth(): boolean {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUTH);
      return data === 'true';
    } catch {
      return false;
    }
  },

  setAuth(isAuth: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH, isAuth ? 'true' : 'false');
    } catch (err) {
      console.error('Failed to save auth state', err);
    }
  },

  resetToInitialData(): { disciplines: Discipline[]; tasks: Task[]; profile: StudentProfile } {
    try {
      localStorage.setItem(STORAGE_KEYS.DISCIPLINES, JSON.stringify(INITIAL_DISCIPLINES));
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(INITIAL_PROFILE));
    } catch (err) {
      console.error('Failed to reset data', err);
    }
    return {
      disciplines: INITIAL_DISCIPLINES,
      tasks: INITIAL_TASKS,
      profile: INITIAL_PROFILE,
    };
  },
};
