import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoRecursosRenovablesListComponent } from './tipo-recursos-renovables-list.component';

describe('TipoRecursosRenovablesListComponent', () => {
  let component: TipoRecursosRenovablesListComponent;
  let fixture: ComponentFixture<TipoRecursosRenovablesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoRecursosRenovablesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoRecursosRenovablesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
