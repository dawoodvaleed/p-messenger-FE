import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss']
})
export class ThreadComponent implements OnInit {
  @Input() threadName: string;
  @Input() lastMessage: string;
  @Input() threadImg: string;

  constructor() { }

  ngOnInit() {
  }

}
