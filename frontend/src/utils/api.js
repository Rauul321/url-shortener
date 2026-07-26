// src/utils/api.js

/**
 * Lee la respuesta de error de cualquier petición HTTP y extrae un mensaje de texto limpio.
 */
export const parseErrorMessage = async (response) => {
    try {
        const contentType = response.headers.get("content-type");

        // Si el backend respondió un JSON con detalles del error
        if (contentType && contentType.includes("application/json")) {
            const data = await response.json();

            // Caso express-validator (array de errores)
            if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
                return data.errors[0].msg || data.errors[0].message;
            }

            // Caso { message: "..." } o { error: "..." }
            return data.message || data.error || "Ocurrió un error inesperado.";
        }

        // Si respondió texto plano
        const text = await response.text();
        return text || `Error HTTP (${response.status})`;
    } catch {
        return "No se pudo interpretar la respuesta del servidor.";
    }
};