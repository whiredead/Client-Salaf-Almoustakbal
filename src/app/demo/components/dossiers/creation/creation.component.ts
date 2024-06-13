import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Message, MessageService, SelectItem } from 'primeng/api';
import { lastValueFrom } from 'rxjs';
import { ClientService } from 'src/app/demo/service/client.service';
import { DossierService } from 'src/app/demo/service/dossier.service';
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
  clientsBox: SelectItem[] = [];
  produitBox: SelectItem[] = [];
  agenceBoxe: SelectItem[]=[];
  uploadedFiles: any[] = [];
  periodiciteBox: SelectItem[]=[];

  constructor(private messageService: MessageService, public clientSer: ClientService, public dossierSer: DossierService) {
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
      differé: new FormControl(null, [Validators.required]),
      assurance: new FormControl(null, [Validators.required]),
      codeComptable: new FormControl(null, [Validators.required]),
      cession: new FormControl(null),
    });
  }

  getProduit(): SelectItem[] {
    return Object.keys(produit)
      .filter(key => isNaN(Number(key)))  // Filter out the reverse mapping
      .map(key => ({ label: key }));
  }

  getAgence(): SelectItem[] {
    return Object.keys(agence)
      .filter(key => isNaN(Number(key)))  // Filter out the reverse mapping
      .map(key => ({ label: key }));
  }

  getperiodicite(){
    return Object.keys(periodicite)
      .filter(key => isNaN(Number(key)))  // Filter out the reverse mapping
      .map(key => ({ label: key }));
  }

  async ngOnInit(): Promise<void> {
    this.clientsBox = await this.getAllClients();
    this.periodiciteBox = await this.getperiodicite()
    this.agenceBoxe = await this.getAgence();
    this.produitBox=await this.getProduit();
    
  }

  async getAllClients(): Promise<SelectItem[]> {
    try {
      const data = await lastValueFrom(this.clientSer.getAllClients());

      const clients = data.map(d => ({ label: `${d.codeClient}- ${d.nom} ${d.prenom}`, value: d.codeClient }));

      return clients;
    } catch (error) {
      return [];
    }
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.creationForm.get('cession')?.setValue(file);
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

    Object.keys(formData.controls).forEach(key => {
    });
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
}
 