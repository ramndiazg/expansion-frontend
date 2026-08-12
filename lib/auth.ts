export type SesionUsuario = {
  id: string;
  nombre: string;
  email: string;
  rol: "admin" | "publicador";
};

const TOKEN_KEY = "expansion_admin_token";
const USER_KEY = "expansion_admin_user";
const EVENTO_CAMBIO = "expansion-auth-usuario-changed";

export function guardarSesion(token: string, usuario: SesionUsuario) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(usuario));
  window.dispatchEvent(new Event(EVENTO_CAMBIO));
}

export function obtenerToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function obtenerUsuario(): SesionUsuario | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function cerrarSesion() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event(EVENTO_CAMBIO));
}

export function alCambiarSesionUsuario(callback: () => void) {
  window.addEventListener(EVENTO_CAMBIO, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENTO_CAMBIO, callback);
    window.removeEventListener("storage", callback);
  };
}
