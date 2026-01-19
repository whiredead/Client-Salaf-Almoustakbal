import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, ReplaySubject, map, of } from 'rxjs';
import { ItemBarService } from 'src/app/layout/service/items.service';
import { login } from 'src/app/shared/models/login';
import { User } from 'src/app/shared/models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  
  private userSource = new ReplaySubject<User | null>(1);// like an Observable has index of 1 value (size=1)
  user$ = this.userSource.asObservable();// $ to say it's an Observable

  constructor(private http: HttpClient, private router : Router,private itemBarService: ItemBarService) { }

  refreshUser(jwt : string|null){
    //console.log("##### auth jwt "+jwt)
    if(jwt === null){
      this.userSource.next(null);
      //console.log("#####  "+this.user$.subscribe({next: responce=>{console.log(responce?.firstName)}}))
      return of(undefined); // return an observable
    }
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer '+ jwt);
    //console.log(headers)
    return this.http.get<User>(`${environment.appUrl}auth/refresh-user-token`, {headers}).pipe(
      map((user:User)=>{
        if(user){
          this.setUser(user);
          //console.log("#####  "+this.user$.subscribe({next: responce=>{console.log(responce.firstName)}}))
        }
      })
    )

  }

  login(model: login): Observable<User> {
    return this.http.post<User>(`${environment.appUrl}auth/login`,model)
    .pipe(
      map((user: User) => {
        if (user) {
          this.setUser(user);
        }
        return user
      })
    );
  }

  logout(){
    //console.log("logout called")
    localStorage.removeItem(environment.userKey);
    // ✅ IMPORTANT: Vider le cache du menu
    this.itemBarService.clearCache();

    this.userSource.next(null);
    this.router.navigateByUrl('connecter')
  }
 
  inscrire(formData: FormData): Observable<any>  {
    return this.http.post<any>(`${environment.appUrl}auth/register`,formData)
  }

  getJwt(){
    const key = localStorage.getItem(environment.userKey)
    if(key){
      const user: User = JSON.parse(key); // parse string to user
      return user.jwt;
    }
    else{
      return null;
    }
  }

  private setUser(user: User){
    localStorage.setItem(environment.userKey, JSON.stringify(user));// store user inside localstorage stringify the user
    this.userSource.next(user)//store user inside userSource
  }

  getAllUsers():Observable<any> {
    return this.http.get<any>(`${environment.appUrl}auth/getAllUsers`)
  }
  getUtilisateurByCin(cin:string):Observable<any>{
    return this.http.get<any>(`${environment.appUrl}auth/getUtilisateurByCin/${cin}`)
  }


  searchByLabel(term: string): Observable<any> {
    return this.http.get<any>(`${environment.appUrl}auth/searchByLabel/${term}`)
  }

  updateUser(value: any): Observable<any> {
    return this.http.post<any>(`${environment.appUrl}auth/updateUser`,value)
  }

  isLoggedIn(): boolean {
    return this.getUser() !== null;
  }
  getUser(): User | null {
    const userJson = localStorage.getItem(environment.userKey);
    if (userJson) {
      return JSON.parse(userJson) as User;
    }
    return null;
  }
}
