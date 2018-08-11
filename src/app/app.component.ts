import { Component, ViewChild, ElementRef } from '@angular/core';
import { LoginService } from './login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('navbarToggler') navbarToggler:ElementRef

  constructor(public loginService: LoginService) { }

  ngOnInit() {
    this.getLoggedInUser();
  }

  navBarTogglerIsVisible():boolean {
    return this.navbarToggler.nativeElement.offsetParent !== null
  }

  collapseNav() {
    if (this.navBarTogglerIsVisible()) {
      this.navbarToggler.nativeElement.click()
    }
  }

  getLoggedInUser() {
    this.loginService.getLoggedInUser()
    .then((res) => {
      return res;
    })
    .catch(() => {
      return undefined;
    })
  }

  isProtected() {
    let onLogin = window.location.href.indexOf('login') > 0;
    let onRegister = window.location.href.indexOf('register') > 0;
    let onHome = window.location.href.indexOf('home') > 0;
    
    return !(this.loginService.isLoggedIn || onLogin || onRegister || onHome);
  }
}
