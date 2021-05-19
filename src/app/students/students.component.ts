import { 
  Component, 
  OnInit,
  Output, 
} from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { StudentTotals } from '../app.models';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {
  @Output()panelOpenState = false;
  studentsArray: FormArray;
  currentExpenses: AbstractControl[] = [];
  studentTotals: StudentTotals[] = [];
  dumpArr: any[] = [];
 
  constructor(
    private http: HttpClient
    ) {}

  ngOnInit(): void {
    this.studentsArray = new FormArray([this.generateDefaultStudent()]);
  }

  addStudent(): void {
    this.studentsArray.push(this.generateDefaultStudent());
  }

  removeStudent(studentIndex: number) {
    studentIndex != 0 ? this.studentsArray.removeAt(studentIndex) : null;
    this.updateStudentExpense(studentIndex);
  }

  generateDefaultStudent(): FormGroup {
    return new FormGroup({
      name: new FormControl('', Validators.required),
      expenses: new FormArray([this.generateDefaultExpense()]),
      totalExpenses: new FormControl(0, Validators.required),
    });
  }

  generateDefaultExpense(): FormGroup {
    return new FormGroup({
      expenseName: new FormControl('', Validators.required),
      expenseCost: new FormControl(0, Validators.required),
    });
  }

  addExpense(expenses: AbstractControl[]): void {
    expenses.push(this.generateDefaultExpense());
  }

  removeExpense(expenses: AbstractControl[], expenseIndex: number): void {
    expenseIndex != 0 ? expenses.splice(expenseIndex, 1) : null;
  }

  combineTotal(arr: []) {

  }

  getStudentName(fg: FormGroup): string {
    return fg.get('name').value;
  }

  getExpenses(fg: FormGroup): AbstractControl[] {
    const fa = fg.get('expenses') as FormArray;
    this.currentExpenses = fa.controls;
    return fa.controls;
  }

  calculate() {
    const answer = {
      message: 'Calculation Complete', 
      studentsOwe: this.studentTotals
    };
    this.http.post(`${environment.host}/save-calculation`, answer).subscribe();
    console.log('studentTotals', this.studentTotals);
  }

  getStudentFormGroup(studentIndex): FormGroup {
    const studentFormGroup: FormGroup = this.studentsArray.at(studentIndex) as FormGroup;
    return studentFormGroup;
  }

  getStudentExpense(studentIndex): FormArray {
    const studentFormGroup = this.getStudentFormGroup(studentIndex);
    const studentExpenses: FormArray = studentFormGroup.get('expenses') as FormArray;
    return studentExpenses;
  }

  addStudentExpense(studentIndex) {
    const studentExpenses = this.getStudentExpense(studentIndex);
    studentExpenses.push(this.generateDefaultExpense());
  }

  updateStudentExpense(studentIndex) {
    const studentExpenses = this.getStudentExpense(studentIndex);
    const studentFormGroup = this.getStudentFormGroup(studentIndex);
    const totalExpenseForTheStudent = studentExpenses.value.map(({ expenseCost }) => expenseCost).reduce((sum, itemCost) => sum + itemCost, 0);
    studentFormGroup.patchValue({
      totalExpenses: totalExpenseForTheStudent,
    });
    this.getExpensesForallStudents();
  }

  getExpensesForallStudents() {
    const expensesForAllStudents = this.studentsArray.value.map(({ totalExpenses, name }) => ({ totalExpenses, name }));
    console.log("expensesForAllStudents: ", expensesForAllStudents);
  }

}
