import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { FirebaseService } from 'src/app/Services/firebase.service';
import { UtilService } from 'src/app/Services/util.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild('loginInput') loginInputElement: ElementRef;

  phoneGroup = new FormGroup({
    phoneControl: new FormControl('', [Validators.required])
  })
  codeForm: FormGroup;
  windowRef: any;
  loginError: string = '';
  spin: boolean = false;
  subscription;

  constructor(public fb: FormBuilder,
    public fireAuthService: FirebaseService,
    public activatedRoute: ActivatedRoute,
    public win: UtilService,
    private router: Router) {
    this.createCodeForm();
  }

  makeRecaptcha() {
    this.windowRef = this.win.windowRef;
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('log-in-button', { 'size': 'invisible' });
  }

  check() {
    this.logIn()
  }

  ngOnInit() {
    if (localStorage.getItem('user')) {
      this.router.navigate(['/mychat']);
    } else {
      this.makeRecaptcha()
    }
  }

  createCodeForm() {
    this.codeForm = this.fb.group({ code: ['', Validators.required] })
  }

  logIn() {
    this.spin = true;
    let appVerifier = this.windowRef.recaptchaVerifier;
    this.fireAuthService.loginPhone(this.phoneGroup.controls.phoneControl.value, appVerifier).pipe(
      finalize(() => {
        appVerifier = null;
        this.spin = false
        this.loginInputElement.nativeElement.focus();
      }),
    ).subscribe(
      res => {
        this.windowRef.confirmationResult = res;
        appVerifier = null
        this.loginError = ''
      },
      err => {
        this.loginError = err.message;
      }
    )
  }

  verifyCode(codeForm: FormGroup) {
    let code: string = codeForm.value.code;
    this.windowRef.confirmationResult.confirm(code).then(userInfo => {
      localStorage.setItem('user', userInfo.user.uid);
      this.subscription = this.fireAuthService.getUserDetail(userInfo.user.uid).subscribe(res => {
        localStorage.setItem('userDetail', JSON.stringify(res.payload.data()));
        this.router.navigate(['/mychat']);
      })
    }).catch(err => { console.log(err) });
  }

  ngOnDestroy() {
    this.subscription && this.subscription.unsubscribe()
  }
}