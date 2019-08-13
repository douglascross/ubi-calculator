import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CitizensChartComponent } from './citizens-chart.component';

describe('CitizensChartComponent', () => {
  let component: CitizensChartComponent;
  let fixture: ComponentFixture<CitizensChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CitizensChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CitizensChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
