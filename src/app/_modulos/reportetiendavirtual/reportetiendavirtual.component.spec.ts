import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportetiendavirtualComponent } from './reportetiendavirtual.component';

describe('ReportetiendavirtualComponent', () => {
  let component: ReportetiendavirtualComponent;
  let fixture: ComponentFixture<ReportetiendavirtualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportetiendavirtualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportetiendavirtualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
