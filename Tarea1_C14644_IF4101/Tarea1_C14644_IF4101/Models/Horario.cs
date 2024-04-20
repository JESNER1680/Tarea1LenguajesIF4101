using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tarea1_IF4101_C14644.Models
{
    public class Horario
    {
        [Key]
        public int IdHorario { get; set; }
        public string HorarioText { get; set; }

        public int IdRuta { get; set; }
        [ForeignKey("IdRuta")]
        public virtual Ruta Ruta { get; set; }
    }
}
