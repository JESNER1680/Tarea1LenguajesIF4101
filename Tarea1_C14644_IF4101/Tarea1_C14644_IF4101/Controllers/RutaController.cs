using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Tarea1_C14644_IF4101.Models;
using Tarea1_IF4101_C14644.Models;

namespace Tarea1_IF4101_C14644.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RutaController : ControllerBase
    {
        private readonly DbDataContext _dbDataContext;

        public RutaController(DbDataContext dbDataContext)
        {
            _dbDataContext = dbDataContext;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Ruta>> GetRuta(int id)
        {
            var ruta = await _dbDataContext.Rutas.FindAsync(id);
            if (ruta == null)
            {
                return NotFound();
            }

            return ruta;
        }

        [HttpPost]
        public async Task<ActionResult<Ruta>> PostRuta(Ruta ruta)
        {
            _dbDataContext.Rutas.Add(ruta);
            await _dbDataContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetRuta), new { id = ruta.IdRuta }, ruta);
        }
        [HttpGet("detalle")]
        public async Task<ActionResult<IEnumerable<RutaDetalle>>> GetRutasConDetalle()
        {
            var rutas = await _dbDataContext.Rutas.ToListAsync();
            if (rutas == null || !rutas.Any())
            {
                return NotFound();
            }

            var rutasConDetalle = new List<RutaDetalle>();
            foreach (var ruta in rutas)
            {
                var rutaDetalle = new RutaDetalle
                {
                    Ruta = ruta,
                    Paradas = await _dbDataContext.ParadaRutas
                        .Where(pr => pr.IdRuta == ruta.IdRuta)
                        .Select(pr => pr.Parada)
                        .ToListAsync(),
                    Horarios = await _dbDataContext.Horarios
                        .Where(h => h.IdRuta == ruta.IdRuta)
                        .ToListAsync()
                };
                rutasConDetalle.Add(rutaDetalle);
            }

            return rutasConDetalle;
        }
        [HttpGet("Filtro")]
        public async Task<ActionResult<IEnumerable<object>>> GetRutasConFiltro(string? destino, string? origen, string? fecha, string? horario)
        {
            Console.WriteLine("VALORES: "+ destino, origen, fecha, horario); 
            var rutasConDetalleResult = await GetRutasConDetalle();
            if (rutasConDetalleResult == null)
            {
                return NotFound();
            }

            var rutasConDetalle = rutasConDetalleResult.Value;
            if (!string.IsNullOrEmpty(destino))
            {

                rutasConDetalle = rutasConDetalle
                    .Where(ruta => ruta.Paradas.Any(parada =>
                        parada.NombreParada == destino &&
                        _dbDataContext.ParadaRutas.Any(pr =>
                            pr.IdRuta == ruta.Ruta.IdRuta &&
                            pr.IdParada == parada.IdParada &&
                            pr.EsDestino)))
                    .ToList();
            }

            if (!string.IsNullOrEmpty(origen))
            {
                rutasConDetalle = rutasConDetalle
                    .Where(ruta => ruta.Paradas.Any(parada =>
                        parada.NombreParada == origen &&
                        _dbDataContext.ParadaRutas.Any(pr =>
                            pr.IdRuta == ruta.Ruta.IdRuta &&
                            pr.IdParada == parada.IdParada &&
                            pr.EsOrigen)))
                    .ToList();
            }

            if (!string.IsNullOrEmpty(fecha))
            {
                if (DateTime.TryParse(fecha, out DateTime fechaSeleccionada))
                {
                    rutasConDetalle = rutasConDetalle
                        .Where(ruta => ruta.Ruta.Fecha.Date == fechaSeleccionada.Date)
                        .ToList();
                }
            }

            if (!string.IsNullOrEmpty(horario))
            {
                rutasConDetalle = rutasConDetalle
                    .Where(ruta => ruta.Horarios.Any(h => h.HorarioText == horario))
                    .ToList();
            }

            if (string.IsNullOrEmpty(destino) && string.IsNullOrEmpty(origen) && string.IsNullOrEmpty(fecha) && string.IsNullOrEmpty(horario))
            {
                rutasConDetalle = rutasConDetalleResult.Value.ToList();
            }

            if (!rutasConDetalle.Any())
            {
                return NotFound();
            }
            var rutasConDetalleJSON = rutasConDetalle.Select(ruta =>
            {
                var paradas = ruta.Paradas.Select(parada => new
                {
                    parada.IdParada,
                    parada.NombreParada,
                    EsOrigen = _dbDataContext.ParadaRutas.Any(pr =>
                        pr.IdRuta == ruta.Ruta.IdRuta &&
                        pr.IdParada == parada.IdParada &&
                        pr.EsOrigen),
                    EsDestino = _dbDataContext.ParadaRutas.Any(pr =>
                        pr.IdRuta == ruta.Ruta.IdRuta &&
                        pr.IdParada == parada.IdParada &&
                        pr.EsDestino)
                });

                return new
                {
                    ruta.Ruta.IdRuta,
                    ruta.Ruta.CodigoRuta,
                    ruta.Ruta.NombreRuta,
                    ruta.Ruta.Fecha,
                    ruta.Ruta.Precio,
                    ruta.Ruta.Duracion,
                    ruta.Ruta.Kilometros,
                    ruta.Ruta.CantidadAsientos,
                    Paradas = paradas,
                    Horarios = ruta.Horarios.Select(horario => new
                    {
                        horario.IdHorario,
                        horario.HorarioText
                    })
                };
            });

            return Ok(rutasConDetalleJSON);
        }

    }
    public class RutaDetalle
    {
        public Ruta Ruta { get; set; }
        public List<Parada> Paradas { get; set; }
        public List<Horario> Horarios { get; set; }
    }

}
