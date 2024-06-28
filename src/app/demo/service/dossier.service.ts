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

    getAllDossiers(): Observable<any>{
        return this.http.get<any>(`${environment.appUrl}app/getAllDossiers`)
    }
    getDossierByReference(reference:string): Observable<any>{
        return this.http.get<any>(`${environment.appUrl}app/getDossierByReference/${reference}`);
    }
    
    searchByLabel(label:string):Observable<any>{
        return this.http.get<any>(`${environment.appUrl}app/getDossierByLabel/${label}`)
    }
    
    updateDossier(value: any): Observable<any> {
        return this.http.post<any>(`${environment.appUrl}app/updateDossier`,value)
    }
}