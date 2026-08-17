/** Payload de registro de transacción. */
export interface TransactionRequest {
  operacion: string;
  importe: string;
  cliente: string;
  secreto: string;
}

/** Comprobante plano devuelto por API_A (mismo shape que API_B). */
export interface TransactionResponse {
  id: string;
  estatus: string;
  referencia: string;
  operacion: string;
}

/** Ítem del listado paginado. */
export interface TransactionListItem {
  id: string;
  operacion: string;
  importe: number;
  cliente: string;
  referencia: string;
  estatus: string;
}

/** Normaliza estatus del API (enum `APROBADA` vs etiqueta `Aprobada`). */
function normalizeEstatus(estatus: string | null | undefined): string {
  return (estatus ?? '').trim().toLowerCase();
}

/** True si la transacción está aprobada y puede cancelarse. */
export function isEstatusAprobado(estatus: string | null | undefined): boolean {
  const v = normalizeEstatus(estatus);
  return v === 'aprobada' || v === 'aprobado';
}

/** True si la transacción ya está cancelada. */
export function isEstatusCancelado(estatus: string | null | undefined): boolean {
  const v = normalizeEstatus(estatus);
  return v === 'cancelar' || v === 'cancelada' || v === 'cancelado';
}

/** Respuesta paginada de transacciones. */
export interface TransactionPageResponse {
  content: TransactionListItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

/** Request de cancelación. */
export interface CancelTransactionRequest {
  id: string;
  referencia: string;
  estatus: string;
}
