import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterDegreeComponent } from './register-degree.component';

describe('RegisterCourseComponent', () => {
  let component: RegisterDegreeComponent;
  let fixture: ComponentFixture<RegisterDegreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterDegreeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterDegreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
