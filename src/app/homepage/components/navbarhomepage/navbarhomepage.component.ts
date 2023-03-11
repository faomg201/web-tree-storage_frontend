import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClientService } from 'src/app/shareds/_service/http-client.service';
import { first } from 'rxjs';
import { LoginService } from 'src/app/login/service/login.service';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-web-storage'
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';

import { ImageCroppedEvent } from 'ngx-image-cropper';

declare var $: any;
@Component({
  selector: 'app-navbarhomepage',
  templateUrl: './navbarhomepage.component.html',
  styleUrls: ['./navbarhomepage.component.css']
})
export class NavbarhomepageComponent {
  @ViewChild('infoEditUserRepass') infoEditUserRepass!: ElementRef;
  // @ViewChild('flush-collapseOne') button!: ElementRef;

  pathNLogin = window.location.pathname;

  imageChangedEvent: any = '';
  croppedImage: any = '';
  fileChangeEvent(event: any) {
    this.imageChangedEvent = event;
    this.previewLoaded = true; ///teasss
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.convertDataUrlToBlob(this.croppedImage);

  }

  convertDataUrlToBlob(dataUrl: any): Blob {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const f = new Blob([u8arr], { type: mime });

    this.blobToFile(f, '777');

    return f;
  }

  public blobToFile = (theBlob: Blob, fileName: string): File => {
    var b: any = theBlob;
    this.imageChangedEvent;
    var Fname: any | File = this.imageChangedEvent.target.files[0];
    var fffff: any = Fname.name;
    b.name = fileName;
    const file = new File([theBlob], fffff, {
      lastModified: new Date().getTime(),
      type: theBlob.type,
    });
    if (file) {
      this.paymentForm.patchValue({
        bankimg_name: file,
      });
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {

        this.previewLoaded = true;
        this.file = reader.result;
      };
    }
    return file;
  };

  file: any;
  previewLoaded = false;



  isShown = false;
  stlist = true;

  infoAboutme: any;
  infoUser: any;
  infolistorder: any;
  infobank: any;

  infoPament: any

  infoUserEdit: any;
  infoUserEditaddress: any;
  EditUserForm: FormGroup
  RepassUserForm: FormGroup
  paymentForm: FormGroup

  myArray: any = [];
  readyPaySum: any = [];
  orderJson: any = [];
  sum: any | number = 0;
  sumDel: number = 0;

  id_pament: any;

  constructor(
    private http: HttpClientService,
    private toastService: HotToastService,
    private loginService: LoginService,
    private local: LocalStorageService,
    private builder: FormBuilder,
    private router: Router,
  ) {
    function generateID(num: number) {
      const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = `#${num}-00`;
      for (let i = 0; i < 7; i++) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
      }
      return result;
    }
    const num = this.UserID
    this.id_pament = generateID(num);
    console.log(this.id_pament);

