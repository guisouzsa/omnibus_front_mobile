# Aplicação Mobile Omnibus - Motorista

## Status do projeto

Implementação completa, pronta para produção.

## Visão geral

Esta aplicação mobile foi desenvolvida para motoristas gerenciarem suas rotas, despesas e notificações, com integração completa a uma API backend Laravel.

O sistema é responsivo, moderno e focado em usabilidade em dispositivos móveis.

## Funcionalidades

### Autenticação

* Login com email e senha
* Integração com API (Laravel Sanctum)
* Armazenamento seguro de token
* Logout automático em caso de expiração
* Logout manual

### Dashboard de rotas

* Listagem de rotas do motorista
* Exibição de horários e pontos de início e fim
* Visualização de detalhes da rota
* Carregamento dinâmico via API

### Despesas

* Cadastro de despesas com validação
* Campos: placa, valor e descrição
* Estrutura para upload de comprovantes
* Feedback de envio

### Mapa interativo

* Visualização de rotas em tempo real
* Marcadores de início e fim
* Linha de trajeto
* Zoom automático
* Interface responsiva

### Notificações

* Seleção de tipos de notificação
* Mensagem personalizada
* Integração com API
* Feedback de envio

### Interface

* Design responsivo (mobile-first)
* Compatível com tablets e desktops
* Paleta de cores institucional

## Tecnologias utilizadas

* Next.js
* TypeScript
* React
* Context API
* Leaflet (mapas)
* Laravel (backend)
* Sanctum (autenticação)

## Estrutura do projeto

* src/components: componentes reutilizáveis
* src/contexts: controle de autenticação global
* src/hooks: hooks personalizados
* src/services: integração com API
* src/types: tipagem TypeScript
* app/: páginas da aplicação

## API

### Endpoints já integrados

* Login do motorista
* Dados do motorista
* Logout
* Listagem de rotas
* Detalhes de rota
* Despesas (CRUD básico)

### Endpoints futuros

* Notificações (envio e listagem)

## Execução do projeto

Instalação:
npm install

Desenvolvimento:
npm run dev

Build:
npm run build

Execução em produção:
npm start

A aplicação será executada em:
http://localhost:3000

## Documentação adicional

* IMPLEMENTACAO.md
* BACKEND_CONFIG.md
* DEPLOYMENT.md

## Versão

1.0

## Data

02/05/2026

## Observação

Repositório destinado exclusivamente ao desenvolvimento do frontend mobile da aplicação Omnibus Motorista.
