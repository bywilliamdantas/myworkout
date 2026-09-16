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
