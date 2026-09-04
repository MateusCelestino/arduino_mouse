'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { signIn } from '@/app/login/actions';
import { EMPTY_AUTH_STATE } from '@/lib/admin/action-state';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="btn-primary w-full py-3" disabled={pending}>
      {pending ? 'Entrando…' : 'Entrar'}
    </button>
  );
}

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [state, formAction] = useActionState(signIn, EMPTY_AUTH_STATE);

  return (
    <form action={formAction} className="card space-y-4 p-6">
      <input type="hidden" name="redirect" value={redirectTo} />

      <div>
        <label className="label" htmlFor="email">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="input"
          placeholder="voce@exemplo.com"
        />
      </div>

      <div>
        <label className="label" htmlFor="password">
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="input"
          placeholder="••••••••"
        />
      </div>

      {state.message ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {state.message}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  );
}
