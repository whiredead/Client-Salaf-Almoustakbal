import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Message, MessageService, SelectItem } from 'primeng/api';
import { lastValueFrom } from 'rxjs';
import { ClientService } from 'src/app/demo/service/client.service';
import { sitFamiliale } from 'src/app/shared/models/SitFamiliale';
import { civilite } from 'src/app/shared/models/civilite';
import { statutOccupationLogement } from 'src/app/shared/models/statutOccupationLogement';
import { Ville } from 'src/app/shared/models/ville';


@Component({
  selector: 'app-creation',
  templateUrl: './creation.component.html',
  styleUrl: './creation.component.css',
  providers: [MessageService]

})
export class CreationComponent implements OnInit {

  codeClient:string
  client:any;
  msgs: Message[] = [];
  creationForm: FormGroup;
  submitted: boolean = false;
  errorMessages: string[]= []
  civiliteBox: SelectItem[] = [];
  sitFamilialeBox: SelectItem[] = [];
  villeBox: SelectItem[] = [];
  villeBox1: SelectItem[] = [];
  statusLogBox: SelectItem[]=[];

  constructor(private clientService:ClientService,private route: ActivatedRoute, private messageservice: MessageService,public clientSer: ClientService) {
  }

  getCivilite(): SelectItem[] {
    return Object.keys(civilite)
      .filter(key => isNaN(Number(key)))  // Filter out the reverse mapping
      .map(key => ( {label: key} ));
  }

  getVille(): SelectItem[] {
    return Object.keys(Ville)
      .map(key => ( { label: Ville[key] } ));
  }

  async getAllVilles(): Promise<SelectItem[]> {
    try {
      const data = await lastValueFrom(this.clientSer.getAllVilles());
      const villes = data.map(d => ({ label: d.name, codeVille: d.id }));
      return villes;
    } catch (error) {
      console.error('Error fetching clients:', error);
      return [];
    }
  }
  getSitFamiliale(): SelectItem[] {
    return Object.keys(sitFamiliale)
      .filter(key => isNaN(Number(key)))  // Filter out the reverse mapping
      .map(key => ( {label: key} ));
  }

  getStatutOccupationLogement(): SelectItem[] {
    return Object.keys(statutOccupationLogement)
      .map(key => ( { label: statutOccupationLogement[key] } ));
  }

