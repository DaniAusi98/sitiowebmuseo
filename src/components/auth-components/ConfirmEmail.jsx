import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { API_URL } from "../../services/api";
import { useTheme } from "@mui/material/styles";
export default function ConfirmEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const theme = useTheme();
  useEffect(() => {
    let cancelled = false;
    let redirectTimeout;

    const confirmEmail = async () => {
      const userId = searchParams.get("userId");
      const token = searchParams.get("token");

      if (!userId || !token) {
        if (!cancelled) {
          setStatus("error");
          setErrorMessage(
            "El enlace de confirmación está incompleto o es inválido.",
          );
        }
        return;
      }

      try {
        const response = await fetch(
          `https://localhost:7204/api/v1/UsuarioVisitante/confirm-email`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, token }),
          },
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));

          throw new Error(
            errorData.message ??
              errorData.mensaje ??
              "No se pudo verificar el correo. El enlace puede haber expirado.",
          );
        }

        if (!cancelled) {
          setStatus("success");

          redirectTimeout = setTimeout(() => {
            navigate("/signIn");
          }, 4000);
        }
      } catch (error) {
        if (!cancelled) {
          setStatus("error");
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Ocurrió un error inesperado.",
          );
        }
      }
    };

    confirmEmail();

    return () => {
      cancelled = true;

      if (redirectTimeout) {
        clearTimeout(redirectTimeout);
      }
    };
  }, [searchParams, navigate]);

  return (
    <div
      style={{
        maxWidth: "450px",
        margin: "100px auto",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
      }}
    >
      {status === "verifying" && (
        <div>
          <h2>🔄 Validando tus datos</h2>
          <p>
            Estamos confirmando tu dirección de correo electrónico, por favor
            espera...
          </p>
        </div>
      )}

      {status === "success" && (
        <div style={{ color: "#2e7d32" }}>
          <h2>✅ ¡Cuenta verificada con éxito!</h2>
          <p>
            Tu correo ha sido confirmado correctamente. Redirigiendo a la
            pantalla de inicio de sesión...
          </p>
        </div>
      )}

      {status === "error" && (
        <div style={{ color: "#d32f2f" }}>
          <h2>❌ Error de verificación</h2>
          <p>{errorMessage}</p>

          <button
            onClick={() => navigate("/resend-confirmation")}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: theme.palette.primary.main,
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Solicitar nuevo correo
          </button>
        </div>
      )}
    </div>
  );
}
