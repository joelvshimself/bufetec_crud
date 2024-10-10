// script.js


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

function modificarPermiso(UserId) {
    // Guardamos el ID de usuario para usarlo más tarde
    userIdGlobal = UserId;

    // Mostrar el modal
    document.getElementById('modal').style.display = 'block';
}

function cerrarModal() {
    // Ocultar el modal
    document.getElementById('modal').style.display = 'none';
}

function enviarPermiso() {
    const permisoSeleccionado = document.getElementById('permiso').value;
    const url = `/api/usuarios/${userIdGlobal}/permiso`;

    // Datos que se enviarán en la petición
    const data = {
        permiso: parseInt(permisoSeleccionado)
    };

    // Realizar la petición PUT al servidor
    fetch(url, {
        method: 'PUT', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al modificar el permiso');
        }
        return response.json();
    })
    .then(updatedUser => {
        console.log('Permiso modificado:', updatedUser);
        alert('Permiso modificado exitosamente');

        // Actualizar el permiso en la tabla
        const filas = document.querySelectorAll('#usuarios-table tbody tr');
        filas.forEach(fila => {
            if (fila.children[0].textContent == userIdGlobal) {
                fila.querySelector('.permiso').textContent = permisoSeleccionado;
            }
        });

        cerrarModal();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un problema al modificar el permiso');
        cerrarModal();
    });
}

function borrarUsuario(userId) {
    if (confirm('¿Estás seguro de que deseas borrar este usuario?')) {
        fetch(`/api/usuarios/${userId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al borrar el usuario');
            }
            return response.json();
        })
        .then(data => {
            alert('Usuario borrado exitosamente');
            // Eliminar la fila correspondiente de la tabla
            const filas = document.querySelectorAll('#usuarios-table tbody tr');
            filas.forEach(fila => {
                if (fila.children[0].textContent == userId) {
                    fila.remove();
                }
            });
        })
        .catch(error => {
            console.error('Error al borrar el usuario:', error);
        });
    }
}
