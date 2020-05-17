import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResonanceComponent } from './resonance.component';

describe('ResonanceComponent', () => {
  let component: ResonanceComponent;
  let fixture: ComponentFixture<ResonanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResonanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResonanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
