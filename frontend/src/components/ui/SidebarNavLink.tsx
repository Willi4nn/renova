import type { LucideIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/cn';

interface SidebarNavLinkProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

export function SidebarNavLink({
  icon: Icon,
  label,
  href,
}: SidebarNavLinkProps) {
  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg p-3 font-medium transition-colors',
          isActive
            ? 'bg-renova-teal/10 text-renova-teal'
            : 'text-slate-300 hover:bg-white/5 hover:text-white',
        )
      }
    >
      <Icon size={20} />
      <span>{label}</span>
    </NavLink>
  );
}
