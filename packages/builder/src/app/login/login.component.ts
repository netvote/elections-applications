import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AuthService} from '../services/auth.service';
import swal from 'sweetalert2/dist/sweetalert2.all.min.js';
import {ToastService} from '../services/toast.service';
import { SpinnerService } from '@chevtek/angular-spinners';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  returnUrl: string;
  showLogin = true;
  authMethod: any;
  rootAccount: string;

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService
  ) {
    this.auth.getEthAccounts().subscribe((accounts)=>{
      this.rootAccount = accounts[0];
    })
  }

  ngOnInit() {
    this.auth.signOut();
  }

  toggleLogin() {
    this.showLogin = !this.showLogin;
    this.authMethod = '';
  }

  login() {

    this.loading = true;
    this.router.navigate(['ballot-list']);
    this.auth.emailLogin(this.model.username, this.model.password)
      .then((data) => {
        console.log(data);
        this.router.navigate(['/']);
      })
      .catch((error) => {

        if (error.message)
          this.toast.error(error.message);

        console.log('Login: ', error.message);
        this.loading = false;
      });
  }

  register() {
    if(this.authMethod === "metamask"){
      if(!this.model.username || !this.model.firstName || !this.model.lastName){
        alert('Missing form values');
        return;
      }

      this.loading = true;

      this.auth.ethSignUp(this.model.username, this.model.firstName,this.model.lastName)
        .then((data)=>{
          this.router.navigate(['/']);
        }).catch(
          (error) => {
            this.loading = false;
          });
    } else if(this.authMethod === "google"){

    }
    //console.log(this.authMethod, this.model.username);
    // this.loading = true;
    // this.auth.emailSignUp(this.model.username, this.model.password, this.model.firstName, this.model.lastName)
    //   .then((data) => {
    //     this.router.navigate(['/']);
    // }).catch(
    // (error) => {
    //   this.loading = false;
    // });
  }

}
