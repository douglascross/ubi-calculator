import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WealthGraphicComponent } from './wealth-graphic.component';

describe('WealthGraphicComponent', () => {
  let component: WealthGraphicComponent;
  let fixture: ComponentFixture<WealthGraphicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WealthGraphicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WealthGraphicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
