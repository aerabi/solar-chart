import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartComponent } from './chart.component';
import {DUMMY_JSON} from './chart.component.data';
import {ChartPoint} from './chart.component.model';

describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loadData should work properly', () => {
    const data = component.loadData(DUMMY_JSON);
    const point: ChartPoint & any = {
      time: '0100',
      'i1: Solar in': 0,
      'i2: Load': 84.23,
      'i3: Solar Export': 0,
    };
    expect(data).toContain(point);
  });

  it('normalizeLegendName should work properly', () => {
    const name = component.normalizeLegendName('i2: Solar in');
    expect(name).toEqual('Solar in');
  });

});
