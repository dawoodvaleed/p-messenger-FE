import { Component, Input } from '@angular/core';
import { FirebaseService } from '../../Services/firebase.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  @Input() selectedThread: any;
  chatList = []
  isGroup: boolean
  subscription

  constructor(private fireBaseService: FirebaseService) { }

  ngOnChanges(changes) {
    this.chatList = []
    this.subscription && this.subscription.unsubscribe()
    const { selectedThread: { currentValue } } = changes
    const id = currentValue.combineUid ? currentValue.combineUid : currentValue.groupID
    this.isGroup = currentValue.combineUid ? false : true
    this.subscription = id ? this.fireBaseService.getChat(id).subscribe(res => {
      this.chatList = res.map(item => item.payload.doc.data())
    }) : null
  }
}
