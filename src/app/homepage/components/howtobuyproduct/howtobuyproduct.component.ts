import { Component } from '@angular/core';
import { HttpClientService } from 'src/app/shareds/_service/http-client.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-howtobuyproduct',
  templateUrl: './howtobuyproduct.component.html',
  styleUrls: ['./howtobuyproduct.component.css']
})
export class HowtobuyproductComponent {

  infobank: any;
  loading = true;

  constructor(
    private http: HttpClientService
  ) {
    setTimeout(() => {
      this.loading = false;
    }, 3000);
  }

  ngOnInit(): void {
    this.getInfoBank();
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

}
