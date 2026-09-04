'use client';

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react';

import type { LinkType } from '@/lib/types';
import { normalizeUrl } from '@/lib/utils';

interface TrackedLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  linkType: LinkType;
  linkId?: string | null;
  label?: string;
  children: ReactNode;
}

/**
 * Link externo que registra o clique no Supabase antes de abrir o destino.
 * Usa `sendBeacon` quando disponivel para nao atrasar a navegacao.
 */
export function TrackedLink({
  href,
  linkType,
  linkId = null,
  label,
  children,
  onClick,
  ...rest
}: TrackedLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    const body = JSON.stringify({ link_id: linkId, link_type: linkType, label });

    try {
      if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
        navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }));
      } else {
        void fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
          keepalive: true,
        });
      }
    } catch {
      // Estatistica nunca deve impedir o usuario de acessar o link.
    }

    onClick?.(event);
  }

  return (
    <a
      href={normalizeUrl(href)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      {...rest}
    >
      {children}
    </a>
  );
}
