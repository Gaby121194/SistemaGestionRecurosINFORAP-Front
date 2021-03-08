import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecursosrenovablesFormComponent } from './recursosrenovables-form.component';

describe('RecursosrenovablesFormComponent', () => {
  let component: RecursosrenovablesFormComponent;
  let fixture: ComponentFixture<RecursosrenovablesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecursosrenovablesFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecursosrenovablesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
