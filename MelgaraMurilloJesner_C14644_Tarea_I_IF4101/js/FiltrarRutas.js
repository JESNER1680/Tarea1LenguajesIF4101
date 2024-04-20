let rutas = [];
let horarios = [];
let paradas = [];
let paradaRutas = [];
let usuarioActivo = null;
let asientos = [];
let contador = 0;
let rutaActual = null;
let compraHecha = false;
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

const obtenerAsientos = async () => {
  try {
    const uri = 'http://localhost:5104/api/Asiento';
    const response = await fetch(uri);

    if (!response.ok) {
      throw new Error('Error al obtener los asientos');
    }

    const data = await response.json();
    asientos = convertirJSONAsientos(data);
    return asientos;
  } catch (error) {
    console.error('No se puede obtener el listado de asientos.', error);
    throw error;
  }
}

const convertirJSONAsientos = (data) => {
  if (!Array.isArray(data)) {
    throw new Error('Los datos no son un arreglo');
  }

  return data.map(objetoAsiento => {
    return {
      idAsiento: objetoAsiento.idAsiento,
      idRuta: objetoAsiento.idRuta,
      numeroAsiento: objetoAsiento.numeroAsiento,
      disponibilidadAsiento: objetoAsiento.disponibilidadAsiento,
      estadoAsiento: objetoAsiento.estadoAsiento
    };
  });
};


const obtenerRutasConFiltro = async (destino, origen, fecha, horario) => {
  try {
    obtenerAsientos();
      let uri = 'http://localhost:5104/api/Ruta/Filtro';

      uri += `?destino=${encodeURIComponent(destino)}&`;
      uri += `origen=${encodeURIComponent(origen)}&`;
      uri += `fecha=${encodeURIComponent(fecha)}&`;
      uri += `horario=${encodeURIComponent(horario)}`;

      const response = await fetch(uri, {
        method: 'GET'
      });
      
      if (!response.ok) {
          throw new Error('Error en la solicitud');
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data)) {
          throw new Error('Los datos recibidos no son un arreglo');
      }
      const rutas = convertirJsonARutas(data);
      localStorage.setItem('rutas', JSON.stringify(rutas));
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
  const rutasFromLocalStorage = JSON.parse(localStorage.getItem('rutas'));

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
          comprarButton.value = ruta.idRuta;
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
  rutaActual = ruta.idRuta;

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
  usuarioActivo = JSON.parse(sessionStorage.getItem("usuarioActivo"));
  const filtro = document.getElementById("formularioBusquedaRuta");
  if(filtro !==null){
    filtro.addEventListener("submit", (event)=>{
      event.preventDefault();
      obtenerDatosFiltros();
    })
  }

  const botonComprarBoleto = document.getElementById("botonComprar");

  if(botonComprarBoleto){
    botonComprarBoleto.addEventListener("click", ()=>{
      obtenerDatosCompra();
    });
  }
  const checkBox = document.getElementById("checkImprimir");

checkBox.addEventListener("change", function() {
    if (this.checked) {
        compraHecha = true;
    } else {
        compraHecha = false;
    }
});
});

const obtenerDatosFiltros = () =>{
  const origen = document.getElementById("origen").value;
  const destino = document.getElementById("destino").value;
  const fecha = document.getElementById("fecha").value;
  const horario = document.getElementById("horario").value;
  console.log(origen+" - "+destino+" - "+fecha+" - "+horario)
  obtenerFiltros(origen, destino, fecha, horario);
}

const registrarCompra = async (asiento, clase, fecha) => {
  let rutaEncontrada = null;
  let numeroAsiento1 = 0;

  try {
    const asientoEncontrado = asientos.find(a => a.numeroAsiento === asiento && a.idRuta === rutaActual);
    if (!asientoEncontrado) {
      throw new Error('El asiento no fue encontrado');
    }
    numeroAsiento1 = asientoEncontrado.numeroAsiento;
    rutaEncontrada = rutas.find(ruta => ruta.idRuta === parseInt(rutaActual));
    let uriComprar = 'http://localhost:5104/api/Compra';
    uriComprar += `?tipoServicio=${encodeURIComponent(clase)}&`;
    uriComprar += `IdRuta=${encodeURIComponent(rutaActual)}&`;
    uriComprar += `PrecioBoleto=${encodeURIComponent(rutaEncontrada.precio)}&`;
    uriComprar += `fechatiquete=${encodeURIComponent("19/04/2024")}&`;
    uriComprar += `idNumeroAsiento=${encodeURIComponent(""+asientoEncontrado.numeroAsiento)}&`;
    uriComprar += `IdUsuario=${encodeURIComponent(""+usuarioActivo.idUsuario)}`;

    const response = await fetch(uriComprar, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      alert("No se pudo realizar la compra");
    } else {
      alert("Compra Realizada");
      enviarCorreo(clase, fecha, rutaEncontrada, numeroAsiento1);
      if (compraHecha === true) {
        generarPDF(clase, fecha, rutaEncontrada, numeroAsiento1);
      }
      limpiarInputs();
    }
  } catch (error) {
    alert("No se pudo realizar la compra");
  }
}

