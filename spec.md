Quero que você desenvolva um projeto web completo, funcional e pronto para publicação, destinado a uma festa de aniversário infantil.

O sistema funcionará como uma cabine de fotos digital acessada por QR Code. Os convidados escanearão o QR Code, abrirão o site no celular, escolherão uma moldura, tirarão uma foto utilizando a câmera do próprio navegador, visualizarão o resultado com a moldura aplicada, e poderão baixar ou compartilhar a imagem.

Todas as fotos também deverão ser salvas automaticamente no servidor para que o responsável pela festa possa acessá-las posteriormente.

O projeto precisa ser entregue completo, sem pseudocódigo, sem trechos incompletos e sem deixar funcionalidades essenciais para implementação posterior.

## 1. Objetivo do sistema

Criar uma aplicação web mobile-first, rápida, bonita, intuitiva e compatível com Android e iPhone.

Fluxo principal:

1. O convidado escaneia um QR Code.
2. O QR Code abre o site da festa.
3. O site apresenta uma tela de boas-vindas.
4. O convidado toca no botão “Começar”.
5. O convidado escolhe uma moldura.
6. O site solicita permissão para usar a câmera.
7. A câmera é aberta dentro do próprio navegador.
8. A moldura escolhida aparece sobre a imagem da câmera em tempo real.
9. O convidado tira a foto.
10. O sistema une permanentemente a foto e a moldura utilizando HTML5 Canvas.
11. O sistema mostra uma prévia do resultado.
12. O convidado pode confirmar, refazer, baixar ou compartilhar.
13. Ao confirmar, a foto é enviada automaticamente para o armazenamento do sistema.
14. O responsável pela festa poderá acessar uma galeria administrativa simples para visualizar e baixar as fotos.
15. O sistema também terá uma galeria pública em modo apresentação, para exibir as fotos em uma TV, computador, projetor ou navegador de Smart TV.

## 2. Tecnologias obrigatórias

Utilize:

* Next.js, utilizando App Router.
* React.
* TypeScript.
* Tailwind CSS.
* Supabase.
* Supabase Storage para armazenar as fotografias e as molduras.
* Supabase Database para registrar os dados das imagens.
* HTML5 Canvas para combinar a fotografia com a moldura.
* API `navigator.mediaDevices.getUserMedia()` para acessar a câmera.
* API `navigator.share()` para compartilhamento nativo.
* Web Share API com suporte a compartilhamento de arquivo.
* PWA, para que o site possa funcionar com aparência de aplicativo.
* Lucide React para ícones.
* Framer Motion para animações suaves.
* Sonner ou biblioteca equivalente para notificações toast.
* Zod para validação de dados.
* JSZip para download de todas as imagens em arquivo ZIP, caso essa função seja implementada no navegador.

Não utilize Font Awesome. Prefira Lucide React por ser mais leve, moderno e consistente visualmente.

## 3. Identidade visual

A festa terá temática inspirada em Frozen, neve, gelo, inverno encantado e princesa do gelo.

Não utilize imagens oficiais, personagens, logotipos ou artes protegidas da Disney sem que esses arquivos sejam fornecidos posteriormente pelo administrador.

Crie uma identidade visual original inspirada em:

* Paleta de azul-claro.
* Azul-gelo.
* Azul profundo.
* Branco.
* Prata.
* Lilás suave.
* Gradientes gelados.
* Flocos de neve.
* Cristais.
* Brilhos discretos.
* Efeito de vidro congelado.
* Estética de inverno mágico.
* Sensação de conto de fadas.
* Interface infantil, elegante e moderna.

A aparência deve ser bonita, delicada e profissional, evitando excesso de elementos.

Utilize:

* Glassmorphism moderado.
* Fundos com gradientes suaves.
* Flocos de neve animados de forma leve.
* Botões grandes e fáceis de tocar.
* Bordas arredondadas.
* Sombras suaves.
* Excelente contraste.
* Tipografia clara.
* Animações discretas.

