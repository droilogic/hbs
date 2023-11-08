import { Component, Input } from '@angular/core';
import { Owner } from 'src/app/interfaces/owner';

@Component({
  selector: 'app-owner-create',
  templateUrl: './owner-create.component.html',
  styleUrls: ['./owner-create.component.css']
})
export class OwnerCreateComponent {
  newOwnerComment = 'type in a comment';
  dtoOwnerComment = '';
  owner:Owner | undefined;

  onCreateOwner() {

    this.newOwnerComment = this.dtoOwnerComment;
    
  }
}
