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
