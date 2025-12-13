import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logout.component.html', // Aponta para o ficheiro HTML
  styleUrl: './logout.component.scss'     // Aponta para o ficheiro de estilos
})
export class LogoutComponent {
  private router = inject(Router);

  // Getter para decidir se mostra o botão
  get shouldShow(): boolean {
    // Não mostrar o botão na página de login
    return this.router.url !== '/login';
  }

  logout() {
    if(confirm('Are you sure you want to logout?')) {
      // 1. Limpa TODO o localStorage
      localStorage.clear();

      // 2. Redireciona para o Login
      this.router.navigate(['/login']);
    }
  }
}