import { Component } from '@angular/core';
import { HttpClientService } from 'src/app/shareds/_service/http-client.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  infoAboutme: any;

  constructor(private http: HttpClientService) {
    this.getInfoAboutme();
  }


  ngOnInit(): void {
    
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


}
