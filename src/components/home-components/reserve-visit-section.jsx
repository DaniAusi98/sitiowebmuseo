import { Box, Typography } from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { Link } from "react-router-dom";

export default function BannerReserva() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "280px",
        backgroundImage: "url('/visitas-guiadas-img.jpg')",
        mt: "30px",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          padding: 4,
          borderRadius: 2,
          textAlign: "center",
          boxShadow: 3,
          minWidth: "320px",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            mb: 2,
          }}
        >
          Visitas Grupales
        </Typography>
        <Typography variant="body2">
          Destinada a escuelas y grupos afines
        </Typography>

        <Box
          component={Link}
          to="/visitanos"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            mt: 1,
            textDecoration: "none",
            color: "inherit",
            transition: "0.2s",
            "&:hover": {
              transform: "scale(1.03)",
            },
          }}
        >
          <EventAvailableIcon />

          <Typography
            variant="body2"
            color="primary"
            sx={{ fontWeight: "bold" }}
          >
            Reserva tu visita
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
