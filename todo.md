# Project TODO

## Configuração Inicial
- [x] Configurar logo IPEX no projeto
- [x] Definir schema do banco de dados para registros de documentos
- [x] Criar migrations do banco de dados

## Backend (tRPC)
- [x] Implementar rota para criar novo registro
- [x] Implementar rota para listar todos os registros
- [x] Implementar rota para exportar registros em CSV
- [x] Implementar rota para exportar registros em PDF

## Frontend
- [x] Criar página principal com formulário de registro
- [x] Implementar campos do formulário (solicitado por, tipo documento, assinatura de, data, responsável)
- [x] Implementar validação de formulário
- [x] Criar tabela de listagem de registros
- [x] Adicionar botões de exportação (CSV e PDF)
- [x] Aplicar branding IPEX (cores e logo)

## Integração e Deploy
- [x] Testar fluxo completo de criação e listagem
- [x] Testar exportação CSV
- [x] Testar exportação PDF
- [x] Criar checkpoint para deploy
- [x] Configurar repositório GitHub

## Novos Campos - Empresa e Assunto
- [x] Adicionar campo "empresa" ao schema do banco de dados
- [x] Adicionar campo "assunto" ao schema do banco de dados
- [x] Atualizar migrations do banco de dados
- [x] Adicionar campo "Empresa" ao formulário
- [x] Adicionar campo "Assunto" ao formulário
- [x] Atualizar rotas tRPC para incluir novos campos
- [x] Atualizar tabela de listagem com novos campos
- [x] Atualizar exportação CSV com novos campos
- [x] Atualizar exportação PDF com novos campos
- [x] Testar criação de registro com novos campos
- [x] Criar checkpoint final

## Funcionalidade de Exclusão
- [x] Adicionar campo "deletedAt" ao schema para soft delete
- [x] Atualizar migrations do banco de dados com novo campo
- [x] Implementar rota tRPC para soft delete (mover para excluídos)
- [x] Implementar rota tRPC para exclusão permanente
- [x] Criar página de registros excluídos
- [x] Adicionar botão de exclusão na tabela de registros
- [x] Adicionar funcionalidade de restaurar registros excluídos
- [x] Testar soft delete e exclusão permanente


## Funcionalidade de Envio de Email
- [x] Implementar rota tRPC para envio de email
- [x] Adicionar botão de envio de email na tabela de registros
- [x] Configurar email pré-preenchido (emanuel@ipexconstrutora.com.br)
- [x] Testar envio de email
- [x] Criar checkpoint final com email

## Ajustes Solicitados
- [x] Corrigir problema da data que está puxando um dia anterior (timezone)
- [x] Adicionar multiseleção aos campos
- [x] Testar ajustes de data e multiseleção

## Página de Perfil do Usuário
- [ ] Implementar rota tRPC para listar registros do usuário
- [ ] Criar página de perfil do usuário
- [ ] Exibir dados do usuário (nome, email, data de cadastro)
- [ ] Listar registros criados pelo usuário
- [ ] Adicionar link para perfil na navegação
- [ ] Testar página de perfil


## Correção de Data e Adição de Hora
- [ ] Corrigir problema da data que está salvando com um dia anterior
- [ ] Adicionar campo de hora ao formulário
- [ ] Atualizar schema do banco de dados para incluir hora
- [ ] Testar salvamento correto de data e hora
