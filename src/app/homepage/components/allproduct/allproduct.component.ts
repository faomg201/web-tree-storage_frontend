import { Component } from '@angular/core';
import { HttpClientService } from 'src/app/shareds/_service/http-client.service';
import { first } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';

import { LoginService } from 'src/app/login/service/login.service';


declare var $: any;

@Component({
  selector: 'app-allproduct',
  templateUrl: './allproduct.component.html',
  styleUrls: ['./allproduct.component.css']
})
export class AllproductComponent {
  private TreeTypemgURl = environment.apiUrl;
  TyURl: string = this.TreeTypemgURl + '/static/treetypes/'
  private TreeDetailURl = environment.apiUrl;
  TdURl: string = this.TreeDetailURl + '/static/treedetails/'

  UserID: any = this.loginService.UserIDValue;

  p = 1;
  infoTreeype: any;
  infoTreedetail: any;
  infoTreeypeBYID: any;
  qtTdForrm: FormGroup;
  serachTree: FormGroup;

  loading = true;

  constructor(
    private http: HttpClientService,
    private loginService: LoginService,
    private toastService: HotToastService,
    private builder: FormBuilder,
  ) {
    setTimeout(() => {
      this.loading = false;
    }, 3000);
    this.qtTdForrm = this.builder.group({
      listorder_quantity: ['', Validators.required]
    });
    this.serachTree = this.builder.group({
      nametree: '',
      min: '',
      max: '',
      typetree: ''
    });
  }
  ngOnInit(): void {
    //getTree
    this.http.getData('/treedetails').pipe(first()).subscribe((response: any) => {
      if (response.status == true) {
        this.infoTreedetail = response.data;
      }
    },
    );
    // serachTree
    console.log(this.serachTree.status, `dsfdafa`);
    console.log(this.serachTree.valueChanges.subscribe)
    console.log();



    this.serachTree.valueChanges.subscribe((value) => {
      // console.log(`nametree is ${value.nametree}, min is ${value.min}, max is ${value.max}`);
      // console.log(value.nametree);
      // console.log(value.min);
      // console.log(value.max);
      if (value.nametree || value.min || value.max||value.typetree) {
        this.http.getData('/treedetails').pipe(first()).subscribe((response: any) => {
          if (response.status == true) {
            console.log(value.typetree);
            
            const find = [];
            for (const obj of response.data) {
              if (value.nametree != '' && value.min == '' && value.max == '' && value.typetree == '') {
                if (obj.treedetail_title.includes(value.nametree)) {
                  find.push(obj);
                }
              }else if (value.nametree == '' && value.min == '' && value.max == '' && value.typetree !== '') {
                if (obj.treetype_name.includes(value.typetree)) {
                  find.push(obj);
                }
              }              
              else if (value.nametree == '' && value.min !== '' && value.max == '' && value.typetree == '') {
                if (obj.treedetail_price >= value.min) {
                  find.push(obj);
                }
              } 
              else if (value.nametree == '' && value.min == '' && value.max !== '' && value.typetree == '' ) {
                if (obj.treedetail_price <= value.max) {
                  find.push(obj);
                }
              }else if (value.nametree !== '' && value.min !== '' && value.max !== '' && value.typetree !== '' ) {
                if (obj.treedetail_title.includes(value.nametree) && obj.treedetail_price <= value.max
                &&obj.treedetail_price >= value.min&&obj.treetype_name.includes(value.typetree)) {
                  find.push(obj);
                }
              }else if (value.nametree == '' && value.min !== '' && value.max !== '' && value.typetree !== '' ) {
                if (obj.treedetail_price <= value.max &&obj.treedetail_price >= value.min&&obj.treetype_name.includes(value.typetree)) {
                  find.push(obj);
                }
              }else if (value.nametree == '' && value.min !== '' && value.max == '' && value.typetree !== '' ) {
                if (obj.treedetail_price >= value.min&&obj.treetype_name.includes(value.typetree)) {
                  find.push(obj);
                }
              }else if (value.nametree == '' && value.min == '' && value.max !== '' && value.typetree !== '' ) {
                if (obj.treedetail_price <= value.max&&obj.treetype_name.includes(value.typetree)) {
                  find.push(obj);
                }
              }else if (value.nametree !== '' && value.min !== '' && value.max !== '' && value.typetree == '' ) {
                if (obj.treedetail_title.includes(value.nametree) && obj.treedetail_price <= value.max
                &&obj.treedetail_price >= value.min) {
                  find.push(obj);
                }
              }else if (value.nametree !== '' && value.min !== '' && value.max == '' && value.typetree == '' ) {
                if (obj.treedetail_title.includes(value.nametree) &&obj.treedetail_price >= value.min) {
                  find.push(obj);
                }
              }else if (value.nametree !== '' && value.min == '' && value.max !== '' && value.typetree == '' ) {
                if (obj.treedetail_title.includes(value.nametree) && obj.treedetail_price <= value.max) {
                  find.push(obj);
                }
              }else if (value.nametree !== '' && value.min !== '' && value.max == '' && value.typetree !== '' ) {
                if (obj.treedetail_title.includes(value.nametree) &&obj.treedetail_price >= value.min
                &&obj.treetype_name.includes(value.typetree)) {
                  find.push(obj);
                }
              }else if (value.nametree !== '' && value.min == '' && value.max !== '' && value.typetree !== '' ) {
                if (obj.treedetail_title.includes(value.nametree) && obj.treedetail_price <= value.max
                &&obj.treetype_name.includes(value.typetree)) {
                  find.push(obj);
                }
              }else if (value.nametree !== '' && value.min == '' && value.max == '' && value.typetree !== '' ) {
                if (obj.treedetail_title.includes(value.nametree) &&obj.treetype_name.includes(value.typetree)) {
                  find.push(obj);
                }
              }else if (value.nametree == '' && value.min !== '' && value.max !== '' && value.typetree == '' ) {
                if (obj.treedetail_price <= value.max&&obj.treedetail_price >= value.min) {
                  find.push(obj);
                }
              }else{
                console.log(`not data inside`);
                
              }

            }
            this.infoTreedetail = find
          }
        },
        );

      } else {
        this.http.getData('/treedetails').pipe(first()).subscribe((response: any) => {
          if (response.status == true) {
            this.infoTreedetail = response.data;
          }
        },
        );

      }

    });
    this.getTreetype();
    // this.getTreeDetail();
  }



