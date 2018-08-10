import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit() {
  }

  username: string
  email: string
  password: string
  confirmPassword: string
  passwordsMatch: boolean = true
  usernameTaken: boolean
  errorMessage: string

  onRegister() {
    if (this.matchPasswords()) {
      this.loginService.register(
        this.username, this.email, this.password
      )
      .then((res) => {
        localStorage.setItem('token', res['token']);
        this.loginService.isLoggedIn = true;
        this.loginService.username = this.username;
        this.router.navigate(['./vault']);
      })
      .catch((msg) => {
        // console.log(`Error Registering ${this.username}`, msg);
        this.username = ''
        this.email = ''
        this.password = ''
        this.confirmPassword = ''
        this.errorMessage = msg
        this.usernameTaken = true
      })
    } else { //Passwords don't match
      this.password = ''
      this.confirmPassword = ''
      this.passwordsMatch = false
    }
  }

  matchPasswords() {
    return (this.password == this.confirmPassword)
  }
}
