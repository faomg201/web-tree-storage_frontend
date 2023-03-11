import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {HttpClientService} from '../shareds/_service/http-client.service'
import { first } from 'rxjs';
import { HotToastService } from '@ngneat/hot-toast';
import { Router,ActivatedRoute  } from '@angular/router';



declare var $: any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  accountForm: FormGroup;
  submit = false;
  infoProvince : any;
  p:any;

  constructor(private toastService: HotToastService,
    private builder: FormBuilder,
    private http: HttpClientService,
    private router: Router) {      
    //   console.log(this.submit);
      
    // console.log(this.infoProvince);
      
    this.accountForm = this.builder.group({
      user_username: ['', Validators.required],
      user_password: ['', Validators.required],
      con_user_password: ['', Validators.required],
      user_email: ['', Validators.required],
      user_firstname: ['', Validators.required],
      user_lastname: ['', Validators.required],
      user_address: ['', Validators.required],
      role_id: ['2', Validators.required]
    })
  }

  ngOnInit() {
    
    $(document).ready(function() {
      $.Thailand({
        $district: $('#district'), 
        $amphoe: $('#amphoe'), 
        $province: $('#province'),
        $zipcode: $('#zipcode'), 
      });
    });
  }

  resetFrom() {
    this.ngOnInit();
    this.submit = false
    this.accountForm.reset();
    $("#district").val("");
    $("#amphoe").val("");
    $("#province").val("");
    $("#zipcode").val("");
  }

  get a() {
    return this.accountForm.controls;
  }
  createAccount() {
    const password = this.accountForm.get('user_password')?.value;
    const conpassword = this.accountForm.get('con_user_password')?.value;

    const address = this.accountForm.get('user_address')?.value;
    const district = $('#district').val();
    const amphoe = $('#amphoe').val();
    const province = $('#province').val();
    const zipcode = $('#zipcode').val();
    

    const merge =`บ้านเลขที่ ` +address+` ตำบล/แขวง ` +district+` อำเภอ/เขต `+amphoe+` จังหวัด `+province+` รหัสไปรษณีย์ `+zipcode
 
   
    this.submit = true;

    if (this.accountForm.invalid) {
      this.toastService.error('กรอกข้อมูลผิดพลาด');
      return;
    }
    if (password != conpassword) {
      this.toastService.error('รหัสผ่านไม่ตรงกัน');
      return;
    }

    if (district==='' && amphoe==='' && province==='' && zipcode==='') {
      this.toastService.error('กรอกข้อมูลผิดพลาด');
      return;
    }

    
    const formData = new FormData();
    formData.append('user_username', this.accountForm.get('user_username')?.value);
    formData.append('user_password', this.accountForm.get('user_password')?.value);
    formData.append('user_email', this.accountForm.get('user_email')?.value);
    formData.append('user_firstname', this.accountForm.get('user_firstname')?.value);
    formData.append('user_lastname', this.accountForm.get('user_lastname')?.value);
    formData.append('user_address', merge);
    formData.append('role_id', this.accountForm.get('role_id')?.value);


     console.log(merge);
    
    this.http
      .createDatauser('/user', formData).pipe(first()).subscribe((response: any) => {
        console.log(response);
        if (response.statusCode == 201) {
          $('#CREATE_EMP').modal('hide');
          this.submit = false;
          this.toastService.success('เพิ่มข้อมูลสำเร็จ', {
            duration: 10000,
            style: {
              border: '2px solid green',
              padding: '16px',
              color: 'green',
            },
            iconTheme: {
              primary: 'green',
              secondary: '#FFFAEE',
            },
          });
        //   setTimeout(function(){
        //     window.location.reload();
        //  }, 2000);

         this.router.navigate(['/login'])
         
        } else if (response.statusCode == 404) {
          this.toastService.error('มีชื่อผู้ใช้นี้แล้ว');
        }
        else if (response.statusCode == 405) {
          this.toastService.error('มีอีเมลนี้แล้ว');
        }
      }
        ,
        (error) => {
          const response = error.error;
          if (response.status == 500) {
            this.toastService.error('เกิดข้อผิดพลาด');
          }
        }
      );
  }
}
