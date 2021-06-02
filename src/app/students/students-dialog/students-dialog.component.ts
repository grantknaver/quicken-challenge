import {
  Component, 
  Inject, 
  OnInit
} from '@angular/core';
import { 
  MatDialogRef, 
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { StudentTotals } from '../../app.models';

/**
 * @title Dialog with header, scrollable content and actions
 */
@Component({
  selector: 'students-dialog',
  templateUrl: 'students-dialog.component.html',
  styleUrls: ['./students-dialog.component.scss']
})
export class StudentsDialog implements OnInit {
  studentsWhoOwe: StudentTotals[];
  constructor(
    public dialogRef: MatDialogRef<StudentsDialog>,
    @Inject(MAT_DIALOG_DATA) public dialogData: {calc: StudentTotals[], currentCalculation: boolean}
    ) {}

  ngOnInit(): void {
    this.studentsWhoOwe = this.dialogData.calc.slice(1);
  }

  generatePaymentStatements(paymentStatus: number): {status: string, amount: number} {
    const absoluteNumber = Math.abs(paymentStatus);
    return paymentStatus > 0 ? {status: 'owes', amount: absoluteNumber} : {status: 'overpaid', amount: absoluteNumber};
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
