# Meus Treinos

App para organizar seus treinos A/B/C, saber qual treino fazer hoje (ciclo
automático), marcar como feito e acompanhar o histórico. Funciona como PWA:
depois de publicado, instala no iPhone e se comporta como um app nativo.

## Estrutura

```
meus-treinos/
├── index.html      → estrutura/estilo do app
├── app.js          → toda a lógica do app
├── manifest.json   → configuração do PWA
├── sw.js           → service worker (uso offline + atualização)
├── icons/
│   ├── icon-192.png
│   ├── icon-512.png
│   └── apple-touch-icon.png
└── README.md
```

Os dados (treinos, exercícios e histórico) ficam salvos no `localStorage` do
navegador do seu iPhone — não há servidor. Use **"Exportar backup"** dentro
do app de vez em quando para não perder o histórico caso troque de aparelho.

## Novidades desta versão

**Rodada 4**
- **Timer de descanso** entre séries (60/90/120s configurável por exercício), com vibração no fim. Não dispara em exercícios marcados como superset.
- **Tela sempre ligada** durante o treino (Wake Lock), com opção para desativar em Preferências.
- **Sugestão de progressão**: ao abrir um exercício, mostra "Sugestão: 65 kg × 10" com base na última vez, e um botão para aplicar direto nas séries.
- **Recordes pessoais (PR)**: selo de troféu quando você bate a maior carga ou o maior 1RM estimado, com uma seção "Recordes" listando os principais.
- **Notas e RPE**: campo de observação por exercício e por treino, e RPE (1–10) opcional por exercício.
- **Tipos de série**: aquecimento, drop set e até a falha (toque no número da série para alternar). Aquecimento fica fora das estatísticas de volume e recordes.
- **Estatísticas**: volume total, séries por grupo muscular e volume por semana (7/30/90 dias).
- **Peso corporal e medidas** (cintura, peito, braço, coxa) com gráfico de evolução.
- **Backups automáticos** dentro do aparelho (últimas 5 cópias diárias), com tela para restaurar qualquer uma.
- **Exportar/importar mais seguros**: exportar agora tenta abrir a folha de compartilhamento do iPhone (salvar direto no iCloud); importar valida o arquivo antes de aplicar e recusa backups corrompidos ou de versão futura.
- **Desfazer** em exclusões de exercício, treino e sessão (toast com botão "Desfazer").
- **Duplicar treino**, **reordenar exercícios**, **superset** (agrupar dois exercícios) e **link** de vídeo/técnica por exercício.
- **Unidade kg/lb** configurável.
- Correção: marcar uma série com ✓ agora grava de fato o peso/reps que já apareciam pré-preenchidos na tela (antes podiam ficar em branco).
- Telas de abertura (splash screens) do iOS.

**Rodada 3.1**
- **Biblioteca de exercícios embutida**: a lista de exercícios do seletor
  agora já vem pré-carregada com mais de 300 exercícios organizados em 21
  grupos musculares (Quadríceps, Glúteos, Peitoral, Costas, Bíceps,
  Tríceps, etc.), então dá pra montar um treino sem digitar nada. Os
  grupos aparecem retráteis (toque para abrir/fechar); ao digitar na
  busca, o filtro passa a mostrar todos os exercícios que combinam, de
  qualquer grupo, numa lista só. Exercícios digitados manualmente que não
  estão na biblioteca continuam aparecendo no topo, em "Meus exercícios".

**Rodada 3**
- **Tela de iniciar treino**: não é mais possível adicionar ou remover séries
  durante o treino (a quantidade de séries é a configurada no exercício,
  em "Meus treinos"). As únicas coisas editáveis ali são peso e
  repetições — e agora as repetições também podem ser digitadas
  diretamente (igual ao peso), além dos botões de +/-.
- **Estatística "no mês"**: o card que antes mostrava a soma de todas as
  sessões já feitas (desde sempre) agora mostra apenas as sessões do mês
  atual, reiniciando a cada mês novo. "Dias seguidos" e "essa semana"
  continuam como antes.
- **Lista de exercícios em vez de digitar**: ao tocar em "Adicionar
  exercício" dentro de um treino, abre uma lista com todos os nomes de
  exercícios já usados em qualquer treino, com busca (filtra por qualquer
  trecho do nome) e checkboxes — dá pra marcar vários de uma vez e todos
  entram automaticamente como exercícios do treino. Se o nome ainda não
  existir, dá pra digitar um novo e marcá-lo também. Para renomear um
  exercício já existente, toque no nome dele para abrir a mesma lista
  (aqui é só tocar em um item para escolher).

