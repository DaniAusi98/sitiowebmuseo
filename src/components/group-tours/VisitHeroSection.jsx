import { Box, Container, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export default function VisitHeroSection() {
  const heroImage = "/visitanosHero.jpg";

  return (
    <Box
      sx={{
        position: "relative",
        height: "600px",
        width: "100%",
        backgroundImage: `url(${heroImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Overlay oscuro */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
        }}
      />

      {/* Contenido */}
      <Container
        sx={{
          position: "relative",
          zIndex: 1,
          color: "white",
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: "50px",
            fontWeight: "bold",
            mb: 2,
          }}
        >
          Visítanos
        </Typography>

        <Typography
          sx={{
            fontSize: "18px",
            mb: 2,
          }}
        >
          Museo de Antropología - UNC
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <LocationOnIcon
            sx={{
              fontSize: 32,
              color: "#f87171",
            }}
          />

          <Typography
            sx={{
              fontSize: "30px",
            }}
          >
            Av. Hipólito Yrigoyen 174, Córdoba
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
