import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { HotToastService } from '@ngneat/hot-toast';
import { LoginService } from '../login/service/login.service';
import { HttpClientService } from '../shareds/_service/http-client.service';

declare var $: any;
@Component({
  selector: 'app-re-password',
  templateUrl: './re-password.component.html',
  styleUrls: ['./re-password.component.css']
})
export class RePasswordComponent {

  infoRePassForm: FormGroup
  NewPassForm: FormGroup
  infoUser: any;
  inforole: any;

  constructor(
    private toastService: HotToastService,
    private builder: FormBuilder,
    private https: LoginService,
    private http: HttpClientService,
    private router: Router) {
    this.infoRePassForm = this.builder.group({
      RP_username: ['', Validators.required],
      RP_email: ['', Validators.required]
    });
    this.NewPassForm = this.builder.group({
      New_password: ['', Validators.required],
      Con_password: ['', Validators.required]
    });
  }

  ngOnInit(): void {


  }

  Open_RePass() {
    $('#RePass').modal('show');
  }
  Close_RePass() {
    $('#RePass').modal('hide');
    this.infoRePassForm.reset();
  }


  RePass() {

    const formData = new FormData();
    formData.append('user_username', this.infoRePassForm.get('RP_username')?.value);
    formData.append('user_email', this.infoRePassForm.get('RP_email')?.value);

    this.https.Login('/user/re-pass', formData).pipe(first()).subscribe((response: any) => {

      if (response.statusCode == 201) {
        this.infoUser = response.data;
        this.inforole = response.token


        this.toastService.success('เปลี่ยนรหัสผ่านใหม่', {
          duration: 2000
        });
        this.Open_RePass();

      } else {
        if (response.statusCode == 405) {
          this.toastService.error('ไม่มีข้อมูลผู้ใช้ หรือ ข้อมูลไม่ตรงกัน', {
            duration: 2000
          });
        }
      }
      if (response.statusCode == 500) {

        const RpAdname = this.infoRePassForm.get('RP_username')?.value
        const RpAdemail = this.infoRePassForm.get('RP_email')?.value
        const formData = new FormData();
        formData.append('accadmin_name', RpAdname);
        formData.append('accadmin_email', RpAdemail);

        this.https.Login('/admin/re-pass', formData).pipe(first()).subscribe((response: any) => {
          if (response.statusCode == 201) {
            this.infoUser = response.data;
            this.inforole = response.token

            this.toastService.success('เปลี่ยนรหัสผ่านใหม่', { duration: 2000 });
            this.Open_RePass();

          } else {
            if (response.statusCode == 405) {
              this.toastService.error('ไม่มีข้อมูลผู้ใช้ หรือ ข้อมูลไม่ตรงกัน', {
                duration: 2000
              });
            } else {
              this.toastService.error('ไม่มีข้อมูลผู้ใช้ หรือ ข้อมูลไม่ตรงกัน', {
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
    },
      err => {
        const error = err.error.error
        alert('เกิดข้อผิดพลาด');
      }

    );
  }
  New_Pass(userID: number, rol: any) {
    const password = this.NewPassForm.get('New_password')?.value;
    const conpassword = this.NewPassForm.get('Con_password')?.value;



    if (this.NewPassForm.invalid) {
      this.toastService.error('กรอกข้อมูลผิดพลาด', { duration: 2000 });
      return;
    }
    if (password != conpassword) {
      this.toastService.error('รหัสผ่านไม่ตรงกัน', { duration: 2000 });
      return;
    }
    if (rol == 'user') {
      const formData = new FormData();
      formData.append('user_password', password);
      this.http
        .updateData('/user/re-pass/' + userID, formData).pipe(first()).subscribe((response: any) => {
          if (response.statusCode == 201) {
            this.Close_RePass();
            this.ngOnInit();
            this.toastService.success('เปลี่ยนรหัสผ่านสำเร็จ', {
              duration: 2000
            });
            this.router.navigate(['/login'])

          } else if (response.statusCode == 204) {
            this.toastService.error('เกิดข้อผิดพลาด', { duration: 2000 });
          }
        }
          ,
          (error) => {
            const response = error.error;
            if (response.status == 500) {
              this.toastService.error('เกิดข้อผิดพลาด', { duration: 2000 });
            }
          }
        );
    }
    else if (rol == 'admin') {
      const formData = new FormData();
      formData.append('accadmin_password', password);
      this.http
        .updateData('/admin/re-pass/' + userID, formData).pipe(first()).subscribe((response: any) => {
          if (response.statusCode == 201) {
            this.Close_RePass();
            this.ngOnInit();
            this.toastService.success('เปลี่ยนรหัสผ่านสำเร็จ', {
              duration: 2000
            });
            this.router.navigate(['/login'])

          } else if (response.statusCode == 204) {
            this.toastService.error('เกิดข้อผิดพลาด', { duration: 2000 });
          }
        }
          ,
          (error) => {
            const response = error.error;
            if (response.status == 500) {
              this.toastService.error('เกิดข้อผิดพลาด', { duration: 2000 });
            }
          }
        );
    }
    else {
      this.toastService.error('เกิดข้อผิดพลาด AU!!', { duration: 2000 });
    }


  }

}
