import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientService } from 'src/app/shareds/_service/http-client.service';
import { first } from 'rxjs';
import { LocalStorageService } from 'angular-web-storage'
import { HotToastService } from '@ngneat/hot-toast';

import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { LoginService } from 'src/app/login/service/login.service';



declare var $: any;

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  Adminname = this.loginService.UsernameValue;
  AdminID = this.loginService.UserIDValue;


  p = 1;
  infoAdminAcc: any;
  infoUserAcc: any;
  infoRole: any;
  AdmimaccountForm: FormGroup;
  EditAdminForm: FormGroup;
  EditUserForm: FormGroup;
  submit = false;

  infoAccAdminDel: any;
  infoUserAccDel: any;

  infoAccAdminEdit: any;
  infoAccUserEdit: any;


  constructor(
    private router: Router,
    private builder: FormBuilder,
    private toastService: HotToastService,
    private http: HttpClientService,
    private local: LocalStorageService,
    private loginService: LoginService) {
    this.AdmimaccountForm = this.builder.group({
      accadmin_name: ['', Validators.required],
      accadmin_password: ['', Validators.required],
      accadmin_email: ['', Validators.required],
      con_accadmin_password: ['', Validators.required],
      accadmin_firstname: ['', Validators.required],
      accadmin_lastname: ['', Validators.required],
      role_id: ['1', Validators.required]
    })
    this.EditAdminForm = this.builder.group({
      accadmin_name: ['', Validators.required],
      accadmin_password: ['', Validators.required],
      accadmin_email: ['', Validators.required],
      con_accadmin_password: ['', Validators.required],
      accadmin_firstname: ['', Validators.required],
      accadmin_lastname: ['', Validators.required],
    })
    this.EditUserForm = this.builder.group({
      user_username: ['', Validators.required],
      user_email: ['', Validators.required],
      user_firstname: ['', Validators.required],
      user_lastname: ['', Validators.required],
      user_address: ['', Validators.required]
    })
  }
  ngOnInit(): void {
    // console.log(this.Adminname);
    
    this.http.getData('/accadmin/' + this.AdminID).pipe(first()).subscribe((response: any) => {
      // console.log(response.data);
      if(response.data.deletedAt!==null){
        this.local.clear();
        this.router.navigate(['/login'])
      }
      
    })
    if (this.loginService.roleNameValue != 1) {
      this.local.clear();
      this.router.navigate(['/login'])
      
      
    }
    this.getUserAcc();
    this.getAdminAcc();


  }


  getUserAcc() {
    this.http.getData('/user').pipe(first()).subscribe((response: any) => {
      if (response.status == true) {
        this.infoUserAcc = response.data;
      }
    }, (error) => {
      const response = error.error;
      if (response.status == 500) {
        alert('Failed cant Get Data');
      }
    })
  }

  getAdminAcc() {
    this.http.getData('/accadmin').pipe(first()).subscribe((response: any) => {
      if (response.status == true) {
        this.infoAdminAcc = response.data;
      }
    }, (error) => {
      const response = error.error;
      if (response.status == 500) {
        alert('Failed cant Get Data');
      }
    })
  }
  Open_EditUser() {
    $('#EditUser').modal('show');
  }
  Close_EditUser() {
    $('#EditUser').modal('hide');
    this.EditUserForm.reset();
    this.ngOnInit();
  }
  getUserID_Edit(id: number) {
    this.http.getData('/user/' + id).pipe(first()).subscribe((response: any) => {
      if (response.status == true) {
        this.infoAccUserEdit = response.data;
        this.EditUserForm = this.builder.group({
          user_username: [this.infoAccUserEdit.user_username, Validators.required],
          user_email: [this.infoAccUserEdit.user_email, Validators.required],
          user_firstname: [this.infoAccUserEdit.user_firstname, Validators.required],
          user_lastname: [this.infoAccUserEdit.user_lastname, Validators.required],
          user_address: [this.infoAccUserEdit.user_address, Validators.required]
        });
      }
    });
  }
  resetEditUserForm(id: number) {
    this.http.getData('/user/' + id).pipe(first()).subscribe((response: any) => {
      if (response.status == true) {
        this.infoAccUserEdit = response.data;
        this.EditUserForm = this.builder.group({
          user_username: [this.infoAccUserEdit.user_username, Validators.required],
          user_email: [this.infoAccUserEdit.user_email, Validators.required],
          user_firstname: [this.infoAccUserEdit.user_firstname, Validators.required],
          user_lastname: [this.infoAccUserEdit.user_lastname, Validators.required],
          user_address: [this.infoAccUserEdit.user_address, Validators.required]
        });
      }
    });
  }
  Put_User(id: number) {
    this.submit = true;

    if (this.EditUserForm.invalid) {
      this.toastService.error('กรอกข้อมูลผิดพลาด', { duration: 2000 });
      return;
    }
    const formData = new FormData();
    formData.append('user_firstname', this.EditUserForm.get('user_firstname')?.value);
    formData.append('user_lastname', this.EditUserForm.get('user_lastname')?.value);
    formData.append('user_address', this.EditUserForm.get('user_address')?.value);

    this.http
      .updateData('/user/' + id, formData).pipe(first()).subscribe((response: any) => {
        if (response.statusCode == 201) {
          this.Close_EditUser();
          this.submit = false;
          this.ngOnInit();
          this.toastService.success('แก้ไขข้อมูลสำเร็จ', { duration: 2000 });
        } 
        else  {
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



  Open_EditAdmin() {
    $('#EditAdmin').modal('show');
  }
  Close_EditAdmin() {
    $('#EditAdmin').modal('hide');
    this.EditAdminForm.reset();
    this.ngOnInit();
  }
  getAdminID_Edit(id: number) {
    this.http.getData('/accadmin/' + id).pipe(first()).subscribe((response: any) => {
      if (response.status == true) {
        this.infoAccAdminEdit = response.data;

        this.EditAdminForm = this.builder.group({
          accadmin_name: [this.infoAccAdminEdit.accadmin_name, Validators.required],
          accadmin_password: ['', Validators.required],
          con_accadmin_password: ['', Validators.required],
          accadmin_email: [this.infoAccAdminEdit.accadmin_email, Validators.required],
          accadmin_firstname: [this.infoAccAdminEdit.accadmin_firstname, Validators.required],
          accadmin_lastname: [this.infoAccAdminEdit.accadmin_lastname, Validators.required],
        });
      }
    });
  }
  resetEditAdminForm(id: number) {
    this.http.getData('/accadmin/' + id).pipe(first()).subscribe((response: any) => {
      if (response.status == true) {
        this.infoAccAdminEdit = response.data;
        this.EditAdminForm = this.builder.group({
          accadmin_name: [this.infoAccAdminEdit.accadmin_name, Validators.required],
          accadmin_password: ['', Validators.required],
          con_accadmin_password: ['', Validators.required],
          accadmin_email: [this.infoAccAdminEdit.accadmin_email, Validators.required],
          accadmin_firstname: [this.infoAccAdminEdit.accadmin_firstname, Validators.required],
          accadmin_lastname: [this.infoAccAdminEdit.accadmin_lastname, Validators.required],
        });
      }
    });
  }
  Put_Accadmin(id: number) {
    const password = this.EditAdminForm.get('accadmin_password')?.value;
    const conpassword = this.EditAdminForm.get('con_accadmin_password')?.value;
    this.submit = true;

    if (this.EditAdminForm.invalid) {
      this.toastService.error('กรอกข้อมูลผิดพลาด', { duration: 2000 });
      return;
    }
    if (password != conpassword) {
      this.toastService.error('รหัสผ่านไม่ตรงกัน', { duration: 2000 });
      return;
    }

    const formData = new FormData();
    // formData.append('accadmin_name', this.EditAdminForm.get('accadmin_name')?.value);

    formData.append('accadmin_password', this.EditAdminForm.get('accadmin_password')?.value);
    formData.append('accadmin_email', this.EditAdminForm.get('accadmin_email')?.value);
    formData.append('accadmin_firstname', this.EditAdminForm.get('accadmin_firstname')?.value);
    formData.append('accadmin_lastname', this.EditAdminForm.get('accadmin_lastname')?.value);



    this.http
      .updateData('/accadmin/' + id, formData).pipe(first()).subscribe((response: any) => {
        if (response.statusCode == 201) {
          this.Close_EditAdmin();
          this.submit = false;
          this.ngOnInit();
          this.toastService.success('แก้ไขข้อมูลสำเร็จ', { duration: 2000 });

        } else if (response.statusCode == 404) {
          this.toastService.error('มีชื่อผู้ใช้นี้แล้ว', { duration: 2000 });
        }
        else if (response.statusCode == 405) {
          this.toastService.error('มีอีเมลนี้แล้ว', { duration: 2000 });
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

  Open_DelAccount_Model() {
    $('#DelAccount').modal('show');
  }
  Close_DelAccount_Model() {
    $('#DelAccount').modal('hide');
  }
  Open_DelAccount_Admin() {
    $('#DelAccountAdmin').modal('show');
  }
  Close_DelAccount_Admin() {
    $('#DelAccountAdmin').modal('hide');
  }

  getAdminID_Del(id: number) {
    this.http
      .getData('/accadmin/' + id)
      .pipe(first())
      .subscribe((response: any) => {
        this.infoAccAdminDel = response.data;
      });
  }

  deleteAcountAdmin(id: any) {
    this.http
      .removeData('/accadmin/' + id)
      .pipe(first())
      .subscribe(
        (response: any) => {
          if (response.status == true) {
            this.submit = false;
            this.ngOnInit();
            this.Close_DelAccount_Admin();
            this.toastService.error('ลบข้อมูลสำเร็จ', { duration: 2000 });
            this.infoUserAcc = response.data;

          }
        },
        (error) => {
          const response = error.error;
          if (response.status == 500) {
            alert('can not Delete Data');
          }
        }
      );
  }



  Open_AddminAcc() {
    $('#AddminAcc').modal('show');
  }
  Close_AddminAcc() {
    $('#AddminAcc').modal('hide');
    this.submit = false
    this.AdmimaccountForm = this.builder.group({
      accadmin_name: ['', Validators.required],
      accadmin_password: ['', Validators.required],
      accadmin_email: ['', Validators.required],
      con_accadmin_password: ['', Validators.required],
      accadmin_firstname: ['', Validators.required],
      accadmin_lastname: ['', Validators.required],
      role_id: ['1', Validators.required]
    })
  }

  getUserID_Del(id: number) {
    this.http
      .getData('/user/' + id)
      .pipe(first())
      .subscribe((response: any) => {
        this.infoUserAccDel = response.data;
      });
  }
  deleteAcount(id: any) {
    this.http
      .removeData('/user/' + id)
      .pipe(first())
      .subscribe(
        (response: any) => {
          if (response.status == true) {
            this.submit = false;
            this.ngOnInit();
            this.Close_DelAccount_Model();
            this.toastService.error('ลบข้อมูลสำเร็จ', { duration: 2000 });
            this.infoUserAcc = response.data;

          }
        },
        (error) => {
          const response = error.error;
          if (response.status == 500) {
            alert('can not Delete Data');
          }
        }
      );
  }
  createAddminAcc() {
    const password = this.AdmimaccountForm.get('accadmin_password')?.value;
    const conpassword = this.AdmimaccountForm.get('con_accadmin_password')?.value;
    this.submit = true;
    if (this.AdmimaccountForm.invalid) {
      this.toastService.error('กรอกข้อมูลผิดพลาด', { duration: 2000 });
      return;
    }
    if (password != conpassword) {
      this.toastService.error('รหัสผ่านไม่ตรงกัน', { duration: 2000 });
      return;
    }
    const formData = new FormData();
    formData.append('accadmin_name', this.AdmimaccountForm.get('accadmin_name')?.value);
    formData.append('accadmin_password', this.AdmimaccountForm.get('accadmin_password')?.value);
    formData.append('accadmin_email', this.AdmimaccountForm.get('accadmin_email')?.value);
    formData.append('accadmin_firstname', this.AdmimaccountForm.get('accadmin_firstname')?.value);
    formData.append('accadmin_lastname', this.AdmimaccountForm.get('accadmin_lastname')?.value);
    formData.append('role_id', this.AdmimaccountForm.get('role_id')?.value);

    this.http
      .createDatauser('/accadmin', formData).pipe(first()).subscribe((response: any) => {
        if (response.statusCode == 201) {
          this.Close_AddminAcc();
          this.submit = false;
          this.ngOnInit();
          this.toastService.success('เพิ่มข้อมูลสำเร็จ', { duration: 2000 });

        } else if (response.statusCode == 404) {
          this.toastService.error('มีชื่อผู้ใช้นี้แล้ว', { duration: 2000 });
        }
        else if (response.statusCode == 405) {
          this.toastService.error('มีอีเมลนี้แล้ว', { duration: 2000 });
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

}
