import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private fireAuth: AngularFireAuth, private store: AngularFirestore) { }

  loginPhone(phone: string, appVerifier: any) {
    return from(this.fireAuth.auth.signInWithPhoneNumber(phone, appVerifier))
  }

  getUsers() {
    return this.store
      .collection('users')
      .snapshotChanges()
  }

  getUserDetail(id) {
    return this.store
      .collection('users').doc(id)
      .snapshotChanges()
  }

  getUserThreads(userId: string) {
    return this.store
      .collection('Allthreads')
      .doc(userId)
      .collection('threads', red => red.orderBy('dateTime', 'desc'))
      .snapshotChanges()
  }

  getChat(id) {
    return this.store
      .collection('allMessages')
      .doc(id)
      .collection('messages', red => red.orderBy('dateTime', 'asc'))
      .snapshotChanges()
  }

  sendMessage(id, obj, thread) {
    let subscriptions = []
    if (thread.combineUid) {
      thread.combineUid.split("|$|").map(uid => {
        subscriptions.push(this.store
          .collection('Allthreads')
          .doc(uid)
          .collection('threads', ref => ref.where('combineUid', '==', thread.combineUid))
          .snapshotChanges()
          .subscribe(res => {
            res.map(msg => msg.payload.doc.ref.update({
              dateTime: obj.dateTime,
              senderUid: obj.sendUid,
              isLastMsgSeen: uid == localStorage.getItem('user') ? true : false,
              lastMessage: obj.message,
            }))
            subscriptions.forEach(subscription => subscription.unsubscribe())
          }))
      })
    } else {
      subscriptions.push(this.store
        .collection('AllGroups')
        .doc(thread.groupID)
        .snapshotChanges()
        .subscribe(res => res.payload.data()['groupMembers'].map(user => {
          subscriptions.push(this.store
            .collection('Allthreads')
            .doc(user.uid)
            .collection('threads', ref => ref.where('groupID', '==', thread.groupID))
            .snapshotChanges()
            .subscribe(res => {
              res.map(msg => msg.payload.doc.ref.update({
                dateTime: obj.dateTime,
                isLastMsgSeen: user.uid == localStorage.getItem('user') ? true : false,
                lastMessage: obj.messageType == 1 ? `🖼️ Image` : obj.message,
              }))
              subscriptions.forEach(subscription => subscription.unsubscribe())
            }))
        })))
    }
    return this.store.collection('allMessages').doc(id).collection('messages').add(obj)
  }
}