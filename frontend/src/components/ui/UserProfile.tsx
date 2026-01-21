interface UserProfileProps {
  initials: string;
  name: string;
}

export function UserProfile({ initials, name }: UserProfileProps) {
  return (
    <div className="flex items-center gap-2 border-l px-2 py-2">
      <div className="bg-renova-teal flex h-9 w-9 items-center justify-center rounded-full border font-bold text-white">
        {initials}
      </div>
      <div>
        <p className="text-md font-bold">{name}</p>
      </div>
    </div>
  );
}
