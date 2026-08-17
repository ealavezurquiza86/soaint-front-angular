import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { RegisterTransactionComponent } from './features/transactions/register/register-transaction.component';
import { TransactionListComponent } from './features/transactions/list/transaction-list.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    canActivate: [authGuard],
    component: LayoutComponent,
    children: [
      { path: 'registrar', component: RegisterTransactionComponent },
      { path: 'listado', component: TransactionListComponent },
      { path: '', redirectTo: 'listado', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'listado' },
];
