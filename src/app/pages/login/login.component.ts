import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { enviroments } from '../../../enviroments/enviroments';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);


  loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

  constructor(private httpClient: HttpClient) {}

  redirectUser(role: string){
    switch (role) {
      case 'ADMIN':
        this.router.navigate(['/admin-dashboard']);
        break;
      case 'TEACHER':
        this.router.navigate(['/teacher-dashboard']);
        break;
      case 'STUDENT':
        this.router.navigate(['/student-dashboard']);
        break;
  }
  }
  onSubmit() {
  if (this.loginForm.valid) {

    this.httpClient
      .post(`${enviroments.apiUrl}/auth/login`, this.loginForm.value)
      .subscribe({
        next: (response: any) => {
          console.log(response)
          localStorage.setItem('token', response.token);
          localStorage.setItem('id', response.id);
          localStorage.setItem('role', response.role);
          this.redirectUser(response.role);
        },
        error: (error) => {
          console.error('Login error:', error);

          alert('Unable to log in. Please check your credentials.');
        }
      });

  } else {
    this.loginForm.markAllAsTouched();
  }
}
}
