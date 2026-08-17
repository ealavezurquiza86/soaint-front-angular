import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import {
  CancelTransactionRequest,
  TransactionPageResponse,
  TransactionRequest,
  TransactionResponse,
} from '../models/transaction.models';

/**
 * Cliente HTTP hacia los endpoints de transacciones de API_A.
 * Consume cuerpos JSON planos (sin envelope).
 */
@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly baseUrl = `${environment.apiUrl}/transacciones`;

  constructor(private readonly http: HttpClient) {}

  /** Registra una transacción (secreto ya cifrado). */
  registerTransaction(data: TransactionRequest) {
    return this.http.post<TransactionResponse>(`${this.baseUrl}`, data);
  }

  /** Consulta transacciones paginadas. */
  getTransactions(page = 0, size = 10, sort = 'id,desc') {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', sort);
    return this.http.get<TransactionPageResponse>(this.baseUrl, { params });
  }

  /** Cancela una transacción aprobada (HTTP 200 sin cuerpo). */
  cancelTransaction(data: CancelTransactionRequest) {
    return this.http.patch<void>(`${this.baseUrl}/cancelar`, data);
  }
}
