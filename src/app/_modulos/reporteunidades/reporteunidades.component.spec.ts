import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteunidadesComponent } from './reporteunidades.component';

describe('ReporteunidadesComponent', () => {
  let component: ReporteunidadesComponent;
  let fixture: ComponentFixture<ReporteunidadesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteunidadesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteunidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