  Op_treeDetail(id: number) {
    $('#TreeDetail').modal('show');
    this.http
      .getData('/treedetails/' + id)
      .pipe(first())
      .subscribe((response: any) => {
        this.infoTreeypeBYID = response.data;
        console.log(this.infoTreeypeBYID);

      });
  }
  Cl_treeDetail() {
    $('#TreeDetail').modal('hide');
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

  getTreeDetail() {
    // const minInput = document.querySelector('input[formControlName="min"]') as HTMLInputElement;
    // const maxInput = document.querySelector('input[formControlName="max"]') as HTMLInputElement;

    // console.log(this.minnumber, `min number`);
    // console.log(this.maxnumber, `max number`);

    // minInput.addEventListener('formGroup', (event) => {
    //   if (event.target instanceof HTMLInputElement) {
    //     const min = parseInt(event.target.value, 10);
    //     if (!isNaN(min)) {
    //       this.minnumber = min;
    //       console.log(this.minnumber, `min number`);
    //     }
    //   }
    // });

    // maxInput.addEventListener('formGroup', (event) => {
    //   if (event.target instanceof HTMLInputElement) {
    //     const max = parseInt(event.target.value, 10);
    //     if (!isNaN(max)) {
    //       const maxnum = max;
    //       this.maxnumber.push(maxnum)
    //       console.log(this.maxnumber, `min number`);
    //     }
    //   }
    // });







  }
  resetbuyorder() {
    this.qtTdForrm.reset();
  }
  AddlistOrder(TDid: number) {
    if (!this.UserID) {
      this.toastService.error('กรุณาเข้าสู่ระบบ', { duration: 2000 });
      return
    }

    const qtAdd = this.qtTdForrm.get('listorder_quantity')?.value
    const userId = this.UserID;
    const TDId: any = TDid;


    if (this.qtTdForrm.invalid) {
      this.toastService.error('กรอกข้อมูลผิดพลาด', { duration: 2000 });
      return;
    }
    if (this.qtTdForrm.get('listorder_quantity')?.value <= 0) {
      this.toastService.error('กรุณากรอกจำนวนมากกว่า 0!', { duration: 2000 });
      return;
    }
    this.http
      .getData('/treedetails/' + TDid)
      .pipe(first())
      .subscribe((response: any) => {

        const quantity = response.data.treedetail_quantity
        const price = response.data.treedetail_price

        if (quantity - qtAdd <= -1) {
          this.toastService.error('สินค้ามีจำนวนไม่พอ', { duration: 2000 });
          return;
        }
        else {
          const sum: any = qtAdd * price;
          console.log(qtAdd);
          console.log(sum);

          const formData = new FormData();
          formData.append('listorder_quantity', qtAdd);
          formData.append('listorder_sumprice', sum);
          formData.append('treedetail_id', TDId);
          formData.append('user_id', userId);
          this.http
            .createData('/listorder', formData)
            .pipe(first())
            .subscribe(
              (response: any) => {
                if (response.statusCode == 201) {
                  this.ngOnInit();
                  this.Cl_treeDetail();
                  this.resetbuyorder();
                  window.location.reload();
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



      });

  }

}