O fundo deve ser visualmente bonito, mas não deve prejudicar o desempenho em celulares mais simples.

## 4. Responsividade

A aplicação deve ser mobile-first.

Prioridade:

1. iPhone com Safari.
2. Android com Chrome.
3. Tablets.
4. Computadores.
5. Navegadores de Smart TV para a galeria ao vivo.

O layout da câmera deve funcionar corretamente em diferentes proporções de tela.

A aplicação não pode depender de instalação pela loja de aplicativos.

## 5. Página inicial

Criar uma página inicial com:

* Nome da aniversariante configurável.
* Idade configurável.
* Uma imagem principal configurável.
* Mensagem de boas-vindas configurável.
* Botão “Começar”.
* Pequena instrução explicando que a pessoa poderá escolher uma moldura, tirar uma foto e compartilhar.
* Link discreto para a galeria pública, caso ela esteja habilitada.

Exemplo de mensagem:

“Bem-vindo ao nosso reino encantado! Escolha sua moldura, registre este momento especial e compartilhe sua foto.”

Não fixe esse texto diretamente no componente. Coloque as configurações em um arquivo central ou tabela de configurações.

## 6. Seleção de molduras

Criar uma tela para escolha das molduras.

Cada moldura deve possuir:

* Nome.
* Imagem de prévia.
* Arquivo PNG transparente.
* Status ativo ou inativo.
* Ordem de exibição.
* Data de criação.

Exibir as molduras em cards responsivos.

Ao selecionar uma moldura:

* Destacar visualmente a seleção.
* Mostrar uma prévia maior.
* Exibir botão “Usar esta moldura”.
* Permitir voltar e escolher outra.

O sistema deve permitir molduras em proporções diferentes, mas priorizar formatos:

* Retrato 4:5.
* Quadrado 1:1.
* Stories 9:16.

Cada moldura deve informar sua proporção.

## 7. Câmera

Criar uma câmera dentro do navegador utilizando `getUserMedia`.

Requisitos:

* Solicitar permissão de câmera apenas quando necessário.
* Mostrar uma explicação antes de solicitar a permissão.
* Utilizar preferencialmente a câmera traseira.
* Permitir alternar entre câmera frontal e traseira.
* Mostrar a moldura escolhida sobre o vídeo em tempo real.
* Manter o alinhamento correto entre vídeo e moldura.
* Aplicar `object-fit: cover`.
* Tratar corretamente espelhamento da câmera frontal.
* Exibir botão grande para fotografar.
* Exibir botão para trocar a câmera.
* Exibir botão para voltar.
* Impedir cliques repetidos durante o processamento.
* Mostrar mensagem amigável quando a câmera não estiver disponível.
* Tratar permissão negada.
* Orientar o usuário a liberar a permissão nas configurações do navegador.
* Funcionar somente em HTTPS, conforme exigência dos navegadores.

A moldura não deve ser aplicada somente visualmente. Ela deverá ser incorporada ao arquivo final da fotografia.

## 8. Processamento com Canvas

Ao tirar a foto:

1. Capturar o frame atual do vídeo.
2. Criar um Canvas na proporção definida pela moldura.
3. Calcular corretamente o recorte da câmera.
4. Desenhar a imagem da câmera no Canvas.
5. Aplicar espelhamento quando necessário.
6. Desenhar a moldura PNG sobre a fotografia.
7. Gerar o arquivo final em JPEG de alta qualidade ou WebP.
8. Manter a transparência da moldura sobre a foto.
9. Limitar o tamanho do arquivo para evitar uploads excessivamente pesados.
10. Preservar qualidade adequada para redes sociais e impressão simples.

Utilizar preferencialmente:

* Resolução máxima aproximada de 2160 pixels no maior lado.
* Qualidade entre 0,88 e 0,94.
* Compressão sem perda visual relevante.

