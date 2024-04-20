using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using Tarea1_C14644_IF4101.Models;
using Tarea1_IF4101_C14644.Models;

namespace Tarea1_IF4101_C14644.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompraController : ControllerBase
    {
        private readonly DbDataContext _dbDataContext;

        public CompraController(DbDataContext dbDataContext)
        {
            _dbDataContext = dbDataContext;
        }

        [HttpPost]
        public async Task<ActionResult> PostCompra(string tipoServicio, string IdRuta, string PrecioBoleto, string fechatiquete, string idNumeroAsiento, string IdUsuario)
        {
            try
            {
                var asiento = await _dbDataContext.Asientos.FirstOrDefaultAsync(a => a.IdRuta == int.Parse(IdRuta) && a.NumeroAsiento == int.Parse(idNumeroAsiento) && a.DisponibilidadAsiento);

                if (asiento == null)
                {
                    return NotFound("No se encontró el asiento especificado.");
                }

                var boleto = new Boleto
                {
                    TipoServicio = tipoServicio,
                    IdRuta = int.Parse(IdRuta),
                    PrecioBoleto = int.Parse(PrecioBoleto),
                    FechaTiquete = DateTime.Parse(fechatiquete),
                    IdNumeroAsiento = asiento.IdAsiento,
                    IdUsuario = int.Parse(IdUsuario)
                };
                asiento.EstadoAsiento = false;
                asiento.DisponibilidadAsiento = false;
                _dbDataContext.Boletos.Add(boleto);
                await _dbDataContext.SaveChangesAsync();
                var ultimoBoleto = await _dbDataContext.Boletos.OrderByDescending(b => b.IdBoleto).FirstOrDefaultAsync();

                if (ultimoBoleto != null)
                {
                    var compra = new Compra
                    {
                        IdUsuario = int.Parse(IdUsuario),
                        IdBoleto = ultimoBoleto.IdBoleto
                    };
                    _dbDataContext.Compras.Add(compra);
                    await _dbDataContext.SaveChangesAsync();
                }

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
    }
}
