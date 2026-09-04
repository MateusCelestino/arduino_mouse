/** Estado devolvido pelas Server Actions do painel. */
export interface ActionState {
  ok: boolean;
  message: string;
}

export const EMPTY_STATE: ActionState = { ok: false, message: '' };

/** Estado das acoes de autenticacao. */
export type AuthState = ActionState;

export const EMPTY_AUTH_STATE: AuthState = { ok: false, message: '' };
