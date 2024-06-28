import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { lastValueFrom } from 'rxjs';
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
  utilisateurCin: any=null;
  utilisateur: any;
  imagePreview: string | ArrayBuffer | null = null;
  reader: FileReader;
  filename: string| undefined;
  passwordChanged: boolean=false;

  constructor(private fb: FormBuilder, private authService: AuthService,private route: ActivatedRoute, private messageservice: MessageService) {
  }

  showToast(severity:string,summary:string,detail:string) {
    console.log('### calleddd')
    this.messageservice.add({ key: 'tst', severity: severity, summary: summary, detail: detail });

  }

  async ngOnInit(): Promise<void> {
    console.log('ng on init called')
    this.inscriptionForm = new FormGroup({
      nom : new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(15)]),
      prenom : new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(15)]),
      DateNaissance : new FormControl( new Date().toISOString().substring(0, 10), [Validators.required]),
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
  );
    await this.getUtilisateurToUpdate();
    
    
}

  async onFileChange(event: any) {
    console.log('### '+ JSON.stringify(event.target.files,null,2))
    if (event.target.files.length > 0) {
      console.log('event file ')
      const file = event.target.files[0];
      this.filename=file.name

      await this.inscriptionForm.get('profile')?.setValue(file);

      console.log('##### ' +file.name)
      if(this.utilisateur) {
        this.utilisateur.profileContent = await this.convertFileToBase64(file)
        this.utilisateur.profileContentUrl=file.name

      }
      else{
        this.reader = new FileReader();
        this.reader.onload = () => {
          this.imagePreview = this.reader.result;
        };
        this.reader.readAsDataURL(file);
      }
      
    }
  }

  async convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  inscrire() {
    console.log("#### inscription called")
    this.submitted = true;
    this.errorMessages=[];
    if (this.inscriptionForm.valid) {
      console.log("#### formulaire valide")
      console.log('pofile image '+JSON.stringify(this.inscriptionForm.get('profile').value))
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
    this.clearImage()
  }

  clearImage() {
    console.log('clea is called')
    this.imagePreview = null;
    this.filename = undefined;
    this.utilisateur.profileContent=null
    this.utilisateur.profileContentUrl=null
    this.inscriptionForm.patchValue({
      profile : null,})
  }


  async getUtilisateurToUpdate(){
    await this.route.paramMap.subscribe(async params => {this.utilisateurCin = params.get('cin');
      if(this.utilisateurCin){
        await this.initialiseForm(this.utilisateurCin)
      }
    })
  }

  async initialiseForm(cin:string){
    
    this.utilisateur= await lastValueFrom(this.authService.getUtilisateurByCin(cin))
    console.log('## utilisateur '+JSON.stringify(this.utilisateur,null,2))
    this.inscriptionForm.patchValue({
      nom : this.utilisateur.nom,
      prenom : this.utilisateur.prenom,
      DateNaissance : this.utilisateur.dateNaissance,
      cin :this.utilisateur.cin,
      profession : this.utilisateur.profession,
      adresse : this.utilisateur.adresse,
      email : this.utilisateur.email,
      password : "******",
      passwordConf: "******",
      genre : this.utilisateur.genre,
      cinAnc:this.utilisateur.cin,
    })
    this.markControlsAsTouchedAndValidate();
    if(this.utilisateur.profileContent!=null){
      this.inscriptionForm.patchValue({
        profile : this.base64ToFile(this.utilisateur.profileContent,this.utilisateur.profileContentUrl,'image/'),})
    }

    this.inscriptionForm.get('password').valueChanges.subscribe(value=>{
      this.passwordChanged=true
    })

  }
  markControlsAsTouchedAndValidate(): void {
    Object.keys(this.inscriptionForm.controls).forEach(controlName => {
      const control = this.inscriptionForm.get(controlName);
      if (control) {
        control.markAsTouched();
        control.updateValueAndValidity();
      }
    });
  }
  getProfileImageSrc(profileContent: string): string {
    let image= profileContent;
    return image
  }

  base64ToFile(base64: string, filename: string, mimeType: string): File {
    // Split the base64 string to get the MIME type
    const byteCharacters = atob(base64.split(',')[1]);
  
    // Create an ArrayBuffer and Uint8Array to convert binary data to a Blob
    const ab = new ArrayBuffer(byteCharacters.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteCharacters.length; i++) {
      ia[i] = byteCharacters.charCodeAt(i);
    }
  
    // Create a Blob from ArrayBuffer
    const blob = new Blob([ab], { type: mimeType });
  
    // Create a File object from Blob
    const file = new File([blob], filename, { type: mimeType });
  
    return file;
  }

  update(){
    if(this.inscriptionForm.valid){
      const formData = new FormData();
      formData.append('nom', this.inscriptionForm.value.nom);
      formData.append('prenom', this.inscriptionForm.value.prenom);
      formData.append('DateNaissance', this.inscriptionForm.value.DateNaissance);
      formData.append('cin', this.inscriptionForm.value.cin);
      formData.append('cinAnc', this.utilisateur.cin);
      formData.append('profession', this.inscriptionForm.value.profession);
      formData.append('adresse', this.inscriptionForm.value.adresse);
      formData.append('email', this.inscriptionForm.value.email);
      formData.append('genre', this.inscriptionForm.value.genre);
      formData.append('emailAnc', this.utilisateur.email);
      formData.append('ProfileContentUrl',this.utilisateur.profileContentUrl);
      formData.append('passwordAnc', this.utilisateur.password);

    Object.keys(this.inscriptionForm.controls).forEach(async controlName => {

      

      formData.append('password', this.inscriptionForm.value.password);

      formData.append('passwordChanged', this.passwordChanged.toString());
      
      if(controlName==="profile" && this.utilisateur.profileContent){
        formData.append('profile', this.inscriptionForm.get('profile').value, this.inscriptionForm.get('profile').value.name);
      }
    });
    formData.forEach((v,k)=>{
      console.log(' key: '+k+' value: '+v)
      if (k === 'profile') {
        // Assuming 'profile' value is a File object
        console.log('### ' + (v as File).name);
    }

    })

    this.authService.updateUser(formData).subscribe({
      next: async (response:any)=>{
        console.log('response '+response)
        this.showToast('success','Message succes','utilasateur est modifié avec succes')
        this.submitted = false;
          this.inscriptionForm.reset()
          await this.getUtilisateurToUpdate();

      },
      error: (error:any)=>{
        console.log('error '+JSON.stringify(error,null,2))
        this.showToast('error','Message echec',error.error.message)

      }
    })
    }
    else{
    console.log('not valid ')

    }
  }
}