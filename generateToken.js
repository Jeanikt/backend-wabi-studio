// src/generateToken.js
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid'); // Adicione a biblioteca uuid para gerar UUIDs

const JWT_SECRET = '59761ee07851753d805a0db4a1b9c3d14e49f5b805f4d25b4b3a4b1951423913';

// Token para usuário comum
const userPayload = {
  id: '877f3813-6504-4d9e-b5b4-f59c7243bb5e', // Use um UUID válido do seu banco de dados
  email: 'user@example.com',
  role: 'user',
};
const userToken = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '1h' });
console.log('User Token:', userToken);

// Token para administrador
const adminPayload = {
  id: uuidv4(), // Gere um novo UUID para o admin, ou use um existente do banco
  email: 'admin@example.com',
  role: 'admin',
};
const adminToken = jwt.sign(adminPayload, JWT_SECRET, { expiresIn: '1h' });
console.log('Admin Token:', adminToken);