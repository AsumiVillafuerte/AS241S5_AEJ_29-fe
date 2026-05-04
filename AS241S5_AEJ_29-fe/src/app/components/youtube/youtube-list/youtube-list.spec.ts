import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YoutubeList } from './youtube-list';

describe('YoutubeList', () => {
  let component: YoutubeList;
  let fixture: ComponentFixture<YoutubeList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YoutubeList],
    }).compileComponents();

    fixture = TestBed.createComponent(YoutubeList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