## 9. Prévia da fotografia

Depois da captura, mostrar a imagem final já com a moldura.

Disponibilizar os botões:

* “Gostei, salvar”.
* “Tirar novamente”.
* “Escolher outra moldura”.
* “Baixar foto”.
* “Compartilhar”.
* “Voltar ao início”.

O botão de salvar deve:

* Fazer upload da imagem final.
* Mostrar indicador de progresso.
* Bloquear envios duplicados.
* Mostrar mensagem de sucesso.
* Registrar a imagem no banco de dados.

Caso o upload falhe:

* Não perder a fotografia da memória.
* Permitir tentar novamente.
* Permitir baixar a imagem mesmo sem upload.

## 10. Compartilhamento

Utilizar a Web Share API.

Quando houver suporte a compartilhamento de arquivos:

* Compartilhar o arquivo final diretamente.
* Incluir uma mensagem curta.
* Permitir que o sistema operacional apresente WhatsApp, Instagram, Telegram, Messenger, AirDrop e outros aplicativos disponíveis.

Importante:

Não afirmar que é possível publicar automaticamente em Stories do Instagram.

O navegador deve abrir o menu nativo de compartilhamento. A partir dele, o usuário escolhe Instagram, WhatsApp ou outro aplicativo disponível.

Quando o compartilhamento de arquivos não estiver disponível:

* Fazer o download da imagem.
* Mostrar uma orientação como:
  “A foto foi baixada. Agora você pode publicá-la no Instagram ou enviá-la pelo WhatsApp.”

Criar também um botão específico “Compartilhar”, sem prometer integração direta com APIs privadas do Instagram.

## 11. Download

Permitir:

* Download individual da foto pelo convidado.
* Nome de arquivo amigável.
* Nome contendo data e identificador aleatório.

Exemplo:

`aniversario-gelo-2026-07-28-a8f31c.jpg`

## 12. Salvamento no servidor

Utilizar Supabase Storage.

Criar um bucket para fotografias.

Sugestão:

* Bucket: `event-photos`
* Pasta por evento.
* Nome de arquivo com UUID.
* Não armazenar informações pessoais desnecessárias.

Criar tabela `photos` com os campos:

* `id`
* `event_id`
* `frame_id`
* `storage_path`
* `public_url` ou caminho assinado
* `created_at`
* `status`
* `width`
* `height`
* `file_size`
* `mime_type`

Criar tabela `frames` com:

* `id`
* `event_id`
* `name`
* `preview_url`
* `storage_path`
* `aspect_ratio`
* `display_order`
* `is_active`
* `created_at`

Criar tabela `events` com:

* `id`
* `name`
* `birthday_person_name`
* `age`
* `welcome_message`
* `cover_image_url`
* `slug`
* `gallery_enabled`
* `gallery_moderation_enabled`
* `created_at`

Caso seja mais simples para o MVP, pode existir somente um evento, mas a arquitetura deverá permitir múltiplos eventos no futuro.

## 13. Privacidade

Não solicitar:

* Nome do convidado.
* E-mail.
* Telefone.
* Cadastro.
* Login.
* Conta em rede social.

Antes da câmera, apresentar um aviso curto:

“Ao salvar a foto, você autoriza que ela seja armazenada na galeria privada do evento e, caso a galeria pública esteja habilitada, exibida durante a festa.”

Criar uma caixa de confirmação simples antes da primeira captura ou antes do primeiro salvamento.

Disponibilizar um texto de privacidade em modal.

Não coletar localização.

Não coletar dados desnecessários.

## 14. Área administrativa simples

O site público não terá login, cadastro ou autenticação para os convidados.

Entretanto, criar uma rota administrativa protegida de maneira simples.

Utilizar uma destas opções:

1. Senha administrativa configurada por variável de ambiente.
2. Supabase Auth somente para o administrador.

Prefira Supabase Auth com login administrativo simples, desde que isso não afete o fluxo dos convidados.

