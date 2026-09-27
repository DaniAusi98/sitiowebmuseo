import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
import { useEffect, useRef } from "react";

import { useAuth } from "../../../auth/auth-ctx";
import { authService } from "../../../lib/auth";
import useNotifications from "../../hooks/Notification/useNotification";
import useDialogs from "../../hooks/useDialogs";
import { API_URL } from "../../../services/api";

import {
  Box,
  Button,
  TextField,
  Typography,
  FormHelperText,
  FormControl,
  Select,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  MenuItem,
} from "@mui/material";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import AvailableCalendar from "../InteractiveCalendar";
import TematicasSelector from "../TematicasSelector";
import UbicacionInstitucion from "../../ubicacion/UbicacionInstitucion";

export const ReprogramGuidedTour = () => {
  const schema = z
    .object({
      institucionNombre: z.string().min(3, "Mínimo 3 caracteres"),

      institucionTelefono: z
        .string()
        .min(10, "Mínimo 10 caracteres")
        .max(15, "Máximo 15 caracteres"),

      institucionEmail: z.email("Formato inválido"),

      // ============================
      // UBICACIÓN
      // ============================

      pais: z.string().min(1, "Seleccione un país"),

      provincia: z.string().min(1, "Seleccione una provincia"),

      localidad: z.string().min(1, "Seleccione una localidad"),

      esEducativa: z.boolean(),

      nivelEducativo: z
        .string()
        .optional()
        .transform((val) =>
          val === "" || val === undefined ? undefined : Number(val),
        ),

      anioGrado: z.string().optional(),

      cantidadPersonas: z.coerce
        .number()
        .positive("La cantidad debe ser mayor a 0")
        .int("La cantidad debe ser un número entero")
        .min(10, "Debe ser mayor a 10")
        .max(50, "Debe ser menor o igual a 50"),

      diversidadFuncionalDescripcion: z.string().optional(),

      motivoRelacionVisita: z.string().optional(),

      observaciones: z.string().optional(),

      preferredStartDateTime: z.string().min(1, "Seleccione un horario"),

      preferredEndDateTime: z.string().min(1, "Seleccione un horario"),

      tematicasIds: z
        .array(z.string())
        .min(1, "Seleccione al menos una temática"),
    })
    .check((ctx) => {
      const data = ctx.value;

      if (data.esEducativa) {
        if (data.nivelEducativo === undefined) {
          ctx.issues.push({
            code: "custom",
            path: ["nivelEducativo"],
            message: "Seleccione un nivel educativo",
          });
        }

        if (!data.anioGrado) {
          ctx.issues.push({
            code: "custom",
            path: ["anioGrado"],
            message: "Indique un sala/grado/año",
          });
        }
      }
    });

  const { user } = useAuth();

  const { id } = useParams();

  const navigate = useNavigate();

  const notifications = useNotifications();

  const dialogs = useDialogs();

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

    mode: "onSubmit",

    reValidateMode: "onChange",

    defaultValues: {
      institucionNombre: "",
      institucionEmail: "",
      institucionTelefono: "",

      // ============================
      // UBICACIÓN
      // ============================

      pais: "",
      provincia: "",
      localidad: "",

      esEducativa: false,

      nivelEducativo: "",
      anioGrado: "",

      cantidadPersonas: "",

      diversidadFuncionalDescripcion: "",

      motivoRelacionVisita: "",

      observaciones: "",

      preferredStartDateTime: "",
      preferredEndDateTime: "",

      tematicasIds: [],
    },
  });

  const nivelMap = {
    Inicial: "0",
    Primario: "1",
    Secundario: "2",
    Superior: "3",
  };

  // ============================
  // CARGAR RESERVA
  // ============================

  useEffect(() => {
    const loadReservation = async () => {
      try {
        const response = await authService.authenticatedFetch(
          `${API_URL}/api/v1/VisitasGuiadas/${id}`,
        );

        if (!response.ok) {
          throw new Error("Error al cargar la reserva");
        }

        const reserva = await response.json();

        const esEducativaReserva =
          reserva.nivelCurso !== null &&
          reserva.nivelCurso !== undefined &&
          reserva.anioCurso !== null &&
          reserva.anioCurso !== undefined;

        reset({
          institucionNombre: reserva.institucion ?? "",

          institucionEmail: reserva.emailInstitucion ?? "",

          institucionTelefono: reserva.telefonoInstitucion ?? "",

          // ============================
          // UBICACIÓN
          // ============================

          pais: "",

          provincia: "",

          localidad: "",

          esEducativa: esEducativaReserva,

          nivelEducativo: esEducativaReserva
            ? (nivelMap[reserva.nivelCurso] ?? "")
            : "",

          anioGrado: esEducativaReserva ? String(reserva.anioCurso ?? "") : "",

          cantidadPersonas: reserva.cantidadPersonas ?? "",

          diversidadFuncionalDescripcion: reserva.descripcionDiscapacidad ?? "",

          motivoRelacionVisita: reserva.motivoVisita ?? "",

          observaciones: reserva.observaciones ?? "",

          preferredStartDateTime: "",

          preferredEndDateTime: "",

          tematicasIds: reserva.tematicasDto?.map((t) => String(t.id)) ?? [],
        });
      } catch (error) {
        console.error(error);

        notifications.error("No fue posible cargar la reserva.");
      }
    };

    if (id) {
      loadReservation();
    }
  }, [id, reset]);

  const esEducativa = watch("esEducativa");

  const selectedStart = watch("preferredStartDateTime");

  const selectedEnd = watch("preferredEndDateTime");

  // ============================
  // UBICACIÓN
  // ============================

  const handleUbicacionChange = React.useCallback(
    ({ pais, provincia, localidad }) => {
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

    const confirmed = await dialogs.confirm(
      `La visita será reprogramada para el ${dayjs(
        data.preferredStartDateTime,
      ).format("DD/MM/YYYY HH:mm")}. ¿Desea continuar?`,
      {
        title: "Confirmar reprogramación",
        okText: "Reprogramar",
        cancelText: "Cancelar",
        severity: "warning",
      },
    );

    if (!confirmed) {
      return;
    }

    const payload = {
      VisitaReprogramadaId: id,

      UsuarioVisitanteId: user.id,

      Institucion: data.institucionNombre,

      TelefonoInstitucion: data.institucionTelefono,

      EmailInstitucion: data.institucionEmail,

      // ============================
      // UBICACIÓN
      // ============================

      PaisInstitucion: data.pais,

      ProvinciaInstitucion: data.provincia,

      LocalidadInstitucion: data.localidad,

      Inicio: data.preferredStartDateTime,

      Fin: data.preferredEndDateTime,

      NivelEducativo: data.esEducativa ? Number(data.nivelEducativo) : null,

      AnioGrado: data.esEducativa ? data.anioGrado : null,

      DiversidadFuncionalDescripcion: data.diversidadFuncionalDescripcion,

      MotivoRelacionVisita: data.motivoRelacionVisita,

      Observaciones: data.observaciones,

      CantidadPersonas: data.cantidadPersonas,

      TematicasIds: data.tematicasIds,
    };

    console.log("PAYLOAD REPROGRAMACIÓN:", payload);

    try {
      const response = await authService.authenticatedFetch(
        `${API_URL}/api/v1/VisitasGuiadas/${id}/reprogram`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error("Error al reprogramar la visita");
      }

      await calendarRef.current?.refreshAvailability();

      notifications.show("La visita fue reprogramada exitosamente", {
        severity: "success",
      });

      navigate("/reservations");
    } catch (error) {
      console.error(error);

      notifications.show("No se pudo reprogramar la visita", {
        severity: "error",
      });
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
          Reprogramar Visita Guiada
        </Typography>

        {/* ============================= */}
        {/* DATOS DEL SOLICITANTE */}
        {/* ============================= */}

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

        {/* ============================= */}
        {/* DATOS DE LA INSTITUCIÓN */}
        {/* ============================= */}

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

        <FormControl fullWidth margin="normal">
          <FormLabel sx={{ mb: 1 }}>Teléfono de la institución</FormLabel>

          <TextField
            fullWidth
            error={!!errors.institucionTelefono}
            helperText={errors.institucionTelefono?.message}
            {...register("institucionTelefono")}
          />
        </FormControl>

        {/* ============================= */}
        {/* UBICACIÓN */}
        {/* ============================= */}

        <UbicacionInstitucion
          resetRef={ubicacionRef}
          onChange={handleUbicacionChange}
          errors={errors}
        />

        {/* ============================= */}
        {/* INSTITUCIÓN EDUCATIVA */}
        {/* ============================= */}

        <Controller
          name="esEducativa"
          control={control}
          render={({ field }) => (
            <FormControl>
              <FormLabel>¿La institución es educativa?</FormLabel>

              <RadioGroup
                row
                value={field.value ? "true" : "false"}
                onChange={(e) => field.onChange(e.target.value === "true")}
              >
                <FormControlLabel value="true" control={<Radio />} label="Sí" />

                <FormControlLabel
                  value="false"
                  control={<Radio />}
                  label="No"
                />
              </RadioGroup>
            </FormControl>
          )}
        />

        {/* ============================= */}
        {/* NIVEL EDUCATIVO */}
        {/* ============================= */}

        <Controller
          name="nivelEducativo"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.nivelEducativo}>
              <FormLabel sx={{ mb: 1 }}>Nivel educativo</FormLabel>

              <Select
                {...field}
                disabled={!esEducativa}
                value={field.value ?? ""}
              >
                <MenuItem value="">
                  <em>Seleccione</em>
                </MenuItem>

                <MenuItem value="0">Nivel Inicial</MenuItem>

                <MenuItem value="1">Nivel Primario</MenuItem>

                <MenuItem value="2">Nivel Secundario</MenuItem>

                <MenuItem value="3">Nivel Superior No Universitario</MenuItem>

                <MenuItem value="4">Nivel Superior Universitario</MenuItem>

                <MenuItem value="5">Otro</MenuItem>
              </Select>

              <FormHelperText>{errors.nivelEducativo?.message}</FormHelperText>
            </FormControl>
          )}
        />

        {/* ============================= */}
        {/* AÑO / GRADO */}
        {/* ============================= */}

        <FormControl fullWidth margin="normal">
          <FormLabel sx={{ mb: 1 }}>
            Indique un sala/grado/año. (Solo para instituciones educativas)
          </FormLabel>

          <TextField
            multiline
            rows={4}
            fullWidth
            disabled={!esEducativa}
            error={!!errors.anioGrado}
            helperText={errors.anioGrado?.message}
            {...register("anioGrado")}
          />
        </FormControl>

        {/* ============================= */}
        {/* CANTIDAD */}
        {/* ============================= */}

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

        {/* ============================= */}
        {/* DIVERSIDAD FUNCIONAL */}
        {/* ============================= */}

        <FormControl fullWidth margin="normal">
          <FormLabel sx={{ mb: 1 }}>
            Descripción de diversidad funcional
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

        {/* ============================= */}
        {/* MOTIVO */}
        {/* ============================= */}

        <FormControl fullWidth margin="normal">
          <FormLabel sx={{ mb: 1 }}>Motivo de la visita</FormLabel>

          <TextField
            multiline
            rows={4}
            fullWidth
            error={!!errors.motivoRelacionVisita}
            helperText={errors.motivoRelacionVisita?.message}
            {...register("motivoRelacionVisita")}
          />
        </FormControl>

        {/* ============================= */}
        {/* OBSERVACIONES */}
        {/* ============================= */}

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

        {/* ============================= */}
        {/* TEMÁTICAS */}
        {/* ============================= */}

        <TematicasSelector name="tematicasIds" control={control} />

        {/* ============================= */}
        {/* CALENDARIO */}
        {/* ============================= */}

        <AvailableCalendar
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

        <Button type="submit" variant="contained">
          Reprogramar
        </Button>
      </Box>
    </Box>
  );
};
