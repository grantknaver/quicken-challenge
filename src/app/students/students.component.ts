import { 
  Component, 
  OnInit,
  Output, 
} from '@angular/core';
import { 
  FormGroup, 
  FormControl, 
  FormArray, 
  Validators, 
  AbstractControl 
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { StudentTotals } from '../app.models';
import { environment } from '../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { StudentsDialog } from './students-dialog/students-dialog.component';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {
  @Output()panelOpenState = false;
  public studentsArray: FormArray;
  public currentExpenses: AbstractControl[] = [];
  private answerArray: StudentTotals[] = [];
 
  constructor(private http: HttpClient,
    public dialog: MatDialog) {}

  ngOnInit(): void {
    this.studentsArray = new FormArray([this.generateDefaultStudent()]);
  }

  addStudent(): void {
    this.studentsArray.push(this.generateDefaultStudent());
  }

  removeStudent(studentIndex: number): void {
    this.studentsArray.removeAt(studentIndex);
    this.updateStudentExpense(studentIndex);
  }

  generateDefaultStudent(): FormGroup {
    return new FormGroup({
      name: new FormControl(''),
      expenses: new FormArray([this.generateDefaultExpense()]),
      totalExpenses: new FormControl(0, Validators.required),
    });
  }

  generateDefaultExpense(): FormGroup {
    return new FormGroup({
      expenseName: new FormControl(''),
      expenseCost: new FormControl(null, [Validators.required, Validators.min(0)]),
    });
  }

  removeExpense(expenseIndex: number, studentIndex: number): void {
    this.getStudentExpense(studentIndex).removeAt(expenseIndex);
    this.updateStudentExpense(studentIndex);
  }

  calculate(): void {
      if(this.answerArray.length >= 2) {
        this.openDialog(this.answerArray, true);
        this.http.post(`${environment.host}/save-calculation`, this.answerArray)
          .subscribe((info: {message: string}) => {
            console.log(info.message);
          });
      } else {
        alert('Please input the expenses of more than one student!')
      }
  }

  getCalculate(): void {
    this.http.get(`${environment.host}/get-calculation`)
    .subscribe((data: StudentTotals[]) => {
      this.openDialog(data, false);
    });

  }

  getStudentFormGroup(studentIndex: number): FormGroup {
    const studentFormGroup: FormGroup = this.studentsArray.at(studentIndex) as FormGroup;
    return studentFormGroup === undefined ? this.generateDefaultStudent() : studentFormGroup
  }

  // Allows for easier iteration
  getStudentExpensesArray(fg: FormGroup): AbstractControl[] {
    const fa = fg.get('expenses') as FormArray;
    this.currentExpenses = fa.controls;
    return fa.controls;
  }

  getStudentExpense(studentIndex: number): FormArray {
    const studentFormGroup = this.getStudentFormGroup(studentIndex);
    const studentExpenses: FormArray = studentFormGroup.get('expenses') as FormArray;
    return studentExpenses;
  }

  addStudentExpense(studentIndex: number): void {
    const studentExpenses = this.getStudentExpense(studentIndex);
    studentExpenses.push(this.generateDefaultExpense());
  }

  updateStudentExpense(studentIndex: number): void {
    const studentExpenses = this.getStudentExpense(studentIndex);
    const studentFormGroup = this.getStudentFormGroup(studentIndex);
    const totalExpenseForTheStudent = studentExpenses.value.map(({ expenseCost }) => expenseCost).reduce((sum, itemCost) => sum + itemCost, 0);
    studentFormGroup.patchValue({
      totalExpenses: totalExpenseForTheStudent,
    });
    this.getStudentExpensesArrayForallStudents();
  }

  getStudentExpensesArrayForallStudents(): void {
    const expensesForAllStudents: StudentTotals[] = this.studentsArray.value.map(({ totalExpenses, name }, i) => {
      const nameAutoFill = name === '' ? `Student ${i + 1}` : name;
      return {
        totalExpenses,
        name: nameAutoFill
      }
    });
    const totalCostForEveryone: number = expensesForAllStudents.map(v => v.totalExpenses).reduce((total, num) => total + num);
    const numberOfStudents = expensesForAllStudents.length;
    const studentsNeed2Pay = totalCostForEveryone / numberOfStudents;
    const studentsAccording2Pay = expensesForAllStudents.sort((a, b) => b.totalExpenses - a.totalExpenses);
    this.answerArray = studentsAccording2Pay.map((student, i) => {
      let paying = 0;
      if (i != 0) {
        paying = Math.round(((studentsNeed2Pay - student.totalExpenses) + Number.EPSILON) * 100) / 100   
      }
      return {
        ...student,
        need2Pay: paying
      }
    });
  }

  styleRemoveStudentBtn(data: string): string {
    if (data.length === 1) {
      return 'none';
    } else {
      return 'initial';
    }
  }

  styleExpenseBtns(data: FormGroup[]): boolean {
    return data.length === 1;
  }

  generateStudentLabel(index: number): string {
    const name = this.getStudentFormGroup(index).get('name').value  === '' ?  
    `Student #${index + 1}` : 
    this.getStudentFormGroup(index).get('name').value;
    return name;
  }

  openDialog(calc: StudentTotals[] | string, currentCalculation: boolean): void {
    const dialogRef = this.dialog.open(StudentsDialog, {
      width: '80vw',
      maxWidth: '300px',
      data: {calc, currentCalculation}
    });

    dialogRef.afterClosed().subscribe(() => {
      location.reload();
    });
  }

}
