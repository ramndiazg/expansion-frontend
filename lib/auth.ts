export type SesionUsuario = {
  id: string;
  nombre: string;
  email: string;
  rol: "admin" | "publicador";
};

const TOKEN_KEY = "expansion_admin_token";
const USER_KEY = "expansion_admin_user";

export function guardarSesion(token: string, usuario: SesionUsuario) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(usuario));
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
}