const obtenerDatosCompra=()=>{
  const valorAsientosNumerico = parseInt(document.getElementById("asientos").value);
  const clase = document.getElementById("clase").value;
  const fecha = document.getElementById("fecha").value;
  registrarCompra(valorAsientosNumerico, clase, fecha);
}

const compra = () =>{
  
}

const limpiarInputs = () =>{
  const campos = document.querySelectorAll("#asientos, #fecha, #numeroTarjeta, #cvv");
  campos.forEach((campo) => campo.value = "");
}

function generarPDF(clase, fecha, ruta, numeroAsiento) {
  const detalles = `
      Clase: ${clase}<br>
      Fecha: ${fecha}<br>
          Código: ${ruta.codigoRuta}<br>
          Nombre: ${ruta.nombreRuta}<br>
          Fecha: ${ruta.fecha}<br>
          Precio: ${ruta.precio}<br>
          Duración: ${ruta.duracion}<br>
          Kilómetros: ${ruta.kilometros}<br>
          Paradas: ${ruta.paradas.map(parada => parada.nombreParada).join(', ')}<br>
          Horarios: ${ruta.horarios.map(horario => horario.horarioText).join(', ')}<br>
      Número de Asiento: ${numeroAsiento}
  `;


  const canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 200; 
  const QR = new QRCode(canvas);
  QR.makeCode(`${ruta.idRuta}-${ruta.fecha}-${ruta.horarios[0].horarioText}`);

  const contenidoPDF = `
  <div style="font-family: Arial, sans-serif; margin-bottom: 20px;">
    <div style="font-weight: bold; font-size: 18px; margin-bottom: 10px;">Detalles:</div>
    <div style="margin-bottom: 10px;">${detalles}</div>
  </div>
  <div id="qrcode" style="margin-top: 20px;"></div>
`;


  const ventanaImpresion = window.open('', '_blank');

  ventanaImpresion.document.write("<h1>Autobuses los panchos</h1>");
  ventanaImpresion.document.write(contenidoPDF);
      const qrcodeDiv = ventanaImpresion.document.getElementById('qrcode');

    const texto = `${ruta.idRuta}-${ruta.fecha}-${ruta.horarios[0].horarioText}`;

    const qr = new QRCode(qrcodeDiv, {
      text: texto,
      width: 128,
      height: 128,
    });
    

  ventanaImpresion.print();

  ventanaImpresion.close();
}

const enviarCorreo = (clase, fecha, ruta, numeroAsiento) => {
  emailjs.init('-PWWWHrCMozno8jkT');
  const detallesBoleto = {
    clase: clase,
    fecha: fecha,
    codigoRuta: ruta.codigoRuta,
    nombreRuta: ruta.nombreRuta,
    fechaRuta: ruta.fecha,
    precioRuta: ruta.precio,
    duracionRuta: ruta.duracion,
    kilometrosRuta: ruta.kilometros,
    paradasRuta: ruta.paradas.map(parada => parada.nombreParada).join(', '),
    horariosRuta: ruta.horarios.map(horario => horario.horarioText).join(', '),
    numeroAsiento: numeroAsiento,
    to: usuarioActivo.correoElectronico 
  };

  emailjs.send("service_ns8gpvq", "template_jcyr4vd", detallesBoleto)
    .then(function(response) {
      console.log("Correo enviado con éxito:", response);
      alert("¡Datos enviados correctamente!");
    })
    .catch(function(error) {
      console.error("Error al enviar correo:", error);
      alert("¡Ocurrió un error al enviar los datos!");
    });
};

