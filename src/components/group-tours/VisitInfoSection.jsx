import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/auth-ctx";

export default function VisitInfoSection() {
  const { isAuthenticated } = useAuth();

  return (
    <Box
      sx={{
        py: 8,
        backgroundColor: "#f8f8f8",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            mb: 3,
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
          variant="h3"
          sx={{
            fontWeight: "bold",
            mb: 3,
            color: "text.black",
          }}
        >
          Visitas individuales o en grupos pequeños
        </Typography>

        <Typography
          sx={{
            mb: 6,
            fontSize: "18px",
            textAlign: "justify",
          }}
        >
          Las muestras y exhibiciones del Museo de Antropologías pueden
          recorrerse delunes a viernes de 9 a 19 h., con entrada libre y
          gratuita. Al entrar, el Área Recepción le asesorará sobre las muestras
          y sus posibles recorridos.
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              component="img"
              src="/visitas-individuales.webp"
              alt="Visita 1"
              sx={{
                width: "100%",
                height: "250px",
                objectFit: "cover",
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              component="img"
              src="/visitas-individuales2.webp"
              alt="Visita 2"
              sx={{
                width: "100%",
                height: "250px",
                objectFit: "cover",
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              component="img"
              src="/visitas-individuales3.webp"
              alt="Visita 3"
              sx={{
                width: "100%",
                height: "250px",
                objectFit: "cover",
              }}
            />
          </Grid>
        </Grid>

        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            mb: 3,
            mt: 6,
            color: "text.black",
          }}
        >
          Visitas guiadas
        </Typography>

        <Typography
          sx={{
            mb: 6,
            fontSize: "18px",
            textAlign: "justify",
          }}
        >
          El Área Educación del Museo de Antropología propone visitas guiadas
          para instituciones educativas y otros grupos afines. En ellas se
          abordan diferentes temáticas surgidas de las inquietudes, intereses e
          imaginarios de sus visitantes. A través de ellas se invita a mirar e
          interpretar algunas de las salas del museo de acuerdo a la temática
          seleccionada, al nivel educativo de quienes nos visitan, a la
          currícula escolar y a las problemáticas antropológicas presentes en el
          museo.
        </Typography>
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            mb: 3,
            mt: 6,
            color: "text.black",
          }}
        >
          ¡Inauguramos una nueva vía de comunicación!{" "}
        </Typography>
        <Typography
          sx={{
            mb: 6,
            fontSize: "18px",
            textAlign: "justify",
          }}
        >
          Además, ahora podés contactarnos por WhatsApp 📲 al 351 813 0110 para
          consultas sobre 🏛️visitas guiadas, 🎉 eventos y 📅 nuevas actividades.
          Nuestro horario de atención por esta vía es:de lunes a viernes, de 10
          a 17 h.
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              component="img"
              src="/info-grupal1.webp"
              alt="Visita 1"
              sx={{
                width: "100%",
                height: "250px",
                objectFit: "cover",
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              component="img"
              src="/info-grupal2.webp"
              alt="Visita 2"
              sx={{
                width: "100%",
                height: "250px",
                objectFit: "cover",
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              component="img"
              src="/info-grupal3.webp"
              alt="Visita 3"
              sx={{
                width: "100%",
                height: "250px",
                objectFit: "cover",
              }}
            />
          </Grid>
        </Grid>
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            mb: 3,
            mt: 6,
            color: "text.black",
          }}
        >
          Preguntas Frecuentes
        </Typography>
        <Box sx={{ mt: 6 }}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">
                ¿Cuáles son los horarios para visitas guiadas?
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Typography>
                Por la mañana, a las 9:30 y a las 11:00 hs. y por la tarde, a
                las 14:00 y a las 15:30 hs.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">
                ¿Cuánto dura una visita guiada y qué costo tiene?
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Typography>
                Las visitas son gratuitas y tienen una duración aproximada de 1
                hora.{" "}
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">
                ¿Tienen visitas en lengua de señas?
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Typography>Sí, con reserva previa.</Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">
                ¿Cuáles son las temáticas de las visitas guiadas?
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Typography>
                Se eligen en función de los intereses del público.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">
                ¿Dónde consulto la propuesta educativa de este año?{" "}
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Typography>Puede encontrarla haciendo click aquí</Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">
                ¿Realizan visitas virtuales?{" "}
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Typography>
                Sí, el Área Educación del Museo brinda visitas guiadas virtuales
                y presenciales.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">
                Tengo otra pregunta que no figura aquí{" "}
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Typography>
                Puede escribir a los contactos que figuran en las Áreas del
                museo.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 5,
          }}
        >
          <Button
            variant="contained"
            component={Link}
            to={isAuthenticated ? "/visitas" : "/signIn"}
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: "bold",
              borderRadius: 1,
              backgroundColor: "primary.main",
              color: "primary.contrastText",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
          >
            Formulario de Reserva
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
