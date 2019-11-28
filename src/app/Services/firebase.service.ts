import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { from } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { finalize, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private fireAuth: AngularFireAuth, private store: AngularFirestore, private http: HttpClient) { }

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

  changeLastSeen(id) {
    const currentUserId = localStorage.getItem('user')
    this.store.collection('Allthreads')
      .doc(currentUserId)
      .collection('threads')
      .doc(id)
      .update({ isLastMsgSeen: true })
  }

  pushNotification(ids, body, title?) {
    const currentUserId = localStorage.getItem('user');
    let subscriptions = []
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `key=AAAAJ8mHfOM:APA91bERrvetSLXTGxfsotgKzbnLvvyuC8O8i38iR2k5f427oTCiI5jLK2aEZuW4sfqjigVXpAX1Uz2T0jvd1aHwUnQz0PSqLsdOy6UZuYI9IoQI1h8GMVLVEvr1jnv8oPR6cEOnUXn2`);
    ids.map(id => {
      if (id !== currentUserId)
        subscriptions.push(this.store
          .collection('users')
          .doc(id)
          .snapshotChanges()
          .subscribe(res => {
            const obj = {
              registration_ids: [res.payload.data()['fcmDeviceToken']],
              notification: {
                body: body.messageType == 1 ? `🖼️ Image` : body.message,
                title: title ? title : res.payload.data()['name'],
                sound: "default"
              }
            }
            subscriptions.push(this.http.post('https://fcm.googleapis.com/fcm/send', obj, { headers: headers })
              .pipe(finalize(() => subscriptions.forEach(subscription => subscription.unsubscribe())))
              .subscribe())
          }))
    })
  }

  sendMessage(id, obj, thread) {
    const currentUserId = localStorage.getItem('user')
    let uids = []
    if (thread.combineUid) {
      thread.combineUid.split("|$|").map(uid => {
        uids.push(uid)
        this.store
          .collection('Allthreads')
          .doc(uid)
          .collection('threads', ref => ref.where('combineUid', '==', thread.combineUid))
          .get()
          .subscribe(res => {
            res.docs.map(ele => {
              ele.ref.update({
                dateTime: obj.dateTime,
                senderUid: obj.sendUid,
                isLastMsgSeen: uid === currentUserId ? true : false,
                lastMessage: obj.messageType == 1 ? `🖼️ Image` : obj.message,
              })
            })
          })
      })
      this.pushNotification(uids, obj)
    } else {
      let name = ''
      this.store
        .collection('AllGroups')
        .doc(thread.groupID)
        .get()
        .pipe(finalize(() => this.pushNotification(uids, obj, name)))
        .subscribe(res => res.data()['groupMembers'].map(user => {
          name = res.data()['groupName']
          uids.push(user.uid)
          this.store
            .collection('Allthreads')
            .doc(user.uid)
            .collection('threads', ref => ref.where('groupID', '==', thread.groupID))
            .get()
            .subscribe(res => {
              res.docs.map(ele => {
                ele.ref.update({
                  dateTime: obj.dateTime,
                  isLastMsgSeen: user.uid === currentUserId ? true : false,
                  lastMessage: obj.messageType == 1 ? `🖼️ Image` : obj.message,
                })
              })
            })
        }))
    }
    return this.store.collection('allMessages').doc(id).collection('messages').add(obj)
  }
}