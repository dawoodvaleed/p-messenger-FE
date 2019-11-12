import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire'
import { AngularFirestoreModule } from '@angular/fire/firestore'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ThreadsComponent } from './Containers/threads/threads.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatTooltipModule, MatProgressSpinnerModule } from '@angular/material';
import { ThreadComponent } from './Components/thread/thread.component';
import { LoginComponent } from './Containers/login/login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ChatComponent } from './Containers/chat/chat.component';
import { MessageComponent } from './Components/message/message.component';
import { NewComponent, UploadFileDialog } from './Containers/new/new.component';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { ConvertDate } from './Services/util.service';

@NgModule({
  declarations: [
    AppComponent,
    ThreadsComponent,
    ThreadComponent,
    LoginComponent,
    ChatComponent,
    MessageComponent,
    NewComponent,
    UploadFileDialog,
    ConvertDate,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    ReactiveFormsModule,
    FormsModule,

    // FireStore Modules
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    BrowserAnimationsModule,

    // Material Modules
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [UploadFileDialog]
})
export class AppModule { }
