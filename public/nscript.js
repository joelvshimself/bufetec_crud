
document.getElementById('uploadnoticia').addEventListener('click', subirNoticia);

async function subirNoticia() {
    const titulo = document.getElementById('titulo').value.trim();  // trim para evitar espacios
    const descripcion = document.getElementById('descripcion').value.trim();
    const link = document.getElementById('filelink').value.trim();
    const isVideo = document.getElementById('isVideo').checked;  // true si está marcado, false si no

    // URL del API
    const url = `https://ndba.onrender.com/noticias`;

    // Validación simple
    if (titulo === '' || descripcion === '' || link === '') {
        alert('Por favor, llena todos los campos');
        return;
    }

    // Crear objeto de noticia
    const nuevaNoticia = {
        "Nombre": titulo,
        "Descripcion": descripcion,
        "Link": link,
        "IsVideo": isVideo
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevaNoticia)
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Noticia subida correctamente:', data);
        alert('Noticia subida correctamente');
        cargarNoticias();  // Actualizar la lista de noticias después de subir una nueva

    } catch (error) {
        console.error('Error al subir la noticia:', error);
        alert('Hubo un problema al subir la noticia');
    }
}

// Función para eliminar noticias
async function eliminarNoticia(id) {
    const url = `https://ndba.onrender.com/noticias/${id}`;
    try {
        const response = await fetch(url, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        alert('Noticia eliminada correctamente');
        cargarNoticias(); // Recargar las noticias después de eliminar una
    } catch (error) {
        console.error('Error al eliminar la noticia:', error);
        alert('Hubo un problema al eliminar la noticia');
    }
}

// Función para cargar noticias
async function cargarNoticias() {
    try {
        const response = await fetch('https://ndba.onrender.com/noticias');
        const noticias = await response.json();

        const listaDiv = document.getElementById('lista');
        listaDiv.innerHTML = ''; // Limpiar la lista antes de agregar las noticias

        noticias.forEach(noticia => {
            const noticiaElement = document.createElement('div');
            noticiaElement.classList.add('noticia-item');

            const tituloElement = document.createElement('p');
            tituloElement.textContent = noticia.Nombre;

            const eliminarButton = document.createElement('button');
            eliminarButton.textContent = 'Eliminar';
            eliminarButton.addEventListener('click', () => eliminarNoticia(noticia.Noticia_id));

            noticiaElement.appendChild(tituloElement);
            noticiaElement.appendChild(eliminarButton);
            listaDiv.appendChild(noticiaElement);
        });
    } catch (error) {
        console.error('Error fetching noticias:', error);
    }
}

// Cargar noticias al cargar la página
document.addEventListener('DOMContentLoaded', cargarNoticias);
