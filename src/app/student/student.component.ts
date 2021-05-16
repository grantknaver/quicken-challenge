import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-students',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {
  panelOpenState = false;
  students: string[];
  
  constructor() { }

  ngOnInit(): void {
    this.students =['chris', 'chris2', 'chris3'];
  }

}
