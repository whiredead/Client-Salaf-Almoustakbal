import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AuthService } from './demo/service/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

    constructor(private primengConfig: PrimeNGConfig, private authService: AuthService) { }

    ngOnInit() {
        this.primengConfig.ripple = true;
        this.refreshUser();
    }
    private refreshUser(){
        const jwt = this.authService.getJwt();
        //console.log("jwt app "+jwt)
        if(jwt){
            this.authService.refreshUser(jwt).subscribe(
                {
                    next: _ =>{},
                    error: _ =>{
                        this.authService.logout();
                    },

                }
            )
        }
        else{
            //console.log("else of app null jwt")
            this.authService.refreshUser(null).subscribe();
        }
    }
}
