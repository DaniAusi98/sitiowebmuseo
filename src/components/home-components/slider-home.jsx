import { useEffect, useState } from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { Link } from "react-router-dom";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const images = ["/hero1.jpg", "/hero2.jpg", "/hero3.jpg"];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        height: 600,
        overflow: "hidden",
      }}
    >
      {images.map((img, index) => (
        <Box
          key={index}
          sx={{
            position: "absolute",
            inset: 0,
            opacity: current === index ? 1 : 0,
            transition: "opacity 1s ease",
            backgroundImage: `url(${img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ))}

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: "rgba(0,0,0,0.4)",
        }}
      />

      <IconButton
        onClick={() =>
          setCurrent((prev) => (prev - 1 + images.length) % images.length)
        }
        sx={{
          position: "absolute",
          left: 16,
          top: "50%",
          transform: "translateY(-50%)",
          color: "white",
          zIndex: 3,
        }}
      >
        <ChevronLeftIcon />
      </IconButton>

      <IconButton
        onClick={() => setCurrent((prev) => (prev + 1) % images.length)}
        sx={{
          position: "absolute",
          right: 16,
          top: "50%",
          transform: "translateY(-50%)",
          color: "white",
          zIndex: 3,
        }}
      >
        <ChevronRightIcon />
      </IconButton>

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          pb: 2,
          color: "white",
        }}
      >
        <Button
          variant="contained"
          size="large"
          component={Link}
          to="/visitanos"
          sx={{ mb: 4 }}
        >
          Reserva tu visita
        </Button>
      </Box>
    </Box>
  );
}
