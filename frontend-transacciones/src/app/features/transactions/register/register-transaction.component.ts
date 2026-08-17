import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CryptoService } from '../../../core/services/crypto.service';
import { TransactionService } from '../services/transaction.service';

/**
 * Formulario de registro de transacción con cifrado AES del secreto.
 */
@Component({
  selector: 'app-register-transaction',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register-transaction.component.html',
  styleUrl: './register-transaction.component.css',
})
export class RegisterTransactionComponent {
  private readonly fb = inject(FormBuilder);
  private readonly crypto = inject(CryptoService);
  private readonly txService = inject(TransactionService);

  readonly loading = signal(false);
  readonly successMsg = signal('');
  readonly errorMsg = signal('');

  readonly form = this.fb.nonNullable.group({
    operacion: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
    importe: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
    cliente: ['', [Validators.required, Validators.maxLength(500)]],
    secreto: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.successMsg.set('');
    this.errorMsg.set('');
    const raw = this.form.getRawValue();
    const payload = {
      ...raw,
      secreto: this.crypto.encryptAES(raw.secreto),
    };
    this.txService.registerTransaction(payload).subscribe({
      next: (res) => {
        this.successMsg.set(`Transacción registrada — ID: ${res.id}, Ref: ${res.referencia}, Estatus: ${res.estatus}`);
        this.form.reset();
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('Error al registrar la transacción');
        this.loading.set(false);
      },
    });
  }
}
