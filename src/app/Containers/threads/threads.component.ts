import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../Services/firebase.service';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-threads',
  templateUrl: './threads.component.html',
  styleUrls: ['./threads.component.scss']
})
export class ThreadsComponent implements OnInit {
  currentUser = localStorage.getItem('user')
  threadList = []
  selectedThread = {}
  profileImg = ''
  subscriptions = []

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches))

  constructor(private breakpointObserver: BreakpointObserver, private fireBaseService: FirebaseService, private router: Router) { }

  ngOnInit() {
    if (this.currentUser) {
      this.subscriptions.push(this.fireBaseService.getUserDetail(this.currentUser).subscribe(res => {
        this.profileImg = res.payload.data()['image']
        localStorage.setItem('userDetail', JSON.stringify(res.payload.data()))
        this.subscriptions.push(this.fireBaseService.getUserThreads(this.currentUser).subscribe(res => {
          this.threadList = res.map(item => {
            return { docId: item.payload.doc.id, ...item.payload.doc.data() }
          })
        }))
      }))
    } else {
      this.router.navigate(['/']);
    }
  }

  openThread(thread) {
    this.fireBaseService.changeLastSeen(thread.docId)
    this.selectedThread = thread
  }

  ngOnDestroy() {
    this.subscriptions && this.subscriptions.forEach(subscription => subscription.unsubscribe())
  }

  logOut() {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}