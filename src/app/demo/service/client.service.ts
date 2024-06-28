import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class ClientService{

    constructor(private http: HttpClient){}

    creerClient(formData: FormData): Observable<any>  {
        return this.http.post<any>(`${environment.appUrl}app/creerClient`,formData)
    }
    creerClient1(formData: FormData): Observable<any>  {
        return this.http.post<any>(`${environment.appUrl}app/creerClient1`,formData)
    }
    creerDomicile(formData: FormData): Observable<any>  {
        return this.http.post<any>(`${environment.appUrl}app/creerDomicile`,formData)
    }

    getAllClients(): Observable<any>{
        return this.http.get<any>(`${environment.appUrl}app/getAllClients`)
    }

    getAllVilles(): Observable<any>{
        return this.http.get<any>(`${environment.appUrl}app/getAllVilles`)
    }
    getAllStatutOccupation(): Observable<any>{
        return this.http.get<any>(`${environment.appUrl}app/getAllStatutOccupation`)
    }

    getClientBycode(codeClient:string): Observable<any>{
        return this.http.get<any>(`${environment.appUrl}app/getClientBycode/${codeClient}`);
    }

    update(value: any): Observable<any> {
        return this.http.post<any>(`${environment.appUrl}app/upateClient`,value)
    }

    searchByLabel(label:string):Observable<any>{
        return this.http.get<any>(`${environment.appUrl}app/getClientByLabel/${label}`)
    }

}