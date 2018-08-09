import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { RouterModule, Routes } from '@angular/router'

// Components
import { AppComponent } from './app.component';
import { VaultComponent } from './components/vault/vault.component';
import { EditComponent } from './components/edit/edit.component';
import { CreateComponent } from './components/create/create.component';
import { HomeComponent } from './components/home/home.component';

// Authentication
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { LogoutComponent } from './components/auth/logout/logout.component';
import { UnauthorizedComponent } from './components/auth/unauthorized/unauthorized.component';

import { PieceService } from './piece.service';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'vault',
    component: VaultComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    VaultComponent,
    EditComponent,
    CreateComponent,
    LoginComponent,
    RegisterComponent,
    LogoutComponent,
    UnauthorizedComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    MDBBootstrapModule.forRoot(),
    HttpClientModule,
    RouterModule.forRoot(routes),
    FormsModule
  ],
  schemas: [ NO_ERRORS_SCHEMA],
  providers: [PieceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
