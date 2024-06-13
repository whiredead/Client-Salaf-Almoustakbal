import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class DossierService{

    constructor(private http: HttpClient){}

    creerDossier(formData: FormData): Observable<any>  {
        return this.http.post<any>(`${environment.appUrl}app/creerDossier`,formData)
    }
    
}