let usuarios = [];
let usuarioActivo = null;
const apiControllers = {
  tareas: 'Tareas',
  notas: 'Notas',
  usuario: 'Usuario'
};


function getControllerUri(controllerName) {
  const baseUri = 'http://localhost:5104/api/';
  const controller = apiControllers[controllerName.toLowerCase()];
  if (!controller) {
    console.error('Controlador no encontrado:', controllerName);
    return null;
  }
  return baseUri + controller;
}


//const uri = 'http://localhost:5104/api/Tarea1_C14644_IF4101';
let listaDeTareas = [];


const obtenerListaDeTareas = () => {
  const uri = getControllerUri("usuario");
  fetch(uri)
    .then(response => response.json())
    .then(data => {
      usuarios = convertirJsonAUsuarios(data);
      mostrarTareasEnTabla(usuarios);
    })
    .catch(error => console.error('No se puede obtener el listado de tareas.', error));
}

const convertirJsonAUsuarios = (data) => {
  return data.map(usuario => {
    return {
      idUsuario: usuario.idUsuario,
      nombrePersona: usuario.nombrePersona,
      cedula: usuario.cedula,
      nombreUsuario: usuario.nombreUsuario,
      contrasennia: usuario.contrasennia,
      correoElectronico: usuario.correoElectronico,
      tarjetaCredito: usuario.tarjetaCredito,
      cvv: usuario.cvv,
      usuarioEspecial: usuario.usuarioEspecial
    };
  });
}

const mostrarTareasEnTabla =(usuarios) => {
  console.log("CANTIDAD DE USUARIOS: "+usuarios.length);
}


const registrarTarea = () => {
  const uri = getControllerUri("usuario");
  const nombrePersona = document.getElementById("nombrePersona").value.trim();
  const cedula = document.getElementById("cedula").value.trim();
  const nombreUsuario = document.getElementById("nombreUsuarioRegistro").value.trim();
  const contrasennia = document.getElementById("contrasennaRegistro").value.trim();
 const correoElectronico = document.getElementById("correoElectronico").value.trim();
 const tarjetaCredito = document.getElementById("tarjetaCredito").value.trim();
 const cvvTarjeta = document.getElementById("cvv").value.trim(); 
 console.log(nombrePersona+"-"+cedula+"-"+nombreUsuario+"-"+contrasennia+"-"+correoElectronico+"-"+tarjetaCredito+"-"+cvvTarjeta)

 const usuario = {
  nombrePersona: nombrePersona,
  cedula: cedula,
  nombreUsuario: nombreUsuario,
  contrasennia: contrasennia,
  correoElectronico: correoElectronico,
  tarjetaCredito: tarjetaCredito,
  cvv: cvvTarjeta
};


  fetch(uri, {//Aqui esta un error
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(usuario)
  })
    .then(response => response.json())
    .then(() => {
      obtenerListaDeTareas();
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

/*const editarTarea = () => {

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
*/



const obtenerDatosFormularioRegistro = () =>{
  const nombrePersona = document.getElementById("nombrePersona");
  const cedula = document.getElementById("cedula");
  const nombreUsuario = document.getElementById("nombreUsuarioRegistro");
  const contrasennia = document.getElementById("contrasennaRegistro");
 const correoElectronico = document.getElementById("correoElectronico");
 const tarjetaCredito = document.getElementById("tarjetaCredito");
 const cvvTarjeta = document.getElementById("cvv").value; 

  return{nombrePersona, cedula, nombreUsuario, contrasennia, correoElectronico, tarjetaCredito, cvvTarjeta};
}

document.addEventListener("DOMContentLoaded", () => {
  obtenerListaDeTareas();
  const botonRegistro = document.getElementById("RegistrarUsuario");
  if(botonRegistro){
    botonRegistro.addEventListener("click", (event) => {
      event.preventDefault(); // Evita el envío del formulario por defecto
      console.log("HOLA ENTRE AL METODO DE REGISTRO");
      registrarTarea(); // Llama a la función correcta para registrar un usuario
    });
  }

  const botonCerrarRegistro = document.getElementById("CerrarRegistro");
  if(botonCerrarRegistro){
    botonCerrarRegistro.addEventListener("click", (event) => {
      event.preventDefault(); // Evita el envío del formulario por defecto
      obtenerListaDeTareas();
      console.log("HOLA ENTRE AL METODO DE CERRAR REGISTRO");
    });
  }

  const formIngresar = document.getElementById("formulario");
  if (formIngresar) {
    formIngresar.addEventListener("submit", (event) => {
      event.preventDefault(); // Evitar que se recargue la página
      const nombreUsuario = document.getElementById("nombreUsuario").value.trim();
      const contrasenna = document.getElementById("contrasenna").value.trim();
      console.log("LISTO: "+nombreUsuario + "-" + contrasenna);
      let usuario = comprobarInicioSesion(nombreUsuario, contrasenna);
      console.log(usuario);
      if (usuario) {
        usuarioActivo = usuario;
        window.location.href = "BusquedaRuta.html";
        console.log("usuario encontrado");
      }
    });
  }
});

const comprobarInicioSesion = (nombreUsuario, contrasenna) => {
  let usuarioActivo = null;
  if(usuarios.length > 0 ){
    usuarios.forEach(usuario =>{
      if(usuario.nombreUsuario === nombreUsuario && contrasenna === usuario.contrasennia ){
        usuarioActivo = usuario;
        // Guardar información del usuario en el sessionStorage
        sessionStorage.setItem('usuarioActivo', JSON.stringify(usuarioActivo));
      }
    });
  }
  return usuarioActivo;
}

const mostrarMenu = () =>{
  const menu = document.getElementById("menuOpciones");
  if(menu){
    menu.style.display = "flex";
  }
}



