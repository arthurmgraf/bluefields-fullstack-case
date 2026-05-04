import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { signOut } from '@/actions/auth';

export function Header({ email }: { email: string | null }) {
  return (
    <header className="border-b">
      <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">
          Startup Tracker
        </Link>
        <div className="flex items-center gap-3">
          {email && <span className="text-sm text-muted-foreground hidden sm:inline">{email}</span>}
          <form action={signOut}>
            <Button type="submit" variant="ghost" size="sm">
              Sair
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
