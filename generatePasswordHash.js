// generatePasswordHash.js
const bcrypt = require('bcrypt');

const password = 'admin123'; // Senha que você quer usar para o admin
bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Erro ao gerar hash:', err);
    return;
  }
  console.log('Senha hasheada:', hash);
});