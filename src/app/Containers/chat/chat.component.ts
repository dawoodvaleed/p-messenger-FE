import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FirebaseService } from '../../Services/firebase.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @Input() selectedThread: any;
  chatList = []
  isGroup: boolean

  constructor(private fireBaseService: FirebaseService) { }

  ngOnInit() { }

  ngOnChanges(changes) {
    const { selectedThread: { currentValue } } = changes
    const id = currentValue.combineUid ? currentValue.combineUid : currentValue.groupID
    this.isGroup = currentValue.combineUid ? false : true
    id ? this.fireBaseService.getChat(id).subscribe(res => {
      this.chatList = res.map(item => item.payload.doc.data())
    }) : null
  }
}
