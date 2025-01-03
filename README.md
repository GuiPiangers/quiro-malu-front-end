<h1 align="center" style="font-weight: bold;">Front-end do Sistema de Gestão para Clínica de Quiropraxia</h1>

<p align="center">
 <a href="#features">Funcionalidades</a> • 
 <a href="#tech">Tecnologias</a> • 
 <a href="#started">Getting Started</a>
</p>

<p>
<b>Este projeto é o front-end do sistema de gestão desenvolvido para uma clínica de quiropraxia. Construído com <strong>Next.js 14.2</strong>, <strong>Tailwind CSS</strong> e <strong>TypeScript</strong>, ele fornece uma interface moderna, responsiva e performática para gerenciar as operações da clínica e melhorar a experiência dos usuários.</b>
</p>

<p>
    Deve ser usado em conjunto com o <a href="https://github.com/GuiPiangers/quiro-malu-backend">Projeto Back-end</a>, que oferece uma API para executar as regras de negócio do sistema e salvar os dados em um banco de dados.
</p>

<h2 id="features">Funcionalidades</h2>

<p>Atualmente, o front-end suporta as seguintes funcionalidades principais:</p>
<ul>
  <li>Interface para o sistema de registro e login de novos usuários, garantindo a segunrança no uso do sistema e permitindo mais de um usuário simultânio usando contas diferentes</li>
  <li><strong>Interface para Gerenciamento de Pacientes</strong>: Permite visualizar, registrar, editar e organizar informações dos pacientes.
  </li>
  <li><strong>Sistema de Agendamento</strong>: Ferramenta interativa para agendar consultas com controle visual por dias e horários.</li>
  <li><strong>Visualização de Relatórios</strong>: Interface intuitiva para exibir relatórios de progresso de cada paciente.</li>
</ul>

<h3>Funcionalidades Futuras</h3>
<ul>
  <li><strong>Geração de PDFs</strong>: Disponibilizar o download de relatórios de progresso diretamente na interface.</li>
  <li><strong>Gestão Financeira</strong>: Implementação de gráficos e tabelas para controlar o fluxo financeiro da clínica.</li>
  <li><strong>Automação de Mensagens</strong>: Configuração para que o usuário agende mensagens personalizáveis para os clientes via WhatsApp.</li>
  <li><strong>Modo Offline</strong>: Transformar a aplicação em uma PWA, permitindo o uso mesmo sem internet.</li>

</ul>

<h2 id="tech">Tecnologias</h2>

- NextJS
- TypeScript
- Tailwind CSS
- Docker
- React Hook Form
- Tanstack Query
- ZOD

<h2 id="started">Instalação e configuração</h2>

<h3>Pré requisitos</h3>

- [NodeJS](https://github.com/)
- [Git 2](https://github.com)
- [Docker](https://www.docker.com/get-started/)

<ol>
  <li>Clone este repositório:
    <pre><code>git clone https://github.com/GuiPiangers/quiro-malu-front-end.git
cd quiro-malu-front-end</code></pre>
  </li>

  <li>Instale as dependências:
    <pre><code>npm install</code></pre>
  </li>

  <li>Configure as variáveis de ambiente:
    Crie um arquivo`.env.local` com a configuração do endereço da API back-end:

   ```yaml
  NEXT_PUBLIC_HOST=http://localhost:8000
   ```
  </li>
 
  <li>Inicie o servidor:
    <pre><code>npm run dev</code></pre>
  </li>
</ol>

<p>O servidor estará disponível em <code>http://localhost:3000</code> por padrão.</p>