    this.paymentForm = this.builder.group({
      payment_status: ['unpaid', Validators.required],
      bankimg_name: ['', Validators.required]
    });
    this.EditUserForm = this.builder.group({
      user_username: ['', Validators.required],
      user_email: ['', Validators.required],
      user_firstname: ['', Validators.required],
      user_lastname: ['', Validators.required],
      user_address: ['', Validators.required]
    });
    this.RepassUserForm = this.builder.group({
      ori_password: ['', Validators.required],
      new_password: ['', Validators.required],
      con_password: ['', Validators.required]
    });
  }

  UserN: any = this.loginService.UsernameValue;
  UserID: any = this.loginService.UserIDValue;


  ngOnInit(): void {

    this.getInfoAboutme();
    this.getInfoUser();
    this.getInfoListorder();
    this.getInfoBank();
    this.getPayment();
    $(document).ready(function () {
      $.Thailand({
        $district: $('#district'),
        $amphoe: $('#amphoe'),
        $province: $('#province'),
        $zipcode: $('#zipcode'),
      });
    });
  }

  getPayment() {
    this.http.getData('/payment').pipe(first()).subscribe((response: any) => {


      const newArray = [];
      for (let i = 0; i < response.data.length; i++) {
        const pIDuser = response.data[i].id_payment.split("#")[1].split("-")[0];
        if (pIDuser == this.UserID) {
          newArray.push(response.data[i]);
          this.infoPament = newArray
        }
      }
      console.log( this.infoPament);

    });
  }

  RepassUser() {

    if (this.RepassUserForm.invalid) {
      this.toastService.error('กรอกข้อมูลผิดพลาด', { duration: 2000 });
      return;
    }
    if (this.RepassUserForm.get('new_password')?.value !== this.RepassUserForm.get('con_password')?.value) {
      this.toastService.error('รหัสผ่านใหม่ไม่ตรงกัน', { duration: 2000 });
      return;
    }

    const formData = new FormData();
    formData.append('user_password', this.RepassUserForm.get('ori_password')?.value);
    formData.append('new_password', this.RepassUserForm.get('new_password')?.value);
    this.http.createDatauser('/user/user-repass/' + this.UserID, formData).pipe(first()).subscribe((response: any) => {
      if (response.statusCode == 203) {
        this.http.updateData('/user/user-repass/' + this.UserID, formData).pipe(first()).subscribe((response: any) => {
          if (response.statusCode == 201) {
            this.getInfoUser();
            this.ClEditInforUser();
            this.RepassUserForm.reset();
            this.toastService.success('แก้ไขข้อมูลสำเร็จ', { duration: 2000 });
          }

        });
      } else {
        if (response.statusCode == 406) {
          this.toastService.error('รหัสผ่านเดิมไม่ตรงกัน', { duration: 2000 });
        }
      }
    },
      err => {
        alert('เกิดข้อผิดพลาด');
      }

    );

  }
  tog() {
    this.isShown = !this.isShown;
    const element = this.infoEditUserRepass.nativeElement;
    if (this.isShown) {
      element.classList.add('show');
    } else {
      element.classList.remove('show');
    }
  }

  OpEditInforUser() {
    $('#infoEditUser').modal('show');
    this.getInforUserEdit();
  }
  ClEditInforUser() {
    const element = this.infoEditUserRepass.nativeElement;
    element.classList.remove('show');
    $('#infoEditUser').modal('hide');
    this.EditUserForm.reset();
    this.RepassUserForm.reset();
    this.ngOnInit();



  }
  getInforUserEdit() {
    this.http.getData('/user/infor/' + this.UserID).pipe(first()).subscribe((response: any) => {
      if (response.status == true) {
        this.infoUserEdit = response.data;
        this.infoUserEditaddress = response.token.address

        this.EditUserForm = this.builder.group({
          user_username: [this.infoUserEdit.user_username, Validators.required],
          user_email: [this.infoUserEdit.user_email, Validators.required],
          user_firstname: [this.infoUserEdit.user_firstname, Validators.required],
          user_lastname: [this.infoUserEdit.user_lastname, Validators.required],
          user_address: [this.infoUserEditaddress.user_address, Validators.required]
        });
        $("#district").val(this.infoUserEditaddress.district);
        $("#amphoe").val(this.infoUserEditaddress.amphoe);
        $("#province").val(this.infoUserEditaddress.province);
        $("#zipcode").val(this.infoUserEditaddress.zipcode);
      }
    });
  }
  resetinfoUserEditForm() {
    this.http.getData('/user/infor/' + this.UserID).pipe(first()).subscribe((response: any) => {
      if (response.status == true) {
        this.infoUserEdit = response.data;
        this.infoUserEditaddress = response.token.address

        this.EditUserForm = this.builder.group({
          user_username: [this.infoUserEdit.user_username, Validators.required],
          user_email: [this.infoUserEdit.user_email, Validators.required],
          user_firstname: [this.infoUserEdit.user_firstname, Validators.required],
          user_lastname: [this.infoUserEdit.user_lastname, Validators.required],
          user_address: [this.infoUserEditaddress.user_address, Validators.required]
        });
        $("#district").val(this.infoUserEditaddress.district);
        $("#amphoe").val(this.infoUserEditaddress.amphoe);
        $("#province").val(this.infoUserEditaddress.province);
        $("#zipcode").val(this.infoUserEditaddress.zipcode);
      }
    });
  }
  Put_infoUserEdit() {

    if (this.EditUserForm.invalid) {
      this.toastService.error('กรอกข้อมูลผิดพลาด', { duration: 2000 });
      return;
    }
    const address = this.EditUserForm.get('user_address')?.value;
    const district = $('#district').val();
    const amphoe = $('#amphoe').val();
    const province = $('#province').val();
    const zipcode = $('#zipcode').val();

    const merge = `บ้านเลขที่ ` + address + ` ตำบล/แขวง ` + district + ` อำเภอ/เขต ` + amphoe + ` จังหวัด ` + province + ` รหัสไปรษณีย์ ` + zipcode

    const formData = new FormData();
    formData.append('user_email', this.EditUserForm.get('user_email')?.value);
    formData.append('user_firstname', this.EditUserForm.get('user_firstname')?.value);
    formData.append('user_lastname', this.EditUserForm.get('user_lastname')?.value);
    formData.append('user_address', merge);

    this.http
      .updateData('/user/infor/' + this.UserID, formData).pipe(first()).subscribe((response: any) => {
        if (response.statusCode == 201) {
          this.getInfoUser();
          this.ClEditInforUser();

          this.toastService.success('แก้ไขข้อมูลสำเร็จ', { duration: 2000 });
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

  Open_Oderstatus() {
    $('#Oderstatus').modal('show');
  }
  Close_Oderstatus() {
    $('#Oderstatus').modal('hide');
  }

  Open_infoUser() {
    $('#infoUser').modal('show');
  }
  Close_infoUser() {
    $('#infoUser').modal('hide');
  }

  getInfoListorder() {
    this.http.getData('/listorder').pipe(first()).subscribe((response: any) => {
      const newArray = [];
      for (let i = 0; i < response.data.length; i++) {
        if (response.data[i]?.user_id == this.UserID) {
          newArray.push(response.data[i]);
          this.infolistorder = newArray
        }
      }
    });
  }
  getInfoBank() {
    this.http.getData('/aboutmebank').pipe(first()).subscribe((response: any) => {
      if (response.status == true) {
        this.infobank = response.data;
      }
    },
      (error) => {
        const response = error.error;
        if (response.status == 500) {
          alert('Failed cant Get Data');
        }
      }
    );
  }

  getInfoUser() {
    this.http.getData('/user/' + this.UserID).pipe(first()).subscribe((response: any) => {
      if (response.status == true) {
        this.infoUser = response.data;
      }
    });
  }
  getInfoAboutme() {
    this.http
      .getData('/aboutme')
      .pipe(first())
      .subscribe(
        (response: any) => {
          if (response.status == true) {
            this.infoAboutme = response.data;
          }
        },
        (error) => {
          const response = error.error;
          if (response.status == 500) {
            alert('Failed cant Get Data');
          }
        }
      );
  }

  logout() {
    this.local.clear();
    this.ngOnInit();
    if (this.pathNLogin == '/home') {
      window.location.reload()
    } else {
      this.router.navigate(['/home'])
    }


  }
  delListorder(id: number) {
    let indexToUpdate = this.myArray.findIndex((obj: any) => obj.lsId === id);

    console.log(this.sum);
    console.log(this.myArray.length);
    if (indexToUpdate !== -1) {
      this.toastService.error('มีข้อมูลในชำระเงิน', { duration: 2000 });
      return
    }

    console.log(`ไม่มไ่ไมไ่มีในอาเรย`);
    // this.myArray.splice(indexToUpdate, 1);
    this.http
      .getData('/listorder/' + id)
      .pipe(first())
      .subscribe(() => {
        if (this.infolistorder) {
          const index = this.infolistorder.findIndex((item: { listorder_id: any; }) => item?.listorder_id === id);
          if (index !== -1) {
            // this.infolistorder[index] = null;
            this.infolistorder.splice(index, 1);
            console.log(this.infolistorder);

            this.http.removeData('/listorder/' + id).pipe(first()).subscribe((response: any) => {
              if (response.status == true) {
                this.toastService.success(`ลบรายการ ` + `USwts` + this.UserID + `00` + id + ` สำเร็จ `, { duration: 2000 });
              }
            });
          }
        } else {
          console.log('infolistorder is null or undefined');
        }
      }
      )



  }


  readyPay(id: number) {


    // find index of object with matching lsId
    let indexToUpdate = this.myArray?.findIndex((obj: any) => obj.lsId === id);



    if (indexToUpdate !== -1) {
      // replace object with matching lsId with new object

      this.http
        .getData('/listorder/' + id)
        .pipe(first())
        .subscribe(
          (response: any) => {
            console.log(response.data.listorder_sumprice, `minus`);
            this.sum -= response.data.listorder_sumprice
          }
        );
      this.myArray.splice(indexToUpdate, 1);

    } else {
      // push new object with incremented status
      console.log(indexToUpdate);


      this.http
        .getData('/listorder/' + id)
        .pipe(first())
        .subscribe(
          (response: any) => {
            console.log(response.data.listorder_sumprice, `plus`);
            const order = response.data
            let myObject = { 'lsId': id, 'status': this.myArray.length, order };

            this.sum += response.data.listorder_sumprice
            this.myArray.push(myObject);
          }
        );
    }
    console.log(this.sum);


    console.log(this.myArray);
  }

  payment() {

    const accordionButton = document.getElementById('flush-collapseOne') as HTMLButtonElement;
    const myArray: string[] = [`d`];
    console.log(myArray.length);


    if (myArray.length === 0) {
      console.log(777);

      accordionButton.disabled = true;
    }

    // Remove the event listener that toggles the accordion
    accordionButton.removeEventListener('click', () => {
      $('#flush-collapseOne').collapse('toggle');
    });
  }
  paymentNoti() {
    const allorder = JSON.stringify(this.myArray.map((order: { lsId: any; }) => order.lsId).join(' '));

    if (!this.paymentForm.get('bankimg_name')?.value) {
      this.toastService.error('กรุณาแนบหลักฐานการชำระ', { duration: 2000 });
      return
    }
    for (let i = 0; i < this.myArray.length; i++) {
      var order = `(${i + 1}) ${this.myArray[i].order.treedetail_title} จำนวน ${this.myArray[i].order.listorder_quantity} ต้น ราคา ${this.myArray[i].order.treedetail_price} ราคารวม ${this.myArray[i].order.listorder_sumprice} บาท`
      this.orderJson.push(order)

    }

    const mergeOrder = this.orderJson.join();


    const formData = new FormData();
    formData.append('id_payment', this.id_pament);
    formData.append('payment_sum', this.sum);
    formData.append('delpayment_order', allorder);
    formData.append('payment_order', mergeOrder);
    formData.append('payment_status', this.paymentForm.get('payment_status')?.value);
    formData.append('bankimg_name', this.paymentForm.get('bankimg_name')?.value);
    this.http.createDatauser('/payment', formData).pipe(first()).subscribe((response: any) => {
      if (response.statusCode == 201) {
        // this.Close_Oderstatus();
        this.toastService.success('เพิ่มข้อมูลสำเร็จ', { duration: 3000 });
        this.previewLoaded = false;
        this.imageChangedEvent = false;
        setTimeout(window.location.reload.bind(window.location), 900);



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

  // closeOrder() {
  //   this.previewLoaded = false;
  //   this.imageChangedEvent = false;
  //   this.myArray = [];

  // }





}
