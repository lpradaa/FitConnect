import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisConexiones } from './mis-conexiones';

describe('MisConexiones', () => {
  let component: MisConexiones;
  let fixture: ComponentFixture<MisConexiones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisConexiones],
    }).compileComponents();

    fixture = TestBed.createComponent(MisConexiones);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
