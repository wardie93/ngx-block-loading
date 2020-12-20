import { TestBed } from '@angular/core/testing';

import { AnimationHelperService } from './animation-helper.service';

describe('AnimationHelperService', () => {
  let service: AnimationHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnimationHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
