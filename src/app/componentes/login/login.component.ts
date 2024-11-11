import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginDTO } from '../../dto/login-dto';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service';
import { TokenService } from '../../servicios/token.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginDTO: LoginDTO;

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.loginDTO = {} as LoginDTO;
  }

  public logearse() {
    this.authService.loginCliente(this.loginDTO).subscribe({
      next: (data) => {

        this.tokenService.login(data.respuesta.token);

        const decodedToken = this.tokenService.decodePayload(data.respuesta.token);
        const usuario = {
          nombre: decodedToken.nombre,
          apellido: decodedToken.apellido
        };
        this.authService.setUser(usuario);

        const rol = this.tokenService.getRol();
        if (rol === 'CIUDADANO') {
          this.router.navigate(['/']);
        } else if (rol === 'AUXILIAR_RESERVA') {
          this.router.navigate(['/gestion-productos']);
        }
      },
      error: (error) => {
        Swal.fire({
          title: 'Inicio de Sesión',
          text: error.error.respuesta,
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#8b0000'
        });
      },
    });
  }
}
