# OnPlay Frontend

Frontend Angular para plataforma de streaming de filmes.

## Funcionalidades

- **Tela de Login**: Autenticação de usuários
- **Cadastro de Usuário**: Criação de conta com validação de senha
- **Validação de Senha**: Regras de segurança implementadas
- **Catálogo de Filmes**: Exibição de filmes do backend
- **Player Simples**: Simulação de reprodução de filmes

## Regras de Validação de Senha

- Mínimo 8 caracteres
- Pelo menos 1 letra maiúscula
- Pelo menos 1 letra minúscula  
- Pelo menos 1 número
- Pelo menos 1 caractere especial (!@#$%^&*)

## Como executar

1. Instalar dependências:
```bash
npm install
```

2. Executar aplicação:
```bash
npm start
```

3. Acessar: http://localhost:4200

## Estrutura do Projeto

- `src/app/components/` - Componentes da aplicação
- `src/app/services/` - Serviços para API
- `src/app/guards/` - Guards de autenticação
- `src/app/app.routes.ts` - Configuração de rotas

## API Backend

A aplicação consome APIs do backend em `http://localhost:8080/api`:
- `/auth/login` - Login de usuário
- `/auth/register` - Cadastro de usuário  
- `/movies` - Listagem de filmes
- `/movies/{id}` - Detalhes do filme