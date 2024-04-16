const uri = 'http://localhost:5104/api/TodoItems';

let listaDeTareas = [];


const obtenerListaDeTareas = () => {
  fetch(uri)
    .then(response => response.json())
    .then(data => mostrarTareasEnTabla(data))
    .catch(error => console.error('No se puede obtener el listado de tareas.', error));
}

const registrarTarea = () => {
  const nuevaTareaInput = document.getElementById('add-name');

  const tarea = {
    estaListo: false,
    nombre: nuevaTareaInput.value.trim()
  };

  fetch(uri, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(tarea)
  })
    .then(response => response.json())
    .then(() => {
      obtenerListaDeTareas();
      nuevaTareaInput.value = '';
    })
    .catch(error => console.error('No se ha podido agregar una tarea', error));
}

const eliminarTarea = (id) => {
  fetch(`${uri}/${id}`, {
    method: 'DELETE'
  })
  .then(() => obtenerListaDeTareas())
  .catch(error => console.error('No se ha podido eliminar una tarea', error));
}

const mostrarMenuDeEdicion = (id) => {
  const tarea = listaDeTareas.find(tarea => tarea.id === id);
  
  document.getElementById('edit-name').value = tarea.nombre;
  document.getElementById('edit-id').value = tarea.id;
  document.getElementById('edit-isComplete').checked = tarea.estaListo;
  document.getElementById('editForm').style.display = 'block';
}

const editarTarea = () => {

  const idTarea = document.getElementById('edit-id').value;

  const tarea = {
    id: parseInt(idTarea, 10),
    estaListo: document.getElementById('edit-isComplete').checked,
    nombre: document.getElementById('edit-name').value.trim()
  };

  fetch(`${uri}/${idTarea}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(tarea)
  })
  .then(() => obtenerListaDeTareas())
  .catch(error => console.error('No se ha podido editar una tarea', error));

  cerrarInput();

  return false;
}

const mostrarTareasEnTabla =(data)=>{

}


const obtenerDatosFormularioRegistro = () =>{
  return{};
}