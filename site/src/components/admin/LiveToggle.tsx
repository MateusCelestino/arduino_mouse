'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { setLiveStatus } from '@/app/admin/actions';
import { EMPTY_STATE } from '@/lib/admin/action-state';
import { cn } from '@/lib/utils';

function SubmitButton({ live }: { live: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn('btn w-full sm:w-auto', live ? 'btn-secondary' : 'btn-primary')}
    >
      {pending ? 'Atualizando…' : live ? 'Encerrar transmissão' : 'Marcar como AO VIVO AGORA'}
    </button>
  );
}

/** Liga/desliga o selo "AO VIVO" mostrado no site publico. */
export function LiveToggle({ profileId, live }: { profileId: string; live: boolean }) {
  const [state, formAction] = useActionState(setLiveStatus, EMPTY_STATE);

  return (
    <div className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <p className="font-display text-lg font-semibold text-white">Status da live</p>
        <p className="flex items-center gap-2 text-sm text-slate-400">
          {live ? (
            <>
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse-live" />
              O site está exibindo o selo AO VIVO.
            </>
          ) : (
            'O site está exibindo o status offline.'
          )}
        </p>
        {state.message ? (
          <p className={cn('text-xs', state.ok ? 'text-accent' : 'text-red-300')}>{state.message}</p>
        ) : null}
      </div>

      <form action={formAction} className="sm:shrink-0">
        <input type="hidden" name="__id" value={profileId} />
        <input type="hidden" name="__live" value={String(!live)} />
        <SubmitButton live={live} />
      </form>
    </div>
  );
}
