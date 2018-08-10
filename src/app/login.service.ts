import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})

export class LoginService {

  // uri = 'http://localhost:4000'
  uri = 'https://immense-tor-11241.herokuapp.com'
  
  isLoggedIn: boolean = false
  username: string

  constructor(private http: HttpClient) { }

  getLoggedInUser() {
    let promise = new Promise((resolve, reject) => {
      this.http.get(`${this.uri}/api/me`, this.getHeaders()).toPromise()
        .then(
          res => {
            this.isLoggedIn = true
            this.username = res['username']
            resolve(res)
          },
          msg => {
            this.isLoggedIn = false
            reject(msg)
          }
        )
    })
    return promise
  }

  login(username, password) {
    const user = {
      username: username,
      password: password
    }
    let promise = new Promise((resolve, reject) => {
      this.http.post(`${this.uri}/api/login`, user, this.loginHeaders()).toPromise()
        .then(
          res => {
            this.isLoggedIn = true
            this.username = res['username']
            resolve(res)
          },
          msg => {
            this.isLoggedIn = false
            reject(msg)
          }
        )
    })
    return promise
  }

  register(username, email, password) {
    const user = {
      username: username,
      email: email,
      password: password
    }
    let promise = new Promise((resolve, reject) => {
      this.http.post(`${this.uri}/api/register`, user).toPromise()
        .then(
          res => {
            this.isLoggedIn = true
            this.username = res['username']
            resolve(res)
          },
          msg => {
            this.isLoggedIn = false
            reject(msg)
          }
        )
    })
    return promise
  }

  logout() {
    this.isLoggedIn = false
    this.username =''
    localStorage.setItem('token', 'null')
    this.http.post(`${this.uri}/api/logout`, '')
  }
  
  private getToken() {
    return localStorage.getItem('token')
  }

  private getHeaders() {
    return {
      headers: new HttpHeaders({
        'x-access-token': this.getToken()
      })
    };
  }

  private postHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': this.getToken()
      })
    };
  }

  private loginHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
  }
}
