import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-text-box',
  templateUrl: './search-text-box.component.html',

})
export class SearchTextBoxComponent implements OnInit {
  @Output() dataChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() placeholderName: string;
  @Input() class: string;
  @Input() isMargin: boolean = true;
  constructor() { }

  ngOnInit() {
    this.class = !this.class ? 'col-lg-6 col-md-6 col-sm-12' : this.class;
  }

  onChange(event) {
    this.dataChange.emit(event);
  }

}
