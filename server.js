const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000; // Puedes cambiar este puerto si es necesario

// Middleware para registrar todas las solicitudes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Middleware para servir archivos estáticos (como el APK)
app.use('/downloads', express.static(path.join(__dirname, 'downloads')));

// Ruta para la página principal
app.get('/', (req, res) => {
  res.send('Servidor de actualizaciones de ConectaHogarTV');
});

// Ruta para obtener la información de la versión
app.get('/version.json', (req, res) => {
  fs.readFile(path.join(__dirname, 'version.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer version.json:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    res.json(JSON.parse(data));
  });
});

// Manejador de errores para rutas no encontradas
app.use((req, res, next) => {
  res.status(404).send('Lo siento, no puedo encontrar eso!');
});

// Manejador de errores general
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor de actualizaciones escuchando en http://localhost:${port}`);
});