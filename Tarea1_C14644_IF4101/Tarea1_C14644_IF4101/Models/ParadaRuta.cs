using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tarea1_IF4101_C14644.Models
{
    public class ParadaRuta
    {
        [Key]
        public int Id { get; set; }

        public int IdRuta { get; set; }

        [ForeignKey("IdRuta")]
        public virtual Ruta Ruta { get; set; }

        public int IdParada { get; set; }

        [ForeignKey("IdParada")]
        public virtual Parada Parada { get; set; }

        public bool EsOrigen { get; set; }

        public bool EsDestino { get; set; }
    }
}
