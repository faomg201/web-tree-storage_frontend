import { Component } from '@angular/core';

import { ImageCroppedEvent } from 'ngx-image-cropper';
import { HttpClientService } from 'src/app/shareds/_service/http-client.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { environment } from 'src/environments/environment';
import { first } from 'rxjs';

import { LoginService } from 'src/app/login/service/login.service';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-web-storage';


declare var $: any;

@Component({
  selector: 'app-aboutme',
  templateUrl: './aboutme.component.html',
  styleUrls: ['./aboutme.component.css']
})
export class AboutmeComponent {
  private aboutmeimgURl = environment.apiUrl;
  AbImgURL: string = this.aboutmeimgURl + '/static/aboutmeimg/'

  imageChangedEvent: any = '';
  croppedImage: any = '';
  fileChangeEvent(event: any) {
    this.imageChangedEvent = event;
    const blo: Blob = event;
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
      this.AddAboutImgForm.patchValue({
        aboutmeimg_name: file,
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
  p = 1;
  infoMBTI: any;
  infoServiceUs: any;
  infoDel: any;
  AddAboutImgForm: FormGroup;
  submit = false;

  infoAboutme: any;
  infoBank: any;
  infoImgAbMe: any;
  AboutmeForm: FormGroup;
  BankForm: FormGroup;

  infoImgAbMeDel:any;
  infoBankDel: any;

  constructor(
    private http: HttpClientService,
    private toastService: HotToastService,
    private builder: FormBuilder,
    public local:LocalStorageService,
    private router: Router,
    private loginService: LoginService
  ) {
    this.AddAboutImgForm = this.builder.group({
      aboutmeimg_name: ['', Validators.required]
    });

    this.AboutmeForm = this.builder.group({
      aboutme_name: ['', Validators.required],
      aboutme_detail: ['', Validators.required],
      aboutme_tel: ['', Validators.required],
      aboutme_email: ['', Validators.required],
      aboutme_line: ['', Validators.required]
    })

    this.BankForm = this.builder.group({
      aboutmebank_name: ['', Validators.required],
      aboutmebank_number: ['', Validators.required],
      aboutmebank_op_fname: ['', Validators.required],
      aboutmebank_op_lname: ['', Validators.required]
    })
  }
  UserN:any = this.loginService.UsernameValue;
  ngOnInit(): void {
    if(this.loginService.roleNameValue!=1){
      this.local.clear();
    this.router.navigate(['/login'])
    }
    this.getInforBank();
    this.getInforImgAbMe();

    this.http.getData('/aboutme').pipe(first()).subscribe((response: any) => {
      if (response.status == true) {
        this.infoAboutme = response;
        this.AboutmeForm = this.builder.group({
          aboutme_name: [this.infoAboutme.data.aboutme_name, Validators.required],
          aboutme_detail: [this.infoAboutme.data.aboutme_detail, Validators.required],
          aboutme_tel: [this.infoAboutme.data.aboutme_tel, Validators.required],
          aboutme_email: [this.infoAboutme.data.aboutme_email, Validators.required],
          aboutme_line: [this.infoAboutme.data.aboutme_line, Validators.required],
        });
      }
    });

  }
  getInforImgAbMe(){
    this.http.getData('/aboutmeimg').pipe(first()).subscribe((response: any) => {
      if (response.status == true) {
        this.infoImgAbMe = response.data;
      }
    }, (error) => {
      const response = error.error;
      if (response.status == 500) {
        alert('Failed cant Get Data');
      }
    })
  }
  getInforBank(){
    this.http.getData('/aboutmebank').pipe(first()).subscribe((response: any) => {
      if (response.status == true) {
        this.infoBank = response.data;
      }
    }, (error) => {
      const response = error.error;
      if (response.status == 500) {
        alert('Failed cant Get Data');
      }
    })
  }

  resetAboutmeFrom() {
    this.ngOnInit();
    this.infoAboutme.reset();
    this.submit = false
  }
  getImgID_Del(id: number){
    this.http
    .getData('/aboutmeimg/' + id)
    .pipe(first())
    .subscribe((response: any) => {
      this.infoImgAbMeDel = response.data;
    });
  }
  deleteImgID_Del(id: any) {
    this.http
    .removeData('/aboutmeimg/' + id)
    .pipe(first())
    .subscribe(
      (response: any) => {
        if (response.status == true) {
          this.submit = false;
          this.ngOnInit();
          this.Close_DelAboutImg();
          this.toastService.error('ลบข้อมูลสำเร็จ',{duration: 2000});
          this.infoImgAbMe = response.data;
  
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

  Open_AddAboutImg() {
    $('#AddAboutImg').modal('show');
  }
  Close_AddAboutImg() {
    $('#AddAboutImg').modal('hide');
    this.previewLoaded = false;
    this.imageChangedEvent = false;
  }

  Open_DelAboutImg(){
    $('#DelAboutImg').modal('show');
  }
  Close_DelAboutImg(){
    $('#DelAboutImg').modal('hide');
  }

  Open_Addbank() {
    $('#AddBank').modal('show');
  }
  Close_Addbank() {
    $('#AddBank').modal('hide');
    this.submit = false
    this.BankForm.reset();
  }
  Open_DelBank(){
    $('#DelBank').modal('show');
  }
  Close_DelBank(){
    $('#DelBank').modal('hide');
  }

  getBankID_Del(id: number){
    this.http
      .getData('/aboutmebank/' + id)
      .pipe(first())
      .subscribe((response: any) => {
        
        this.infoBankDel = response.data;
      });
  }
  deleteBankID_Del(id: any) {
    this.http
    .removeData('/aboutmebank/' + id)
    .pipe(first())
    .subscribe(
      (response: any) => {
        if (response.status == true) {
          this.submit = false;
          this.ngOnInit();
          this.Close_DelBank();
          this.toastService.error('ลบข้อมูลสำเร็จ',{duration: 2000});
          this.infoImgAbMe = response.data;
  
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

  Add_Bank() {
    this.submit = true;
    if (this.BankForm.invalid) {
      this.toastService.error('กรอกข้อมูลผิดพลาด',{duration: 2000});
      return;
    }
    
    const formData = new FormData();
    formData.append('aboutmebank_name', this.BankForm.get('aboutmebank_name')?.value);
    formData.append('aboutmebank_number', this.BankForm.get('aboutmebank_number')?.value);
    formData.append('aboutmebank_op_fname', this.BankForm.get('aboutmebank_op_fname')?.value);
    formData.append('aboutmebank_op_lname', this.BankForm.get('aboutmebank_op_lname')?.value);

    this.http.createData('/aboutmebank', formData).pipe(first()).subscribe((response: any) => {
      if (response.statusCode == 201) {
        this.Close_Addbank();
        this.getInforBank();
        this.toastService.success('เพิ่มข้อมูลสำเร็จ',{duration: 2000});
      }
    },
      (error) => {
        const response = error.error;
        if (response.status == 500) {
          this.toastService.error('เกิดข้อผิดพลาด',{duration: 2000});
        }
      })
  }



  AddAboutImg() {
    const formData = new FormData();
    formData.append('aboutmeimg_name', this.AddAboutImgForm.get('aboutmeimg_name')?.value);
    this.http.createData('/aboutmeimg', formData).pipe(first()).subscribe((response: any) => {
      if (response.statusCode == 201) {
        this.Close_AddAboutImg();
        this.getInforImgAbMe();
        this.submit = false;
        
        this.toastService.success('เพิ่มข้อมูลสำเร็จ', {duration: 2000});
      }
    },
      (error) => {
        const response = error.error;
        if (response.status == 500) {
          this.toastService.error('เกิดข้อผิดพลาด',{duration: 2000});
        }
      }
    );
  }

  PutAboutme() {

    if (!this.infoAboutme) {

      const formData = new FormData();
      formData.append('aboutme_name', this.AboutmeForm.get('aboutme_name')?.value);
      formData.append('aboutme_detail', this.AboutmeForm.get('aboutme_detail')?.value);
      formData.append('aboutme_tel', this.AboutmeForm.get('aboutme_tel')?.value);
      formData.append('aboutme_email', this.AboutmeForm.get('aboutme_email')?.value);
      formData.append('aboutme_line', this.AboutmeForm.get('aboutme_line')?.value);

      this.http.createData('/aboutme', formData).pipe(first()).subscribe((response: any) => {
        if (response.statusCode == 201) {
          this.toastService.success('เพิ่มข้อมูลสำเร็จ', {duration: 2000});
        }
      },
        (error) => {
          const response = error.error;
          if (response.status == 500) {
            this.toastService.error('เกิดข้อผิดพลาด',{duration: 2000});
          }
        })
    }
    else {
      this.submit = true;
      if (this.AboutmeForm.invalid) {
        this.toastService.error('กรอกข้อมูลผิดพลาด',{duration: 2000});
        return;
      }
      const formData = new FormData();
      formData.append('aboutme_name', this.AboutmeForm.get('aboutme_name')?.value);
      formData.append('aboutme_detail', this.AboutmeForm.get('aboutme_detail')?.value);
      formData.append('aboutme_tel', this.AboutmeForm.get('aboutme_tel')?.value);
      formData.append('aboutme_email', this.AboutmeForm.get('aboutme_email')?.value);
      formData.append('aboutme_line', this.AboutmeForm.get('aboutme_line')?.value);
      this.http.updateData('/aboutme/1', formData).pipe(first()).subscribe((response: any) => {
        if (response.statusCode == 201) {
          this.ngOnInit();
          this.toastService.success('แก้ไขข้อมูลสำเร็จ', {duration: 2000});
        }
      }, (error) => {
        const response = error.error;
        if (response.status == 500) {
          this.toastService.error('เกิดข้อผิดพลาด',{duration: 2000});
        }
      }
      )


    }
  }

}
