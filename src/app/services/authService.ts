import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) {}

  checkRole(expectedRole: string): boolean {
    const role = localStorage.getItem('role');

    if (role !== expectedRole) {
      alert('The page you tried to acess is for ' + expectedRole.toLowerCase() + 's only')
      if(role == null){
        this.router.navigate(['/login']);
      } else{
        this.router.navigate(['/' + role?.toLowerCase() + '-dashboard']);
      }
      
      return false;
    }
    return true;
  }
}