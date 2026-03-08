import { LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Modal } from '../features/Modal';
import { Button } from '../ui/Button';
import { UserProfile } from '../ui/UserProfile';

export function Navbar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    logout();
  };

  return (
    <>
      <nav className="border-b border-slate-200 bg-white px-8 py-4">
        <div className="flex items-center justify-end gap-6">
          <UserProfile
            initials={getInitials(user?.name)}
            name={user?.name || 'Usuário'}
            email={user?.email || 'email não disponível'}
          />

          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex items-center gap-2 text-slate-500 transition-colors hover:text-red-600"
            title="Sair da conta"
          >
            <LogOut size={20} />
            <span className="hidden text-sm font-medium sm:block">Sair</span>
          </button>
        </div>
      </nav>

      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Confirmar Saída"
      >
        <div className="space-y-6">
          <p className="text-gray-600">
            Tem certeza que deseja sair da sua conta?
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setIsLogoutModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
