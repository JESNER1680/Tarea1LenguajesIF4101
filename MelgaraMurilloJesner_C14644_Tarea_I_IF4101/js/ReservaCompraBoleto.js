// Función para actualizar la información de la carta
function updateCardDetails(details) {
    document.getElementById('ticketDate').textContent = 'Fecha de Tiquete: ' + details.ticketDate;
    document.getElementById('travelDate').textContent = 'Fecha de Viaje: ' + details.travelDate;
    document.getElementById('routeCode').textContent = 'Código de Ruta: ' + details.routeCode;
    document.getElementById('routeName').textContent = 'Nombre de Ruta: ' + details.routeName;
    document.getElementById('ticketQuantity').textContent = 'Cantidad de Tiquetes: ' + details.ticketQuantity;
    document.getElementById('totalPrice').textContent = 'Precio Total con IVA: ' + details.totalPrice;
    document.getElementById('qrCodeImage').src = details.qrCodeImage;
}

// Ejemplo de uso:
// Supongamos que tienes un objeto con los detalles del tiquete
var ticketDetails = {
    ticketDate: '13/04/2024',
    travelDate: '20/04/2024',
    routeCode: 'ABC123',
    routeName: 'Tokyo - Kyoto',
    ticketQuantity: '2',
    totalPrice: '¥12,000',
    qrCodeImage: 'ruta-a-tu-imagen-qr.jpg' // Asegúrate de reemplazar esto con la ruta real
};

// Actualizar la carta con los detalles del tiquete
updateCardDetails(ticketDetails);
