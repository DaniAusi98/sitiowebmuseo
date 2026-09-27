import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import dayjs from "dayjs";

import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";

const AvailableCalendar = forwardRef(({ selectedStart, onTimeSelect }, ref) => {
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);

  // =========================
  // FETCH DISPONIBILIDAD MES
  // =========================

  const fetchAvailableTimes = async (monthDate) => {
    setLoading(true);

    try {
      const fechaDesde = monthDate.startOf("month").format("YYYY-MM-DD");
      const fechaHasta = monthDate.endOf("month").format("YYYY-MM-DD");

      const res = await fetch(
        `https://localhost:7204/api/v1/VisitasGuiadas/DisponibilidadTurnosVisitasGuiadas?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`,
      );

      const data = await res.json();

      if (data?.items) {
        setAvailableTimes(data.items);
      } else {
        setAvailableTimes([]);
      }
    } catch (err) {
      console.error("Error fetching available times:", err);
      setAvailableTimes([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // REFRESH DESDE EL PADRE
  // =========================

  useImperativeHandle(ref, () => ({
    refreshAvailability: () => {
      // Si hay una fecha seleccionada, refrescamos su mes.
      // Si no, refrescamos el mes actual.
      const monthDate = selectedDate ? dayjs(selectedDate) : dayjs();

      return fetchAvailableTimes(monthDate);
    },
  }));

  // =========================
  // CARGA INICIAL
  // =========================

  useEffect(() => {
    fetchAvailableTimes(dayjs());
  }, []);

  // =========================
  // TURNOS DISPONIBLES
  // =========================

  const availableTurns = availableTimes.filter(
    (x) => x.estadoTurno === "Disponible" && x.cuposDisponibles > 0,
  );

  // =========================
  // DÍAS HABILITADOS
  // =========================

  const availableDaysSet = new Set(
    availableTurns.map((x) =>
      dayjs(x.horarioTurno.inicio).format("YYYY-MM-DD"),
    ),
  );

  // =========================
  // TURNOS DEL DÍA SELECCIONADO
  // =========================

  const slotsForSelectedDate = availableTurns.filter(
    (x) => dayjs(x.horarioTurno.inicio).format("YYYY-MM-DD") === selectedDate,
  );

  return (
    <Box>
      {/* =========================
          CALENDARIO
      ========================= */}

      <Card>
        <CardContent>
          <DateCalendar
            value={selectedDate ? dayjs(selectedDate) : null}
            disablePast
            loading={loading}
            onMonthChange={(month) => {
              setSelectedDate(null);
              onTimeSelect(null, null);

              fetchAvailableTimes(month);
            }}
            shouldDisableDate={(date) => {
              const key = dayjs(date).format("YYYY-MM-DD");

              return !availableDaysSet.has(key);
            }}
            onChange={(newValue) => {
              if (!newValue) return;

              const formatted = dayjs(newValue).format("YYYY-MM-DD");

              setSelectedDate(formatted);

              onTimeSelect(null, null);
            }}
          />
        </CardContent>
      </Card>

      {/* =========================
          HORARIOS
      ========================= */}

      {selectedDate && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Horarios disponibles
            </Typography>

            {loading ? (
              <Box display="flex" justifyContent="center" py={3}>
                <CircularProgress />
              </Box>
            ) : slotsForSelectedDate.length > 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                {slotsForSelectedDate.map((slot, index) => {
                  const startTime = dayjs(slot.horarioTurno.inicio).format(
                    "HH:mm",
                  );

                  const endTime = dayjs(slot.horarioTurno.fin).format("HH:mm");

                  const isSelected = selectedStart === slot.horarioTurno.inicio;

                  return (
                    <Button
                      key={index}
                      variant={isSelected ? "contained" : "outlined"}
                      onClick={() =>
                        onTimeSelect(
                          slot.horarioTurno.inicio,
                          slot.horarioTurno.fin,
                        )
                      }
                      sx={{
                        p: 2,
                        width: "100%",
                        display: "flex",
                        justifyContent: "flex-start",
                        textTransform: "none",
                      }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography fontWeight="bold">
                          {startTime} - {endTime}
                        </Typography>

                        <Typography variant="body2">
                          Max. Personas: {slot.cuposDisponibles}
                        </Typography>
                      </Box>
                    </Button>
                  );
                })}
              </Box>
            ) : (
              <Typography color="text.secondary">
                No hay horarios disponibles para esta fecha
              </Typography>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
});

export default AvailableCalendar;
