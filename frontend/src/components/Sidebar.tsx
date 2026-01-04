import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  DollarSign,
  LayoutDashboard,
  Users,
} from 'lucide-react';
import logoImg from '../assets/logo.png';
import { useUIStore } from '../store/useUIStore';
import { SidebarNavLink } from './ui/SidebarNavLink';

export function Sidebar() {
  const { isSidebarOpen, toggleSidebar } = useUIStore();

  return (
    <aside
      className={`bg-foreground relative flex min-h-screen flex-col p-6 text-white transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'w-64' : 'w-24 items-center'
      }`}
    >
      <button
        onClick={toggleSidebar}
        className="bg-renova-teal text-foreground absolute top-8 -right-3 z-50 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full hover:scale-110 active:scale-95"
      >
        {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>
      <div
        className={`mb-10 flex w-full items-center transition-all duration-300 ${
          isSidebarOpen ? 'gap-3' : 'justify-center'
        }`}
      >
        <img src={logoImg} alt="Logo" className="h-9 w-9 min-w-[36px]" />
        <span
          className={`text-renova-teal text-2xl font-bold tracking-tight whitespace-nowrap transition-all duration-300 ${
            isSidebarOpen
              ? 'w-auto translate-x-0 opacity-100'
              : 'pointer-events-none w-0 -translate-x-10 overflow-hidden opacity-0'
          }`}
        >
          Renova
        </span>
      </div>
      <nav className="flex flex-col gap-2">
        <SidebarNavLink
          icon={LayoutDashboard}
          label={isSidebarOpen ? 'Dashboard' : ''}
          href="/"
        />
        <SidebarNavLink
          icon={Users}
          label={isSidebarOpen ? 'Clientes' : ''}
          href="/clients"
        />
        <SidebarNavLink
          icon={ClipboardList}
          label={isSidebarOpen ? 'Serviços' : ''}
          href="/services"
        />
        <SidebarNavLink
          icon={DollarSign}
          label={isSidebarOpen ? 'Financeiro' : ''}
          href="/finance"
        />
      </nav>
    </aside>
  );
}
