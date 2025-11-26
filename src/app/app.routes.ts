import { Routes } from '@angular/router';
import { LoginComponent } from './components/login.component';
import { CatalogComponent } from './components/catalog.component';
import { PlayerComponent } from './components/player.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'catalog', component: CatalogComponent, canActivate: [AuthGuard] },
  { path: 'player/:id', component: PlayerComponent, canActivate: [AuthGuard] }
];