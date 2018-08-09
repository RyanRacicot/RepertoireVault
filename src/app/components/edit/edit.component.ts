import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { PieceService } from '../../piece.service';
import { ModalDirective } from 'angular-bootstrap-md';

@Component({
  selector: 'edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  @Output() notify: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('deleteModal') deleteModal: ModalDirective;
  constructor(public pieceService: PieceService) { }

  ngOnInit() {
  }

}
