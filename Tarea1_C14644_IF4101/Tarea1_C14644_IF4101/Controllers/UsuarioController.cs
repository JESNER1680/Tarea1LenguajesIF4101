using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tarea1_C14644_IF4101.Models;
using Tarea1_IF4101_C14644.Models;

namespace Tarea1_IF4101_C14644.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        private readonly DbDataContext _dbDataContext;

        public UsuarioController(DbDataContext dbDataContext)
        {
            _dbDataContext = dbDataContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Usuario>>> GetUsuarios()
        {
            var usuarios = await _dbDataContext.Usuarios.ToListAsync();
            if (usuarios == null || usuarios.Count == 0)
            {
                return NotFound();
            }
            return usuarios;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Usuario>> GetUsuario(int id)
        {
            var usuario = await _dbDataContext.Usuarios.FindAsync(id);
            if (usuario == null)
            {
                return NotFound();
            }
            return usuario;
        }

        [HttpPost]
        public async Task<ActionResult<Usuario>> PostUsuario(Usuario usuario)
        {
            _dbDataContext.Usuarios.Add(usuario);
            await _dbDataContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUsuario), new { id = usuario.IdUsuario }, usuario);
        }

        private bool UsuarioExists(int id)
        {
            return _dbDataContext.Usuarios.Any(e => e.IdUsuario == id);
        }
    }
}
