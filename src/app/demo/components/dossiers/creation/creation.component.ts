import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Message, MessageService, SelectItem } from 'primeng/api';
import { lastValueFrom } from 'rxjs';
import { ClientService } from 'src/app/demo/service/client.service';
import { DossierService } from 'src/app/demo/service/dossier.service';
import { SelectedItem } from 'src/app/shared/models/SelectedItem';
import { agence } from 'src/app/shared/models/agence';
import { civilite } from 'src/app/shared/models/civilite';
import { periodicite } from 'src/app/shared/models/periodicite';
import { produit } from 'src/app/shared/models/produit';

@Component({
  selector: 'app-creation',
  templateUrl: './creation.component.html',
  styleUrls: ['./creation.component.css'],
  providers: [MessageService]
})
export class CreationComponent implements OnInit {
  msgs: Message[] = [];
  submitted: boolean = false;
  errorMessages: string[] = [];
  creationForm: FormGroup;
  clientsBox: SelectedItem[] = [];
  produitBox: SelectedItem[] = [];
  agenceBoxe: SelectedItem[]=[];
  uploadedFiles: any[] = [];
  periodiciteBox: SelectedItem[]=[];
  reference:string;
  dossier:any;
  filename: any;
  selectedFile: File | null = null;


  constructor(private messageService: MessageService, public clientSer: ClientService,private route: ActivatedRoute, public dossierSer: DossierService) {
    
  }

  getProduit(): SelectedItem[] {
    return Object.keys(produit)
      .filter(key => isNaN(Number(key)))  // Filter out the reverse mapping
      .map(key => ({ label: key }));
  }

  getAgence(): SelectedItem[] {
    return Object.keys(agence)
      .filter(key => isNaN(Number(key)))  // Filter out the reverse mapping
      .map(key => ({ label: key }));
  }

  getperiodicite(){
    return Object.keys(periodicite)
      .filter(key => isNaN(Number(key)))  // Filter out the reverse mapping
      .map(key => ({ label: key }));
  }

  async getDossierToUpdate(){
    await this.route.paramMap.subscribe(async params => {this.reference = params.get('reference');
      if(this.reference){
        await this.initialiseForm(this.reference)
      }
    })
  }

  async ngOnInit(): Promise<void> {
    this.creationForm = new FormGroup({
      dateOp: new FormControl(new Date().toISOString().substring(0, 10), [Validators.required]),
      codeClient: new FormControl(null, [Validators.required]),
      reference: new FormControl(null, [Validators.required]),
      produit:new FormControl(null, [Validators.required]),
      agence:new FormControl(null, [Validators.required]),
      premiereEcheance: new FormControl(new Date().toISOString().substring(0, 10), [Validators.required]),
      derniereEcheance: new FormControl(new Date().toISOString().substring(0, 10), [Validators.required]),
      echeance: new FormControl(new Date().toISOString().substring(0, 10), [Validators.required]),
      credit: new FormControl(null, [Validators.required]),
      periodicite: new FormControl(null, [Validators.required]),
      duree: new FormControl(null, [Validators.required]),
      teg: new FormControl(null),
      tva: new FormControl(null),
      differe: new FormControl(null, [Validators.required]),
      assurance: new FormControl(null, [Validators.required]),
      codeComptable: new FormControl(null, [Validators.required]),
      cession: new FormControl(null),
    });
    this.clientsBox = await this.getAllClients();
    this.periodiciteBox = await this.getperiodicite()
    this.agenceBoxe = await this.getAgence();
    this.produitBox=await this.getProduit();

    await this.getDossierToUpdate();

    
  }

  async initialiseForm(reference:string){
    
    this.dossier= await lastValueFrom(this.dossierSer.getDossierByReference(reference))
    console.log('##### dossier ' +JSON.stringify(this.dossier,null,2))
    console.log('##### dossier ' +JSON.stringify(this.dossier.cessionPath,null,2))
    console.log('##### dossier ' +JSON.stringify(this.dossier.cessionByte,null,2))
    this.creationForm.patchValue({
      dateOp: this.dossier.dateOp,
      codeClient: {label: `${this.dossier['clientDto'].codeClient}- ${this.dossier.clientDto.nom} ${this.dossier.clientDto.prenom}`, value: this.dossier.clientDto.codeClient},
      reference: this.dossier.reference,
      produit:{label: this.dossier.produit } ,
      agence:{label:this.dossier.agence},
      premiereEcheance: this.dossier.premiereEcheance,
      derniereEcheance: this.dossier.derniereEcheance,
      echeance: this.dossier.echeance,
      credit: this.dossier.credit,
      periodicite: { label:this.dossier.periodicite},
      duree: this.dossier.duree,
      teg: this.dossier.teg,
      tva: this.dossier.tva,
      differe: this.dossier.differe,
      assurance: this.dossier.assurance,
      codeComptable: this.dossier.codeComptable,
    });
    this.markControlsAsTouchedAndValidate();
    if(this.dossier.cessionByte!=null){
      this.creationForm.patchValue({
        cession : await this.base64ToFile(this.dossier.cessionByte,this.dossier.cessionPath,'text/plain') })

    }
  }

