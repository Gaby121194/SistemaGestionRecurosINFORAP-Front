import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-basic-list',
  templateUrl: './basic-list.component.html' 
})
export class BasicListComponent implements OnInit {
  constructor() { }
  @Output() dataChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCreateEvent: EventEmitter<any> = new EventEmitter<any>();
  @Input() title : string  ="";
  @Input() subtitle : string = "";
  @Input() searchPlaceholder : string  ="Buscar";
  @Input() showSearch : boolean = true;
  @Input() showCreate : boolean = false;
  ngOnInit(): void {
  }
  applyFilter(event) {
    this.dataChange.emit(event);
  }
  onCreate(){
    this.onCreateEvent.emit();
  }
}
