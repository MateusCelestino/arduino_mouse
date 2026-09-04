import { ICON_OPTIONS } from '@/lib/defaults';

export type FieldType =
  | 'text'
  | 'textarea'
  | 'url'
  | 'number'
  | 'int'
  | 'bool'
  | 'image'
  | 'select'
  | 'tags';

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  help?: string;
  required?: boolean;
  options?: readonly string[];
  /** Campo somente leitura, exibido mas nunca enviado ao banco. */
  readOnly?: boolean;
}

export interface TableDef {
  table: string;
  /** Rota do painel, usada para revalidar apos salvar. */
  path: string;
  label: string;
  singular: string;
  /** Coluna usada como titulo na listagem. */
  titleField: string;
  fields: FieldDef[];
}

export const ADMIN_TABLES = ['social_links', 'custom_links', 'affiliate_links', 'banners'] as const;

export type AdminTable = (typeof ADMIN_TABLES)[number];

export const TABLE_DEFS: Record<AdminTable, TableDef> = {
  social_links: {
    table: 'social_links',
    path: '/admin/redes',
    label: 'Redes sociais',
    singular: 'rede social',
    titleField: 'platform',
    fields: [
      {
        name: 'platform',
        label: 'Plataforma',
        type: 'text',
        required: true,
        placeholder: 'Twitch, Kick, YouTube, X / Twitter…',
        help: 'Você pode criar qualquer plataforma nova.',
      },
      { name: 'username', label: 'Username', type: 'text', placeholder: 'zerovolumemateus' },
      {
        name: 'url',
        label: 'URL',
        type: 'url',
        required: true,
        placeholder: 'https://twitch.tv/zerovolumemateus',
      },
      { name: 'description', label: 'Descrição curta', type: 'textarea' },
      {
        name: 'icon',
        label: 'Ícone',
        type: 'select',
        options: ICON_OPTIONS,
        help: 'Escolha "link" para um ícone genérico.',
      },
      { name: 'sort_order', label: 'Ordem', type: 'int' },
      { name: 'active', label: 'Ativo', type: 'bool' },
    ],
  },

  custom_links: {
    table: 'custom_links',
    path: '/admin/links',
    label: 'Links',
    singular: 'link',
    titleField: 'title',
    fields: [
      { name: 'title', label: 'Título', type: 'text', required: true },
      { name: 'description', label: 'Descrição', type: 'textarea' },
      { name: 'url', label: 'URL', type: 'url', required: true, placeholder: 'https://…' },
      { name: 'image_url', label: 'Imagem / ícone', type: 'image' },
      { name: 'sort_order', label: 'Ordem', type: 'int' },
      { name: 'featured', label: 'Destaque', type: 'bool' },
      { name: 'active', label: 'Ativo', type: 'bool' },
      { name: 'click_count', label: 'Cliques', type: 'int', readOnly: true },
    ],
  },

  affiliate_links: {
    table: 'affiliate_links',
    path: '/admin/afiliados',
    label: 'Afiliados',
    singular: 'link afiliado',
    titleField: 'name',
    fields: [
      { name: 'name', label: 'Nome do produto', type: 'text', required: true },
      { name: 'description', label: 'Descrição', type: 'textarea' },
      { name: 'image_url', label: 'Imagem', type: 'image' },
      { name: 'store', label: 'Loja', type: 'text', placeholder: 'Amazon, Kabum…' },
      { name: 'price', label: 'Preço (opcional)', type: 'number', placeholder: '199.90' },
      { name: 'coupon', label: 'Cupom (opcional)', type: 'text', placeholder: 'ZEROVOLUME10' },
      {
        name: 'affiliate_url',
        label: 'Link de afiliado',
        type: 'url',
        required: true,
        placeholder: 'https://…',
      },
      { name: 'sort_order', label: 'Ordem', type: 'int' },
      { name: 'featured', label: 'Destaque', type: 'bool' },
      { name: 'active', label: 'Ativo', type: 'bool' },
      { name: 'click_count', label: 'Cliques', type: 'int', readOnly: true },
    ],
  },

  banners: {
    table: 'banners',
    path: '/admin/banners',
    label: 'Banners',
    singular: 'banner',
    titleField: 'title',
    fields: [
      { name: 'title', label: 'Título', type: 'text' },
      { name: 'description', label: 'Descrição', type: 'textarea' },
      { name: 'image_url', label: 'Imagem', type: 'image', required: true },
      { name: 'link_url', label: 'Link ao clicar (opcional)', type: 'url' },
      {
        name: 'position',
        label: 'Posição',
        type: 'select',
        options: ['home', 'perfil', 'links'],
      },
      { name: 'sort_order', label: 'Ordem', type: 'int' },
      { name: 'active', label: 'Ativo', type: 'bool' },
    ],
  },
};

export const PROFILE_FIELDS: FieldDef[] = [
  { name: 'display_name', label: 'Nome', type: 'text', required: true },
  { name: 'username', label: 'Username', type: 'text', required: true },
  { name: 'headline', label: 'Texto principal', type: 'textarea', help: 'Aparece abaixo do nome na Home.' },
  { name: 'bio', label: 'Bio', type: 'textarea' },
  { name: 'avatar_url', label: 'Avatar', type: 'image' },
  { name: 'banner_url', label: 'Banner', type: 'image' },
  {
    name: 'favorite_games',
    label: 'Jogos favoritos',
    type: 'tags',
    help: 'Separe por vírgula. Ex.: Valorant, CS2, GTA RP',
  },
  { name: 'live_url', label: 'URL da live', type: 'url', help: 'Destino do botão principal.' },
  { name: 'live_button_text', label: 'Texto do botão de live', type: 'text' },
  { name: 'live_status', label: 'Status ao vivo', type: 'bool' },
];

export const SETTINGS_FIELDS: FieldDef[] = [
  { name: 'site_name', label: 'Nome do site', type: 'text', required: true },
  { name: 'headline', label: 'Headline', type: 'text' },
  { name: 'description', label: 'Descrição do site', type: 'textarea' },
  { name: 'seo_title', label: 'SEO — título', type: 'text' },
  { name: 'seo_description', label: 'SEO — descrição', type: 'textarea' },
  {
    name: 'seo_keywords',
    label: 'SEO — palavras-chave',
    type: 'text',
    help: 'Separe por vírgula.',
  },
  { name: 'og_image_url', label: 'Imagem de compartilhamento (Open Graph)', type: 'image' },
  { name: 'affiliate_notice', label: 'Aviso de afiliados', type: 'textarea' },
];
