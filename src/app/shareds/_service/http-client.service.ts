import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

import { LocalStorageService,LocalStorage } from 'angular-web-storage';


@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  serveURl = environment.apiUrl;
  
  public token! : string 
  constructor(
    private http: HttpClient,
    public local:LocalStorageService
    ) {
    const dataUser = JSON.parse(localStorage.getItem('currentUser')!)
    // this.token = dataUser.access_token!
    this.token = dataUser
    // console.log(dataUser);
    
   }
   getDataAPIWeb(path:any){
    // console.log(path);
    // console.log(this.serveURl+path);
    
    return this.http.get('https://'+path,{
      // headers: {
      //   Authorization: 'Bearer '+ this.token
      // }
    })
  }
  // getDataAT(path:any){
    
  //   return this.http.get(this.serveURl+path,{
  //     headers: {
  //       Authorization: 'Bearer '+ this.token
  //     }
  //   })
  // }
  getData(path:any){
    // console.log(path);
    // console.log(this.serveURl+path);
    
    return this.http.get(this.serveURl+path,{
      // headers: {
      //   Authorization: 'Bearer '+ this.token
      // }
    })
  }
  createData(path:any, data:any,){
    return this.http.post(this.serveURl+path, data,{
      // headers: {
      //   Authorization: 'Bearer '+ this.token
      // }
    })
  }
  createDatauser(path:any, data:any  ){
    return this.http.post(this.serveURl+path, data,{
      // headers: {
      //   Authorization: 'Bearer '+ this.token
      // }
    }); 

  }
  // createDatauserAT(path:any, data:any  ){
  //   return this.http.post(this.serveURl+path, data,{
  //     headers: {
  //       Authorization: 'Bearer '+ this.token
  //     }
  //   }); 

  // }

  updateData(path:any, data:any){
    return this.http.put(this.serveURl+path, data,{
      // headers: {
      //   Authorization: 'Bearer '+ this.token
      // }
    });
    
  }

  removeData(path:any){
    return this.http.delete(this.serveURl+path,{
      // headers: {
      //   Authorization: 'Bearer '+ this.token
      // }
    }
    //   ,{
    //   headers:{
    //     'Content-Type': 'application/json'
    //   },
    //   withCredentials:true,
    // }
    
    );
  }

  // http://localhost:8000/static/turtle.jpeg

}
