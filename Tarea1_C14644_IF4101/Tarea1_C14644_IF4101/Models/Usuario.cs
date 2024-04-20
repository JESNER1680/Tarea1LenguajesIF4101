using System.ComponentModel.DataAnnotations;

namespace Tarea1_IF4101_C14644.Models
{
    public class Usuario
    {
        [Key]
        public int IdUsuario { get; set; }
        public string? NombrePersona { get; set; }
        public string? cedula { get; set; }
        public string? NombreUsuario { get; set; }
        public string? Contrasennia { get; set; }
        public string? CorreoElectronico { get; set; }
        public string? tarjetaCredito { get; set; }
        public string? CVV { get; set; }
        public bool UsuarioEspecial { get; set; }
    }
}
