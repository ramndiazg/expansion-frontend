const VOTANTE_KEY = "expansion_votante_id";

export function obtenerVotanteId(): string {
  let id = localStorage.getItem(VOTANTE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VOTANTE_KEY, id);
  }
  return id;
}

export function yaVoto(slug: string): boolean {
  return localStorage.getItem(`expansion_voto_${slug}`) === "1";
}

export function marcarVotado(slug: string) {
  localStorage.setItem(`expansion_voto_${slug}`, "1");
}
