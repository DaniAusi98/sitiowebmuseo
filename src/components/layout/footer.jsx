import {
  Box,
  Container,
  Typography,
  Link,
  Stack,
  IconButton,
} from "@mui/material";

import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import EmailIcon from "@mui/icons-material/Email";
import { YouTube } from "@mui/icons-material";

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
        mt: 8,
      }}
    >
      {/* TOP */}
      <Container
        maxWidth={true}
        sx={{
          px: { xs: 2, md: 7 },
          py: { xs: 6, md: 8 },
        }}
      >
        <Box
          component="img"
          src="tira-de-logos.png"
          alt="tira-de-logos"
          sx={{
            width: 300,
          }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            gap: { xs: 6, md: 4 },
          }}
        >
          {/* LOGO + INFO 
          
          
          
          */}

          {/* COLUMNAS */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: { xs: 6, md: 10 },
            }}
          >
            {/* CONTACTO */}
            <Stack spacing={1.5}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Contacto
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Av. Hipólito Yrigoyen 174
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Córdoba, Argentina
              </Typography>

              <Typography variant="body2" color="text.secondary">
                museo@unc.edu.ar
              </Typography>

              <Stack direction="row" spacing={1}>
                <IconButton sx={{ p: 0, color: "common.black" }}>
                  <FacebookIcon />
                </IconButton>

                <IconButton sx={{ p: 0, color: "common.black" }}>
                  <InstagramIcon />
                </IconButton>

                <IconButton sx={{ p: 0, color: "common.black" }}>
                  <EmailIcon />
                </IconButton>

                <IconButton sx={{ p: 0, color: "common.black" }}>
                  <YouTube />
                </IconButton>
              </Stack>
            </Stack>

            {/* HORARIOS */}
            <Stack spacing={1.5}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Horarios
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Lunes a Viernes
              </Typography>

              <Typography variant="body2" color="text.secondary">
                9:00 a 18:00 hs
              </Typography>
            </Stack>
            {/* NAVEGACIÓN */}
            <Stack spacing={1.5}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Navegación
              </Typography>

              <Link underline="hover" color="text.secondary" href="#">
                Inicio
              </Link>

              <Link underline="hover" color="text.secondary" href="#">
                Agenda
              </Link>

              <Link underline="hover" color="text.secondary" href="#">
                Noticias
              </Link>

              <Link underline="hover" color="text.secondary" href="#">
                Exhibiciones
              </Link>
            </Stack>
          </Box>
          <Box
            component="img"
            src="tortu-footer.jpg"
            alt="tortuga-footer"
            sx={{
              width: 200,
            }}
          />
        </Box>
      </Container>

      {/* BOTTOM FULL WIDTH */}
      <Box
        sx={{
          bgcolor: "primary.main",
          width: "100%",
          color: "common.white",
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            px: { xs: 2, md: 7 },
            py: 3,

            display: "flex",

            justifyContent: "center",
            alignItems: "center",

            gap: 2,
          }}
        >
          <Typography variant="body2">
            Museo de Antropología | Facultad de Filosofía y Humanidades,
            Universidad Nacional de Córdoba.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
