import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { API_URL } from "../../services/api"; // Usa esta variable
import { useTheme } from "@mui/material/styles";

export default function ConfirmarVisitaGrupal() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const theme = useTheme();

  useEffect(() => {
    let cancelled = false;
    let redirectTimeout;

    const confirmarVisitaGrupal = async () => {
      const visitaId = searchParams.get("visitaId");

      if (!visitaId) {
        if (!cancelled) {
          setStatus("error");
          setErrorMessage(
            "El enlace de confirmación está incompleto o es inválido.",
          );
        }
        return;
      }

      try {
        // CORRECCIÓN: Usar API_URL o mantener tu endpoint limpio sin 'body'
        const response = await fetch(
          `${API_URL}/api/v1/VisitasGuiadas/${visitaId}/confirmar`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            // CORRECCIÓN: Se eliminó el 'body' porque el backend no lo recibe
          },
        );

        if (!response.ok) {
          // CORRECCIÓN: Leer como texto primero para evitar errores de parseo JSON si viene vacío
          const errorText = await response.text();
          let parsedMessage =
            "No se pudo confirmar la visita grupal. El enlace puede haber expirado.";

          try {
            if (errorText) {
              const errorData = JSON.parse(errorText);
              parsedMessage =
                errorData.message ?? errorData.mensaje ?? parsedMessage;
            }
          } catch {
            // Si no era un JSON válido, usamos el texto plano si existe
            if (errorText) parsedMessage = errorText;
          }

          throw new Error(parsedMessage);
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

    confirmarVisitaGrupal();

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
          <p>Estamos confirmando tu visita grupal, por favor espera...</p>
        </div>
      )}

      {status === "success" && (
        <div style={{ color: "#2e7d32" }}>
          <h2>✅ ¡Visita grupal confirmada con éxito!</h2>
          <p>
            Tu visita grupal ha sido confirmada correctamente. Redirigiendo a la
            pantalla de inicio de sesión...
          </p>
        </div>
      )}

      {status === "error" && (
        <div style={{ color: "#d32f2f" }}>
          <h2>❌ Error al confirmar la visita grupal</h2>
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
