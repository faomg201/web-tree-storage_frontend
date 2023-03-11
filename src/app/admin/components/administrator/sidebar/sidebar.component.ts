import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-web-storage';
import { LoginService } from 'src/app/login/service/login.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
  
})
export class SidebarComponent {
  
  constructor(
    private router: Router,
    public local:LocalStorageService,
    private loginService: LoginService,){}
    UserN:any = this.loginService.UsernameValue;

  logout() {
    this.local.clear();
    this.router.navigate(['/login'])
  }

}
