import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NameBoxComponent } from './name-box.component';

describe('NameBoxComponent', () => {
  let component: NameBoxComponent;
  let fixture: ComponentFixture<NameBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NameBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NameBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
