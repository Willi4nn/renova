import { UserProfile } from '../ui/UserProfile';

export function Navbar() {
  return (
    <nav className="border-b border-slate-200 bg-white px-8 py-4">
      <div className="flex items-center justify-end">
        <UserProfile initials="EP" name="Estofados Piaba" />
      </div>
    </nav>
  );
}
