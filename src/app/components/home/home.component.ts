import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../login.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public loginService: LoginService) { }

  ngOnInit() {
  }

}
