import * as React from "react";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Stack,
  TextField,
  Typography,
  Card,
} from "@mui/material";

import { styled } from "@mui/material/styles";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateField } from "@mui/x-date-pickers/DateField";

import { useAuth } from "../../auth/auth-ctx"; // la ruta correcta

import { useForm, Controller } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const FormContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100vh",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(2),

  backgroundColor: theme.palette.background.default,
}));

const FormCard = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: 500,

  padding: theme.spacing(4),

  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),

  borderRadius: theme.shape.borderRadius * 2,
}));

const schema = z
  .object({
    firstName: z.string().min(1, "El nombre es obligatorio"),

    lastName: z.string().min(1, "El apellido es obligatorio"),

    birthDate: z.any().refine((date) => {
      if (!date) return false;

      const today = new Date();

      const birth = date.toDate();

      let age = today.getFullYear() - birth.getFullYear();

      const monthDiff = today.getMonth() - birth.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birth.getDate())
      ) {
        age--;
      }

      return age >= 18;
    }, "Debe ser mayor de 18 años"),

    email: z.string().email("Email inválido"),

    phone: z.string().min(10, "El teléfono debe tener al menos 10 dígitos"),

    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .regex(/[A-Z]/, "Debe contener una mayúscula")
      .regex(/[a-z]/, "Debe contener una minúscula")
      .regex(/[0-9]/, "Debe contener un número")
      .regex(/[^A-Za-z0-9]/, "Debe contener un carácter especial"),

    confirmPassword: z
      .string()
      .min(6, "La confirmación debe tener al menos 6 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export const SignUp = () => {
  const { register: registerUser } = useAuth();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),

    defaultValues: {
      firstName: "",
      lastName: "",
      birthDate: null,
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });
  const [loading, setLoading] = React.useState(false);
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      await registerUser(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <FormContainer>
        <FormCard elevation={3}>
          <Typography component="h1" variant="h4">
            Registro de usuario
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1 }}>Nombre</FormLabel>

              <TextField
                {...register("firstName")}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />
            </FormControl>

            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1 }}>Apellido</FormLabel>

              <TextField
                {...register("lastName")}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            </FormControl>

            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1 }}>Fecha de nacimiento</FormLabel>

              <Controller
                name="birthDate"
                control={control}
                render={({ field }) => (
                  <DateField
                    value={field.value}
                    onChange={field.onChange}
                    format="DD/MM/YYYY"
                    slotProps={{
                      textField: {
                        error: !!errors.birthDate,
                        helperText: errors.birthDate?.message,
                        fullWidth: true,
                      },
                    }}
                  />
                )}
              />
            </FormControl>

            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1 }}>Email</FormLabel>

              <TextField
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </FormControl>

            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1 }}>Teléfono</FormLabel>

              <TextField
                {...register("phone")}
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
            </FormControl>

            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1 }}>Contraseña</FormLabel>

              <TextField
                type="password"
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </FormControl>

            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1 }}>Confirmar contraseña</FormLabel>

              <TextField
                type="password"
                {...register("confirmPassword")}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
              />
            </FormControl>

            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? "Registrando..." : "Registrarse"}
            </Button>
          </Box>
        </FormCard>
      </FormContainer>
    </LocalizationProvider>
  );
};
