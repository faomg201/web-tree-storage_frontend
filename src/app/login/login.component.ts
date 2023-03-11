import { Component, OnInit } from '@angular/core';
import { LoginService } from './service/login.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { first } from 'rxjs';
import { HotToastService } from '@ngneat/hot-toast';

import { HttpClient } from '@angular/common/http';

declare var $: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;
  sendEmailForm: FormGroup;
  submit = false;

  constructor(
    private toastService: HotToastService,
    private builder: FormBuilder,
    private http: LoginService,
    private https: HttpClient,
    private router: Router) {
    this.loginForm = this.builder.group({
      user_username: ['', Validators.required],
      user_password: ['', Validators.required]
    });

    this.sendEmailForm = this.builder.group({
      send_Email: ['', Validators.required]
    });


  }
  pathNLogin = window.location.pathname;


  ngOnInit(): void {
    console.log(this.pathNLogin);

  }

  login() {

    const formData = new FormData();
    formData.append('user_username', this.loginForm.get('user_username')?.value);
    formData.append('user_password', this.loginForm.get('user_password')?.value);

    this.http.Login('/user/signin', formData).pipe(first()).subscribe((response: any) => {
      if (response.statusCode == 500) {
        const user = this.loginForm.get('user_username')?.value
        const pass = this.loginForm.get('user_password')?.value
        const formData = new FormData();
        formData.append('accadmin_name', user);
        formData.append('accadmin_password', pass);
        this.http.Login('/admin/signin', formData).pipe(first()).subscribe((response: any) => {
          if (response.statusCode == 204) {
            this.toastService.success('เข้าสู่ระบบสำเร็จ', {
              duration: 2000
            });
            this.router.navigate(['/admin'])
          } else {
            // console.log(response);
            this.toastService.error('รหัสผ่านหรือชื่อผู้ใช้ไม่ถูกต้อง', {
              duration: 2000
            });
          }

        }, err => {
          const error = err.error.error
          alert('เกิดข้อผิดพลาด');
        }

        );

      }
      if (response.statusCode == 203) {
        this.toastService.success('เข้าสู่ระบบสำเร็จ', {
          duration: 2000
        });
        this.router.navigate(['/home'])
      } else {
        if (response.statusCode == 406) {
          this.toastService.error('รหัสผ่านหรือชื่อผู้ใช้ไม่ถูกต้อง', {
            duration: 2000
          });
        }

      }
    },
      err => {
        const error = err.error.error
        alert('เกิดข้อผิดพลาด');
      }

    );


  }

  Open_fPass() {
    $('#fPass').modal('show');
  }
  Close_fPass() {
    $('#fPass').modal('hide');
  }
  sendEmail() {
    if (this.sendEmailForm.invalid) {
      this.toastService.error('กรอกข้อมูลผิดพลาด', { duration: 2000 });
      return;
    }

    const email = this.sendEmailForm.get('send_Email')?.value
    const url = 'http://localhost:3000/send-email';
    const body = {
      to: email,
      subject: 'ลืมรหัสผ่านหรือไม่',
      body: `หากคุณลืมรหัสผ่านกรุณา Click link เพื่อเปลี่ยนรหัสผ่าน
      ---------------------------------------

      http://localhost:4200/Re-Password

      ---------------------------------------
      `
    };
    this.toastService.warning('กรุุณารอสักครู่...', { duration: 2000 });
    this.https.post(url, body, email).subscribe(

      res => console.log('Email sent'),
      err => {
        const error = err.error.error
        console.log(error);


        if (err.status == 200) {

          this.Close_fPass();
          this.toastService.warning('กรุุณาตราจสอบที่ อีเมล ของคุณ!', {
            duration: 2000
          });
        } else {

          setTimeout(() => {
            this.Close_fPass();
            this.toastService.error('ไม่มี email นี้ในฐานข้อมูล', {
              duration: 2000
            });
            console.error('Error sending email:', err)
          }, 2000);

        }
      }
    );
  }

}
