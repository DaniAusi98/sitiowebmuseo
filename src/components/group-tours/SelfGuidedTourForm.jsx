import * as React from "react";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../auth/auth-ctx";
import { authService } from "../../lib/auth";
import useNotifications from "../hooks/Notification/useNotification";
import { API_URL } from "../../services/api";

import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  FormLabel,
} from "@mui/material";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import TematicasSelector from "./TematicasSelector";
import AvailableCalendarAutoguiadas from "./SelfGuidedFormCalendar";
import UbicacionInstitucion from "../ubicacion/UbicacionInstitucion";

export const SelfGuidedTourForm = () => {
  const navigate = useNavigate();

  const schema = z.object({
    // ============================
    // DATOS DE LA INSTITUCIÓN
    // ============================

    institucionNombre: z.string().min(3, "Mínimo 3 caracteres"),

    institucionEmail: z.email("Formato inválido"),

    // ============================
    // UBICACIÓN
    // ============================

    pais: z.string().min(1, "Seleccione un país"),

    provincia: z.string().min(1, "Seleccione una provincia"),

    localidad: z.string().min(1, "Seleccione una localidad"),

    // ============================
    // CANTIDAD
    // ============================

    cantidadPersonas: z.coerce
      .number()
      .positive("La cantidad debe ser mayor a 0")
      .int("La cantidad debe ser un número entero")
      .min(10, "La cantidad mínima es 10")
      .max(50, "La cantidad máxima es 50"),

    diversidadFuncionalDescripcion: z.string().optional(),

    observaciones: z.string().optional(),

    // ============================
    // HORARIO
    // ============================

    preferredStartDateTime: z.string().min(1, "Seleccione un horario"),

    preferredEndDateTime: z.string().min(1, "Seleccione un horario"),

    // ============================
    // TEMÁTICAS
    // ============================

    tematicasIds: z
      .array(z.string())
      .min(1, "Seleccione al menos una temática"),
  });

  const { user } = useAuth();

  const notifications = useNotifications();

  const calendarRef = useRef(null);

  const ubicacionRef = useRef(null);

  const {
    register,
    control,
    setValue,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),

    // No validar al montar.
    // Valida cuando se presiona Enviar.
    mode: "onSubmit",

    // Después del primer submit,
    // vuelve a validar cuando el usuario modifica.
    reValidateMode: "onChange",

    defaultValues: {
      institucionNombre: "",

      institucionEmail: "",

      // ============================
      // UBICACIÓN
      // ============================

      pais: "",

      provincia: "",

      localidad: "",

      // ============================
      // CANTIDAD
      // ============================

      cantidadPersonas: "",

      diversidadFuncionalDescripcion: "",

      observaciones: "",

      // ============================
      // HORARIO
      // ============================

      preferredStartDateTime: "",

      preferredEndDateTime: "",

      // ============================
      // TEMÁTICAS
      // ============================

      tematicasIds: [],
    },
  });

  const selectedStart = watch("preferredStartDateTime");

  const selectedEnd = watch("preferredEndDateTime");

  // ============================
  // UBICACIÓN
  // ============================

  const handleUbicacionChange = React.useCallback(
    ({ pais, provincia, localidad }) => {
      // IMPORTANTE:
      // No usamos shouldValidate: true.
      // Así no aparecen errores al montar.

      setValue("pais", pais);

      setValue("provincia", provincia);

      setValue("localidad", localidad);
    },
    [setValue],
  );

  // ============================
  // SUBMIT
  // ============================

  const onSubmit = async (data) => {
    if (!user) {
      return;
    }

    const payload = {
      UsuarioVisitanteId: user.id,

      Institucion: data.institucionNombre,

      EmailInstitucion: data.institucionEmail,

      // ============================
      // UBICACIÓN
      // ============================

      PaisInstitucion: data.pais,

      ProvinciaInstitucion: data.provincia,

      LocalidadInstitucion: data.localidad,

      // ============================
      // HORARIO
      // ============================

      Inicio: data.preferredStartDateTime,

      Fin: data.preferredEndDateTime,

      // ============================
      // DATOS
      // ============================

      DiversidadFuncionalDescripcion: data.diversidadFuncionalDescripcion,

      Observaciones: data.observaciones,

      CantidadPersonas: data.cantidadPersonas,

      TematicasIds: data.tematicasIds,
    };

    console.log("PAYLOAD:", payload);

    try {
      const response = await authService.authenticatedFetch(
        `${API_URL}/api/v1/VisitaAutoguiada`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error("Error al crear la visita");
      }

      const createdReservation = await response.json();

      // ============================
      // ACTUALIZAR CALENDARIO
      // ============================

      await calendarRef.current?.refreshAvailability();

      // ============================
      // LIMPIAR FORMULARIO
      // ============================

      reset();

      ubicacionRef.current?.reset();

      // ============================
      // NOTIFICACIÓN
      // ============================

      notifications.showAction(
        "Reserva creada exitosamente",
        "Tu reserva fue registrada correctamente. Revise su correo electrónico para confirmarla.",
        {
          severity: "success",

          actionText: "Ver detalle",

          onAction: () => {
            /*
            // Descomentar cuando exista la página
            // de detalle de visita autoguiada.

            navigate(`/reservations/autoguiada/${createdReservation.id}`);
            */
          },
        },
      );
    } catch (error) {
      console.error(error);

      notifications.error("Error al crear la visita.");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 1000,
        margin: "0 auto",
        px: {
          xs: 2,
          sm: 3,
        },
        mt: 4,
      }}
    >
      {/* ========================================= */}
      {/* MIS RESERVAS - DESKTOP */}
      {/* ========================================= */}

      <Box
        sx={{
          display: {
            xs: "none",
            md: "flex",
          },
          justifyContent: "flex-end",
          mb: 1,
        }}
      >
        <Button
          variant="contained"
          onClick={() => navigate("/reservations")}
          sx={{
            textTransform: "none",
          }}
        >
          Mis reservas
        </Button>
      </Box>

      {/* ========================================= */}
      {/* FORMULARIO */}
      {/* ========================================= */}

      <Box
        component="form"
        onSubmit={handleSubmit(
          (data) => {
            console.log("SUBMIT OK");
            console.log(data);

            onSubmit(data);
          },
          (errors) => {
            console.log("SUBMIT ERROR");
            console.log(errors);
          },
        )}
        sx={{
          maxWidth: 500,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 3,
          p: {
            xs: 2,
            sm: 4,
          },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            width: "100%",
          }}
        >
          Formulario de Reserva de Visita Grupal Autoguiada
        </Typography>

        <Typography
          variant="subtitle1"
          sx={{
            textAlign: "center",
            width: "100%",
          }}
        >
          Complete el formulario para solicitar una visita grupal autoguiada
        </Typography>

        {/* ========================================= */}
        {/* DATOS DEL SOLICITANTE */}
        {/* ========================================= */}

        <FormControl fullWidth margin="normal">
          <FormLabel sx={{ mb: 1 }}>Nombre del solicitante</FormLabel>

          <TextField fullWidth value={user?.nombre ?? ""} disabled />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <FormLabel sx={{ mb: 1 }}>Apellido del solicitante</FormLabel>

          <TextField fullWidth value={user?.apellido ?? ""} disabled />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <FormLabel sx={{ mb: 1 }}>Email del solicitante</FormLabel>

          <TextField fullWidth value={user?.email ?? ""} disabled />
        </FormControl>

        {/* ========================================= */}
        {/* DATOS DE LA INSTITUCIÓN */}
        {/* ========================================= */}

        <FormControl fullWidth margin="normal">
          <FormLabel sx={{ mb: 1 }}>Nombre de la institución</FormLabel>

          <TextField
            fullWidth
            error={!!errors.institucionNombre}
            helperText={errors.institucionNombre?.message}
            {...register("institucionNombre")}
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <FormLabel sx={{ mb: 1 }}>Email de la institución</FormLabel>

          <TextField
            fullWidth
            error={!!errors.institucionEmail}
            helperText={errors.institucionEmail?.message}
            {...register("institucionEmail")}
          />
        </FormControl>

        {/* ========================================= */}
        {/* UBICACIÓN */}
        {/* ========================================= */}

        <UbicacionInstitucion
          resetRef={ubicacionRef}
          onChange={handleUbicacionChange}
          errors={errors}
        />

        {/* ========================================= */}
        {/* CANTIDAD DE PERSONAS */}
        {/* ========================================= */}

        <FormControl fullWidth margin="normal">
          <FormLabel sx={{ mb: 1 }}>Cantidad de personas</FormLabel>

          <TextField
            type="number"
            fullWidth
            error={!!errors.cantidadPersonas}
            helperText={errors.cantidadPersonas?.message}
            {...register("cantidadPersonas")}
          />
        </FormControl>

        {/* ========================================= */}
        {/* DIVERSIDAD FUNCIONAL */}
        {/* ========================================= */}

        <FormControl fullWidth margin="normal">
          <FormLabel sx={{ mb: 1 }}>
            ¿Existen personas con diversidad funcional en el grupo?
            <br />
            En caso afirmativo, describa brevemente.
          </FormLabel>

          <TextField
            multiline
            rows={4}
            fullWidth
            error={!!errors.diversidadFuncionalDescripcion}
            helperText={errors.diversidadFuncionalDescripcion?.message}
            {...register("diversidadFuncionalDescripcion")}
          />
        </FormControl>

        {/* ========================================= */}
        {/* OBSERVACIONES */}
        {/* ========================================= */}

        <FormControl fullWidth margin="normal">
          <FormLabel sx={{ mb: 1 }}>Observaciones</FormLabel>

          <TextField
            multiline
            rows={4}
            fullWidth
            error={!!errors.observaciones}
            helperText={errors.observaciones?.message}
            {...register("observaciones")}
          />
        </FormControl>

        {/* ========================================= */}
        {/* TEMÁTICAS */}
        {/* ========================================= */}

        <TematicasSelector name="tematicasIds" control={control} />

        {/* ========================================= */}
        {/* CALENDARIO */}
        {/* ========================================= */}

        <AvailableCalendarAutoguiadas
          ref={calendarRef}
          selectedStart={selectedStart}
          onTimeSelect={(inicio, fin) => {
            setValue("preferredStartDateTime", inicio || "", {
              shouldValidate: true,
            });

            setValue("preferredEndDateTime", fin || "", {
              shouldValidate: true,
            });
          }}
        />

        {selectedStart && selectedEnd && (
          <Typography sx={{ mt: 2 }}>
            Seleccionado: {dayjs(selectedStart).format("DD/MM/YYYY HH:mm")}
            {" - "}
            {dayjs(selectedEnd).format("HH:mm")}
          </Typography>
        )}

        {errors.preferredStartDateTime && (
          <Typography color="error">
            {errors.preferredStartDateTime.message}
          </Typography>
        )}

        {errors.preferredEndDateTime && (
          <Typography color="error">
            {errors.preferredEndDateTime.message}
          </Typography>
        )}

        {/* ========================================= */}
        {/* ENVIAR */}
        {/* ========================================= */}

        <Button type="submit" variant="contained">
          Enviar
        </Button>
      </Box>

      {/* ========================================= */}
      {/* MIS RESERVAS - MOBILE */}
      {/* ========================================= */}

      <Box
        sx={{
          display: {
            xs: "flex",
            md: "none",
          },
          justifyContent: "center",
          mt: 2,
          mb: 3,
        }}
      >
        <Button
          variant="contained"
          onClick={() => navigate("/reservations")}
          sx={{
            textTransform: "none",
            width: "100%",
            maxWidth: 500,
          }}
        >
          Mis reservas
        </Button>
      </Box>
    </Box>
  );
};
