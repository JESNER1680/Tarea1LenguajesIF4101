using System.ComponentModel.DataAnnotations;

namespace Tarea1_IF4101_C14644.Models
{
    public class Parada
    {
        [Key]
        public int IdParada { get; set; }
        public string? NombreParada { get; set; }

    }
}
