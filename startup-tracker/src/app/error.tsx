'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Top-level error boundary:', error.message, { digest: error.digest });
  }, [error]);

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="max-w-md text-center space-y-3">
        <h1 className="text-2xl font-semibold">Algo deu errado</h1>
        <p className="text-sm text-muted-foreground">
          Tivemos um erro inesperado. Tente novamente — se persistir, recarregue a página.
        </p>
        <Button onClick={reset}>Tentar novamente</Button>
      </div>
    </main>
  );
}
