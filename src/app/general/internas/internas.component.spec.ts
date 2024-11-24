import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternasComponent } from './internas.component';

describe('InternasComponent', () => {
  let component: InternasComponent;
  let fixture: ComponentFixture<InternasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
