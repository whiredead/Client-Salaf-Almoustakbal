import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/demo/service/auth.service';

@Component({
  selector: 'app-creation',
  templateUrl: './creation.component.html',
  styleUrl: './creation.component.css',
  providers: [MessageService]

})
export class CreationComponent implements OnInit{

  inscriptionForm: FormGroup;
  submitted: boolean = false;
  errorMessages: string[]= [];
  

  constructor(private fb: FormBuilder, private authService: AuthService, private messageservice: MessageService) {
    this.inscriptionForm = new FormGroup({
      nom : new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(15)]),
      prenom : new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(15)]),
      DateNaissance : new FormControl(null, [Validators.required]),
      cin : new FormControl(null, [Validators.required]),
      profile : new FormControl(null),
      profession : new FormControl(null),
      adresse : new FormControl(null),
      email : new FormControl(null, [Validators.required, Validators.pattern('^\\w+@[a-zA-Z_]+?\\.[a-zA-Z_]{2,3}$')]),
      password : new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(15)]),
      passwordConf: new FormControl(null, [Validators.required]),
      genre : new FormControl(null, [Validators.required]),
    },
    {
      validators: this.matchpassword
    }
  );}

  showToast(severity:string,summary:string,detail:string) {
    console.log('### calleddd')
    this.messageservice.add({ key: 'tst', severity: severity, summary: summary, detail: detail });

  }

  ngOnInit(): void {
    
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.inscriptionForm.get('profile')?.setValue(file);
    }
  }

  inscrire() {
    console.log("#### inscription called")
    this.submitted = true;
    this.errorMessages=[];
    if (this.inscriptionForm.valid) {
      console.log("#### formulaire valide")
      const formData = new FormData();
      Object.keys(this.inscriptionForm.value).forEach(key => {
        const value = this.inscriptionForm.value[key];
        // Handle profile file separately
        if (key === 'profile') {
          if (value instanceof File) {
            formData.append(key, value, value.name);
          }
        } else {
          formData.append(key, value);
        }
      });

      this.authService.inscrire(formData).subscribe({
        next: (response: any) => {
          this.showToast('success','Message succes','utilasateur est creé avec succes')
          this.inscriptionForm.reset();
          this.submitted = false;
        },
        error: (error: any) => {
          this.errorMessages=error.error.value.message;
          this.showToast('error','Message echec',error.error.value?.message)
          console.log('#### ' +JSON.stringify(this.errorMessages))

          console.log(error)
        }
      });
    }
  }

  
  matchpassword: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const pwd = control.get('password');
    const pwdC = control.get('passwordConf');
    if (pwd && pwdC && pwd.value !== pwdC.value) {
      return { passwordmatcherror: true }; // Return an error if passwords don't match
    }
    return null; // Return null if passwords match
  }

  reset(){
    this.inscriptionForm.reset()
  }

}