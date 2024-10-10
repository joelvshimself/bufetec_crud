document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/usuarios')
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('#usuarios-table tbody');
            data.forEach(usuario => {
                const tr = document.createElement('tr');

                tr.innerHTML = `
                    <td>${usuario.Usuario_id}</td>
                    <td>${usuario.Nombre}</td>
                    <td>${usuario.Apellido}</td>
                    <td>${usuario.Correo}</td>
                    <td class="permiso">${usuario.Permisos}</td>
                    <td>${usuario.Telefono}</td>
                    <td>${usuario.Edad}</td>
                    <td>
                        <button onclick="modificarPermiso(${usuario.Usuario_id})">Modificar Permiso</button>
                        <button onclick="borrarUsuario(${usuario.Usuario_id})">Borrar</button>
                    </td>
                `;

                tbody.appendChild(tr);
            });
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
        });
});

let userIdGlobal = null;

function modificarPermiso(userId) {
    userIdGlobal = userId;
    document.getElementById('modal').style.display = 'block';
}

function cerrarModal() {
    document.getElementById('modal').style.display = 'none';
}

// Función para enviar un JSON específico
async function renviarPermiso() {
    const permisoSeleccionado = document.getElementById('permiso').value;
    const url = `https://bufetecapi.onrender.com/api/usuarios/${userIdGlobal}/permisos`; // Usamos la variable global userIdGlobal

    const s = {
        "Permisos": parseInt(permisoSeleccionado)  // Asegurarse de que sea un número
    };

    try {
        const response = await fetch(url, {
            method: 'PUT', // Método PUT
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(s) // Cuerpo de la solicitud como JSON
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Permiso actualizado correctamente:', data);
        alert('Permiso actualizado correctamente');

        // Actualizar el permiso en la tabla
        const filas = document.querySelectorAll('#usuarios-table tbody tr');
        filas.forEach(fila => {
            if (fila.children[0].textContent == userIdGlobal) {
                fila.querySelector('.permiso').textContent = permisoSeleccionado;
            }
        });

        cerrarModal();
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema al modificar el permiso');
        cerrarModal();
    }
}

// Asignar el evento al botón "Guardar" cuando se carga el DOM
document.getElementById('guardar-btn').addEventListener('click', renviarPermiso);

async function borrarUsuario(userId) {
    if (confirm('¿Estás seguro de que deseas borrar este usuario?')) {
        try {
            const response = await fetch(`/api/usuarios/${userId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Error al borrar el usuario');
            }

            const data = await response.json();
            alert('Usuario borrado exitosamente');

            const filas = document.querySelectorAll('#usuarios-table tbody tr');
            filas.forEach(fila => {
                if (fila.children[0].textContent == userId) {
                    fila.remove();
                }
            });
        } catch (error) {
            console.error('Error al borrar el usuario:', error);
        }
    }
}
