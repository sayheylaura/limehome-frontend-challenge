import { TestBed } from '@angular/core/testing';
import { addClass, removeClass } from './dom';

describe('NotFoundComponent', () => {
  let functRemove = removeClass;
  let functAdd = addClass;

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  it('should add class', () => {
    let elem = document.createElement('div');
    functAdd('test', elem);
    expect(elem.className).toBe('test');
  });

  it('should remove class', () => {
    let elem = document.createElement('div');
    elem.setAttribute('class', 'test');
    functRemove('test', elem);
    expect(elem.className).toBe('');
  });
});
