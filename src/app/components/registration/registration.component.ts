import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Registration } from '../../models/registration';
import { RegistrationService } from '../services/registration.service';
import { IsEmailExitsService } from '../services/is-email-exits.service'
declare var jQuery: any;

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  public message;

  constructor(private registrationService: RegistrationService, private router: Router, private isEmailExist: IsEmailExitsService) { }

  ngOnInit() { }

  register(registerForm) {

    console.log("registerForm--->", registerForm);

    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(registerForm.email)) {

      if (registerForm.password.length >= 3) {

        if (registerForm.password == registerForm.confirmPass) {
          this.isEmailExist.isEmailExist(registerForm.email)
            .subscribe(response => {

              if (response['data'].length > 0) {
                this.message = "Email Already Exist"
                jQuery('#myModal').modal('show');
              }
              else {
                const Userdata = {
                  email: registerForm.email,
                  name: registerForm.name,
                  password: registerForm.password,
                }
                this.registrationService.register(Userdata)
                  .subscribe(response => {
                    if (response == 201) {
                      this.message = "Succesfully Registered";
                      jQuery('#registerModal').modal('show');

                      // setTimeout(() => {
                      // jQuery('#myModal').modal('hide');
                      // this.router.navigate(['login']);
                      // }, 1500);
                    }
                  });
              }
            });
        }
        else {
          this.message = "Password not matched";
          jQuery('#myModal').modal('show');
        }
      }
      else {
        this.message = "Password Must Be at Least 3 digit Long";
        jQuery('#myModal').modal('show');
      }
    }
    else {
      this.message = "fill correct email Like somethig@abc.com";
      jQuery('#myModal').modal('show');
    }
  }

  navigaeLoginPage() {
    jQuery('#registerModal').modal('hide');
    this.router.navigate(['login']);
  }

  backToLogin() {
    this.router.navigate(['login']);
  }
}
