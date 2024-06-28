import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { AuthService } from 'src/app/demo/service/auth.service';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  
  loginForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  errorMessages: string[]=[];
  returnUrl:string|null=null
  progress:boolean=false;

  constructor(private formBuilder: FormBuilder, 
    private authService: AuthService,
    private router:Router,
    private activatedRoute:ActivatedRoute) {
      this.authService.user$.pipe(take(1)).subscribe({
        next:(user:User|null)=>{
          if(user){
            this.router.navigateByUrl('');
          }
          else{
            this.activatedRoute.queryParamMap.subscribe({
              next:(params:any)=>{
                if(params){
                  this.returnUrl=params.get('returnUrl')
                }
              }
            })
          }
        }
      })
    }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required,Validators.pattern('^\\w+@[a-zA-Z_]+?\\.[a-zA-Z_]{2,3}$')]],
      password: ['', [Validators.required]],
    });
  }

  login() {
    this.submitted = true;
    console.log('clicked');
    this.errorMessages = [];

    if (this.loginForm.valid) {
      this.progress=true
      console.log('form valid');
      this.authService.login(this.loginForm.value).subscribe({
        next: (response: User) => {
          if (this.returnUrl) {
            console.log('###### 1 ' + response);
            console.log('###### 2 ' + JSON.stringify(response));
            this.router.navigateByUrl(this.returnUrl);
          } else {
            this.progress=false
            console.log('###### 1 ' + response);
            console.log('###### 2 ' + JSON.stringify(response));
            this.router.navigateByUrl('salaf');

          }
        },
        error: (error: any) => {
          this.progress=false
          console.log(error);
          this.errorMessages = error.error.value.message;
        },
        complete:()=>{
          this.progress=false
        }
      });
    }
  }

  hide = true;
  clickEvent(event: MouseEvent) {
    this.hide = !this.hide;
    event.stopPropagation();
  }
}
