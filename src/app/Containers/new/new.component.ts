import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {
  @Input() selectedThread: any
  show: boolean = false

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes) {
    this.show = changes.selectedThread.currentValue.hasOwnProperty('combineUid') ? true : false
  }
}