  markControlsAsTouchedAndValidate(): void {
    Object.keys(this.creationForm.controls).forEach(controlName => {
      const control = this.creationForm.get(controlName);
      if (control) {
        control.markAsTouched();
        control.updateValueAndValidity();
      }
    });
  }

  async getAllClients(): Promise<SelectedItem[]> {
    try {
      const data = await lastValueFrom(this.clientSer.getAllClients());

      const clients = data.map(d => ({ label: `${d.codeClient}- ${d.nom} ${d.prenom}`, value: d.codeClient }));

      return clients;
    } catch (error) {
      return [];
    }
  }

  async onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.filename=file.name
      await this.creationForm.get('cession')?.setValue(file);
      if(this.dossier){
        this.dossier.cessionPath=file.name,
        this.dossier.cessionByte=await this.convertFileToBase64(file)
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

  base64ToFile(base64: string, filename: string, mimeType: string): File | null {
    try {
      // Split the base64 string to get the MIME type and the actual base64-encoded data
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
    } catch (error) {
      console.error('Error converting base64 to file:', error);
      return null;
    }
  }
  
  convertToFormData1(formData: any){

    const dossierForm = new FormData();
    const specialKeys = ["codeClient", "produit","agence","tva","periodicite","teg","tva"];
    let clientFormData = new FormData();

    for (let key in formData) {
      const value = this.creationForm.get(key)?.value;

      if (value instanceof File) {
        dossierForm.append(key, value, value.name);
      } 

      else if(specialKeys.includes(key)) {

        if(key=="codeClient"){
          dossierForm.append(key,value.value)
        }
        else{
          dossierForm.append(key, value?.label ?? null);
        }
      }
      else {
        dossierForm.append(key, value);
      }
    }
    dossierForm.forEach((value, key) => {
      console.log(`######### ${key}: ${value}`);
    
    });
    return dossierForm

  }

  showToast(type:string,msg:string,summary:string) {
    console.log("#### showSuccessViaToast called")
    this.messageService.add({ key: 'tst', severity: type, summary: summary, detail: msg });
  }

  async creer() {
    this.submitted = true;
    this.errorMessages = [];
  
    if (this.creationForm.valid) {
      const dossierformData = this.convertToFormData1(this.creationForm.value)

      this.dossierSer.creerDossier(dossierformData).subscribe({
        next: async (response: any) => {
          console.log("Dossiers creation response: ", response);
          this.showToast('success','dossier est creer avec succes','Succes');

          //this.creationForm.reset();
          this.submitted = false;
          
        },

        error: (error: any) => {
          //this.errorMessages = error.error.value.message;
          console.error("Dossiers creation error: "+ error);
          this.showToast('error',error.error.value?.message,'echec');
          console.log(`Dossiers creation error: ${JSON.stringify(error.error)}`);

        }
      });
    }
  }

  clearfile(){
    if(this.dossier){
      this.dossier.cessionByte=null,
      this.dossier.cessionPath=null
    }
    this.creationForm.get('cession')?.setValue('null')
    this.filename=null
  }
  reset(){
    this.creationForm.reset()
  }

  convertToFormData2(formData: any){
    const formData1=new FormData();
    const specialKeys = ["codeClient", "produit","agence","tva","periodicite","teg","tva"];
    formData1.append('cessionPath', this.dossier.cessionPath ?? null);
    for (let key in formData) {
      const value = this.creationForm.get(key)?.value;
      formData1.append('referenceAnc', this.creationForm.get('reference').value);

      if(key==="cession" && this.dossier.cessionByte){
        formData1.append('cession', this.creationForm.get('cession').value, this.creationForm.get('cession').value.name);
      }

      if(specialKeys.includes(key)) {

        if(key=="codeClient"){
          formData1.append(key,value.value)
          formData1.append('codeClientAnc', value.value);

        }
        else{
          formData1.append(key, value?.label ?? null);
        }
      }
      else {
        formData1.append(key, value);
      }

    }
    return formData1

  }

  update(){
    this.submitted = true;
    this.errorMessages = [];
  
    if (this.creationForm.valid) {
      const dossierformData = this.convertToFormData2(this.creationForm.value)
      
      dossierformData.forEach((v,k)=>{
        console.log(' key: '+k+' value: '+v)
        if (k === 'profile') {
          // Assuming 'profile' value is a File object
          console.log('### ' + (v as File).name);
      }})

      this.dossierSer.updateDossier(dossierformData).subscribe({
        next: async (response:any)=>{
          console.log('response '+response)
          this.showToast('success','Message succes','dossier est modifié avec succes')
          this.submitted = false;
          this.creationForm.reset()
          await this.getDossierToUpdate();
        },
        error: (error:any)=>{
          console.log('error '+JSON.stringify(error,null,2))
          this.showToast('error','Message echec',error.error.message)
        }
      })
      
    }
    
  }
}
 