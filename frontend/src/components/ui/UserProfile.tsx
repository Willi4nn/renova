interface UserProfileProps {
  initials: string;
  name: string;
  email: string;
}

export function UserProfile({ initials, name, email }: UserProfileProps) {
  return (
    <div className="flex items-center gap-2 border-l px-2 py-2">
      <div className="bg-renova-teal flex h-9 w-9 min-w-[36px] items-center justify-center rounded-full border font-bold text-white">
        {initials}
      </div>
      <div className="hidden sm:block">
        <p className="text-md font-bold">{name}</p>
        <p className="text-sm text-gray-500">{email}</p>
      </div>
    </div>
  );
}
