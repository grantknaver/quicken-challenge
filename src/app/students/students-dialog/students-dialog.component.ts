import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { StudentTotals } from '../../app.models';

/**
 * @title Dialog with header, scrollable content and actions
 */
@Component({
  selector: 'students-dialog',
  templateUrl: 'students-dialog.component.html',
})
export class StudentsDialog implements OnInit {
  studentsWhoOwe: StudentTotals[];

  constructor(
    public dialogRef: MatDialogRef<StudentsDialog>,
    @Inject(MAT_DIALOG_DATA) public studentRecords: StudentTotals[]
    ) {}

  ngOnInit() {
    this.studentsWhoOwe = this.studentRecords.slice(1);
  }

  test() {
    console.log('studentRecords', this.studentRecords);
  }

  generatePaymentStatements(paymentStatus: number) {
    const absoluteNumber = Math.abs(paymentStatus);
    return paymentStatus > 0 ? `owes ${absoluteNumber}` : `overpaid ${absoluteNumber}`;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
