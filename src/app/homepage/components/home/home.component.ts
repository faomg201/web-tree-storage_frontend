import { Component } from '@angular/core';
import { HttpClientService } from 'src/app/shareds/_service/http-client.service';
import { first } from 'rxjs';
import { environment } from 'src/environments/environment';



declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  private treetypeURl = environment.apiUrl;
  SerURL: string = this.treetypeURl + '/static/treetypes/'

  private aboutmeimgURl = environment.apiUrl;
  AbImgURL: string = this.aboutmeimgURl + '/static/aboutmeimg/'

  infoTreeype: any;
  infoImgSlider: any;
  infoImgSliderfArray: any;
  infoAboutme: any;
  loading = true;


  constructor(private http: HttpClientService) {
    setTimeout(() => {
      this.loading = false;
    }, 3000);
  }


  ngOnInit(): void {
    this.getTreetype();
    this.getImgSlider();
    this.getInfoAboutme();
    

  }
  getInfoAboutme(){
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

  getImgSlider() {
    this.http
      .getData('/aboutmeimg')
      .pipe(first())
      .subscribe(
        (response: any) => {
          if (response.status == true) {
            this.infoImgSlider = response.data;
            this.infoImgSliderfArray = response.data[0].aboutmeimg_name;
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

}

