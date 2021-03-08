import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { LoaderService } from 'src/app/core/services/loader.service';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  @Output() saveEvent = new EventEmitter();

  @Input() urlCancel: string;

  @Input() formGroup: FormGroup;

  isLoadingForm: Subject<boolean> = this.loaderService.isLoading;

  color = 'primary';
  mode = 'indeterminate';
  value = 50;

  constructor(private loaderService: LoaderService) { }

  ngOnInit() {

  }

  saveForm(): void {
    if (this.saveEvent.observers.length !== 0) {
      this.saveEvent.emit();
    }

  }
}
