using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tarea1C14644IF4101.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Asientos",
                columns: table => new
                {
                    IdAsiento = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdRuta = table.Column<int>(type: "int", nullable: false),
                    NumeroAsiento = table.Column<int>(type: "int", nullable: false),
                    DisponibilidadAsiento = table.Column<bool>(type: "bit", nullable: false),
                    EstadoAsiento = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Asientos", x => x.IdAsiento);
                });

            migrationBuilder.CreateTable(
                name: "Paradas",
                columns: table => new
                {
                    IdParada = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NombreParada = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Paradas", x => x.IdParada);
                });

            migrationBuilder.CreateTable(
                name: "Rutas",
                columns: table => new
                {
                    IdRuta = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CodigoRuta = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NombreRuta = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Fecha = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Precio = table.Column<float>(type: "real", nullable: false),
                    Duracion = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Kilometros = table.Column<int>(type: "int", nullable: false),
                    CantidadAsientos = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rutas", x => x.IdRuta);
                });

            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    IdUsuario = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NombrePersona = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    cedula = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NombreUsuario = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Contrasennia = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CorreoElectronico = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    tarjetaCredito = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CVV = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UsuarioEspecial = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.IdUsuario);
                });

            migrationBuilder.CreateTable(
                name: "Horarios",
                columns: table => new
                {
                    IdHorario = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HorarioText = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IdRuta = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Horarios", x => x.IdHorario);
                    table.ForeignKey(
                        name: "FK_Horarios_Rutas_IdRuta",
                        column: x => x.IdRuta,
                        principalTable: "Rutas",
                        principalColumn: "IdRuta",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ParadaRutas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdRuta = table.Column<int>(type: "int", nullable: false),
                    IdParada = table.Column<int>(type: "int", nullable: false),
                    EsOrigen = table.Column<bool>(type: "bit", nullable: false),
                    EsDestino = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ParadaRutas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ParadaRutas_Paradas_IdParada",
                        column: x => x.IdParada,
                        principalTable: "Paradas",
                        principalColumn: "IdParada",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ParadaRutas_Rutas_IdRuta",
                        column: x => x.IdRuta,
                        principalTable: "Rutas",
                        principalColumn: "IdRuta",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Boletos",
                columns: table => new
                {
                    IdBoleto = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TipoServicio = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IdRuta = table.Column<int>(type: "int", nullable: false),
                    PrecioBoleto = table.Column<int>(type: "int", nullable: false),
                    FechaTiquete = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IdNumeroAsiento = table.Column<int>(type: "int", nullable: false),
                    IdUsuario = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Boletos", x => x.IdBoleto);
                    table.ForeignKey(
                        name: "FK_Boletos_Asientos_IdNumeroAsiento",
                        column: x => x.IdNumeroAsiento,
                        principalTable: "Asientos",
                        principalColumn: "IdAsiento",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Boletos_Rutas_IdRuta",
                        column: x => x.IdRuta,
                        principalTable: "Rutas",
                        principalColumn: "IdRuta",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Boletos_Usuarios_IdUsuario",
                        column: x => x.IdUsuario,
                        principalTable: "Usuarios",
                        principalColumn: "IdUsuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Compras",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdUsuario = table.Column<int>(type: "int", nullable: false),
                    IdBoleto = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Compras", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Compras_Usuarios_IdUsuario",
                        column: x => x.IdUsuario,
                        principalTable: "Usuarios",
                        principalColumn: "IdUsuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Boletos_IdNumeroAsiento",
                table: "Boletos",
                column: "IdNumeroAsiento");

            migrationBuilder.CreateIndex(
                name: "IX_Boletos_IdRuta",
                table: "Boletos",
                column: "IdRuta");

            migrationBuilder.CreateIndex(
                name: "IX_Boletos_IdUsuario",
                table: "Boletos",
                column: "IdUsuario");

            migrationBuilder.CreateIndex(
                name: "IX_Compras_IdUsuario",
                table: "Compras",
                column: "IdUsuario");

            migrationBuilder.CreateIndex(
                name: "IX_Horarios_IdRuta",
                table: "Horarios",
                column: "IdRuta");

            migrationBuilder.CreateIndex(
                name: "IX_ParadaRutas_IdParada",
                table: "ParadaRutas",
                column: "IdParada");

            migrationBuilder.CreateIndex(
                name: "IX_ParadaRutas_IdRuta",
                table: "ParadaRutas",
                column: "IdRuta");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Boletos");

            migrationBuilder.DropTable(
                name: "Compras");

            migrationBuilder.DropTable(
                name: "Horarios");

            migrationBuilder.DropTable(
                name: "ParadaRutas");

            migrationBuilder.DropTable(
                name: "Asientos");

            migrationBuilder.DropTable(
                name: "Usuarios");

            migrationBuilder.DropTable(
                name: "Paradas");

            migrationBuilder.DropTable(
                name: "Rutas");
        }
    }
}
