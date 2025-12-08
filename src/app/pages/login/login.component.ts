import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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


  loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

  constructor(private httpClient: HttpClient) {
    
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Formulário Válido (Login):', this.loginForm.value);
      this.httpClient.post(`${enviroments.apiUrl}/auth/login`, this.loginForm.value).subscribe((response: any) => {
        console.log('Resposta do servidor:', response);
        localStorage.setItem('token', response.token);
       })
    } else {
      console.log('Formulário Inválido');
      this.loginForm.markAllAsTouched();
    }
  }
}
