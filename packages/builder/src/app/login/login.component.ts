import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AuthService} from '../services/auth.service';
import swal from 'sweetalert2/dist/sweetalert2.all.min.js';
import {ToastService} from '../services/toast.service';
import { SpinnerService } from '@chevtek/angular-spinners';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
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
  registerForm: FormGroup;

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService,
    public formBuilder: FormBuilder
  ) {
    this.auth.getEthAccounts().subscribe((accounts)=>{
      this.rootAccount = accounts[0];
    })

    this.registerForm = formBuilder.group({
      regFirstName: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(25), Validators.pattern('^[\w\s-]+$'), Validators.required])],
      regLastName: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(25), Validators.pattern('^[\w\s-]+$'), Validators.required])],
      regEmail: ['', Validators.compose([ Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$'), Validators.required])]
      
    });

  }

  ngOnInit() {
    this.auth.signOut();
  }

  toggleLogin() {
    this.showLogin = !this.showLogin;
    this.authMethod = '';
  }

  login() {

    if(this.authMethod === "metamask"){

      this.loading = true;

      this.auth.ethLogin()
        .then((data)=>{
          this.router.navigate(['/']);
        }).catch(
          (error) => {
            this.loading = false;
          });
    } else if(this.authMethod === "google"){
      this.auth.googleLogin()
        .then((data)=>{
          this.router.navigate(['/']);
        }).catch(
          (error) => {
            this.loading = false;
          });;
    }
  }

  register() {

    if(this.authMethod === "metamask"){

      if(!this.model.username || !this.model.firstName || !this.model.lastName){
        alert('Username, First Name and Last Name required for registration');
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

  }

}
