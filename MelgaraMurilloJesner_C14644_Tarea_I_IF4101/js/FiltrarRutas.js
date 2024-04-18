let rutas = [];
let horarios = [];
let paradas = [];
let paradaRutas = [];
let usuarioActivo = null;
let asientos = [];
let contador = 0;
const apiControllers = {
  horario: 'Horario',
  parada: 'Parada',
  paradaRuta: 'ParadaRuta',
  ruta: 'Ruta',
  filtro: 'Filtro'
};

function getControllerUri(controllerName) {
  const baseUri = 'http://localhost:5104/api/';
  const controller = apiControllers[controllerName];
  if (!controller) {
    console.error('Controlador no encontrado:', controllerName);
    return null;
  }
  return baseUri + controller;
}
const obtenerAsientos = ()=>{
    const uri = getControllerUri("usuario");
    fetch(uri)
      .then(response => response.json())
      .then(data => {
        usuarios = convertirJsonAUsuarios(data);
        mostrarTareasEnTabla(usuarios);
      })
      .catch(error => console.error('No se puede obtener el listado de tareas.', error));
}
const obtenerRutasConFiltro = async (destino, origen, fecha, horario) => {
  try {
      let uri = 'http://localhost:5104/api/Ruta/Filtro';

      // Construir la URL con los parámetros de la consulta
      uri += `?destino=${encodeURIComponent(destino)}&`;
      uri += `origen=${encodeURIComponent(origen)}&`;
      uri += `fecha=${encodeURIComponent(fecha)}&`;
      uri += `horario=${encodeURIComponent(horario)}`;

      // Realizar la solicitud GET con los parámetros en la URL
      const response = await fetch(uri, {
        method: 'GET' // Método GET explícito
      });
      
      if (!response.ok) {
          throw new Error('Error en la solicitud');
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data)) {
          throw new Error('Los datos recibidos no son un arreglo');
      }
      
      const rutas = convertirJsonARutas(data);
      console.log('Rutas obtenidas:', rutas);
      
      // Guardar las rutas en el localStorage
      localStorage.setItem('rutas', JSON.stringify(rutas));
      console.log('Rutas guardadas en el localStorage');

      // Llamar a mostrarTareasEnTabla después de obtener y procesar los datos
      mostrarTareasEnTabla(); 
  } catch (error) {
      console.error('Error al obtener las rutas:', error);
  }
};


const convertirJsonARutas = (data) => {
  if (!Array.isArray(data)) {
      throw new Error('Los datos no son un arreglo');
  }
  return data.map(jsonRuta => {
      return {
          idRuta: jsonRuta.idRuta,
          codigoRuta: jsonRuta.codigoRuta,
          nombreRuta: jsonRuta.nombreRuta,
          fecha: new Date(jsonRuta.fecha),
          precio: jsonRuta.precio,
          duracion: jsonRuta.duracion,
          kilometros: jsonRuta.kilometros,
          cantidadAsientos: jsonRuta.cantidadAsientos,
          paradas: jsonRuta.paradas.map(parada => {
              return {
                  idParada: parada.idParada,
                  nombreParada: parada.nombreParada,
                  esOrigen: parada.esOrigen,
                  esDestino: parada.esDestino
              };
          }),
          horarios: jsonRuta.horarios.map(horario => {
              return {
                  idHorario: horario.idHorario,
                  horarioText: horario.horarioText
              };
          })
      };
  });
};

