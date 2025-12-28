import {
  ClipboardList,
  DollarSign,
  LayoutDashboard,
  Users,
} from 'lucide-react';
import logoImg from '../assets/logo.png';
import { SidebarNavLink } from './ui/SidebarNavLink';

export function Sidebar() {
  return (
    <aside className="bg-foreground flex min-h-screen w-64 flex-col p-6 text-white">
      <div className="mb-10 flex items-center gap-3">
        <img
          src={logoImg}
          alt="Renova Logo"
          className="h-9 w-9 object-contain"
        />
        <span className="text-renova-teal text-2xl font-bold tracking-tight">
          Renova
        </span>
      </div>

      <nav className="flex flex-col gap-2">
        <SidebarNavLink icon={LayoutDashboard} label="Dashboard" href="/" />
        <SidebarNavLink icon={Users} label="Clientes" href="/clients" />
        <SidebarNavLink
          icon={ClipboardList}
          label="Serviços"
          href="/services"
        />
        <SidebarNavLink icon={DollarSign} label="Financeiro" href="/finance" />
      </nav>
    </aside>
  );
}
