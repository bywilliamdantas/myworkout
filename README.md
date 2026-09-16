# Meus Treinos

App para organizar seus treinos A/B/C, saber qual treino fazer hoje (ciclo
automático), marcar como feito e acompanhar o histórico. Funciona como PWA:
depois de publicado, instala no iPhone e se comporta como um app nativo.

## Estrutura

```
meus-treinos/
├── index.html      → o app em si
├── manifest.json    → configuração do PWA
├── sw.js             → service worker (uso offline)
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

- **Registro de carga e reps**: ao marcar um treino como feito (ou tocar num
  dia do histórico), abre uma folha com cada exercício para anotar peso e
  repetições. O campo mostra o último valor registrado como referência.
- **Histórico em heatmap**: o calendário virou um mapa de calor (estilo
  GitHub), mais compacto e fácil de ler os padrões de frequência.
- **Reordenar treinos** no ciclo com as setinhas ao lado de cada card.
- **Ícones SVG** no lugar dos caracteres de texto (✎ ✕ ✓) para um visual
  mais consistente entre aparelhos.
- **Indicador de salvamento** renomeado para deixar claro que os dados ficam
  só neste aparelho (não é sincronização na nuvem).
- **Aviso de atualização do app**: quando uma nova versão for publicada no
  GitHub Pages, aparece um banner para atualizar sem precisar desinstalar.
- **Importar backup** agora mostra quantos treinos/sessões o arquivo tem
  antes de sobrescrever os dados atuais.
- Corrigido um bug em que o contador interno de exercícios reiniciava a
  cada carregamento da página, podendo gerar exercícios com IDs
  duplicados depois de várias edições.

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
