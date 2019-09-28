import { Component, OnChanges, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss']
})
export class BadgeComponent implements OnChanges {

  @Input() icon: 'person' | 'cash' = 'person';
  @Input() size = 4;
  @HostBinding('style.width') width: string;
  @HostBinding('style.height') height: string;
  @HostBinding('style.padding') padding: string;

  constructor() { }

  ngOnChanges(changes) {
    this.width = this.size + 'px';
    this.height = this.size + 'px';
    this.padding = (this.size / 4) + 'px';
  }

}
