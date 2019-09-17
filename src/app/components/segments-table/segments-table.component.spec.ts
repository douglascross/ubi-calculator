import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentsTableComponent } from './segments-table.component';

describe('SegmentsTableComponent', () => {
  let component: SegmentsTableComponent;
  let fixture: ComponentFixture<SegmentsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SegmentsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SegmentsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
