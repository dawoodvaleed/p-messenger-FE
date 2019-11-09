import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../Services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-threads',
  templateUrl: './threads.component.html',
  styleUrls: ['./threads.component.scss']
})
export class ThreadsComponent implements OnInit {

  currentUser = localStorage.getItem('user')
  threadList = []
  selectedThread = {}

  constructor(private fireBaseService: FirebaseService, private router: Router) { }

  ngOnInit() {
    if (this.currentUser) {
      this.fireBaseService.getUserDetail(this.currentUser).subscribe(res => localStorage.setItem('userDetail', JSON.stringify(res.payload.data())))
      this.fireBaseService.getUserThreads(this.currentUser).subscribe(res => {
        this.threadList = res.map(item => item.payload.doc.data())
      })
    } else {
      this.router.navigate(['/']);
    }
  }

  openThread(thread) {
  this.selectedThread = thread
  }
}