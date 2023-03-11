import { Component, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientService } from 'src/app/shareds/_service/http-client.service';
import { first } from 'rxjs';
import { LocalStorageService } from 'angular-web-storage'
import { HotToastService } from '@ngneat/hot-toast';

import { LoginService } from 'src/app/login/service/login.service';
import { environment } from 'src/environments/environment';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

declare var $: any;

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent {
  private paymentURl = environment.apiUrl;
  payURL: string = this.paymentURl + '/static/payment/'

  // New
  infounpaid: any = [];
  infodelivery:any = [];
  infosucceeded:any = []

  infoOrder: any = [];

  infoOrderImg: any;
  infostatus: any;
  valST: any;

  infopaymentDel:any;  

  public isUnpaid = true;
  public isDelivery = false;
  public isSucceeded = false;

  trackForm:FormGroup
  editMode = false;
  // New---


  constructor(
    private renderer: Renderer2,
    private builder: FormBuilder,
    private router: Router,
    private toastService: HotToastService,
    private http: HttpClientService,
    private local: LocalStorageService,
    private loginService: LoginService) {
      this.trackForm = this.builder.group({
        track_num: ['', Validators.required],
      })
    
  }
  ngOnInit(): void {
    
    if (this.loginService.roleNameValue != 1) {
      this.local.clear();
      this.router.navigate(['/login'])
    }
    //new
    this.getOrder();
    //new
   


  }
  //new
  onClickEdit() {
    console.log('editMode before click', this.editMode);
    this.editMode = true;
    console.log('editMode after click', this.editMode);
  }
  EditTrack(id:number){

  }
  AddTrack(id: number){
    if (this.trackForm.invalid) {
      this.toastService.error('กรอกข้อมูลผิดพลาด', { duration: 2000 });
      return;
    }
    const formData = new FormData();
    formData.append('track_num', this.trackForm.get('track_num')?.value);
    this.http
      .updateData('/payment/' + id, formData).pipe(first()).subscribe((response: any) => {
        if (response.statusCode == 201) {
          this.trackForm.reset();
          this.chStatus(id);
          this.editMode = false;
          // this.infostatus.track_num=response.data
          // this.cancel();
          // this.chStatusClose();
          // this.ngOnInit();
          this.toastService.success('แก้ไขเลขติดตามพัสดุสำเร็จ', { duration: 2000 });
        }
        else {
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
  getOrder() {
    this.http.getData('/payment').pipe(first()).subscribe((response: any) => {
      if (response.status == true) {
        this.infoOrder = response.data;
        console.log(this.infoOrder);
        for (let i = 0; i < this.infoOrder.length; i++) {
         

          this.infounpaid = this.infoOrder.filter((obj: { payment_status: string; }) => obj.payment_status === "unpaid");
          this.infodelivery = this.infoOrder.filter((obj: { payment_status: string; }) => obj.payment_status === "delivery");
          this.infosucceeded = this.infoOrder.filter((obj: { payment_status: string; }) => obj.payment_status === "succeeded");
          
      
        }
        console.log(this.infounpaid);
        console.log(this.infodelivery);
        console.log(this.infosucceeded);

      }
    }, (error) => {
      const response = error.error;
      if (response.status == 500) {
        alert('Failed cant Get Data');
      }
    })
  }

  openImg(id: number) {
    $('#openImg').modal('show');
    this.http.getData('/payment/' + id).pipe(first()).subscribe((response: any) => {
      console.log();

      if (response.status == true) {
        this.infoOrderImg = response.data;
      }
    })
  }
  chStatus(id: number) {
    $('#chStatus').modal('show');
    this.http.getData('/payment/' + id).pipe(first()).subscribe((response: any) => {
      console.log();
      if (response.status == true) {
        this.infostatus = response.data;
        console.log(this.infostatus.payment_status);
        if (this.infostatus.payment_status === 'unpaid') {
          console.log('Payment status is unpaid');
          this.isUnpaid = true;
          setTimeout(() => {
            const unpaidRadio = document.querySelector('input[value="unpaid"]') as HTMLInputElement;
            if (unpaidRadio) {
              this.renderer.setProperty(unpaidRadio, 'checked', true);
            }
          }, 100);
        }
        else if (this.infostatus.payment_status === 'delivery') {
          console.log('Payment status is delivery');
          this.isDelivery = true;
          setTimeout(() => {
            const deliveryRadio = document.querySelector('input[value="delivery"]') as HTMLInputElement;
            if (deliveryRadio) {
              this.renderer.setProperty(deliveryRadio, 'checked', true);
            }
          }, 100);
        }
        else if (this.infostatus.payment_status === 'succeeded') {
          console.log('Payment status is succeeded');
          this.isSucceeded = true;
          setTimeout(() => {
            const succeededRadio = document.querySelector('input[value="succeeded"]') as HTMLInputElement;
            if (succeededRadio) {
              this.renderer.setProperty(succeededRadio, 'checked', true);
            }
          }, 100);
        } else {
          this.toastService.error('เกิดข้อผิดพลาด', { duration: 2000 });
        }
      }
    })
  }
  chStatusClose() {
    $('#chStatus').modal('hide');
  }
  cancel() {
    $('#allowS').modal('hide');
  }

  putStatus(ts: string, id: number) {
    console.log(ts);
    this.valST = ts
    $('#allowS').modal('show');

  }

  allowS(ts: string, id: number) {
    const formData = new FormData();
    formData.append('payment_status', ts);

    this.http.getData('/payment/' + id).pipe(first()).subscribe((response: any) => {
      console.log(response.data.track_num);
      if(response.data.track_num!=null){
        this.http
        .updateData('/payment/' + id, formData).pipe(first()).subscribe((response: any) => {
          if (response.statusCode == 201) {
            this.cancel();
            this.chStatusClose();
            this.ngOnInit();
            this.toastService.success('แก้ไขสถานะสำเร็จ', { duration: 2000 });
          }
          else {
            this.toastService.error('เกิดข้อผิดพลาด', { duration: 2000 });
          }
        }
        );
      }
      else{
        this.toastService.error('ยังไม่มีเลขพัสดุ', { duration: 2000 });
      }
      
    });

    
  }
  getpaymentDel(id: number) {
    this.http
      .getData('/payment/' + id)
      .pipe(first())
      .subscribe((response: any) => {
        this.infopaymentDel = response.data;
      });
  }

  Open_Delpayment() {
    $('#Delpayment').modal('show');
  }
  Close_Delpayment() {
    $('#Delpayment').modal('hide');
  }
  deletePayment(id: any) {
    this.http
      .removeData('/payment/' + id)
      .pipe(first())
      .subscribe(
        (response: any) => {
          if (response.status == true) {
            this.ngOnInit();
            this.Close_Delpayment();
            this.toastService.error('ลบข้อมูลสำเร็จ', { duration: 2000 });
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
  //new





  

}
