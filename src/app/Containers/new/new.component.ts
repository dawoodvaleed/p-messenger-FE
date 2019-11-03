import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FirebaseService } from '../../Services/firebase.service';
import { UtilService } from 'src/app/Services/util.service';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {
  @Input() selectedThread: any
  show: boolean = false
  message = new FormControl('', [Validators.required]);

  constructor(private firebaseService: FirebaseService, private util: UtilService) { }

  ngOnInit() { }

  ngOnChanges(changes) {
    this.show = changes.selectedThread.currentValue.hasOwnProperty('combineUid') ? true : false
    this.message.reset()
  }

  send(msg) {
    const id = this.selectedThread.combineUid ? this.selectedThread.combineUid : this.selectedThread.groupID
    const obj = {
      message: msg,
      messageType: 0,
      sendUid: localStorage.getItem('user'),
      senderName: 'Dawood',
      dateTime: this.util.getDate()
    }
    this.firebaseService.sendMessage(id, obj, this.selectedThread).then(() => this.message.reset())
  }
}
