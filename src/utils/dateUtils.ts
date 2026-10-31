import { CURRENT_DATE_STR } from '../data/initialData.ts';

export const CURRENT_DATE = new Date('2026-10-31T12:00:00');

export function isOverdue(dueDateStr: string, status: string): boolean {
  if (status === 'concluida') return false;
  return dueDateStr < CURRENT_DATE_STR;
}

export function isToday(dueDateStr: string): boolean {
  return dueDateStr === CURRENT_DATE_STR;
}

export function getDaysDifference(dateStr: string): number {
  const target = new Date(`${dateStr}T12:00:00`);
  const current = new Date(`${CURRENT_DATE_STR}T12:00:00`);
  const diffTime = target.getTime() - current.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function formatDatePtBr(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

export function formatDateShort(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  const months = [
    'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
    'jul', 'ago', 'set', 'out', 'nov', 'dez'
  ];
  const mIndex = parseInt(month, 10) - 1;
  return `${day} de ${months[mIndex] || month}`;
}

export function formatFullCurrentDate(): string {
  return 'Sábado, 31 de Outubro de 2026';
}

export function getRelativeDeadlineLabel(dueDateStr: string, status: string): { label: string; isAlert: boolean } {
  if (status === 'concluida') {
    return { label: 'Concluída', isAlert: false };
  }
  const diff = getDaysDifference(dueDateStr);
  if (diff < 0) {
    const days = Math.abs(diff);
    return { label: `Atrasada (${days}d atrás)`, isAlert: true };
  }
  if (diff === 0) {
    return { label: 'Vence hoje!', isAlert: true };
  }
  if (diff === 1) {
    return { label: 'Vence amanhã', isAlert: true };
  }
  if (diff <= 7) {
    return { label: `Em ${diff} dias`, isAlert: false };
  }
  return { label: formatDateShort(dueDateStr), isAlert: false };
}
