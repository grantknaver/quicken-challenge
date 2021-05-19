import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsDialog } from './students-dialog.component';

describe('DialogComponent', () => {
  let component: StudentsDialog;
  let fixture: ComponentFixture<StudentsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentsDialog ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentsDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
