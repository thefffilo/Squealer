import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { LoginResponse } from '../../shared-interfaces';
import { API_CONFIG } from 'src/app/api.config';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  userData = {
    user: '',
    pwd: '',
  };

  logosrc: string = './assets/SLogo.png'; 
  tryId: string = '';

  noVip: boolean = false;
  notPro: boolean = false;
  notFound: boolean = false;
  incorrectPwd: boolean = false;
  blocked: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private sharedService: SharedService
  ) {}

  onSubmit() {
    const url = API_CONFIG.url+'auth/smm';

    this.http
      .post<LoginResponse>(url, this.userData)
      .pipe(
        catchError((error: any) => {
          this.noVip = false;
          this.notPro = false;
          this.notFound = false;
          this.incorrectPwd = false;
          this.blocked = false;

          console.log(error.error.message);

          if (error.error.message == 'No VIP associated.') {
            this.noVip = true;
          } else if (error.error.message == 'User not professional.') {
            this.notPro = true;
          } else if (error.error.message == 'User not found.') {
            this.notFound = true;
          } else if (error.error.message == 'Incorrect password') {
            this.incorrectPwd = true;
          } else if (error.error.message == 'Account Blocked') {
            this.blocked = true;
          }


          console.error('Si è verificato un errore:', error);
          return throwError('Errore gestito');
        })
      )
      .subscribe((data) => {
        sessionStorage.setItem('accessToken', data.accessToken);
        sessionStorage.setItem('smmId', data.userid);
        sessionStorage.setItem('smmUsername', this.userData.user);

        this.sharedService.smmUsername = this.userData.user;
        this.sharedService.accessToken = data.accessToken;
        this.sharedService.smmId = data.userid;

        this.router.navigate(['/vipSelect']);
      });
  }
}
