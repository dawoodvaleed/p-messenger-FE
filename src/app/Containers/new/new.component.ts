import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FirebaseService } from '../../Services/firebase.service';
import { UtilService } from 'src/app/Services/util.service';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {
  @Input() selectedThread: any
  show: boolean = false
  message = new FormControl('', [Validators.required]);

  constructor(private firebaseService: FirebaseService, private util: UtilService, public dialog: MatDialog) { }

  ngOnInit() { }

  ngOnChanges(changes) {
    this.show = changes.selectedThread.currentValue.hasOwnProperty('combineUid') ? true : false
    this.message.reset()
  }

  send(msg) {
    const id = this.selectedThread.combineUid ? this.selectedThread.combineUid : this.selectedThread.groupID
    const obj = {
      message: msg,
      messageType: "0",
      sendUid: localStorage.getItem('user'),
      senderName: JSON.parse(localStorage.getItem('userDetail')).name,
      dateTime: this.util.getDate()
    }
    this.firebaseService.sendMessage(id, obj, this.selectedThread).then(() => this.message.reset())
  }

  uploadImage(): void {
    this.dialog.open(UploadFileDialog, {
      data: {
        id: this.selectedThread.combineUid ? this.selectedThread.combineUid : this.selectedThread.groupID,
        thread: this.selectedThread
      }
    })
  }
}

@Component({
  selector: 'upload-file-dialog',
  templateUrl: 'upload-file-dialog.html',
  styleUrls: ['./new.component.scss']
})
export class UploadFileDialog {
  fileToUpload: File = null;

  constructor(public dialogRef: MatDialogRef<UploadFileDialog>,
    private util: UtilService,
    private firebaseService: FirebaseService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  upload() {
    let uploadTask = firebase.storage().ref(`images`).child(`${this.util.generateRandom(25)}${this.fileToUpload.name.slice(this.fileToUpload.name.lastIndexOf('.'), this.fileToUpload.name.length)}`).put(this.fileToUpload)
    uploadTask.on('state_changed', (snapshot) => {
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done')
    }, (err) => {
      console.log(err)
    }, () => {
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        const obj = {
          message: downloadURL,
          messageType: "1",
          sendUid: localStorage.getItem('user'),
          senderName: JSON.parse(localStorage.getItem('userDetail')).name,
          dateTime: this.util.getDate()
        }
        this.firebaseService.sendMessage(this.data.id, obj, this.data.thread).then(() => {
          this.fileToUpload = null;
          this.dialogRef.close()
        })
      });
    })
  }
}