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
  showCalculation: boolean;
  answer: string = '';
 
  constructor(
    private http: HttpClient
    ) {}

  ngOnInit(): void {
    this.studentsArray = new FormArray([this.generateDefaultStudent()]);
    this.showCalculation = false;
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
    this.showCalculation = true;
    alert(this.answer);
    this.http.post(`${environment.host}/save-calculation`, {}).subscribe();
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
    const expensesForAllStudents: StudentTotals[] = this.studentsArray.value.map(({ totalExpenses, name }) => ({ totalExpenses, name }));
    const totalCostForEveryone: number = expensesForAllStudents.map(v => v.totalExpenses).reduce((total, num) => total + num);
    const numberOfStudents = expensesForAllStudents.length;
    const studentsNeed2Pay = totalCostForEveryone / numberOfStudents;
    const studentsAccording2Pay = expensesForAllStudents.sort((a, b) => b.totalExpenses - a.totalExpenses);
    const test = studentsAccording2Pay.map((student, i) => {
      let paying = 0;
      if (i != 0) {
        paying = Math.round(((studentsNeed2Pay - student.totalExpenses) + Number.EPSILON) * 100) / 100
        this.answer = this.answer + ` ${student.name} needs to pay $${paying} `;
      }
      return {
        ...student,
        need2Pay: paying
      }
    });

    console.log('test2', test);

    
  }
}
