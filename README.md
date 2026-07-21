# Uma Aventura Congelante — Fotocabine digital

Aplicação mobile-first completa para festa infantil: o convidado escolhe uma moldura, usa a câmera do navegador, recebe a composição final via Canvas, salva no Supabase, baixa ou compartilha. Inclui galeria pública, slideshow para TV, moderação e painel administrativo.

As artes demonstrativas são originais e não usam personagens, marcas ou imagens oficiais de Frozen/Disney.

## Funcionalidades

- Fluxo curto de boas-vindas → moldura → consentimento → câmera → prévia.
- Câmeras frontal/traseira, espelhamento frontal e recorte `cover` na proporção da moldura.
- JPEG em qualidade 0,92, maior lado limitado a 2160 px.
- Upload validado e com progresso, retry sem perder a imagem, download e Web Share API.
- Galeria pública responsiva com atualização automática.
- Slideshow em `/galeria/ao-vivo`, tela cheia, pausa, shuffle e intervalos configuráveis.
- Painel em `/admin` com fotos, aprovação, ocultação, exclusão, ZIP, molduras, configurações e QR Code.
- PWA com manifesto, ícone, cache somente estático e página offline honesta.
- RLS, validação MIME/tamanho, rate limit básico e operações administrativas no servidor.

## Tecnologias

Next.js App Router, React, TypeScript, Tailwind CSS, Supabase Database/Storage, Canvas, Framer Motion, Lucide, Sonner, Zod, JSZip, QRCode e Vitest.

## Requisitos

- Node.js 20 ou superior.
- Projeto Supabase.
- HTTPS para câmera em aparelho real (localhost funciona no desenvolvimento).

## Instalação

```bash
npm install
copy .env.example .env.local
npm run dev
```

Abra `http://localhost:3000`. Sem Supabase, a interface funciona em modo demonstração; upload e persistência informam claramente que faltam configurações.

## Variáveis de ambiente

Copie `.env.example` para `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`: URL do projeto.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: chave pública; pode chegar ao cliente.
- `SUPABASE_SERVICE_ROLE_KEY`: chave secreta, somente no servidor/Vercel.
- `NEXT_PUBLIC_SITE_URL`: URL pública final, usada pelo QR Code.
- `ADMIN_PASSWORD`: senha forte do responsável.
- `ADMIN_SESSION_SECRET`: segredo aleatório longo para a sessão.
- `EVENT_SLUG`: `aventura-congelante` por padrão.

Nunca prefixe a service role com `NEXT_PUBLIC_` e nunca a inclua no Git.

## Supabase: banco e Storage

1. Crie um projeto no Supabase.
2. Abra SQL Editor.
3. Execute integralmente [`supabase/schema.sql`](supabase/schema.sql).
4. Confirme os buckets públicos `event-photos` e `event-frames`.
5. Confirme que RLS está ativa em `events`, `frames` e `photos`.
6. Adicione as variáveis ao `.env.local` e reinicie o servidor.

O upload público passa por `/api/photos`, que valida o arquivo e usa a service role no servidor. O cliente nunca recebe essa chave. O bucket público expõe apenas os arquivos; dados internos e fotos não aprovadas não são listados pela API pública.

## Molduras

Quatro SVGs transparentes demonstrativos ficam em `public/frames`. Eles funcionam no Canvas e podem ser substituídos no painel por PNG transparente. Para produção:

1. Exporte o PNG na proporção 4:5, 1:1 ou 9:16.
2. Mantenha a região central transparente.
3. Limite a 8 MB.
4. Acesse **Admin → Molduras → Nova moldura**.
5. Informe nome/proporção, envie e ajuste a ordem.

Uploads SVG são recusados por segurança; apenas PNG é aceito no painel.

## Personalização da festa

Acesse `/admin`, entre com `ADMIN_PASSWORD` e use **Configurações** para trocar nome, idade, mensagem, capa, galeria e moderação. Os valores em `lib/config.ts` são fallback local; com Supabase, a tabela `events` é a fonte de verdade.

## Painel e moderação