**Rodada 1**
- Registro de carga e reps ao marcar um treino (ou editar um dia do
  histórico), com o último valor usado como referência.
- Histórico em heatmap estilo GitHub.
- Reordenar treinos no ciclo com as setinhas.
- Ícones SVG no lugar dos caracteres de texto (✎ ✕ ✓).
- Indicador de salvamento renomeado ("salvo neste aparelho").
- Aviso de atualização do app quando uma nova versão for publicada.
- Importar backup mostra quantos treinos/sessões o arquivo tem.
- Corrigido bug do contador de ID de exercício reiniciando a cada carregamento.

**Rodada 2**
- **Gráfico de progresso por exercício**: toque no ícone de gráfico ao lado
  de um exercício para ver a evolução de carga ao longo do tempo.
- **Dias de descanso**: dá pra adicionar "Descanso" como parte do ciclo,
  junto com os treinos A/B/C.
- **Lembrete diário**: ative um horário para o app te avisar (por
  notificação, se permitida, e por um aviso dentro do app) que ainda não
  treinou hoje. **Importante:** isso só funciona enquanto o app está aberto
  ou quando você o reabre — o iPhone não permite alarmes em segundo plano
  para apps instalados via Safari sem um servidor de notificações próprio
  (Web Push exigiria backend). Se quiser lembrete garantido mesmo com o app
  fechado, o caminho realista é usar o app de Lembretes/Calendário nativo
  do iPhone em paralelo.
- **Aviso de backup**: se passar 14 dias sem exportar, aparece um banner
  sugerindo exportar (com atalho direto).
- **Importar com escolha**: agora pergunta se você quer **mesclar** o
  backup com os dados atuais (só adiciona sessões novas) ou **substituir**
  tudo.
- **Inputs de exercício redesenhados**: nome em linha própria, séries/reps
  em campos maiores e mais fáceis de tocar.
- **Animação de conclusão**: um pulso sutil no card ao salvar o treino do dia.
- Mais `aria-label`s nos chips e campos da folha de registro.
- Código dividido em `index.html` (estrutura) e `app.js` (lógica), para
  ficar mais fácil de editar cada parte separadamente.

### O que ficou de fora (e por quê)

- **Sincronizar entre aparelhos de verdade** (ex: editar no iPhone e ver no
  iPad na hora) não é possível só com HTML/JS estático — precisa de um
  servidor/backend guardando os dados de cada usuário. O app continua
  local por aparelho; a forma de levar dados de um pra outro é exportar e
  importar o arquivo de backup (dá pra guardar esse arquivo no iCloud Drive
  para facilitar).
- **Reescrever o motor de renderização** (hoje ele redesenha a tela inteira
  a cada ação, em vez de atualizar só o que mudou) não foi feito nesta
  rodada: com a quantidade de dados de um app pessoal de treino isso não
  chega a ser perceptível na prática, e mexer nisso tem risco real de
  introduzir bugs sutis para um ganho que você provavelmente nem notaria.
  Se um dia o app crescer muito (dezenas de exercícios por treino, anos de
  histórico), vale revisitar.

## 1. Subir para o GitHub

1. Entre em [github.com](https://github.com) (crie conta se ainda não tiver).
2. Clique em **New repository**. Nome sugerido: `meus-treinos`. Marque como
   **Public**. Não crie README automático (já tem um aqui).
3. Clique em **Create repository**.
4. Na tela vazia do repositório, clique em **"uploading an existing file"**.
5. Arraste todos os arquivos desta pasta `meus-treinos` (incluindo a pasta
   `icons/` inteira) para a área de upload.
6. Clique em **Commit changes**.

## 2. Ativar o GitHub Pages

1. No repositório, vá em **Settings → Pages**.
2. Em **Source**, escolha **Deploy from a branch**.
3. Em **Branch**, selecione `main` e a pasta `/ (root)`. Clique em **Save**.
4. Aguarde 1–2 minutos e recarregue a página — vai aparecer o link:
   `https://SEU-USUARIO.github.io/meus-treinos/`

## 3. Instalar no iPhone

1. Abra o link no **Safari** do iPhone.
2. Toque no ícone de compartilhar (quadrado com seta para cima).
3. Toque em **"Adicionar à Tela de Início"** e confirme.

O ícone aparece na tela inicial e abre em tela cheia, como um app nativo.

## Atualizando depois

Edite os arquivos direto pelo GitHub (ícone de lápis em cada arquivo) ou
suba versões novas pela mesma tela de upload. O GitHub Pages republica em
cerca de 1 minuto.
