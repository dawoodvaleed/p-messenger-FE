import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {
  @Input() message: string
  @Input() dateTime: string
  @Input() senderId: string
  @Input() senderName: string
  @Input() isGroup: string

  currentUserId = localStorage.getItem('user')

  constructor() { }
}
