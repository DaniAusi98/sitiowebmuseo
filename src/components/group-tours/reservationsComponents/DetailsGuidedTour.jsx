import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { authService } from "../../../lib/auth";
import { API_URL } from "../../../services/api";
import { Button, Box, Grid, Paper, Stack, Typography } from "@mui/material";
import useDialogs from "../../hooks/useDialogs";
import useNotifications from "../../hooks/Notification/useNotification";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function ReservationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(false);

  const dialogs = useDialogs();
  const notifications = useNotifications();

  useEffect(() => {
    loadReservation();
  }, [id]);

  async function loadReservation() {
    try {
      setLoading(true);

      const response = await authService.authenticatedFetch(
        `${API_URL}/api/v1/VisitasGuiadas/${id}`,
      );

      if (!response.ok) {
        throw new Error("No se pudo obtener la reserva");
      }

      const data = await response.json();

      setReservation(data);
    } catch (error) {
      console.error(error);
      setReservation(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel() {
    if (reservation.estado === "Cancelada") {
      notifications.show("La reserva ya está cancelada", {
        severity: "warning",
      });

      return;
    }

    const confirmed = await dialogs.confirm(
      "¿Está seguro que desea cancelar esta reserva?",
      {
        title: "Cancelar reserva",
        okText: "Sí",
        cancelText: "No",
        severity: "error",
      },
    );

    if (!confirmed) return;

    try {
      const response = await authService.authenticatedFetch(
        `${API_URL}/api/v1/VisitasGuiadas/${id}/cancel`,
        {
          method: "PUT",
        },
      );

      if (!response.ok) {
        throw new Error();
      }

      notifications.show("Reserva cancelada correctamente", {
        severity: "success",
      });

      navigate("/reservations");
    } catch {
      notifications.show("No se pudo cancelar la reserva", {
        severity: "error",
      });
    }
  }

  function handleReprogram() {
    if (reservation.estado === "Cancelada") {
      notifications.show("No se puede reprogramar una reserva cancelada", {
        severity: "warning",
      });

      return;
    }

    navigate(`/reservations/${id}/reprogram`);
  }
  async function handleConfirm() {
    if (reservation.estadoConfirmacion === "Confirmada") {
      notifications.show("La reserva ya está confirmada", {
        severity: "warning",
      });
      return;
    }

    try {
      const response = await authService.authenticatedFetch(
        `${API_URL}/api/v1/VisitasGuiadas/${id}/confirmar`,
        {
          method: "PATCH",
        },
      );

      if (!response.ok) {
        throw new Error();
      }

      notifications.show("Reserva confirmada correctamente", {
        severity: "success",
      });
    } catch {
      notifications.show("No se pudo confirmar la reserva", {
        severity: "error",
      });
    }
  }

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!reservation) {
    return <div>No se encontró la reserva</div>;
  }

  const fecha = new Date(reservation.fechaInicio).toLocaleDateString("es-AR");

  const inicio = new Date(reservation.fechaInicio).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const fin = new Date(reservation.fechaFin).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <Box sx={{ flexGrow: 1, width: "100%" }}>
      <Typography variant="h4" gutterBottom>
        Detalle de Reserva
      </Typography>

      <Grid container spacing={2} sx={{ width: "100%" }}>
        {/* FECHA */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper sx={{ px: 2, py: 1 }}>
            <Typography variant="overline">Fecha</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {fecha}
            </Typography>
          </Paper>
        </Grid>

        {/* HORARIO */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper sx={{ px: 2, py: 1 }}>
            <Typography variant="overline">Horario</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {inicio} - {fin}
            </Typography>
          </Paper>
        </Grid>

        {/* INSTITUCIÓN */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper sx={{ px: 2, py: 1 }}>
            <Typography variant="overline">Institución</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {reservation.institucion}
            </Typography>
          </Paper>
        </Grid>

        {/* NIVEL EDUCATIVO */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper sx={{ px: 2, py: 1 }}>
            <Typography variant="overline">
              Nivel educativo del grupo
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {reservation.nivelCurso}
            </Typography>
          </Paper>
        </Grid>

        {/* SALA / GRADO / AÑO */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper sx={{ px: 2, py: 1 }}>
            <Typography variant="overline">Sala/grado/año del grupo</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {reservation.anioCurso}
            </Typography>
          </Paper>
        </Grid>

        {/* CANTIDAD DE ESTUDIANTES */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper sx={{ px: 2, py: 1 }}>
            <Typography variant="overline">Cantidad de Estudiantes</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {reservation.cantidadPersonas}
            </Typography>
          </Paper>
        </Grid>

        {/* Pais */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper sx={{ px: 2, py: 1 }}>
            <Typography variant="overline">Pais de la Institución</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {reservation.paisInstitucion}
            </Typography>
          </Paper>
        </Grid>

        {/* PROVINCIA */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper sx={{ px: 2, py: 1 }}>
            <Typography variant="overline">
              Provincia de la Institución
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {reservation.provinciaInstitucion}
            </Typography>
          </Paper>
        </Grid>

        {/* LOCALIDAD */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper sx={{ px: 2, py: 1 }}>
            <Typography variant="overline">
              Localidad de la Institución
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {reservation.ciudadInstitucion}
            </Typography>
          </Paper>
        </Grid>

        {/* ESTADO DE CONFIRMACIÓN */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper sx={{ px: 2, py: 1 }}>
            <Typography variant="overline">Estado de Confirmación</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {reservation.estadoConfirmacion}
            </Typography>
          </Paper>
        </Grid>

        {/* ESTADO DE LA RESERVA */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper sx={{ px: 2, py: 1 }}>
            <Typography variant="overline">Estado de la Reserva</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {reservation.estado}
            </Typography>
          </Paper>
        </Grid>

        {/* TEMÁTICAS */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="overline">Temáticas</Typography>

            <Stack spacing={1} sx={{ mt: 1 }}>
              {reservation.tematicasDto?.length > 0 ? (
                reservation.tematicasDto.map((tematica) => (
                  <Typography key={tematica.id}>• {tematica.nombre}</Typography>
                ))
              ) : (
                <Typography>-</Typography>
              )}
            </Stack>
          </Paper>
        </Grid>

        {/* EMAIL */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper sx={{ px: 2, py: 1 }}>
            <Typography variant="overline">Email de la Institución</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {reservation.emailInstitucion}
            </Typography>
          </Paper>
        </Grid>

        {/* TELÉFONO */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper sx={{ px: 2, py: 1 }}>
            <Typography variant="overline">
              Teléfono de la Institución
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {reservation.telefonoInstitucion}
            </Typography>
          </Paper>
        </Grid>

        {/* DISCAPACIDAD */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper sx={{ px: 2, py: 1 }}>
            <Typography variant="overline">
              Persona con discapacidad o diversidad funcional
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {reservation.descripcionDiscapacidad || "-"}
            </Typography>
          </Paper>
        </Grid>

        {/* MOTIVO */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper sx={{ px: 2, py: 1 }}>
            <Typography variant="overline">
              Relación de la visita con proyecto Institucional o materia
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {reservation.motivoVisita || "-"}
            </Typography>
          </Paper>
        </Grid>

        {/* OBSERVACIONES */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ px: 2, py: 1 }}>
            <Typography variant="overline">Observaciones</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {reservation.observaciones || "-"}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
        <Button
          variant="text"
          color="inherit"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/reservations")}
        >
          Volver
        </Button>

        {reservation.estado !== "Cancelada" && (
          <>
            <Button
              variant="outlined"
              color="primary-main"
              startIcon={<EditIcon />}
              onClick={handleReprogram}
            >
              Reprogramar
            </Button>

            <Button
              color="error"
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={handleCancel}
            >
              Cancelar reserva
            </Button>
          </>
        )}
        {reservation.estadoConfirmacion !== "Confirmada" && (
          <>
            <Button color="primary" variant="contained" onClick={handleConfirm}>
              Confirmar Visita
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
}