- Publicação automática: desligue **Aprovação manual**; novas fotos entram como `approved`.
- Aprovação manual: ligue; novas fotos entram como `pending`.
- Fotos ocultas ou pendentes nunca aparecem em `/api/gallery`.
- O painel permite ordenar, filtrar, selecionar, gerar ZIP, copiar link, aprovar, ocultar e excluir.

## Galeria ao vivo

Abra `/galeria/ao-vivo` na TV/notebook. O padrão é 8 segundos. Para outro intervalo:

```text
/galeria/ao-vivo?intervalo=12
```

Valores são limitados entre 3 e 60 segundos. A página busca novas fotos a cada 12 segundos sem interromper a imagem atual.

## QR Code

Defina `NEXT_PUBLIC_SITE_URL` com o domínio definitivo, redeploy e abra **Admin → QR Code**. Baixe o PNG em alta resolução ou use **Imprimir**. Há um QR único para a festa.

## Deploy na Vercel

1. Suba este repositório para GitHub/GitLab/Bitbucket.
2. Importe-o na Vercel como projeto Next.js.
3. Cadastre todas as variáveis do `.env.example` nos ambientes desejados.
4. Use `npm run build` como comando de build e mantenha a saída padrão Next.js.
5. Faça o deploy e confirme o domínio HTTPS.
6. Atualize `NEXT_PUBLIC_SITE_URL` para esse domínio e faça novo deploy.
7. Teste câmera e compartilhamento em aparelhos reais.
8. Gere e imprima o QR Code final.
9. Se usar domínio próprio, configure-o na Vercel antes de imprimir o QR.

## Testes e qualidade

```bash
npm run test
npm run lint
npm run typecheck
npm run build
```

Os testes cobrem recorte/proporção da composição Canvas, validação de arquivos, nomes, ordenação de molduras e fallback de compartilhamento.

## Checklist manual antes da festa

- [ ] iPhone/Safari em orientação vertical e horizontal.
- [ ] Android/Chrome em orientação vertical e horizontal.
- [ ] Desktop com webcam.
- [ ] Câmera frontal: prévia e arquivo final espelhados de forma consistente.
- [ ] Câmera traseira e alternância entre lentes.
- [ ] Permissão negada e posterior liberação nas configurações.
- [ ] Navegador interno do Instagram/Facebook mostra orientação para Safari/Chrome.
- [ ] Rede lenta, queda durante upload e botão de tentar novamente.
- [ ] Download sem suporte a compartilhamento.
- [ ] Compartilhamento por arquivo em iPhone/Android.
- [ ] Moderação automática e manual.
- [ ] Slideshow por pelo menos 30 minutos e entrada de fotos novas.
- [ ] ZIP e exclusão no painel.
- [ ] QR Code lido por dois aparelhos diferentes.
- [ ] Tela de TV cheia e intervalo correto.

## Problemas comuns

- **Câmera não abre:** confirme HTTPS e permissão do site; saia do navegador interno do Instagram/Facebook.
- **Upload indisponível:** confira URL, anon key, service role e execução do SQL.
- **Foto não aparece:** em moderação manual, aprove-a no painel; confirme que a galeria pública está ativa.
- **ZIP falha:** confirme que o bucket e suas respostas permitem leitura pública/CORS pelo domínio da aplicação.
- **QR aponta para localhost:** corrija `NEXT_PUBLIC_SITE_URL` e faça novo deploy.
- **Instagram:** navegadores não podem publicar automaticamente em Stories. O botão abre o menu nativo; o usuário escolhe o app. Sem suporte, a foto é baixada com orientação.

## Privacidade

Não são coletados nome, e-mail, telefone, localização ou login do convidado. A câmera é processada no aparelho e somente a imagem confirmada é enviada. Informe os convidados sobre a galeria pública e mantenha moderação manual quando apropriado. Para pedidos de remoção, o responsável pode excluir definitivamente a imagem no painel.

## Limitações conhecidas

O rate limit em memória é adequado como proteção básica por instância, mas não substitui um limitador distribuído em eventos de grande escala. O cache offline não inclui câmera, upload nem galerias. Os SVGs incluídos são molduras de demonstração; o painel exige PNG para novos uploads por segurança.
