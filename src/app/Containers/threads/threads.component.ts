import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../Services/firebase.service';

@Component({
  selector: 'app-threads',
  templateUrl: './threads.component.html',
  styleUrls: ['./threads.component.scss']
})
export class ThreadsComponent implements OnInit {

  currentUser = localStorage.getItem('user')
  threadList = []
  selectedThread = {}

  constructor(private fireBaseService: FirebaseService) { }

  ngOnInit() {
    this.fireBaseService.getUserThreads(this.currentUser).subscribe(res => {
      this.threadList = res.map(item => item.payload.doc.data())
      console.log(this.threadList)
    })
  }

  openThread(thread) {
    this.selectedThread = thread
  }
}