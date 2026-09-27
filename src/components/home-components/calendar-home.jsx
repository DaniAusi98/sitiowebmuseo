import { Box, Card, CardContent, Typography } from "@mui/material";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import esLocale from "@fullcalendar/core/locales/es";

export default function CalendarioHome() {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1600px",
        mx: "auto",
        px: {
          xs: 0,
          lg: 10,
        },
        display: "flex",
        flexDirection: "column",
        mt: 4,
      }}
    >
      {/* INFO ARRIBA */}
      <Card elevation={0} sx={{ borderRadius: 0 }}>
        <CardContent
          sx={{
            textAlign: "center",
          }}
        >
          <Typography variant="h3" gutterBottom>
            Agenda
          </Typography>

          <Typography variant="body1" sx={{ mb: 2 }}>
            Presentaciones, muestras, talleres y encuentros del Museo de
            Antropologías. ¡Te esperamos!
          </Typography>
        </CardContent>
      </Card>

      {/* FILA ABAJO */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
        }}
      >
        {/* CALENDARIO 1/3 */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ borderRadius: 0 }}>
            <CardContent>
              <FullCalendar
                height={450}
                plugins={[dayGridPlugin, timeGridPlugin]}
                initialView="dayGridMonth"
                locale={esLocale}
                dayHeaderContent={(arg) => {
                  return arg.text.charAt(0).toUpperCase() + arg.text.slice(1);
                }}
                headerToolbar={{
                  left: "title",
                  center: "",
                  right: "prev,next",
                }}
                events={[
                  {
                    title: "Taller de Cine",
                    date: "2026-05-15",
                  },
                  {
                    title: "Marcha Universitaria",
                    date: "2026-05-18",
                  },
                ]}
              />
            </CardContent>
          </Card>
        </Box>

        {/* IMAGEN 2/3 */}
        <Box sx={{ flex: 2, display: { xs: "none", md: "block" } }}>
          <Card sx={{ borderRadius: 0, height: "100%" }}>
            <img
              src="imagenes-agenda.jpg"
              alt="Museo"
              style={{
                width: "100%",
                height: "100%",
                minHeight: 450,
                objectFit: "cover",
                display: "block",
              }}
            />
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
