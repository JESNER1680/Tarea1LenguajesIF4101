using Microsoft.EntityFrameworkCore;
using Tarea1_IF4101_C14644.Models;

namespace Tarea1_C14644_IF4101.Models
{
    public class DbDataContext : DbContext
    {
        public DbDataContext(DbContextOptions<DbDataContext> options) : base(options)
        {
        }

        public DbSet<Asiento> Asientos { get; set; }
        public DbSet<Boleto> Boletos { get; set; }
        public DbSet<Compra> Compras { get; set; }
        public DbSet<Horario> Horarios { get; set; }
        public DbSet<Parada> Paradas { get; set; }
        public DbSet<Ruta> Rutas { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<ParadaRuta> ParadaRutas { get; set; }
    }
}
