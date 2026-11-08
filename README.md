# 🎓 EduTask [![Acessar Aplicação Online](https://img.shields.io/badge/🌐_Acessar-Aplicação_Online-blue?style=for-the-badge)](https://edutask-gerenciador-acad-mico-universit-rio.ai.studio/)

O **EduTask** é uma plataforma focada na gestão e acompanhamento de tarefas acadêmicas, criada para simplificar a organização de estudantes e equipes em ambiente de aprendizagem.

---

## 📌 Sobre o Projeto

Este projeto foi desenvolvido como parte das atividades práticas da aula de Metodologias Ágeis, com o objetivo de simular o ciclo de desenvolvimento de um produto digital focado na experiência do usuário e na organização de entregáveis.

### 🛠️ Tecnologias Utilizadas

- **[React](https://reactjs.org/)** / **[TypeScript](https://www.typescriptlang.org/)** — Linguagem e biblioteca principal
- **[Vite](https://vitejs.dev/)** — Build tool rápida e leve

---

## 📚 Documentação e Artefatos

Como parte da entrega acadêmica da disciplina de Metodologias Ágeis, a documentação completa e os artefatos gerados estão organizados na pasta [`docs/`](./docs) do repositório:

- **[Enunciado do Projeto](./docs/enunciado.docx):** Diretrizes e requisitos propostos para a atividade.
- **[Documento de Requisitos](./docs/requisitos.docx):** Todos os requisitos implementáveis para o EduTask.
- **[Documento de Visão de Produto](./docs/visao-produto.docx):** Escopo, objetivos e proposta de valor do EduTask.
- **[Relatórios Scrum](./docs/relatorio-scrum.docx):** Acompanhamento de sprints, backlog e entregáveis da equipe.
- **[Prompts de Geração](./docs/prompts/):** Histórico detalhado com os 5 arquivos de prompts utilizados para a concepção do mockup.
- **[Apresentação](./docs/apresentacao.pdf):** Apresentação usado para explicar o projeto.

---

## 🚀 Como Executar o Projeto Localmente

Siga os passos abaixo para rodar a aplicação em sua máquina local.

### Pré-requisitos

Certifique-se de ter o [Node.js](https://nodejs.org/) (versão 18 ou superior) e um gerenciador de pacotes (`npm`, `yarn` ou `pnpm`) instalados.

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/acramin/EduTask.git
   ```
2. **Acesse a pasta do projeto:**
   ```bash
   cd EduTask
   ```
3. **Instale as dependências:**
   ```bash
   npm install
   ```
4. **Configure as variáveis de ambiente:**
Copie o arquivo .env.example para .env (se necessário)
   ```bash
   cp .env.example .env
   ```
5. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
6. **Acesse a aplicação no seu navegador pelo endereço indicado no terminal (geralmente http://localhost:5173).**

---
## 📂 Estrutura do Projeto
```
EduTask/
├── docs/            # Documentação e artefatos acadêmicos
│   ├── apresentacao.pdf
│   ├── enunciado.docx
│   ├── visao-produto.docx
│   ├── requisitos.docx
│   ├── relatorio-scrum.docx
│   └── prompts/
│       ├── prompt01-criacao.txt
│       ├── prompt02-refinamento-visual.txt
│       ├── prompt03-refinamento-experiencia.txt
│       ├── prompt04-responsividade.txt
│       └── prompt05-auditoria.txt
├── public/          # Arquivos estáticos
├── src/             # Código-fonte principal da aplicação
├── .env.example     # Exemplo de variáveis de ambiente
├── index.html       # Arquivo HTML principal
├── package.json     # Gerenciamento de dependências e scripts
├── tsconfig.json    # Configuração do TypeScript
└── vite.config.ts   # Configuração do Vite
```

---
## ✒️ Autores
Amanda - [acramin](https://github.com/acramin)

---
## 📄 Licença
Este projeto é de fins estritamente acadêmicos.