A autenticação administrativa não deve aparecer no site público.

Rotas sugeridas:

* `/admin`
* `/admin/photos`
* `/admin/frames`
* `/admin/settings`

O painel administrativo deve permitir:

* Visualizar todas as fotos.
* Visualizar em grade.
* Abrir foto em tela cheia.
* Baixar foto individual.
* Selecionar várias fotos.
* Baixar todas as fotos em ZIP.
* Excluir fotos.
* Aprovar ou ocultar fotos da galeria pública.
* Ordenar por mais recente ou mais antiga.
* Filtrar por moldura.
* Copiar o link da imagem.
* Fazer upload de novas molduras.
* Ativar ou desativar molduras.
* Alterar a ordem das molduras.
* Editar nome da aniversariante.
* Editar idade.
* Editar mensagem inicial.
* Editar imagem de capa.
* Ativar ou desativar a galeria pública.
* Ativar ou desativar moderação.

Não precisa existir cadastro público de administrador.

## 15. Galeria pública

Criar uma página:

`/galeria`

Ela deverá mostrar as fotos autorizadas para exibição pública.

Recursos:

* Grade responsiva.
* Atualização automática.
* Paginação ou carregamento progressivo.
* Modal para ampliar.
* Layout bonito.
* Respeitar a identidade visual da festa.
* Não mostrar botões administrativos.
* Não permitir exclusão.
* Não expor informações internas.

A página deve funcionar em celular e computador.

## 16. Galeria ao vivo para TV

Criar uma página:

`/galeria/ao-vivo`

Ela deverá ser otimizada para:

* TV.
* Notebook.
* Computador.
* Projetor.
* Navegador de Smart TV.
* Tela cheia.

Funcionamento:

* Buscar automaticamente as fotos aprovadas.
* Atualizar sem recarregar a página.
* Utilizar Supabase Realtime ou atualização periódica.
* Exibir as fotografias em slideshow.
* Alternar automaticamente entre as fotos.
* Aplicar transições suaves.
* Possuir botão para entrar em tela cheia.
* Permitir pausar e continuar.
* Permitir escolher o intervalo entre fotos.
* Exibir uma tela bonita quando ainda não houver fotografias.
* Não interromper o slideshow quando novas fotos forem adicionadas.
* Evitar repetir imediatamente a mesma foto.
* Embaralhar as fotos opcionalmente.

Criar um parâmetro opcional:

`/galeria/ao-vivo?intervalo=8`

O número representará o intervalo em segundos.

Valor padrão: 8 segundos.

## 17. Moderação da galeria

Criar configuração para dois modos.

Modo 1: publicação automática

* Assim que a fotografia for salva, ela poderá aparecer na galeria pública e na galeria ao vivo.

Modo 2: aprovação manual

* A fotografia é salva.
* Fica aguardando aprovação.
* Somente aparece publicamente depois de ser aprovada pelo administrador.

A configuração deverá ser editável no painel.

## 18. QR Code

Criar no painel uma seção que:

* Mostre a URL pública do evento.
* Gere um QR Code para essa URL.
* Permita baixar o QR Code em PNG.
* Permita imprimir.
* Utilize alta resolução.
* Inclua opcionalmente uma pequena legenda abaixo:
  “Escaneie, tire sua foto e compartilhe.”

O QR Code será único para toda a festa.

Não haverá identificação de mesa.

## 19. PWA

Configurar a aplicação como PWA.

Incluir:

* Manifest.
* Nome do aplicativo.
* Nome curto.
* Ícones.
* Cor do tema.
* Tela de abertura.
* Service Worker quando adequado.
* Cache somente de recursos estáticos.
* Página offline amigável.

A câmera, o upload e a galeria dependem de internet. Não prometer funcionamento completo offline.

Caso a conexão caia depois da captura:

* Manter a imagem na memória.
* Permitir baixar.
* Permitir tentar o upload novamente.

