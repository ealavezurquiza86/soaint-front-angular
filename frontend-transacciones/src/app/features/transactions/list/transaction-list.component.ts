import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../services/transaction.service';
import {
  isEstatusAprobado,
  isEstatusCancelado,
  TransactionListItem,
} from '../models/transaction.models';

/**
 * Tabla paginada de transacciones con cancelación por ícono (solo aprobadas).
 */
@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.css',
})
export class TransactionListComponent implements OnInit {
  readonly isAprobado = isEstatusAprobado;
  readonly isCancelado = isEstatusCancelado;

  readonly items = signal<TransactionListItem[]>([]);
  readonly page = signal(0);
  readonly size = signal(10);
  readonly pageSizes = [10, 20, 50, 100] as const;
  readonly totalElements = signal(0);
  readonly totalPages = signal(0);
  readonly last = signal(true);
  readonly loading = signal(false);
  readonly cancelling = signal<string | null>(null);

  constructor(private readonly txService: TransactionService) {}

  ngOnInit(): void {
    this.load();
  }

  /** Solo transacciones aprobadas pueden cancelarse. */
  canCancel(tx: TransactionListItem): boolean {
    return isEstatusAprobado(tx.estatus);
  }

  load(): void {
    this.loading.set(true);
    this.txService.getTransactions(this.page(), this.size()).subscribe({
      next: (data) => {
        this.items.set(data.content);
        this.totalElements.set(data.totalElements);
        this.totalPages.set(data.totalPages);
        this.last.set(data.last);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  prevPage(): void {
    if (this.page() > 0) {
      this.page.update((p) => p - 1);
      this.load();
    }
  }

  nextPage(): void {
    if (!this.last()) {
      this.page.update((p) => p + 1);
      this.load();
    }
  }

  /** Cambia el tamaño de página y recarga desde la primera página. */
  changeSize(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    if (!value || value === this.size()) return;
    this.size.set(value);
    this.page.set(0);
    this.load();
  }

  /**
   * Cancela una transacción aprobada (idempotente en UI: un solo request en vuelo por id).
   */
  cancel(tx: TransactionListItem): void {
    if (!this.canCancel(tx) || this.cancelling() === tx.id) return;
    if (!confirm(`¿Cancelar la transacción ${tx.id}?\nEsta acción no se puede deshacer.`)) return;

    this.cancelling.set(tx.id);
    this.items.update((list) =>
      list.map((t) => (t.id === tx.id ? { ...t, estatus: 'CANCELADA' } : t)),
    );

    this.txService
      .cancelTransaction({ id: tx.id, referencia: tx.referencia, estatus: 'cancelar' })
      .subscribe({
        next: () => {
          this.cancelling.set(null);
          this.load();
        },
        error: () => {
          this.cancelling.set(null);
          this.load();
        },
      });
  }
}
