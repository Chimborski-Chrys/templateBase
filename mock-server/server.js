import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3000

// Middleware
app.use(cors())
app.use(express.json())

// In-memory database
let users = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Regular User',
    email: 'user@example.com',
    password: 'user123',
    role: 'user',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'John Moderator',
    email: 'mod@example.com',
    password: 'mod123',
    role: 'moderator',
    createdAt: new Date().toISOString()
  }
]

// Helper: Generate token (simple mock)
const generateToken = (user) => {
  return `mock-token-${user.id}-${Date.now()}`
}

// Helper: Verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não fornecido' })
  }

  const token = authHeader.substring(7)
  if (!token.startsWith('mock-token-')) {
    return res.status(401).json({ message: 'Token inválido' })
  }

  // Extract user ID from token
  const userId = token.split('-')[2]
  const user = users.find(u => u.id === userId)

  if (!user) {
    return res.status(401).json({ message: 'Usuário não encontrado' })
  }

  req.user = user
  next()
}

// Helper: Check role
const hasRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Acesso negado' })
    }
    next()
  }
}

// ==================== AUTH ROUTES ====================

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body

  const user = users.find(u => u.email === email && u.password === password)

  if (!user) {
    return res.status(401).json({ message: 'Credenciais inválidas' })
  }

  const token = generateToken(user)
  const { password: _, ...userWithoutPassword } = user

  res.json({
    user: userWithoutPassword,
    token
  })
})

// POST /api/auth/change-password
app.post('/api/auth/change-password', verifyToken, (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body

  if (req.user.password !== currentPassword) {
    return res.status(400).json({
      message: 'Senha atual incorreta',
      field: 'currentPassword'
    })
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      message: 'Senhas não conferem',
      field: 'confirmPassword'
    })
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      message: 'Nova senha deve ter no mínimo 6 caracteres',
      field: 'newPassword'
    })
  }

  // Update password
  const userIndex = users.findIndex(u => u.id === req.user.id)
  users[userIndex].password = newPassword

  res.json({ message: 'Senha alterada com sucesso' })
})

// ==================== USER ROUTES ====================

// GET /api/users - List all users (admin only)
app.get('/api/users', verifyToken, hasRole(['admin']), (req, res) => {
  const usersWithoutPasswords = users.map(({ password, ...user }) => user)
  res.json(usersWithoutPasswords)
})

// POST /api/users - Create user (admin only)
app.post('/api/users', verifyToken, hasRole(['admin']), (req, res) => {
  const { name, email, password, role } = req.body

  // Validation
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' })
  }

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'Email já cadastrado' })
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Senha deve ter no mínimo 6 caracteres' })
  }

  const newUser = {
    id: String(users.length + 1),
    name,
    email,
    password,
    role,
    createdAt: new Date().toISOString()
  }

  users.push(newUser)

  const { password: _, ...userWithoutPassword } = newUser
  res.status(201).json(userWithoutPassword)
})

// PUT /api/users/:id - Update user (admin only)
app.put('/api/users/:id', verifyToken, hasRole(['admin']), (req, res) => {
  const { id } = req.params
  const { name, email, role, password } = req.body

  const userIndex = users.findIndex(u => u.id === id)

  if (userIndex === -1) {
    return res.status(404).json({ message: 'Usuário não encontrado' })
  }

  // Check if email is already taken by another user
  if (email && users.find(u => u.email === email && u.id !== id)) {
    return res.status(400).json({ message: 'Email já cadastrado' })
  }

  // Update user
  if (name) users[userIndex].name = name
  if (email) users[userIndex].email = email
  if (role) users[userIndex].role = role
  if (password) {
    if (password.length < 6) {
      return res.status(400).json({ message: 'Senha deve ter no mínimo 6 caracteres' })
    }
    users[userIndex].password = password
  }

  users[userIndex].updatedAt = new Date().toISOString()

  const { password: _, ...userWithoutPassword } = users[userIndex]
  res.json(userWithoutPassword)
})

// DELETE /api/users/:id - Delete user (admin only)
app.delete('/api/users/:id', verifyToken, hasRole(['admin']), (req, res) => {
  const { id } = req.params

  const userIndex = users.findIndex(u => u.id === id)

  if (userIndex === -1) {
    return res.status(404).json({ message: 'Usuário não encontrado' })
  }

  // Prevent deleting yourself
  if (users[userIndex].id === req.user.id) {
    return res.status(400).json({ message: 'Você não pode deletar seu próprio usuário' })
  }

  users.splice(userIndex, 1)
  res.json({ message: 'Usuário deletado com sucesso' })
})

// ==================== SERVER ====================

app.listen(PORT, () => {
  console.log(`\n🚀 Mock API Server rodando em http://localhost:${PORT}`)
  console.log(`\n📋 Usuários disponíveis para login:`)
  console.log(`   Admin:     admin@example.com / admin123`)
  console.log(`   User:      user@example.com / user123`)
  console.log(`   Moderator: mod@example.com / mod123\n`)
})
