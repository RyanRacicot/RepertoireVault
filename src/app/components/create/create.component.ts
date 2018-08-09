import { Component, OnInit } from '@angular/core';
import { PieceService } from '../../piece.service';
import { Piece } from '../../models/piece.model';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  @Output() notify: EventEmitter<string> = new EventEmitter<string>();

  model = new Piece('','','','','','','','')

  constructor(public pieceService: PieceService) {   }

  ngOnInit() {
  }

  onSubmit(){
    this.pieceService.addPiece(
      this.model.title,
      this.model.composer,
      this.model.opera,
      this.model.language,
      this.model.genre,
      this.model.status,
      this.model.location
    ).then((res) => {
      this.resetModel()
      this.notify.emit('Added piece')
    })
    .catch((msg) => {
      console.log('Failed to Add', this.model.title)
      this.resetModel()
    })
  }

  resetModel() {
    this.model = new Piece('','','','','','','','')
  }

}

