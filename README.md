# Entre nós — Clara & Tomás

Site de casamento em **HTML, CSS e JavaScript**, organizado para GitHub e deploy automático no Vercel. Sem dependências de execução e sem vínculo com ChatGPT Sites.

## Estrutura

```text
marriage/
├── src/
│   ├── index.html          # Conteúdo e seções
│   ├── css/
│   │   ├── style.css       # Base visual vintage e responsividade
│   │   └── refinements.css # Animações e refinamentos visuais
│   └── js/
│       ├── app.js          # Menu, galeria, presentes e confirmação
│       ├── countdown.js    # Dias restantes e ampulheta
│       ├── smooth-scroll.js # Rolagem suave
│       └── faq.js          # Perguntas com abertura animada
├── assets/images/          # Imagens otimizadas em WebP
├── scripts/
│   ├── dev.mjs             # Servidor de desenvolvimento/preview
│   ├── build.mjs           # Prepara a pasta de publicação
│   └── check.mjs           # Valida caminhos e âncoras
├── package.json
├── package-lock.json
├── vercel.json
└── .gitignore
```

`dist/` é gerada pelo build. `sites/` conserva a versão anterior e `public/` conserva os originais das imagens; ambas ficam fora do Git e do deploy. A fonte atual para editar é `src/`, com imagens em `assets/images/`.

## Rodar no computador

Requer Node.js 22 ou superior.

```bash
npm install
npm run dev
```

Abra http://127.0.0.1:5173. Atualize a página para ver as alterações.

```bash
npm run check
npm run build
npm run preview
```

A prévia do build abre em http://127.0.0.1:4173.

## GitHub → Vercel

1. Envie o conteúdo desta pasta `marriage` para a raiz do seu repositório GitHub, incluindo `.gitignore`, `src/`, `assets/`, `scripts/`, `package.json`, `package-lock.json` e `vercel.json`.
2. No Vercel, importe esse repositório.
3. Use **Root Directory: `.`**, **Framework Preset: Other**, **Build Command: `npm run build`** e **Output Directory: `dist`**. O `vercel.json` já define o framework, build e saída.
4. Faça o primeiro deploy. Com o repositório conectado, os próximos pushes seguem o fluxo de deploy do Vercel.

Não há variáveis de ambiente obrigatórias. As fontes Cormorant Garamond e DM Sans são carregadas do Google Fonts, com fallback local.

Referência de configuração: https://vercel.com/docs/project-configuration/vercel-json

## Onde editar

- Nomes, datas, história, dress code e endereço: `src/index.html`.
- Cores, fontes, tamanhos e regras mobile: `src/css/style.css`.
- Arquivo de calendário, ideias de presentes e interações: `src/js/app.js`.
- Data e início da contagem da ampulheta: `src/js/countdown.js` (de 14/10/2026 até 23/05/2027). A areia de cima representa a fração restante desse intervalo; a de baixo, a fração transcorrida.
- Fotos: `assets/images/`. Ao renomear, atualize HTML, CSS e galeria no JavaScript.

## Funcionalidades

Abertura animada, história em capítulos com navegação direta no desktop e sequência vertical no celular, revelação de textos, galeria ampliável, ideias de presentes, perguntas frequentes e calendário para download. A preferência de movimento reduzido é respeitada.

Menu em tela cheia com três fotos, CTA com alianças animadas e ampulheta proporcional à contagem. As fotos da galeria começam em preto e branco; hover ou foco de teclado revela suas cores com um pequeno zoom. Em telas de toque, abrir a foto mostra a versão colorida. O close colorido foi criado com a ferramenta de imagens integrada a partir do original monocromático, preservado na introdução.

A rolagem por mouse no desktop tem desaceleração suave; links e capítulos usam navegação suave nativa. Toque, teclado, barra de rolagem e áreas internas do menu e dos diálogos mantêm os controles nativos. Movimento reduzido desativa a suavização.

O casal, a história, o endereço e o evento são fictícios. As imagens foram geradas por IA. O formulário de presença é uma demonstração: valida no navegador, mas **não envia nem armazena dados**. Para uso real, integrar um serviço de confirmação e substituir as informações ilustrativas.
