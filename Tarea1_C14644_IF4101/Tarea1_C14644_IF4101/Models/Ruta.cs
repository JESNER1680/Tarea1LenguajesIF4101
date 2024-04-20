using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Tarea1_IF4101_C14644.Models
{
    public class Ruta
    {
        [Key]
        public int IdRuta { get; set; }
        public string? CodigoRuta { get; set; }
        public string? NombreRuta { get; set; }
        public DateTime Fecha { get; set; }
        public float Precio { get; set; }
        public string? Duracion { get; set; }
        public int Kilometros { get; set; }
        public int CantidadAsientos { get; set; }
    }
}
