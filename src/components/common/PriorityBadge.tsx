import React from 'react';
import { Priority } from '../../types/index.ts';

interface PriorityBadgeProps {
  priority: Priority;
  compact?: boolean;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, compact = false }) => {
  const configs: Record<
    Priority,
    { label: string; bg: string; text: string; border: string; dot: string }
  > = {
    alta: {
      label: 'Alta',
      bg: 'bg-rose-50/80',
      text: 'text-rose-700',
      border: 'border-rose-200/70',
      dot: 'bg-rose-500',
    },
    media: {
      label: 'Média',
      bg: 'bg-amber-50/80',
      text: 'text-amber-800',
      border: 'border-amber-200/70',
      dot: 'bg-amber-500',
    },
    baixa: {
      label: 'Baixa',
      bg: 'bg-emerald-50/80',
      text: 'text-emerald-800',
      border: 'border-emerald-200/70',
      dot: 'bg-emerald-500',
    },
  };

  const current = configs[priority];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${current.bg} ${current.text} ${current.border} transition-colors`}
      title={`Prioridade ${current.label}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot} shrink-0`} />
      <span>{compact ? current.label : `Prioridade ${current.label}`}</span>
    </span>
  );
};

