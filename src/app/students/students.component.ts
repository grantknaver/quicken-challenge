import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit, Output, } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, AbstractControl } from '@angular/forms';


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

  ngOnInit(): void {
    this.studentsArray = new FormArray([this.generateDefaultStudent()]);
  }

  addStudent() {
    this.studentsArray.push(this.generateDefaultStudent());
  }

  removeStudent() {

  }

  generateDefaultStudent() {
    return new FormGroup({
      name: new FormControl('', Validators.required),
      expenses: new FormArray([this.generateDefaultExpense()]),
    });
  }

  generateDefaultExpense() {
    return new FormGroup({
      expenseName: new FormControl('', Validators.required),
      expenseCost: new FormControl(0, Validators.required),
    });
  }

  addExpense(expenses: FormArray) {
    expenses.push(this.generateDefaultExpense());
  }

  removeExpense() {}

  getStudentName(fg: FormGroup) {
    return fg.get('name').value;
  }

  getExpenses(fg: FormGroup) {
    const fa = fg.get('expenses') as FormArray;
    this.currentExpenses = fa.controls;
    return fa.controls;
  }

  calculate() {
    console.log('calculate works');
  }

}
