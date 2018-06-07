import {BrowserModule} from '@angular/platform-browser';
import {environment} from './../environments/environment';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {CoreModule} from './core/core.module';

import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {HomeComponent} from './home/home.component';
import {BallotBuilderComponent} from './ballot-builder/ballot-builder.component';
import {BallotAccordionComponent} from './ballot-accordion/ballot-accordion.component';

import {AngularFireModule} from 'angularfire2';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFireDatabaseModule} from 'angularfire2/database';

import {AuthService} from './services/auth.service';

import {UserProfileComponent} from './user-profile/user-profile.component';
import {BallotListComponent} from './ballot-list/ballot-list.component';
import {LoginComponent} from './login/login.component';
import {AuthGuard} from './core/auth.guard';

import {GradientDirective} from './directives/gradient.directive';
import {RandomImageDirective} from './directives/random-image.directive';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {ToastModule, ToastOptions} from 'ng2-toastr/ng2-toastr';
import {CustomToastOption} from './core/custom-toast';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MainLayoutComponent} from './layouts/main-layout/main-layout.component';
import {LoginLayoutComponent} from './layouts/login-layout/login-layout.component';
import {QRCodeModule} from 'angular2-qrcode';
import {SpinnerModule} from '@chevtek/angular-spinners';
import {BallotDatepickerComponent} from './ballot-datepicker/ballot-datepicker.component';


const appRoutes: Routes = [

  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: BallotListComponent
      },
      {
        path: 'ballot-builder',
        component: BallotBuilderComponent
      },
      {
        path: 'ballot-builder/:id',
        component: BallotBuilderComponent
      },
      {
        path: 'ballot-list',
        component: BallotListComponent
      }
    ]
  },
  {
    path: '',
    component: LoginLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      }
    ]
  },
  {path: '**', redirectTo: ''}
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    UserProfileComponent,
    BallotListComponent,
    LoginComponent,
    GradientDirective,
    MainLayoutComponent,
    LoginLayoutComponent,
    BallotBuilderComponent,
    RandomImageDirective,
    BallotAccordionComponent,
    BallotDatepickerComponent 
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    NgbModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    CoreModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    RouterModule.forRoot(appRoutes),
    ToastModule.forRoot(),
    BrowserAnimationsModule,
    QRCodeModule,
    ReactiveFormsModule,
    SpinnerModule
  ],
  providers: [AuthService, AuthGuard, {provide: ToastOptions, useClass: CustomToastOption}],
  bootstrap: [AppComponent]
})
export class AppModule {}
