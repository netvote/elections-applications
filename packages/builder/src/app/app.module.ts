import {BrowserModule} from '@angular/platform-browser';
import {environment} from './../environments/environment';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DynamicFormsCoreModule} from '@ng-dynamic-forms/core';
import {DynamicFormsBootstrapUIModule} from '@ng-dynamic-forms/ui-bootstrap';

import {CoreModule} from './core/core.module';

import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {HomeComponent} from './home/home.component';
import {BuildBallotComponent} from './build-ballot/build-ballot.component';
import {BallotGroupComponent} from './ballot-group/ballot-group.component';
import {BallotSectionComponent} from './ballot-section/ballot-section.component';
import {BallotItemComponent} from './ballot-item/ballot-item.component';
import {BallotBuilderComponent} from './ballot-builder/ballot-builder.component';

import {AngularFireModule} from 'angularfire2';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFireDatabaseModule} from 'angularfire2/database';

import {AuthService} from './services/auth.service';

import {UserProfileComponent} from './user-profile/user-profile.component';
import {BallotListComponent} from './ballot-list/ballot-list.component';
import {LoginComponent} from './login/login.component';
import {AuthGuard} from './core/auth.guard';
import {RegisterComponent} from './register/register.component';

import {GradientDirective} from './directives/gradient.directive';
import {RandomImageDirective} from './directives/random-image.directive';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ToastModule, ToastOptions} from 'ng2-toastr/ng2-toastr';
import {CustomToastOption} from './core/custom-toast';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MainLayoutComponent} from './layouts/main-layout/main-layout.component';
import {LoginLayoutComponent} from './layouts/login-layout/login-layout.component';
import {QRCodeModule} from 'angular2-qrcode';
//import {SpinnerModule} from 'angular-spinners';

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
        path: 'build-ballot',
        component: BuildBallotComponent
      },
      {
        path: 'build-ballot/:id',
        component: BuildBallotComponent
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
      },
      {
        path: 'register',
        component: RegisterComponent
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
    BuildBallotComponent,
    BallotGroupComponent,
    BallotSectionComponent,
    BallotItemComponent,
    UserProfileComponent,
    BallotListComponent,
    LoginComponent,
    RegisterComponent,
    GradientDirective,
    MainLayoutComponent,
    LoginLayoutComponent,
    BallotBuilderComponent,
    RandomImageDirective
  ],
  imports: [
    BrowserModule,
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
    DynamicFormsCoreModule.forRoot(),
    DynamicFormsBootstrapUIModule
  ],
  providers: [AuthService, AuthGuard, {provide: ToastOptions, useClass: CustomToastOption}],
  bootstrap: [AppComponent]
})
export class AppModule {}
