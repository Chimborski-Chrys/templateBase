# Mock API Server

Servidor de API mock para desenvolvimento e testes do frontend.

## Como Usar

### Iniciar o servidor
```bash
cd mock-server
npm install
npm start
```

O servidor estará disponível em: `http://localhost:3000`

## Usuários de Teste

| Email | Senha | Role |
|-------|-------|------|
| admin@example.com | admin123 | admin |
| user@example.com | user123 | user |
| mod@example.com | mod123 | moderator |

## Rotas Disponíveis

### Autenticação

**POST /api/auth/login**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```
Resposta:
```json
{
  "user": {
    "id": "1",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  },
  "token": "mock-token-1-1234567890"
}
```

**POST /api/auth/change-password** (requer autenticação)
```json
{
  "currentPassword": "admin123",
  "newPassword": "newpass123",
  "confirmPassword": "newpass123"
}
```

### Usuários (CRUD - requer role: admin)

**GET /api/users**
Lista todos os usuários

**POST /api/users**
```json
{
  "name": "Novo Usuário",
  "email": "novo@example.com",
  "password": "senha123",
  "role": "user"
}
```

**PUT /api/users/:id**
```json
{
  "name": "Nome Atualizado",
  "email": "atualizado@example.com",
  "role": "moderator",
  "password": "novasenha123"
}
```

**DELETE /api/users/:id**
Deleta um usuário

## Headers de Autenticação

Após o login, todas as requisições protegidas devem incluir o header:
```
Authorization: Bearer {token}
```

## Recursos

- CORS habilitado
- Validação de dados
- Proteção RBAC (Role-Based Access Control)
- Dados em memória (reseta ao reiniciar o servidor)
- Mensagens de erro apropriadas
