import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepositorioConocimientoComponent } from './repositorio-conocimiento-component';

describe('RepositorioConocimientoComponent', () => {
  let component: RepositorioConocimientoComponent;
  let fixture: ComponentFixture<RepositorioConocimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepositorioConocimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepositorioConocimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
