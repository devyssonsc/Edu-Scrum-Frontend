import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterSprintComponent } from './register-sprint.component';

describe('RegisterSprintComponent', () => {
  let component: RegisterSprintComponent;
  let fixture: ComponentFixture<RegisterSprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterSprintComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterSprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
