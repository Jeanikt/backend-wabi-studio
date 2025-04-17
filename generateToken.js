// generateToken.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = '59761ee07851753d805a0db4a1b9c3d14e49f5b805f4d25b4b3a4b1951423913'; 

// Token para usuário comum
const userPayload = {
  id: 'user1',
  email: 'user@example.com',
  role: 'user',
};
const userToken = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '1h' });
console.log('User Token:', userToken);

// Token para administrador
const adminPayload = {
  id: 'admin1',
  email: 'admin@example.com',
  role: 'admin',
};
const adminToken = jwt.sign(adminPayload, JWT_SECRET, { expiresIn: '1h' });
console.log('Admin Token:', adminToken);