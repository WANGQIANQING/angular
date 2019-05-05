import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.css']
})
export class StarsComponent implements OnInit, OnChanges {

  @Input()
  rating = 0;
  @Input()
  private readonly = true;

  @Output()
  private ratingChange: EventEmitter<number> = new EventEmitter();
  stars: Array<StarControl>;
  ratingArray: Array<String>;

  constructor() {
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.stars = [];
    this.ratingArray = String(this.rating).split('.');
    // console.log(this.ratingArray);
    if (this.ratingArray.length === 1) {
      for (let i = 1; i < 6; i++) {
        this.stars.push(new StarControl(i > this.rating, false));
      }
    } else {
      for (let i = 1; i < 6; i++) {
        this.stars.push(new StarControl(i > this.rating, i - 0.5 === this.rating));
      }
    }
  }

  ngOnInit() {
  }

  clickStar(index: number) {
    if (!this.readonly) {
      this.rating = index + 1;
      this.ratingChange.emit(this.rating);
    }
  }

}

export class StarControl {
  constructor(
    public empty: boolean,
    public half: boolean
  ) {
  }
}
