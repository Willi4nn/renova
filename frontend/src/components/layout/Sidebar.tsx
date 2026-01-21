import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  DollarSign,
  LayoutDashboard,
  Users,
} from 'lucide-react';
import logoImg from '../../assets/logo.png';
import { useUIStore } from '../../store/useUIStore';
import { SidebarNavLink } from '../ui/SidebarNavLink';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Users, label: 'Clientes', href: '/clients' },
  { icon: ClipboardList, label: 'Serviços', href: '/services' },
  { icon: DollarSign, label: 'Financeiro', href: '/finance' },
];

export function Sidebar() {
  const { isSidebarOpen, toggleSidebar } = useUIStore();

  const toggleBtnClasses =
    'bg-renova-teal text-foreground absolute z-50 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-transform hover:scale-110 active:scale-95';

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Botão de Abrir Mobile */}
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className={`${toggleBtnClasses} top-6.5 left-4 md:hidden`}
          aria-label="Abrir menu"
        >
          <ChevronRight size={16} />
        </button>
      )}

      <aside
        className={`bg-foreground flex min-h-screen flex-col p-6 text-white transition-all duration-300 ease-in-out ${
          isSidebarOpen
            ? 'fixed top-0 left-0 z-50 w-64 md:relative'
            : 'hidden md:relative md:flex md:w-24 md:items-center'
        }`}
      >
        {/* Botão de Toggle Desktop e Mobile */}
        <button
          onClick={toggleSidebar}
          className={`${toggleBtnClasses} top-6.5 -right-3 ${isSidebarOpen ? 'flex' : 'hidden md:flex'}`}
          aria-label={isSidebarOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {isSidebarOpen ? (
            <ChevronLeft size={16} />
          ) : (
            <ChevronRight size={16} />
          )}
        </button>

        <div
          className={`mb-10 flex w-full items-center border-b border-slate-700 pb-6 transition-all ${
            isSidebarOpen ? 'gap-3' : 'md:justify-center'
          }`}
        >
          <img
            src={logoImg}
            alt="Renova Logo"
            className="h-9 w-9 min-w-[36px]"
          />

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

        <nav className="flex w-full flex-col gap-2">
          {NAV_ITEMS.map((item) => (
            <SidebarNavLink
              key={item.href}
              icon={item.icon}
              label={isSidebarOpen ? item.label : ''}
              href={item.href}
            />
          ))}
        </nav>
      </aside>
    </>
  );
}
