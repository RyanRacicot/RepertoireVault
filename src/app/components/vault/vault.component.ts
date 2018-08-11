import { Component, OnInit, ViewChild } from '@angular/core';
import { PieceService } from '../../piece.service';
import { ModalDirective } from 'angular-bootstrap-md';

@Component({
  selector: 'vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.scss']
})
export class VaultComponent implements OnInit {

  constructor(public pieceService: PieceService) { }
  @ViewChild('editModal') editModal: ModalDirective
  @ViewChild('deleteModal') deleteModal: ModalDirective

  pieces;
  filterQuery: string; //So filter resets after changes

  ngOnInit() {
    this.refresh()
  }

  selectToEdit(piece) {
    this.pieceService.selectToEdit(piece)
    this.editModal.show()
  }

  refresh() {
    this.pieceService.getPieces()
    .then((res) => {
      this.pieces = res;
      this.filterQuery = ''
    })
    .catch((msg) => {
      console.log('Error fetching pieces')
    })
  }

  filter(event: any) {
    let filter: string = event.target.value.toLowerCase()
    this.filterQuery = event.target.value

    let pieces = document.getElementById('repTable').querySelectorAll('tr');
    Array.from(pieces).forEach((piece) => { // Each piece
      let contains: boolean = false;
      Array.from(piece.childNodes).forEach((field) => { // Each field
        let fieldText = field.textContent.toLowerCase()
        if (fieldText.indexOf(filter) > -1) contains = true
      })
      if (contains) {
        piece.style.display = ''
      } else {
        piece.style.display = 'none'
      }
    })
  }

  // Edit Methods
  onSave() {
    this.pieceService.savePiece()
    .then(
      (res) => {
        this.refresh()
      }
    )
    .catch((msg) => {
      console.log('Failed to save')
    })
  }

  onDelete() {
    this.editModal.hide()
    this.deleteModal.hide()
    this.pieceService.deletePiece(this.pieceService.selectedPieceId)
    .then((res) => {
        this.refresh()
      }
    )
    .catch((msg) => {
        console.log('Error deleting')
      }
    )
  }
}
