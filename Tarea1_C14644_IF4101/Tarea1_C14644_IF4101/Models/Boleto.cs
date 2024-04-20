using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tarea1_IF4101_C14644.Models
{
    public class Boleto
    {
        [Key]
        public int IdBoleto { get; set; }
        public string TipoServicio { get; set; }
        public int IdRuta { get; set; }
        [ForeignKey("IdRuta")]
        public virtual Ruta Ruta { get; set; }
        public int PrecioBoleto { get; set; }
        public DateTime FechaTiquete { get; set; }
        public int IdNumeroAsiento { get; set; }
        [ForeignKey("IdNumeroAsiento")]
        public virtual Asiento Asiento { get; set; }
        public int IdUsuario { get; set; }
        [ForeignKey("IdUsuario")]
        public virtual Usuario Usuario { get; set; }
    }
}
