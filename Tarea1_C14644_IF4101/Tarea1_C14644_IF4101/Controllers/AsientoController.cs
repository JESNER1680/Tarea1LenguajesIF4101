using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Tarea1_C14644_IF4101.Models;
using Tarea1_IF4101_C14644.Models;

namespace Tarea1_IF4101_C14644.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AsientoController : ControllerBase
    {
        private readonly DbDataContext _dbDataContext;

        public AsientoController(DbDataContext dbDataContext)
        {
            _dbDataContext = dbDataContext;
        }
        [HttpGet]
        public ActionResult<IEnumerable<Asiento>> GetAsientos()
        {
            var asientos = _dbDataContext.Asientos.ToList();
            return asientos;
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Asiento>> GetAsiento(int id)
        {
            var asiento = await _dbDataContext.Asientos.FindAsync(id);
            if (asiento == null)
            {
                return NotFound();
            }
            return asiento;
        }

        [HttpPost]
        public async Task<ActionResult<Asiento>> PostAsiento(Asiento asiento)
        {
            _dbDataContext.Asientos.Add(asiento);
            await _dbDataContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAsiento), new { id = asiento.IdAsiento }, asiento);
        }
        private bool AsientoExists(int id)
        {
            return _dbDataContext.Asientos.Any(e => e.IdAsiento == id);
        }
    }
}