const mostrarTareasEnTabla = () => {
  // Obtener las rutas del localStorage
  const rutasFromLocalStorage = JSON.parse(localStorage.getItem('rutas'));

  // Si hay rutas en el localStorage, cargarlas en la variable rutas
  if (rutasFromLocalStorage) {
      rutas = rutasFromLocalStorage;
  }

  const tablaFiltro = document.getElementById("contenido-tabla");
  if (tablaFiltro) {
      tablaFiltro.innerHTML = '';
      rutas.forEach(ruta => {
          let tr = tablaFiltro.insertRow();
          let tdNombreRuta = tr.insertCell(0);
          let nombreRuta = document.createTextNode(ruta.nombreRuta);
          tdNombreRuta.appendChild(nombreRuta);

          let tdOrigen = tr.insertCell(1);
          let origen = document.createTextNode(ruta.paradas.find(parada => parada.esOrigen).nombreParada);
          tdOrigen.appendChild(origen);

          let tdDestino = tr.insertCell(2);
          let destino = document.createTextNode(ruta.paradas.find(parada => parada.esDestino).nombreParada);
          tdDestino.appendChild(destino);

          let tdFecha = tr.insertCell(3);
          let fecha = ruta.fecha instanceof Date ? ruta.fecha.toDateString() : new Date(ruta.fecha).toDateString();
          let fechaText = document.createTextNode(fecha);
          tdFecha.appendChild(fechaText);

          let tdHorario = tr.insertCell(4);
          let horarios = ruta.horarios.map(horario => horario.horarioText).join(', ');
          let horarioText = document.createTextNode(horarios);
          tdHorario.appendChild(horarioText);

          let tdDetalle = tr.insertCell(5);
          let detalleButton = document.createElement('button');
          detalleButton.type = "button";
          detalleButton.classList.add("btn", "btn-primary");
          detalleButton.setAttribute("data-bs-toggle", "modal");
          detalleButton.setAttribute("data-bs-target", "#detallesModal");
          detalleButton.style.backgroundColor = "#4f4f4f";
          detalleButton.style.color = "white";
          detalleButton.style.border = "none";
          detalleButton.textContent = 'Detalles';
          detalleButton.addEventListener('click', () => mostrarDetalles(ruta));
          tdDetalle.appendChild(detalleButton);
          
          let tdComprar = tr.insertCell(6);
          let comprarButton = document.createElement('button');

          comprarButton.type = "button";

          comprarButton.classList.add("btn", "btn-primary");

          comprarButton.setAttribute("data-bs-toggle", "modal");
          comprarButton.setAttribute("data-bs-target", "#reservaModal");

          comprarButton.style.backgroundColor = "#4f4f4f";
          comprarButton.style.color = "white";
          comprarButton.style.border = "none";

          comprarButton.textContent = "Comprar";

          comprarButton.addEventListener('click', () => comprarRuta(ruta));

          tdComprar.appendChild(comprarButton);

      });
  }
};



const obtenerFiltros = (origen, destino, fecha, horario) =>{
  obtenerRutasConFiltro(origen, destino, fecha, horario);
}
const comprarRuta = (ruta) => {

};

const mostrarDetalles = (ruta) => {
  const modalBody = document.getElementById("modal-detalle");
  const contenidoModal = `
      <h6 style="color: white;">Código de Ruta: ${ruta.codigoRuta}</h6>
      <h6 style="color: white;">Nombre de Ruta: ${ruta.nombreRuta}</h6>
      <h6 style="color: white;">Fecha: ${ruta.fecha instanceof Date ? ruta.fecha.toDateString() : new Date(ruta.fecha).toDateString()}</h6>
      <h6 style="color: white;">Precio: ${ruta.precio}</h6>
      <h6 style="color: white;">Duración: ${ruta.duracion}</h6>
      <h6 style="color: white;">Kilómetros: ${ruta.kilometros}</h6>
      <h6 style="color: white;">Cantidad de Asientos: ${ruta.cantidadAsientos}</h6>
  `;
  modalBody.innerHTML = contenidoModal;
};
document.addEventListener("DOMContentLoaded", ()=>{
  usuarioActivo = sessionStorage.getItem("usuarioActivo");
  const filtro = document.getElementById("formularioBusquedaRuta");
  if(filtro !==null){
    filtro.addEventListener("submit", (event)=>{
      event.preventDefault();
      console.log("JESNER");
      obtenerDatosFiltros();
    })
  }

  const botonComprarBoleto = document.getElementById("botonComprar");

  if(botonComprarBoleto){
    botonComprarBoleto.addEventListener("click", ()=>{

    });
  }

  const botonReservaBoleto = document.getElementById("botonReservar");
});

const obtenerDatosFiltros = () =>{
  const origen = document.getElementById("origen").value;
  const destino = document.getElementById("destino").value;
  const fecha = document.getElementById("fecha").value;
  const horario = document.getElementById("horario").value;
  console.log(origen+" - "+destino+" - "+fecha+" - "+horario)
  obtenerFiltros(origen, destino, fecha, horario);
}
//COMPRA Y RESERVA DE BOLETOS

const registrarCompra = (asiento, clase, fecha, numTarjeta, cvvTarjeta) => {

  const compra = {
    TipoServicio: clase,
    IdRuta: 0,
    PrecioBoleto: rutas.find(ruta => ruta.idRuta = IdRuta).PrecioBoleto,
    FechaTiquete: Date.toString(),
    IdNumeroAsiento: asiento,
    Asiento: null,
    "IdUsuario": 0,
    "Usuario": null
  };
  

  fetch(uri, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(compra)
  })
    .then(response => response.json())
    .then(() => {
      obtenerListaDeTareas();
      nuevaTareaInput.value = '';
    })
    .catch(error => console.error('No se ha podido agregar una tarea', error));
}
const obtenerDatosCompra=()=>{
  const asiento = document.getElementById("asientos").value;
  const clase = document.getElementById("clase").value;
  const fecha = document.getElementById("fecha");
  const numTarjeta = document.getElementById("numeroTarjeta");
  const cvvTarjeta = document.getElementById("cvv");
  realizarComprarBoleto(asiento, clase, fecha, numTarjeta, cvvTarjeta);
}



//onclick="obtenerFiltros()"








