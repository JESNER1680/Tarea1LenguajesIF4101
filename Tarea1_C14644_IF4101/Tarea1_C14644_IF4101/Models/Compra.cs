using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tarea1_IF4101_C14644.Models
{
    public class Compra
    {
        [Key]
        public int Id { get; set; }

        public int IdUsuario { get; set; }

        [ForeignKey("IdUsuario")]
        public virtual Usuario Usuario { get; set; }

        public int IdBoleto { get; set; }

    }
}