  async getClientToUpdate(){
    await this.route.paramMap.subscribe(async params => {this.codeClient = params.get('codeClient');
      if(this.codeClient){
        await this.initialiseForm(this.codeClient)
      }
    })
  }
  
  
  async ngOnInit(): Promise<void> {

    this.creationForm = new FormGroup({
      codeClient: new FormControl(null,[Validators.required]),
      nom : new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(15)]),
      prenom : new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(15)]),
      dateRelation : new FormControl(new Date().toISOString().substring(0, 10),[Validators.required]),
      dateNaissance : new FormControl(new Date().toISOString().substring(0, 10), [Validators.required]),
      lieuNaissance : new FormControl(null,[Validators.required]),
      civilite: new FormControl( null, [Validators.required]),
      sitFamiliale: new FormControl(null,[Validators.required]),
      nombreEnfants : new FormControl(null,[Validators.required]),
      cin : new FormControl(null,[Validators.required]),
      dateDelivrance: new FormControl(new Date().toISOString().substring(0, 10),[Validators.required]),
      codeImputation: new FormControl(null,[Validators.required]),
      telephone: new FormControl(null,[Validators.required,Validators.pattern('^(\\+\\d{1,2}\\s?)?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$')]),
      ville: new FormControl(null,[Validators.required]),
      codePostal: new FormControl(null,[Validators.required]),
      adresse: new FormControl(null,[Validators.required]),
      statutOccupationLogement : new FormControl(null,[Validators.required]),
      netMensuel: new FormControl(null),
      fonction: new FormControl(null),
      dateEmbauchenew:new  FormControl(new Date().toISOString().substring(0, 10)),
      Echelle : new FormControl(null)
    },);

    await this.getClientToUpdate();

    this.civiliteBox=this.getCivilite()

    this.sitFamilialeBox=this.getSitFamiliale()

    this.villeBox=this.getVille()

    this.villeBox1 = await this.getAllVilles()

    this.statusLogBox=this.getStatutOccupationLogement()


  }

  async initialiseForm(codeClient:string){
    this.client= await lastValueFrom(this.clientService.getClientBycode(codeClient))
    console.log('##### ' +JSON.stringify(this.client,null,2))
    this.creationForm.patchValue({
      nom: this.client['nom'],
      prenom: this.client['prenom'],
      dateRelation: this.client['dateRelation'],
      codeClient: codeClient, // Assuming this should be set as the codeClient parameter
      dateNaissance: this.client['dateNaissance'],
      lieuNaissance: this.client['lieuNaissance'],
      civilite: { label: this.client['civilite'] },
      sitFamiliale: { label: this.client['sitFamiliale'] },
      nombreEnfants: this.client['nombreEnfants'],
      cin: this.client['cin'],
      dateDelivrance: this.client['dateDelivrance'],
      codeImputation: this.client['codeImputation'],
      telephone: this.client['telephone'],
      ville: { label: this.client['ville'] },
      codePostal: this.client['codePostal'],
      adresse: this.client['adresse'],
      statutOccupationLogement: { label: this.client['statutOccupationLogement'] },
    });
  }

  showErrorViaMessages(warn:string) {
    this.msgs = [];
    this.msgs.push({ severity: 'error', summary: 'Warn Message', detail:warn});
  }

  showToast(type:string,msg:string,summary:string) {
    console.log("#### showSuccessViaToast called")
    this.messageservice.add({ key: 'tst', severity: type, summary: summary, detail: msg });
  }

  async creer1() {

    this.submitted = true;
    this.errorMessages = [];
  
    if (this.creationForm.valid) {
      const clientFormData = this.convertToFormData1(this.creationForm.value);
  
      // Create client
      this.clientService.creerClient1(clientFormData).subscribe({
        next: async (response: any) => {
          console.log("Client creation response: ", response);
          this.showToast('success','client est creer avec succes','Succes');
          //this.creationForm.reset();
          this.submitted = false;
          
        },

        error: (error: any) => {
          //this.errorMessages = error.error.value.message;
          this.showToast('error',error.error.value?.message,'echec');
          console.error("client creation error: "+ error);
        }
      });
    }
  }

  convertToFormData1(formData: any) {
    const specialKeys = ["ville", "civilite", "statutOccupationLogement", "sitFamiliale"];
    const addressKeys = ["civilite", "statutOccupationLogement", "sitFamiliale"];

    let clientFormData = new FormData();

    for (let key in formData) {
      
      if (specialKeys.includes(key)) {
        clientFormData.append(key, formData[key]?.label ?? null);
      }
      else {
        clientFormData.append(key, formData[key]);
      }
    }

    clientFormData.forEach((v,k)=>{
      console.log('# key '+k+' ## value '+v)
    })
    return clientFormData;
  }

  reset(){
    this.creationForm.reset()
  }

  async update(){
    this.submitted = true;
    this.errorMessages = [];

    const specialKeys = ["ville", "civilite", "statutOccupationLogement", "sitFamiliale"];
    
    if (this.creationForm.valid) {

      console.log('######### sss'+ JSON.stringify(this.creationForm.value,null,2))

      for (let key in this.creationForm.value) {
        if (specialKeys.includes(key)) {
          this.creationForm.patchValue({ [key]: this.creationForm.value[key]?.label ?? null });
        }
      }
      
      this.clientSer.update(this.creationForm.value).subscribe({
        next : async (response:any) => {
        // Handle success
          console.log('Update successful', response);
          this.showToast('success','client '+this.codeClient +' est modifier avec succes','Succes');
          //this.creationForm.reset();
          this.submitted = false;
          this.creationForm.reset()
          await this.getClientToUpdate();

        },

        error: (error: any) => {
          // Handle error
          console.error('Update failed', error);
        }
      });      
    }
  }

  /*
    async creer() {

    this.submitted = true;
    this.errorMessages = [];
  
    if (this.creationForm.valid) {
      const { domicileFormData, clientFormData } = this.convertToFormData(this.creationForm.value);
  
      // Create client
      this.clientService.creerClient(clientFormData).subscribe({
        next: async (response: any) => {
          console.log("Client creation response: ", response);

          await this.creerDomicile(domicileFormData)
          // If domicile creation is successful, create client

          
        },

        error: (error: any) => {
          //this.errorMessages = error.error.value.message;
          this.showToast('error',error.error.value.message,'echec');
          console.error("client creation error: "+ error);
        }
      });
    }
  }

  creerDomicile(domicileFormData:FormData){

    this.clientService.creerDomicile(domicileFormData).subscribe({

      next: (response: any) => {

        console.log("domicile creation response: ", response);
        this.showToast('success','client est creer avec succes','Succes');
        //this.creationForm.reset();
        this.submitted = false;
      },

      error: (error: any) => {
        //this.errorMessages = error.error.value.message;
        console.error('domicile creation error '+error);
        this.showToast('error',error.error.value.message,'echec');

      }
    });
  }
  
  

  convertToFormData(formData: any) {
    const addressKeys = ["ville", "adresse", "codePostal"];
    const specialKeys = ["civilite", "statutOccupationLogement", "sitFamiliale"];

    let domicileFormData = new FormData();
    let clientFormData = new FormData();

    for (let key in formData) {
      if(key=="codeClient"){
        domicileFormData.append(key,formData[key])
        clientFormData.append(key,formData[key])
      }
      else if (addressKeys.includes(key)) {
        
        domicileFormData.append(key, formData[key]?.label ?? formData[key]);
      } 
      else if (specialKeys.includes(key)) {
        clientFormData.append(key, formData[key]?.label ?? null);
      } 
      else {
        clientFormData.append(key, formData[key]);
      }
    }
    return { domicileFormData, clientFormData };
  }
  */

}
