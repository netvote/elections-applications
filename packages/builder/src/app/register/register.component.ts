import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  model: any = {};
  loading = false;

  constructor(private router: Router,
    private auth: AuthService) {}

  ngOnInit() {

  }

  register() {
    this.loading = true;
    this.auth.emailSignUp(this.model.username, this.model.password, this.model.firstName, this.model.lastName)
      .then((data) => {
        this.router.navigate(['/']);
      }).catch(
      (error) => {
        this.loading = false;
      });
  }

}
