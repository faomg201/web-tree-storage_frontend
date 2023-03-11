import { Component } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { environment } from 'src/environments/environment';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs';
import { HttpClientService } from 'src/app/shareds/_service/http-client.service';
import { HotToastService } from '@ngneat/hot-toast';

import { LoginService } from 'src/app/login/service/login.service';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-web-storage'

declare var $: any;

@Component({
  selector: 'app-treedetail',
  templateUrl: './treedetail.component.html',
  styleUrls: ['./treedetail.component.css']
})
export class TreedetailComponent {
  private treeDetailURl = environment.apiUrl;
  TdURL: string = this.treeDetailURl + '/static/treedetails/'

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
      this.treeDetailForm.patchValue({
        treedetail_img: file,
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

  infoTreeDetail: any;
  infoTreeType: any;

  infoTreeDetailDel: any;
  infoAccTreedetailEdit: any;

  submit = false;
  treeDetailForm: FormGroup;

  constructor(
    private http: HttpClientService,
    private toastService: HotToastService,
    private builder: FormBuilder,
    public local: LocalStorageService,
    private router: Router,
    private loginService: LoginService
  ) {
    this.treeDetailForm = this.builder.group({
      treedetail_title: ['', Validators.required],
      treedetail_detail: ['', Validators.required],
      treedetail_price: ['', Validators.required],
      treedetail_quantity: ['', Validators.required],
      treedetail_img: ['', Validators.required],
      treetype_id: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    if (this.loginService.roleNameValue != 1) {
      this.local.clear();
      this.router.navigate(['/login'])
    }
    this.getTreeType();
    this.getTreeDetail();
  }

  getTreeType() {
    try {
      this.http
        .getData('/treetypes')
        .pipe(first())
        .subscribe((response: any) => {
          if (response.status == true) {
            this.infoTreeType = response.data;
          }
        });
    } catch (error) {
      console.log(error);
    }
  }

  getTreeDetail() {
    try {
      this.http
        .getData('/treedetails')
        .pipe(first())
        .subscribe((response: any) => {
          if (response.status == true) {
            this.infoTreeDetail = response.data;
          }
        });
    } catch (error) {
      console.log(error);
    }
  }


  Open_EditTreedetail() {
    $('#EditTreedetail').modal('show');
  }
  Close_EditTreedetail() {
    $('#EditTreedetail').modal('hide');
    this.previewLoaded = false;
    this.imageChangedEvent = false;
    this.treeDetailForm.reset();
    this.ngOnInit();
  }
  getTreedetail_Edit(id: number) {
    this.http.getData('/treedetails/' + id).pipe(first()).subscribe((response: any) => {
      if (response.status == true) {
        this.infoAccTreedetailEdit = response.data;
        this.treeDetailForm = this.builder.group({
          treedetail_title: [this.infoAccTreedetailEdit.treedetail_title, Validators.required],
          treedetail_detail: [this.infoAccTreedetailEdit.treedetail_detail, Validators.required],
          treedetail_price: [this.infoAccTreedetailEdit.treedetail_price, Validators.required],
          treedetail_quantity: [this.infoAccTreedetailEdit.treedetail_quantity, Validators.required],
          treedetail_img: [this.infoAccTreedetailEdit.treedetail_img, Validators.required],
          treetype_id: [this.infoAccTreedetailEdit.treetype_id, Validators.required]
        });
      }
    });
  }
  resetEditTreetypeForm(id: number) {
    this.http.getData('/treedetails/' + id).pipe(first()).subscribe((response: any) => {
      if (response.status == true) {
        this.previewLoaded = false;
        this.imageChangedEvent = false;
        this.infoAccTreedetailEdit = response.data;
        this.treeDetailForm = this.builder.group({
          treedetail_title: [this.infoAccTreedetailEdit.treedetail_title, Validators.required],
          treedetail_detail: [this.infoAccTreedetailEdit.treedetail_detail, Validators.required],
          treedetail_price: [this.infoAccTreedetailEdit.treedetail_price, Validators.required],
          treedetail_quantity: [this.infoAccTreedetailEdit.treedetail_quantity, Validators.required],
          treedetail_img: [this.infoAccTreedetailEdit.treedetail_img, Validators.required],
          treetype_id: [this.infoAccTreedetailEdit.treetype_id, Validators.required]
        });
      }
    });
  }
  Put_Treetype(id: number) {

    if (this.treeDetailForm.invalid) {
      this.toastService.error('กรอกข้อมูลผิดพลาด', { duration: 2000 });
      return;
    }

    const formData = new FormData();
    formData.append('treedetail_title', this.treeDetailForm.get('treedetail_title')?.value);
    formData.append('treedetail_detail', this.treeDetailForm.get('treedetail_detail')?.value);
    formData.append('treedetail_price', this.treeDetailForm.get('treedetail_price')?.value);
    formData.append('treedetail_quantity', this.treeDetailForm.get('treedetail_quantity')?.value);
    formData.append('treedetail_img', this.treeDetailForm.get('treedetail_img')?.value);
    formData.append('treetype_id', this.treeDetailForm.get('treetype_id')?.value);
    this.http
      .updateData('/treedetails/' + id, formData).pipe(first()).subscribe((response: any) => {
        if (response.statusCode == 201) {
          this.Close_EditTreedetail();
          this.ngOnInit();
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


  Open_AddTdForm() {
    $('#AddTdForm').modal('show');
  }
  Close_AddTdForm() {
    $('#AddTdForm').modal('hide');
    this.treeDetailForm = this.builder.group({
      treedetail_title: ['', Validators.required],
      treedetail_detail: ['', Validators.required],
      treedetail_price: ['', Validators.required],
      treedetail_quantity: ['', Validators.required],
      treedetail_img: ['', Validators.required],
      treetype_id: ['', Validators.required]
    });
    this.imageChangedEvent = false;
    this.previewLoaded = false;
  }

  Open_TreeDetailDel() {
    $('#TreeDetailDel').modal('show');
  }
  Close_TreeDetailDel() {
    $('#TreeDetailDel').modal('hide');
  }

  getTreeDetailDel(id: number) {
    console.log(id);

    this.http
      .getData('/treedetails/' + id)
      .pipe(first())
      .subscribe((response: any) => {
        this.infoTreeDetailDel = response.data;
      });
  }

  deleteTreedetail(id: any) {
    this.http
      .removeData('/treedetails/' + id)
      .pipe(first())
      .subscribe(
        (response: any) => {
          if (response.status == true) {
            
            this.ngOnInit();
            this.Close_TreeDetailDel();
            this.toastService.error('ลบข้อมูลสำเร็จ',{ duration: 2000 });
            this.infoTreeDetail = response.data;

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

  AddTreeDetail() {
    if (this.treeDetailForm.invalid) {
      this.toastService.error('กรอกข้อมูลผิดพลาด', { duration: 2000 });
      return;
    }
    if (this.treeDetailForm.get('treedetail_price')?.value <= 0) {
      this.toastService.error('กรุณากรอกราคามากกว่า 0!', { duration: 2000 });
      return;
    }
    if (this.treeDetailForm.get('treedetail_quantity')?.value <= 0) {
      this.toastService.error('กรุณากรอกจำนวนมากกว่า 0!', { duration: 2000 });
      return;
    }

    const formData = new FormData();
    formData.append('treedetail_title', this.treeDetailForm.get('treedetail_title')?.value);
    formData.append('treedetail_detail', this.treeDetailForm.get('treedetail_detail')?.value);
    formData.append('treedetail_price', this.treeDetailForm.get('treedetail_price')?.value);
    formData.append('treedetail_quantity', this.treeDetailForm.get('treedetail_quantity')?.value);
    formData.append('treedetail_img', this.treeDetailForm.get('treedetail_img')?.value);
    formData.append('treetype_id', this.treeDetailForm.get('treetype_id')?.value);
    this.http
      .createData('/treedetails', formData)
      .pipe(first())
      .subscribe(
        (response: any) => {
          if (response.statusCode == 201) {
            this.Close_AddTdForm();
            this.ngOnInit();
            this.toastService.success('เพิ่มข้อมูลสำเร็จ', { duration: 2000 });
          }
        },
        (error) => {
          const response = error.error;
          if (response.status == 500) {
            this.toastService.error('เกิดข้อผิดพลาด', { duration: 2000 });
          }
        }
      );
  }


}
