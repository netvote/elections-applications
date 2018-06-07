import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AuthService} from '../services/auth.service';
import swal from 'sweetalert2/dist/sweetalert2.all.min.js';
import {ToastService} from '../services/toast.service';
import { SpinnerService } from '@chevtek/angular-spinners';
import {FormBuilder, FormGroup, FormControl, Validators, COMPOSITION_BUFFER_MODE} from '@angular/forms';
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
  regFirstName: FormControl;
  regLastName: FormControl;
  regEmail: FormControl;

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

    // this.registerForm = formBuilder.group({
    //   regFirstName: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(25), Validators.pattern('^[\w\s-]+$'), Validators.required])],
    //   regLastName: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(25), Validators.pattern('^[\w\s-]+$'), Validators.required])],
    //   regEmail: ['', Validators.compose([ Validators.pattern('[^ @]*@[^ @]*'), Validators.required])]
      
    // });

  }

  ngOnInit() {
    this.auth.signOut();
    
    this.createFormControls();
    this.createForm();
  }

  createFormControls() {
    this.regFirstName = new FormControl('', [Validators.minLength(3), Validators.maxLength(25), Validators.required]);
    this.regLastName = new FormControl('', [Validators.minLength(3), Validators.maxLength(25), Validators.required]);
    this.regEmail = new FormControl('', [Validators.pattern('[^ @]*@[^ @]*'), Validators.required]);
  }

  createForm() {
    this.registerForm = new FormGroup({
      regFirstName: this.regFirstName,
      regLastName: this.regLastName,
      regEmail: this.regEmail
    });
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

      if (!this.registerForm.valid) {

        alert("The registration form has errors. Please try again.");

        return;
      }

      this.loading = true;

      this.auth.ethSignUp(this.regEmail.value, this.regFirstName.value, this.regLastName.value)
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
