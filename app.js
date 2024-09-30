const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5500;

// Permitir CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});


// Servir archivos estáticos desde la carpeta actual
app.use(express.static(path.join(__dirname)));

// Ruta para servir el archivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


// Ruta para obtener usuarios y manejar CORS
app.get('/api/usuarios', async (req, res) => {
    try {
        const response = await fetch('https://bufetecapi.onrender.com/usuarios');
        const data = await response.json();
        res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate');
        res.status(200).json(data);
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        res.status(500).json({ error: 'Error al obtener los datos' });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
