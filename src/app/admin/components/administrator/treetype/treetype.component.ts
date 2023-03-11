import { Component } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { HttpClientService } from 'src/app/shareds/_service/http-client.service';
import { first } from 'rxjs';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'angular-web-storage'

import { LoginService } from 'src/app/login/service/login.service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-treetype',
  templateUrl: './treetype.component.html',
  styleUrls: ['./treetype.component.css']
})
export class TreetypeComponent {
  private treetypeURl = environment.apiUrl;
  SerURL: string = this.treetypeURl + '/static/treetypes/'

  imageChangedEvent: any = '';
  croppedImage: any = '';
  fileChangeEvent(event: any) {
    this.imageChangedEvent = event;
    const blo: Blob = event;
    this.previewLoaded = true; 
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
      this.treeTypeForm.patchValue({
        treetype_img: file,
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
  
  info: any
  file: any;
  previewLoaded = false;
  p = 1;
  infoTreeype: any;
  infoDel: any;
  submit = false;

  infoTreetypeDel: any;
  infoAccTreetypeEdit: any;

  treeTypeForm: FormGroup;

  constructor(
    private local: LocalStorageService,
    private http: HttpClientService,
    private toastService: HotToastService,
    private builder: FormBuilder,
    private router: Router,
    private loginService: LoginService
  ) {
    this.treeTypeForm = this.builder.group({
      treetype_name: ['', Validators.required],
      treetype_detail: ['', Validators.required],
      treetype_img: ['', Validators.required]
    });
  }


  ngOnInit(): void {
    if (this.loginService.roleNameValue != 1) {
      this.local.clear();
      this.router.navigate(['/login'])
    }
    this.getTreetype();
  }

  getTreetype() {
    this.http
      .getData('/treetypes')
      .pipe(first())
      .subscribe(
        (response: any) => {

          if (response.status == true) {
            this.infoTreeype = response.data;
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

  Open_EditTreetype() {
    $('#EditTreetype').modal('show');
  }
  Close_EditTreetype() {
    $('#EditTreetype').modal('hide');
    this.previewLoaded = false;
    this.imageChangedEvent = false;
    this.treeTypeForm.reset();
    this.ngOnInit();
  }
  getTreetype_Edit(id: number) {
    this.http.getData('/treetypes/' + id).pipe(first()).subscribe((response: any) => {
      if (response.status == true) {
        this.infoAccTreetypeEdit = response.data;
        this.treeTypeForm = this.builder.group({
          treetype_name: [this.infoAccTreetypeEdit.treetype_name, Validators.required],
          treetype_detail: [this.infoAccTreetypeEdit.treetype_detail, Validators.required],
          treetype_img: [this.infoAccTreetypeEdit.treetype_img, Validators.required]
        });
      }
    });
  }
  resetEditTreetypeForm(id: number) {
    this.http.getData('/treetypes/' + id).pipe(first()).subscribe((response: any) => {
      if (response.status == true) {
        this.previewLoaded = false;
        this.imageChangedEvent = false;
        this.infoAccTreetypeEdit = response.data;
        this.treeTypeForm = this.builder.group({
          treetype_name: [this.infoAccTreetypeEdit.treetype_name, Validators.required],
          treetype_detail: [this.infoAccTreetypeEdit.treetype_detail, Validators.required],
          treetype_img: [this.infoAccTreetypeEdit.treetype_img, Validators.required]
        });
      }
    });
  }
  Put_Treetype(id: number) {
    this.submit = true;

    if (this.treeTypeForm.invalid) {
      this.toastService.error('กรอกข้อมูลผิดพลาด', { duration: 2000 });
      return;
    }

    const formData = new FormData();
    formData.append('treetype_name', this.treeTypeForm.get('treetype_name')?.value);
    formData.append('treetype_detail', this.treeTypeForm.get('treetype_detail')?.value);
    formData.append('treetype_img', this.treeTypeForm.get('treetype_img')?.value);
    this.http
      .updateData('/treetypes/' + id, formData).pipe(first()).subscribe((response: any) => {
        if (response.statusCode == 201) {
          this.Close_EditTreetype();
          this.submit = false;
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



  Open_DelAccount_Model() {
    $('#DelAccount').modal('show');
  }
  Close_DelAccount_Model() {
    $('#DelAccount').modal('hide');
  }
  resetFrom() {
    $('#AddTypeTree').modal('hide');
    this.previewLoaded = false;
    this.imageChangedEvent = false;
    this.treeTypeForm = this.builder.group({
      treetype_name: ['', Validators.required],
      treetype_detail: ['', Validators.required],
      treetype_img: ['', Validators.required]
    });
  }

  createTreetype() {
    this.submit = true;
    if (this.treeTypeForm.invalid) {
      this.toastService.error('กรอกข้อมูลผิดพลาด', { duration: 2000 });
      return;
    }
    const formData = new FormData();
    formData.append('treetype_img', this.treeTypeForm.get('treetype_img')?.value);
    formData.append('treetype_detail', this.treeTypeForm.get('treetype_detail')?.value);
    formData.append('treetype_name', this.treeTypeForm.get('treetype_name')?.value);
    this.http.createData('/treetypes', formData).pipe(first()).subscribe((response: any) => {
      if (response.statusCode == 201) {
        $('#AddTypeTree').modal('hide');
        this.submit = false;
        this.resetFrom();
        this.getTreetype();
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

  getTreeType_Del(id: number) {
    this.http
      .getData('/treetypes/' + id)
      .pipe(first())
      .subscribe((response: any) => {
        this.infoTreetypeDel = response.data;
      });
  }

  deleteAcount(id: any) {
    this.http
      .removeData('/treetypes/' + id)
      .pipe(first())
      .subscribe(
        (response: any) => {
          if (response.status == true) {
            this.submit = false;
            this.getTreetype();
            this.Close_DelAccount_Model();
            this.toastService.error('ลบข้อมูลสำเร็จ', { duration: 2000 });
            this.infoTreeype = response.data;

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

}