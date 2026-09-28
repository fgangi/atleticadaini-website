/**
 * Consiglio direttivo: chi ha l'area "direttivo" più chi, pur stando in
 * un'altra area (es. un allenatore), ha una carica nel consiglio. Così una
 * persona con due ruoli si scrive una volta sola nel pannello.
 */
export function membriDirettivo(team: any[]): any[] {
  return team
    .filter((m) => m.area === 'direttivo' || m.carica)
    .map((m) => (m.carica ? { ...m, ruolo: m.carica } : m));
}
