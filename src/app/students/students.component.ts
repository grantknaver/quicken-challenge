import { Component, OnInit, Output, } from '@angular/core';
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
  @Output()
  panelOpenState = false;
  studentsArray: FormArray;
  currentExpenses: AbstractControl[]
  studentTotals: StudentTotals[];
 
  constructor(
    private http: HttpClient
    ) {}

  ngOnInit(): void {
    this.studentsArray = new FormArray([this.generateDefaultStudent()]);
    this.studentTotals = [{name: '', total: 0}];
  }

  addStudent(): void {
    this.studentsArray.push(this.generateDefaultStudent());
  }

  removeStudent() {

  }

  generateDefaultStudent(): FormGroup {
    return new FormGroup({
      name: new FormControl('Adam', Validators.required),
      expenses: new FormArray([this.generateDefaultExpense()]),
    });
  }

  generateDefaultExpense(): FormGroup {
    return new FormGroup({
      expenseName: new FormControl('', Validators.required),
      expenseCost: new FormControl(null, Validators.required),
    });
  }

  addExpense(expenses: FormArray) {
    expenses.push(this.generateDefaultExpense());
  }

  addStudentExpenses(student: FormGroup, expenses: FormGroup): number {
    const studentTotalsLength = this.studentTotals.length;
    const studentName = student.get('name').value;
    const studentExpense = expenses.get('expenseCost').value;
    const currentTotal = {
      ...this.studentTotals[studentTotalsLength - 1], 
      name: studentName, 
      total: this.studentTotals[studentTotalsLength - 1].total + studentExpense
    };
    this.studentTotals.push(currentTotal);
    // Need more exact way to target rather than studentTotalsLength - 1 (findIndex?)
    return currentTotal.total;
  }

  removeExpense() {}

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
  }

  test() {
    console.log('onChange works');
  }

}
