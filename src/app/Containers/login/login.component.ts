import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase/app';
import { FirebaseService } from 'src/app/Services/firebase.service';
import { UtilService } from 'src/app/Services/util.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  phoneControl = new FormControl('', [Validators.required]);
  showCode: boolean = false
  codeForm: FormGroup;
  windowRef: any;

  constructor(public fb: FormBuilder, public fireAuthService: FirebaseService, public activatedRoute: ActivatedRoute, public win: UtilService) {
    this.createCodeForm();
  }

  ngOnInit() {
    this.windowRef = this.win.windowRef;
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('log-in-button', { 'size': 'invisible' });
  }

  createCodeForm() {
    this.codeForm = this.fb.group({ code: [] })
  }

  logIn(phoneNumber: FormControl) {
    var appVerifier = this.windowRef.recaptchaVerifier;
    console.log(phoneNumber.value);
    this.fireAuthService.loginPhone(phoneNumber.value, appVerifier).then(res => {
      this.windowRef.confirmationResult = res;
      this.showCode = true
    }).catch(err => {
      console.log(err);
    })
  }

  verifyCode(codeForm: FormGroup) {
    let code: string = codeForm.value.code;
    this.windowRef.confirmationResult.confirm(code).then(p => {
      console.log(p);
    }).catch(err => { console.log(err); });
  }
}