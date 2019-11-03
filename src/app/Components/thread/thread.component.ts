import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss']
})
export class ThreadComponent {
  @Input() threadName: string;
  @Input() lastMessage: string;
  @Input() threadImg: string;
  @Input() lastSeen: string;
  @Input() senderUid: string;

  currentUser = localStorage.getItem('user')

  constructor() { }
}
