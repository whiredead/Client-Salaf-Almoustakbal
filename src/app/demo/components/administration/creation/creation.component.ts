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

  showSuccessViaToast() {
    console.log("#### showSuccessViaToast called")
    this.messageservice.add({ key: 'tst', severity: 'success', summary: 'Success Message', detail: 'Utilisateur creer avec succes' });
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
          console.log("######## response"+ response);
          this.showSuccessViaToast()
          this.inscriptionForm.reset();
          this.submitted = false;
        },
        error: (error: any) => {
          this.errorMessages=error.error.value.message;
          console.log(error)
        }
      });
    }
    else{
      if(this.inscriptionForm.errors?.['passwordMatchError']){
        console.log("mot de passe incorrete")
      }
      console.log("### nom" +this.inscriptionForm.get('nom')?.status);    
      console.log("### prenom" +this.inscriptionForm.get('prenom')?.status);
      console.log("### email" +this.inscriptionForm.get('email')?.status)
      console.log("### DateNaissance" +this.inscriptionForm.get('DateNaissance')?.status)
      console.log("### cin" +this.inscriptionForm.get('cin')?.status)
      console.log("### profile" +this.inscriptionForm.get('profile')?.status)
      console.log("### profession" +this.inscriptionForm.get('profession')?.status)
      console.log("### adresse" +this.inscriptionForm.get('adresse')?.status)
      console.log("### password" +this.inscriptionForm.get('password')?.status)
      console.log("### passwordConf" +this.inscriptionForm.get('passwordConf')?.status)
      console.log("### genre" +this.inscriptionForm.get('genre')?.status)
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

}