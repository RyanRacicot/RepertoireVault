import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
  invalidLogin: boolean = false;

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit() { }

  onLogin() {
  this.loginService.login(
    this.username, this.password)
    .then((res) => {
      localStorage.setItem('token', res['token']);
      this.loginService.isLoggedIn = true;
      this.loginService.username = this.username;
      this.router.navigate(['./vault']);
    })
    .catch((msg) => {
      this.username = '';
      this.password = '';
      // Display that username / password is incorrect
      this.invalidLogin = true;
    })
  };
}
