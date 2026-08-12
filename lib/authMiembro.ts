export type SesionMiembro = {
  id: string;
  nombre: string;
  email: string;
};

const TOKEN_KEY = "expansion_miembro_token";
const USER_KEY = "expansion_miembro_user";
const EVENTO_CAMBIO = "expansion-auth-miembro-changed";

export function guardarSesionMiembro(token: string, miembro: SesionMiembro) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(miembro));
  window.dispatchEvent(new Event(EVENTO_CAMBIO));
}

export function obtenerTokenMiembro(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function obtenerMiembro(): SesionMiembro | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function cerrarSesionMiembro() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event(EVENTO_CAMBIO));
}

export function alCambiarSesionMiembro(callback: () => void) {
  window.addEventListener(EVENTO_CAMBIO, callback);
  window.addEventListener("storage", callback); // sincroniza entre pestañas
  return () => {
    window.removeEventListener(EVENTO_CAMBIO, callback);
    window.removeEventListener("storage", callback);
  };
}
