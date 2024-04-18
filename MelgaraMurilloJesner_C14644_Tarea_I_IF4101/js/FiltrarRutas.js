let rutas = [];
let horarios = [];
let paradas = [];
let paradaRutas = [];
let usuarioActivo = null;

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

const obtenerRutas = () => {
    const uri = 'http://localhost:5104/api/Ruta/Filtro';
    fetch(uri)
      .then(response => response.json())
      .then(data => {
        rutas = convertirJsonARutas(data);
        console.log('Rutas obtenidas:', rutas);
      })
      .catch(error => console.error('Error al obtener las rutas:', error));
  };
  
  const convertirJsonARutas = (data) => {
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
  const tablaFiltro = document.getElementById("contenido-tabla");
  if(tablaFiltro){
      tablaFiltro.innerHTML = '';
      rutas.forEach(ruta =>{
          let tr = tablaFiltro.insertRow();
          let tdNombreRuta = tr.insertCell(0);
          let nombreRuta = document.createTextNode(ruta.nombreRuta);
          tdNombreRuta.appendChild(nombreRuta);

          let tdOrigen = tr.insertCell(1);
          let origen = document.createTextNode(ruta.paradas.find(parada => parada.esOrigen===true).nombreParada);
          tdOrigen.appendChild(origen);

          let tdDestino = tr.insertCell(2);
          let destino = document.createTextNode(ruta.paradas.find(parada => parada.esDestino === true).nombreParada);
          tdDestino.appendChild(destino);

          let tdFecha = tr.insertCell(3);
          let fecha = document.createTextNode(ruta.fecha.toDateString());
          tdFecha.appendChild(fecha);

          let tdHorario = tr.insertCell(4);
          let horarios = ruta.horarios.map(horario => horario.horarioText).join(', ');
          let horarioText = document.createTextNode(horarios);
          tdHorario.appendChild(horarioText);

          let tdDetalle = tr.insertCell(5);
          let detalleButton = document.createElement('button');
          detalleButton.textContent = 'Detalles';
          detalleButton.addEventListener('click', () => mostrarDetalles(ruta));
          tdDetalle.appendChild(detalleButton);

          let tdComprar = tr.insertCell(6);
          let comprarButton = document.createElement('button');
          comprarButton.textContent = 'Comprar';
          comprarButton.addEventListener('click', () => comprarRuta(ruta));
          tdComprar.appendChild(comprarButton);
      }); 
  }
};

const mostrarDetalles = (ruta) => {
  // Aquí puedes implementar la lógica para mostrar los detalles de la ruta en algún elemento de tu página
  console.log('Detalles de la ruta:', ruta);
};

const comprarRuta = (ruta) => {
  // Aquí puedes implementar la lógica para realizar la compra de la ruta
  console.log('Compra de la ruta:', ruta);
};



document.addEventListener('DOMContentLoaded', () => {
  const botonFiltrar = document.getElementById("botonBusqueda");
  if (botonFiltrar) {
    console.log("HOLA");
    botonFiltrar.addEventListener('click', () => {
      mostrarTareasEnTabla();
    });
  }
});