## 20. Segurança

Implementar:

* Validação de arquivos.
* Limite de tamanho.
* Rate limiting quando possível.
* Nomes de arquivo aleatórios.
* Políticas RLS do Supabase.
* Proteção das rotas administrativas.
* Sanitização das entradas.
* Não expor a chave `service_role` no frontend.
* Utilizar somente a chave pública anônima no cliente.
* Fazer operações administrativas sensíveis no servidor.
* Impedir upload arbitrário de qualquer tipo de arquivo.
* Aceitar somente imagens.
* Verificar MIME type.
* Não permitir execução de SVG enviado por usuários.
* Preferir PNG para molduras e JPEG/WebP para fotos.

Criar políticas de acesso adequadas.

Os convidados poderão:

* Ler molduras ativas.
* Enviar fotografias válidas.
* Ler apenas os dados necessários.

Os administradores poderão:

* Gerenciar fotografias.
* Gerenciar molduras.
* Gerenciar configurações.

## 21. Estrutura do projeto

Organizar o projeto de forma profissional.

Sugestão:

* `app/`
* `components/`
* `components/camera/`
* `components/gallery/`
* `components/admin/`
* `lib/`
* `lib/supabase/`
* `lib/canvas/`
* `hooks/`
* `types/`
* `public/`
* `public/icons/`
* `public/placeholders/`
* `styles/`

Criar componentes reutilizáveis.

Não colocar toda a aplicação em um único arquivo.

## 22. Componentes esperados

Criar, entre outros:

* `WelcomeScreen`
* `FrameSelector`
* `CameraPermission`
* `CameraView`
* `CameraControls`
* `PhotoPreview`
* `ShareButton`
* `DownloadButton`
* `UploadProgress`
* `SnowBackground`
* `PrivacyModal`
* `PublicGallery`
* `LiveSlideshow`
* `AdminPhotoGrid`
* `AdminFrameManager`
* `QRCodeGenerator`

## 23. Experiência do usuário

A aplicação deve:

* Exibir loaders.
* Exibir mensagens de erro amigáveis.
* Evitar telas vazias.
* Possuir estados de sucesso.
* Impedir cliques duplicados.
* Exibir progresso de upload.
* Possuir botões grandes.
* Funcionar com uma única mão.
* Não exigir conhecimento técnico.
* Ter fluxo curto.
* Ter opção clara de voltar.
* Não perder a fotografia ao ocorrer erro de rede.

## 24. Acessibilidade

Implementar:

* `aria-label`.
* Navegação por teclado.
* Textos alternativos.
* Contraste adequado.
* Indicadores de foco.
* Botões com tamanho apropriado.
* Respeito a `prefers-reduced-motion`.
* Mensagens compreensíveis.

## 25. Compatibilidade da câmera

Tratar especialmente:

* Safari no iPhone.
* Chrome no Android.
* Câmera frontal espelhada.
* Orientação vertical.
* Troca de orientação da tela.
* Permissão negada.
* Ausência de câmera.
* Navegador sem suporte.
* Site aberto dentro do navegador interno do Instagram.

Caso o site seja aberto dentro do navegador interno do Instagram ou Facebook e a câmera/compartilhamento não funcione adequadamente, mostrar uma orientação:

“Para uma melhor experiência, abra esta página no Safari ou Chrome.”

Criar botão de ajuda com instruções.

## 26. Configurações por variável de ambiente

Criar `.env.example` contendo:

* `NEXT_PUBLIC_SUPABASE_URL`
* `NEXT_PUBLIC_SUPABASE_ANON_KEY`
* `SUPABASE_SERVICE_ROLE_KEY`
* `NEXT_PUBLIC_SITE_URL`
* Variáveis administrativas necessárias.

Nunca incluir chaves reais.

## 27. Banco de dados

Entregar:

