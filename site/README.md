# ZeroVolumeMateus — Site + Painel Admin

Site profissional de streamer com duas partes:

- **Site público** (`/`, `/perfil`, `/links`) — qualquer pessoa acessa.
- **Painel Admin** (`/admin`) — protegido por login, só você edita.

Todo o conteúdo (textos, links, imagens, SEO, status de live) vem do banco e é
editável pelo painel. Não há dados fixos espalhados pelo código.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS
- Supabase — Auth, Database (Postgres + RLS) e Storage
- Deploy pronto para a Vercel

## Estrutura

```
site/
├─ src/
│  ├─ app/
│  │  ├─ page.tsx              # Home pública
│  │  ├─ perfil/               # Página de perfil
│  │  ├─ links/                # Página estilo Linktree
│  │  ├─ login/                # Login (Supabase Auth) + actions
│  │  ├─ api/track/            # Registro de cliques
│  │  ├─ admin/                # Painel: dashboard, perfil, redes, links,
│  │  │                        #         afiliados, banners, configurações
│  │  ├─ sitemap.ts, robots.ts, icon.svg
│  ├─ components/
│  │  ├─ site/                 # Hero, cards, seções, header, footer
│  │  ├─ admin/                # Sidebar, formulários, upload, CRUD
│  │  └─ PlatformIcon, TrackedLink
│  ├─ lib/
│  │  ├─ supabase/             # Clients (server, browser, middleware)
│  │  ├─ admin/                # Schema dos formulários, auth, action state
│  │  ├─ data.ts               # Leitura do conteúdo público
│  │  ├─ types.ts, utils.ts, defaults.ts
│  └─ middleware.ts            # Renova a sessão e protege /admin
└─ supabase/migrations/        # SQL do banco (tabelas, RLS, storage, seed)
```

---

## 1. Instalação local

```bash
cd site
npm install
cp .env.example .env.local
```

Preencha o `.env.local` (veja a seção seguinte) e rode:

```bash
npm run dev      # http://localhost:3000
```

Scripts disponíveis:

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Sobe o build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript (`tsc --noEmit`) |

> O site sobe mesmo sem o Supabase configurado: ele usa valores padrão e as
> listas ficam vazias. Só o painel exige a conexão.

---

## 2. Conectar o Supabase

1. Crie um projeto em <https://supabase.com/dashboard>.
2. Vá em **Project Settings → API** e copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / publishable key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Cole no `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Rodar as migrations

**Opção A — SQL Editor (mais simples).** No painel do Supabase abra
**SQL Editor → New query** e execute, nesta ordem, o conteúdo de:

1. `supabase/migrations/0001_init.sql` — tabelas, funções e RLS
2. `supabase/migrations/0002_storage.sql` — bucket `media` e políticas
3. `supabase/migrations/0003_seed.sql` — conteúdo inicial (opcional)

**Opção B — Supabase CLI:**

```bash
npx supabase link --project-ref SEU_PROJECT_REF
npx supabase db push
```

### O que o banco cria

| Tabela | Para quê |
| --- | --- |
| `profiles` | Nome, username, bio, avatar, banner, jogos, status de live |
| `social_links` | Cards de Twitch, Kick, YouTube, X e outras plataformas |
| `custom_links` | Links personalizados (Home e `/links`) |
| `affiliate_links` | Produtos/parceiros com preço, cupom e contador de cliques |
| `banners` | Imagens promocionais por posição |
| `click_events` | Cliques com tipo, data, referrer e user-agent |
| `site_settings` | Nome do site, textos, SEO e aviso de afiliados |
| `admin_users` | Quem pode escrever no banco |

**RLS**: visitantes leem apenas conteúdo com `active = true` (e o perfil e as
configurações do site). Criar, editar, apagar e ativar/desativar exige um
usuário autenticado que esteja em `admin_users`. `click_events` só é escrito
pela função `register_click()` e só o admin lê.

---

## 3. Criar o usuário Admin

1. No Supabase, vá em **Authentication → Users → Add user**.
2. Marque **Auto Confirm User**, informe e-mail e senha e crie.
3. Copie o **UID** do usuário criado.
4. No **SQL Editor**, rode:

```sql
insert into public.admin_users (user_id, email)
values ('COLE_O_UID_AQUI', 'seu@email.com')
on conflict (user_id) do nothing;
```

5. Acesse `/login`, entre com esse e-mail e senha e você cai no `/admin`.

> Se logar sem estar em `admin_users`, o painel mostra a tela “Sem permissão”
> já com o `user_id` pronto para você colar no SQL acima.

---

## 4. Upload de imagens

O painel envia avatar, banner e imagens de cards direto para o bucket **`media`**
do Supabase Storage, com preview antes de salvar. O bucket é público para
leitura; só o admin envia e apaga arquivos. Também é possível colar uma URL
externa no lugar do upload.

---

## 5. Rastreamento de cliques

Cliques em redes sociais, links personalizados, afiliados e no botão de live são
enviados para `POST /api/track`, que chama a função `register_click()` no
Postgres. São gravados `link_id`, `link_type`, rótulo, `referrer`, `user_agent` e
data — e o contador `click_count` do link é incrementado.

O Dashboard mostra total de cliques, cliques nos últimos 7 dias e os 10 últimos
links clicados.

---

## 6. Publicar na Vercel

1. Faça o push do repositório para o GitHub.
2. Em <https://vercel.com/new>, importe o repositório.
3. Em **Root Directory**, selecione **`site`** (o projeto Next fica nessa pasta).
4. Em **Environment Variables**, adicione:

   | Nome | Valor |
   | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anon/publishable |
   | `NEXT_PUBLIC_SITE_URL` | `https://seu-dominio.vercel.app` |

5. Clique em **Deploy**. Framework, build (`next build`) e output são detectados
   automaticamente.
6. Depois de configurar um domínio próprio, atualize `NEXT_PUBLIC_SITE_URL` e
   faça redeploy — ele alimenta canonical, Open Graph e `sitemap.xml`.
7. No Supabase, em **Authentication → URL Configuration**, adicione a URL do
   site em **Site URL**.

---

## 7. SEO

- Título, descrição, palavras-chave, Open Graph e Twitter Card vêm de
  `site_settings` (edite em **Configurações**).
- Favicon: `src/app/icon.svg`.
- Imagem de compartilhamento padrão: `public/og.svg` — pode ser trocada pelo
  campo “Imagem de compartilhamento” no painel.
- `sitemap.xml` e `robots.txt` são gerados automaticamente (`/admin`, `/api` e
  `/login` ficam fora do índice).

---

## 8. Usando o painel

| Seção | O que dá para fazer |
| --- | --- |
| **Dashboard** | Ver contadores, últimos cliques e ligar/desligar o “AO VIVO AGORA” |
| **Perfil** | Nome, username, bio, avatar, banner, texto principal, jogos, URL e texto do botão de live |
| **Redes sociais** | CRUD de plataformas com ícone, username, descrição, ordem e ativo |
| **Links** | CRUD de links personalizados com imagem, destaque e ordem |
| **Afiliados** | CRUD com imagem, loja, preço, cupom, destaque, ordem e cliques |
| **Banners** | CRUD de banners por posição (home, perfil, links) |
| **Configurações** | Nome do site, textos, SEO e aviso de afiliados |
