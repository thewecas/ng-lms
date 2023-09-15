import { CommonModule } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {

  @ViewChild('header') header!: HTMLElement;
  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    title: string;
    bodyText: string,
    primaryAction: string;
    secondaryAction: string;
    btnColor: string;
  }) {
    setTimeout(() => {
      console.log(this.header);
      console.log(Object(this.header).nativeElement.attributes.color.value);

    }, 2000);


  }
}
