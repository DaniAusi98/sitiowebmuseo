import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../../lib/auth";
import { API_URL } from "../../../services/api";
import useDialogs from "../../hooks/useDialogs";
import useNotifications from "../../hooks/Notification/useNotification";

import {
  Alert,
  Box,
  Button,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteIcon from "@mui/icons-material/Delete";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";

import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";

export default function SelfGuidedReservationsList() {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dialogs = useDialogs();
  const notifications = useNotifications();

  const loadReservations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.authenticatedFetch(
        `${API_URL}/api/v1/VisitaAutoguiada/reservations`,
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        throw new Error("No se pudieron obtener las reservas");
      }

      const data = await response.json();

      setRows(data.items);
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  async function confirmCancel(id) {
    try {
      const response = await authService.authenticatedFetch(
        `${API_URL}/api/v1/VisitasGuiadas/${id}/cancel`,
        {
          method: "PUT",
        },
      );

      if (!response.ok) {
        throw new Error("No se pudo cancelar la reserva");
      }

      notifications.show("Reserva cancelada correctamente", {
        severity: "success",
      });

      await loadReservations();
    } catch (error) {
      console.error(error);

      notifications.show("No se pudo cancelar la reserva", {
        severity: "error",
      });
    }
  }

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  const handleRefresh = () => {
    if (!loading) {
      loadReservations();
    }
  };

  const handleCreateClick = () => {
    navigate("/reservations/new");
  };

  const handleRowClick = (params) => {
    navigate(`/reservations/${params.row.id}/self-guided`);
  };

  const handleCancel = async (row) => {
    // Protección extra en frontend.
    // Una reserva cancelada no puede volver a cancelarse.
    if (row.estado === "Cancelada") {
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

    await confirmCancel(row.id);
  };

  const handleReprogram = (row) => {
    // Una reserva cancelada no puede reprogramarse.
    if (row.estado === "Cancelada") {
      notifications.show("No se puede reprogramar una reserva cancelada", {
        severity: "warning",
      });

      return;
    }

    navigate(`/reservations/${row.id}/reprogram`);
  };

  const columns = [
    {
      field: "fecha",
      headerName: "Fecha",
      width: 120,
      valueGetter: (_, row) => {
        const fecha = new Date(row.fechaInicio);

        return fecha.toLocaleDateString("es-AR");
      },
    },

    {
      field: "horario",
      headerName: "Horario",
      width: 140,
      valueGetter: (_, row) => {
        const inicio = new Date(row.fechaInicio).toLocaleTimeString("es-AR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

        const fin = new Date(row.fechaFin).toLocaleTimeString("es-AR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

        return `${inicio} - ${fin}`;
      },
    },

    {
      field: "institucion",
      headerName: "Institución",
      flex: 1.5,
      minWidth: 200,
    },
    {
      field: "cantidadPersonas",
      headerName: "Personas",
      width: 100,
      type: "number",
    },

    {
      field: "estadoConfirmacion",
      headerName: "Confirmación",
      width: 180,
    },

    {
      field: "actions",
      type: "actions",
      width: 100,

      getActions: ({ row }) => {
        const actions = [];

        // --------------------------------------------------
        // CANCELAR
        // --------------------------------------------------
        // Solo mostramos cancelar si NO está cancelada.
        if (row.estado !== "Cancelada") {
          actions.push(
            <GridActionsCellItem
              key="cancel"
              icon={<DeleteIcon />}
              label="Cancelar"
              onClick={(event) => {
                event.stopPropagation();
                handleCancel(row);
              }}
            />,
          );
        }

        // --------------------------------------------------
        // REPROGRAMAR
        // --------------------------------------------------
        // Solo mostramos reprogramar si NO está cancelada.
        if (row.estado !== "Cancelada") {
          actions.push(
            <GridActionsCellItem
              key="reprogram"
              icon={<EventRepeatIcon />}
              label="Reprogramar"
              onClick={(event) => {
                event.stopPropagation();
                handleReprogram(row);
              }}
            />,
          );
        }

        return actions;
      },
    },
  ];

  return (
    <Stack spacing={3}>
      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            md: "row",
          },
          justifyContent: "space-between",
          alignItems: {
            xs: "stretch",
            md: "center",
          },
          gap: 2,
        }}
      >
        <Typography variant="h4">Reservas de Visitas Grupales</Typography>

        <Stack direction="row" spacing={1}>
          <Tooltip title="Recargar" placement="right" enterDelay={1000}>
            <div>
              <IconButton
                size="small"
                aria-label="refresh"
                onClick={handleRefresh}
              >
                <RefreshIcon />
              </IconButton>
            </div>
          </Tooltip>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateClick}
          >
            Nueva Reserva
          </Button>
        </Stack>
      </Box>

      {error ? (
        <Alert severity="error">{error.message}</Alert>
      ) : (
        <Box sx={{ width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            disableRowSelectionOnClick
            onRowClick={handleRowClick}
          />
        </Box>
      )}
    </Stack>
  );
}
