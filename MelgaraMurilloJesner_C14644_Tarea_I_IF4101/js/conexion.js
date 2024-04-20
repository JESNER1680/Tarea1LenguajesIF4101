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
let listaDeTareas = [];


const obtenerListaDeUsuarios = () => {
  const uri = getControllerUri("usuario");
  fetch(uri)
    .then(response => response.json())
    .then(data => {
      usuarios = convertirJsonAUsuarios(data);
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
const registrarTarea = () => {
  const uri = getControllerUri("usuario");
  const nombrePersona = document.getElementById("nombrePersona").value.trim();
  const cedula = document.getElementById("cedula").value.trim();
  const nombreUsuario = document.getElementById("nombreUsuarioRegistro").value.trim();
  const contrasennia = document.getElementById("contrasennaRegistro").value.trim();
 const correoElectronico = document.getElementById("correoElectronico").value.trim();
 const tarjetaCredito = document.getElementById("tarjetaCredito").value.trim();
 const cvvTarjeta = document.getElementById("cvv").value.trim(); 

 const usuario = {
  nombrePersona: nombrePersona,
  cedula: cedula,
  nombreUsuario: nombreUsuario,
  contrasennia: contrasennia,
  correoElectronico: correoElectronico,
  tarjetaCredito: tarjetaCredito,
  cvv: cvvTarjeta
};


  fetch(uri, {
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
  obtenerListaDeUsuarios();
  const botonRegistro = document.getElementById("RegistrarUsuario");
  if(botonRegistro){
    botonRegistro.addEventListener("click", (event) => {
      event.preventDefault(); 
      registrarTarea(); 
    });
  }

  const botonCerrarRegistro = document.getElementById("CerrarRegistro");
  if(botonCerrarRegistro){
    botonCerrarRegistro.addEventListener("click", (event) => {
      event.preventDefault(); 
      obtenerListaDeTareas();
    });
  }

  const formIngresar = document.getElementById("formulario");
  if (formIngresar) {
    formIngresar.addEventListener("submit", (event) => {
      event.preventDefault(); 
      const nombreUsuario = document.getElementById("nombreUsuario").value.trim();
      const contrasenna = document.getElementById("contrasenna").value.trim();
      let usuario = comprobarInicioSesion(nombreUsuario, contrasenna);
      if (usuario) {
        usuarioActivo = usuario;
        window.location.href = "BusquedaRuta.html";
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
