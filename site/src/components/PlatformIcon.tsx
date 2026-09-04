import type { ReactElement, SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const paths: Record<string, ReactElement> = {
  twitch: (
    <path d="M4.3 2 2.6 6.2v13.1h4.6V22h2.6l2.6-2.7h3.8L21 14V2H4.3Zm14.9 11.1-3 3h-3.9l-2.6 2.6v-2.6H6.4V3.7h12.8v9.4ZM15.6 6.8v5.4h-1.7V6.8h1.7Zm-4.6 0v5.4H9.3V6.8H11Z" />
  ),
  kick: (
    <path d="M3 2h6.3v5.5h2.1V5.4h2.1V2H20v6.7h-2.1v2.2h-2.1v2.2h2.1v2.2H20V22h-6.5v-3.4h-2.1v-2.1H9.3V22H3V2Z" />
  ),
  youtube: (
    <path d="M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.6 2.6 0 0 0-1.8 1.8A27 27 0 0 0 2 12a27 27 0 0 0 .4 4.8 2.6 2.6 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8A27 27 0 0 0 22 12a27 27 0 0 0-.4-4.8ZM10 15.1V8.9l5.3 3.1-5.3 3.1Z" />
  ),
  x: (
    <path d="M17.5 3h3.2l-7 8 8.2 10h-6.4l-5-6.1L4.7 21H1.5l7.5-8.5L1.2 3h6.6l4.5 5.6L17.5 3Zm-1.1 16.1h1.8L7.7 4.8H5.8l10.6 14.3Z" />
  ),
  instagram: (
    <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4 1.3-.1 1.7-.1 4.9-.1Zm0 3.8a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm0 9.9a3.9 3.9 0 1 1 0-7.8 3.9 3.9 0 0 1 0 7.8Zm7.6-10.1a1.4 1.4 0 1 1-2.8 0 1.4 1.4 0 0 1 2.8 0Z" />
  ),
  tiktok: (
    <path d="M16.5 2c.3 2.3 1.6 3.7 3.8 3.9v2.6c-1.3.1-2.5-.2-3.8-1v5.9c0 5.4-5.9 7.1-8.3 3.3-1.5-2.5-.6-6.8 4.3-7v2.8c-.4.1-.8.2-1.1.3-1 .4-1.6 1-1.4 2.1.3 2.1 4.2 2.8 3.9-1.4V2h2.6Z" />
  ),
  discord: (
    <path d="M19.3 5.4A16.9 16.9 0 0 0 15.2 4l-.3.5c1.4.4 2.5 1 3.6 1.7a13.8 13.8 0 0 0-12.9 0c1-.7 2.2-1.3 3.6-1.7L8.8 4a16.9 16.9 0 0 0-4.1 1.4C2.1 9.3 1.4 13.1 1.7 16.8c1.6 1.2 3.2 1.9 4.7 2.4l1-1.6a10 10 0 0 1-1.7-.8l.4-.3a12 12 0 0 0 11.7 0l.4.3c-.5.3-1.1.6-1.7.8l1 1.6c1.6-.5 3.1-1.2 4.7-2.4.4-4.3-.7-8.1-3-11.4ZM8.6 14.6c-.9 0-1.7-.9-1.7-1.9s.8-1.9 1.7-1.9 1.7.8 1.7 1.9-.7 1.9-1.7 1.9Zm6.8 0c-1 0-1.7-.9-1.7-1.9s.8-1.9 1.7-1.9 1.7.8 1.7 1.9-.7 1.9-1.7 1.9Z" />
  ),
  link: (
    <path d="M10.6 13.4a1 1 0 0 1 0-1.4l1.4-1.4a1 1 0 0 1 1.4 1.4l-1.4 1.4a1 1 0 0 1-1.4 0Zm-3.5 5.3a4.5 4.5 0 0 1 0-6.4l2.8-2.8 1.4 1.4-2.8 2.8a2.5 2.5 0 0 0 3.6 3.6l2.8-2.8 1.4 1.4-2.8 2.8a4.5 4.5 0 0 1-6.4 0Zm9.8-9.8-2.8 2.8-1.4-1.4 2.8-2.8a2.5 2.5 0 0 0-3.6-3.6L9.1 6.7 7.7 5.3l2.8-2.8a4.5 4.5 0 0 1 6.4 6.4Z" />
  ),
};

export const ICON_KEYS = Object.keys(paths);

export function iconKeyFor(platform: string): string {
  const key = platform.toLowerCase();
  if (key.includes('twitch')) return 'twitch';
  if (key.includes('kick')) return 'kick';
  if (key.includes('you')) return 'youtube';
  if (key.includes('twitter') || key.trim() === 'x' || key.startsWith('x ')) return 'x';
  if (key.includes('insta')) return 'instagram';
  if (key.includes('tik')) return 'tiktok';
  if (key.includes('discord')) return 'discord';
  return 'link';
}

interface PlatformIconProps extends IconProps {
  name: string;
}

export function PlatformIcon({ name, ...props }: PlatformIconProps) {
  const icon = paths[name] ?? paths[iconKeyFor(name)] ?? paths.link;

  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      {icon}
    </svg>
  );
}

/** Cor de destaque por plataforma, usada nas bordas e brilhos dos cards. */
export function accentFor(iconKey: string): string {
  switch (iconKey) {
    case 'twitch':
      return '#9146ff';
    case 'kick':
      return '#53fc18';
    case 'youtube':
      return '#ff0033';
    case 'x':
      return '#e7e9ea';
    case 'instagram':
      return '#e1306c';
    case 'tiktok':
      return '#25f4ee';
    case 'discord':
      return '#5865f2';
    default:
      return '#a259ff';
  }
}
