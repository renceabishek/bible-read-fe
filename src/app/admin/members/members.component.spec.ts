import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YouthMembersComponent } from './members.component';

describe('YouthMembersComponent', () => {
  let component: YouthMembersComponent;
  let fixture: ComponentFixture<YouthMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YouthMembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YouthMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
