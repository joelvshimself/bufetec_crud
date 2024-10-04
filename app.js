const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5500;

// Permitir CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// Middleware para manejar JSON
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));


// Ruta para servir el archivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
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

// Ruta para modificar el permiso de un usuario
app.put('/api/usuarios/:id/modificar-permiso', async (req, res) => {
    const userId = req.params.id;
    const nuevoPermiso = req.body.permiso;

    try {
        const response = await fetch(`https://bufetecapi.onrender.com/usuarios/${userId}/modificar-permiso`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ permiso: nuevoPermiso })
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error al modificar el permiso:', error);
        res.status(500).json({ error: 'Error al modificar el permiso' });
    }
});

// Ruta para borrar un usuario
app.delete('/api/usuarios/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const response = await fetch(`https://bufetecapi.onrender.com/usuarios/${userId}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error al borrar el usuario:', error);
        res.status(500).json({ error: 'Error al borrar el usuario' });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
