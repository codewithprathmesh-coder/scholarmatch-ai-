import React from 'react';
import { TrafficLightStatus } from '../../types';
import { ShieldCheck, AlertTriangle, AlertOctagon, Info } from 'lucide-react';

interface Props {
  status: TrafficLightStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  customText?: string;
}

export const TrafficLightBadge: React.FC<Props> = ({ 
  status, 
  size = 'md', 
  showLabel = true,
  customText 
}) => {
  const configs = {
    SAFE: {
      bg: 'bg-emerald-500/15',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      dot: 'bg-emerald-400',
      icon: ShieldCheck,
      label: customText || 'SAFE ROUTE',
      sub: 'Compatible with current route'
    },
    REVIEW: {
      bg: 'bg-amber-500/15',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
      dot: 'bg-amber-400',
      icon: AlertTriangle,
      label: customText || 'REVIEW REQUIRED',
      sub: 'Potential overlap / verify rules'
    },
    CONFLICT: {
      bg: 'bg-rose-500/15',
      border: 'border-rose-500/30',
      text: 'text-rose-400',
      dot: 'bg-rose-400',
      icon: AlertOctagon,
      label: customText || 'MUTUAL CONFLICT',
      sub: 'Exclusivity violation detected'
    }
  };

  const current = configs[status];
  const Icon = current.icon;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 space-x-1',
    md: 'text-xs px-2.5 py-1 space-x-1.5',
    lg: 'text-sm px-3.5 py-1.5 space-x-2 font-semibold'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  };

  return (
    <span 
      className={`inline-flex items-center rounded-full font-medium border backdrop-blur-sm ${current.bg} ${current.border} ${current.text} ${sizeClasses[size]}`}
      title={current.sub}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot} animate-pulse`} />
      <Icon className={iconSizes[size]} />
      {showLabel && <span>{current.label}</span>}
    </span>
  );
};