* Script SQL completo.
* Criação das tabelas.
* Índices.
* Chaves estrangeiras.
* Políticas RLS.
* Buckets necessários.
* Políticas do Storage.
* Dados iniciais de exemplo.
* Evento inicial de demonstração.
* Molduras de exemplo ou placeholders.

## 28. Molduras iniciais

Criar pelo menos quatro molduras demonstrativas originais e simples, sem personagens protegidos:

1. Moldura “Neve Encantada”.
2. Moldura “Cristais de Gelo”.
3. Moldura “Reino Azul”.
4. Moldura “Princesa do Inverno”.

As molduras devem ser PNG transparente e servir apenas como exemplo.

Caso não seja possível gerar os PNGs diretamente, criar arquivos SVG ou componentes visuais temporários somente para demonstração, explicando claramente como substituir pelos PNGs definitivos.

Não utilizar imagens oficiais de Frozen ou personagens da Disney.

## 29. Testes

Adicionar testes para as partes mais importantes:

* Cálculo de recorte da imagem.
* Conversão e combinação no Canvas.
* Validação de arquivos.
* Geração de nome de arquivo.
* Seleção de moldura.
* Fallback de compartilhamento.

Utilizar Vitest ou Jest.

Também fornecer checklist de teste manual em:

* iPhone.
* Android.
* Desktop.
* Tela vertical.
* Tela horizontal.
* Câmera frontal.
* Câmera traseira.
* Internet lenta.
* Permissão negada.
* Compartilhamento sem suporte.

## 30. Deploy

Preparar o projeto para publicação na Vercel.

Entregar instruções detalhadas:

1. Criar projeto no Supabase.
2. Executar o SQL.
3. Criar ou validar os buckets.
4. Configurar políticas.
5. Configurar variáveis de ambiente.
6. Executar localmente.
7. Publicar na Vercel.
8. Configurar domínio.
9. Testar HTTPS.
10. Gerar o QR Code final.

## 31. README

Criar um README completo contendo:

* Visão geral.
* Funcionalidades.
* Tecnologias.
* Requisitos.
* Instalação.
* Configuração.
* Variáveis de ambiente.
* Banco de dados.
* Supabase Storage.
* Como adicionar molduras.
* Como trocar nome e mensagem da festa.
* Como acessar o painel.
* Como ativar a galeria ao vivo.
* Como publicar na Vercel.
* Como testar a câmera.
* Problemas comuns.
* Limitações do Instagram.
* Cuidados de privacidade.
* Checklist antes da festa.

## 32. Entrega esperada

Entregue:

* Todos os arquivos do projeto.
* Código completo.
* Componentes.
* Rotas.
* Estilos.
* Configuração do PWA.
* Script SQL.
* Políticas RLS.
* Configuração do Supabase.
* `.env.example`.
* README.
* Molduras de demonstração.
* Dados iniciais.
* Instruções de deploy.
* Testes.
* Checklist de funcionamento.

Não entregue apenas uma explicação ou um plano.

Não omita arquivos importantes.

Não utilize pseudocódigo.

Não deixe comentários como:

* “implementar depois”
* “adicione sua lógica aqui”
* “TODO”
* “restante do código”
* “código omitido”

Caso a resposta fique grande, gere o projeto arquivo por arquivo, mantendo consistência entre todos os arquivos.

Antes de finalizar, revise:

* Imports.
* Tipagens.
* Dependências.
* Rotas.
* Variáveis de ambiente.
* SQL.
* Políticas do Supabase.
* Compatibilidade entre servidor e cliente.
* Uso correto de componentes client-side.
* Funcionamento da câmera.
* Composição da imagem no Canvas.
* Upload.
* Download.
* Compartilhamento.
* Galeria.
* Slideshow.
* Painel administrativo.

O resultado final deve poder ser instalado com:

`npm install`

e executado com:

`npm run dev`

O projeto deverá estar pronto para deploy na Vercel e uso real durante uma festa.
