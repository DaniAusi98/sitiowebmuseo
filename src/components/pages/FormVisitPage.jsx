import React from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";

import { useAuth } from "../../auth/auth-ctx";

export const FormVisitPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          mb: 3,
          mt: 4,
          flexWrap: "wrap",
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: "bold",
            mb: 0,
          }}
        >
          Visitas
        </Typography>

        <Button
          component={Link}
          to={isAuthenticated ? "/reservations" : "/signIn"}
          variant="contained"
          sx={{
            px: 3,
            py: 1,
            borderRadius: 2,
            fontWeight: "bold",
            backgroundColor: "primary.main",
            color: "primary.contrastText",
            textTransform: "none",
            boxShadow: 1,
            "&:hover": {
              backgroundColor: "primary.dark",
            },
          }}
        >
          Mis reservas
        </Button>
      </Box>

      <Typography
        sx={{
          fontSize: "18px",
          mb: 6,
        }}
      >
        Para visitar la exhibición permanente y la sala de muestras temporales,
        seleccioná el tipo de visita que deseás realizar. Podés visitar el museo
        de forma autónoma o solicitar una visita grupal guiada, destinada a
        instituciones educativas y otros grupos.
      </Typography>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              borderRadius: 0,
            }}
          >
            <CardMedia
              component="img"
              height="250"
              image="/visitas-guiadas-img.jpg"
              alt="Visitas guiadas"
            />

            <CardContent>
              <Typography variant="h4" fontWeight="bold" mb={2}>
                Visitas Guiadas
              </Typography>

              <Typography sx={{ mb: 3 }}>
                Recorridos acompañados por el Área Educación del museo.
              </Typography>

              <Button
                component={Link}
                to="/visitas/guiada"
                variant="contained"
                sx={{ borderRadius: 1 }}
              >
                Seleccionar
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              borderRadius: 0,
            }}
          >
            <CardMedia
              component="img"
              height="250"
              image="/visitas-individuales.webp"
              alt="Visitas autoguiadas"
            />

            <CardContent>
              <Typography variant="h4" fontWeight="bold" mb={2}>
                Visitas Autoguiadas
              </Typography>

              <Typography sx={{ mb: 3 }}>
                Recorridos libres para grupos sin acompañamiento educativo.
              </Typography>

              <Button
                component={Link}
                to="/visitas/autoguiada"
                variant="contained"
                sx={{ borderRadius: 1 }}
              >
                Seleccionar
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};
