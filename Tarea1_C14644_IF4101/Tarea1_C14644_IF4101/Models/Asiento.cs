using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tarea1_IF4101_C14644.Models
{
    public class Asiento
    {
        [Key]
        public int IdAsiento { get; set; }
        public int IdRuta {  get; set; }
        [ForeignKey(nameof(IdRuta))]
        public int NumeroAsiento { get; set; }
        public bool DisponibilidadAsiento { get; set; }
        public bool EstadoAsiento { get; set; }


    }
}
