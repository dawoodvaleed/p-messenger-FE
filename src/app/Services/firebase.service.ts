import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private fireAuth: AngularFireAuth, private store: AngularFirestore) { }

  loginPhone(phone: string, appVerifier: any) {
    return this.fireAuth.auth.signInWithPhoneNumber(phone, appVerifier)
  }

  getUsers() {
    return this.store.collection('users').snapshotChanges()
  }

  getUserThreads(userId: string) {
    return this.store.collection('Allthreads').doc(userId).collection('threads', red => red.orderBy('dateTime', 'desc')).snapshotChanges()
  }

  getChat(id) {
    return this.store.collection('allMessages').doc(id).collection('messages', red => red.orderBy('dateTime', 'asc')).snapshotChanges()
  }
}