import { signIn } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ERROR_MESSAGES: Record<string, string> = {
  invalid_email: 'Email inválido. Tente novamente.',
  send_failed: 'Não foi possível enviar o link. Verifique o email ou tente em alguns minutos.',
  auth_failed: 'Falha ao autenticar. Solicite um novo link.',
};

interface LoginPageProps {
  searchParams: Promise<{ error?: string; sent?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const error = params.error ? ERROR_MESSAGES[params.error] : null;
  const sent = params.sent === '1';

  return (
    <main className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Startup Tracker</h1>
          <p className="text-sm text-muted-foreground">
            Entre com seu email de trabalho. Enviaremos um link mágico.
          </p>
        </div>

        {sent ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            <p className="font-medium">Link enviado.</p>
            <p>Verifique sua caixa de entrada (e o spam — pode levar até 1 minuto).</p>
          </div>
        ) : (
          <form action={signIn} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="voce@empresa.com" />
            </div>
            <Button type="submit" className="w-full">
              Enviar link mágico
            </Button>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
          </form>
        )}

        <p className="text-xs text-muted-foreground text-center">
          Acesso restrito a usuários autorizados.
        </p>
      </div>
    </main>
  );
}
