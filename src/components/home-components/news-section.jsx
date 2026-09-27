import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

const noticias = [
  {
    id: 1,
    titulo: "Taller de cerámica ancestral",
    fecha: "13 mayo 2026",
    resumen:
      "El museo realizará un taller abierto destinado a estudiantes y público general para conocer técnicas tradicionales de cerámica utilizadas por pueblos originarios.",
    imagen: "/imagenes/noticia1.jpg",
  },
  {
    id: 2,
    titulo: "Nueva muestra fotográfica",
    fecha: "10 mayo 2026",
    resumen:
      "La exposición reúne registros históricos y contemporáneos sobre comunidades indígenas de América Latina y su vínculo con el territorio.",
    imagen: "/imagenes/noticia2.jpg",
  },
  {
    id: 3,
    titulo: "Conferencia sobre patrimonio",
    fecha: "8 mayo 2026",
    resumen:
      "Especialistas de distintas universidades participarán de un encuentro interdisciplinario sobre conservación patrimonial y archivos culturales.",
    imagen: "/imagenes/noticia3.jpg",
  },
  {
    id: 4,
    titulo: "Actividades para escuelas",
    fecha: "5 mayo 2026",
    resumen:
      "El área de educación presentó nuevas propuestas pedagógicas para instituciones educativas de distintos niveles.",
    imagen: "/imagenes/noticia4.jpg",
  },
  {
    id: 5,
    titulo: "Archivo audiovisual digital",
    fecha: "2 mayo 2026",
    resumen:
      "Se incorporaron nuevos materiales audiovisuales al archivo digital del museo para consulta pública e investigación.",
    imagen: "/imagenes/noticia5.jpg",
  },
];

export default function NoticiasHome() {
  return (
    <Box
      sx={{
        py: 6,
        px: { xs: 2, md: 6 },
      }}
    >
      {/* TITULO */}
      <Box
        sx={{
          textAlign: "center",
          mb: 5,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            mb: 2,
          }}
        >
          Noticias
        </Typography>

        <Typography
          variant="body1"
          sx={{
            maxWidth: 700,
            mx: "auto",
            color: "text.secondary",
          }}
        >
          Últimas novedades, actividades y propuestas del Museo de
          Antropologías.
        </Typography>
      </Box>

      {/* GRID */}
      <Grid container spacing={3}>
        {noticias.map((noticia) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={noticia.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 0,
                transition: "0.2s",

                "&:hover": {
                  transform: "translateY(-4px)",
                },
              }}
            >
              {/* IMAGEN */}
              <CardMedia
                component="img"
                height="220"
                image={noticia.imagen}
                alt={noticia.titulo}
              />

              {/* CONTENIDO */}
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                }}
              >
                {/* TITULO */}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  {noticia.titulo}
                </Typography>

                {/* FECHA */}
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    mb: 2,
                  }}
                >
                  {noticia.fecha}
                </Typography>

                {/* RESUMEN */}
                <Typography
                  variant="body2"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    mb: 3,
                  }}
                >
                  {noticia.resumen}
                </Typography>

                {/* LEER MAS */}
                <Box sx={{ mt: "auto" }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Leer más →
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
