import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService } from './login.service';
import { Piece } from './models/piece.model';

@Injectable({
  providedIn: 'root'
})
export class PieceService {

  @Output() notify: EventEmitter<string> = new EventEmitter<string>();

  // uri = 'http://localhost:4000'
  uri = 'https://obscure-basin-95024.herokuapp.com'
  
  pieceSelected: boolean = false
  editing: boolean = false
  selectedPieceId: string

  selectedPiece: Piece = {
    title: '',
    composer: '',
    opera: '',
    language: '',
    genre: '',
    status: '',
    location: '',
    user: ''
  }
  bufferPiece: Piece = {
    title: '',
    composer: '',
    opera: '',
    language: '',
    genre: '',
    status: '',
    location: '',
    user: ''
  }
  constructor(private http: HttpClient, private loginService: LoginService) { }

  selectPiece(piece) {
    this.selectedPieceId = piece._id
    this.selectedPiece = piece
    this.bufferPiece = {
      title: piece.title,
      composer: piece.composer,
      opera: piece.opera,
      language: piece.language,
      genre: piece.genre,
      status: piece.status,
      location: piece.location,
      user: ''
    }
    this.pieceSelected = true
  }

  selectToEdit(piece) {
    this.selectPiece(piece)
    this.editing = true
  }

  unSelectPiece() {
    this.pieceSelected = false
    this.editing = false
    this.selectedPieceId = ''
    this.selectedPiece = {
      title: '',
      composer: '',
      opera: '',
      language: '',
      genre: '',
      status: '',
      location: '',
      user: ''
    }
    this.bufferPiece = {
      title: '',
      composer: '',
      opera: '',
      language: '',
      genre: '',
      status: '',
      location: '',
      user: ''
    }
  }

  savePiece() {
    let promise = new Promise((resolve, reject) => {
      this.http.put(`${this.uri}/api/vault/${this.selectedPieceId}`, {
      // this.http.post(`${this.uri}/api/auth/myvault/update/${this.selectedPieceId}`,{
        title: this.bufferPiece.title,
        composer: this.bufferPiece.composer,
        opera: this.bufferPiece.opera,
        language: this.bufferPiece.language,
        genre: this.bufferPiece.genre,
        status: this.bufferPiece.status,
        location: this.bufferPiece.location,
        user: ''
      },
        this.postHeaders()).toPromise()
        .then(
          res => {
            this.unSelectPiece()
            resolve(res)
          },
          msg => {
            reject(msg)
          }
        )
    })

    return promise
  }

  getPieces(){
    let promise = new Promise((resolve, reject) => {
      this.http.get(`${this.uri}/api/vault`, this.getHeaders()).toPromise()
      .then(
        res => {
          resolve(res)
        },
        msg => {
          reject(msg)
        }
      )
    });
    return promise
  }

  getPieceById(id) {
    let promise = new Promise((resolve, reject) => {
      this.http.get(`${this.uri}/api/vault/${id}`, this.getHeaders()).toPromise()
      .then(
        res => {
          resolve(res)
        },
        msg => {
          reject(msg)
        }
      )
    })
    return promise
  }

  addPiece(title, composer, opera, language, genre, status, location) {
    let promise = new Promise((resolve, reject) => {
      this.http.post(`${this.uri}/api/vault`, {
        title: title,
        composer: composer,
        opera: opera,
        language: language,
        genre: genre,
        status: status,
        location: location,
        user: ''
      }, this.postHeaders()).toPromise()
        .then(
          res => {
            resolve(res)
          },
          msg => {
            console.log('Error Adding', title)
            reject(msg)
          }
        )
    })
    return promise
  }

  updatePiece(id, title, composer, opera, language, genre, status, location) {
    let promise = new Promise((resolve, reject) => {
      this.http.put(`${this.uri}/api/vault/${id}`, {
        title: title,
        composer: composer,
        opera: opera,
        language: language,
        genre: genre,
        status: status,
        location: location,
        user: ''
      }, this.postHeaders()).toPromise()
        .then(
          res => {
            resolve(res)
          },
          msg => {
            console.log('Error Updating', title)
            reject(msg)
          }
        )
    });
    return promise
  }

  deletePiece(id) {
    let promise = new Promise((resolve, reject) => {
      this.http.delete(`${this.uri}/api/vault/${id}`, this.getHeaders()).toPromise()
      .then(
        res => {
          resolve(res)
        },
        msg => {
          reject(msg)
        }
      )
    })
    return promise
  }

  private getToken() {
    return localStorage.getItem('token')
  }

  private getHeaders() {
    return {
      headers: new HttpHeaders({
        'x-access-token': this.getToken()
      })
    }
  }

  private postHeaders() {
    return {
      headers: new HttpHeaders({
        'x-access-token': this.getToken(),
        'Content-Type': 'application/json'
      })
    }
  }
}
