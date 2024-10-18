import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportebeneficiosComponent } from './reportebeneficios.component';

describe('ReportebeneficiosComponent', () => {
  let component: ReportebeneficiosComponent;
  let fixture: ComponentFixture<ReportebeneficiosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportebeneficiosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportebeneficiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
