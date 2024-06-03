import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';


@Component({
  selector: 'app-creation',
  templateUrl: './creation.component.html',
  styleUrl: './creation.component.css',
  providers: [MessageService]

})
export class CreationComponent implements OnInit {

  creationForm: FormGroup;
  submitted: boolean = false;
  errorMessages: string[]= []
  civiliteBox: SelectItem[] = [];
  sitFamilialeBox: SelectItem[] = [];

  constructor(private fb: FormBuilder, private messageservice: MessageService) {
    this.creationForm = new FormGroup({
      codeClient: new FormControl(null,[Validators.required]),
      nom : new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(15)]),
      prenom : new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(15)]),
      dateRelation : new FormControl(new Date().toISOString().substring(0, 10), [Validators.required]),
      dateNaissance : new FormControl(new Date().toISOString().substring(0, 10), [Validators.required]),
      lieuNaissance : new FormControl(null),
      civilite: new FormControl(null),
      sitFamiliale: new FormControl(null),
      nombreEnfants : new FormControl(null),
      cin : new FormControl(null, [Validators.required]),
      dateDelivrance: new FormControl(new Date().toISOString().substring(0, 10), [Validators.required]),
      codeImputation: new FormControl(null,[Validators.required]),
      telephone: new FormControl(null),
      ville: new FormControl(null),
      codePostal: new FormControl(null),
      adresse: new FormControl(null),
      statutOccupationLogement : new FormControl(null)
      
    },
  );}
  ngOnInit(): void {
    this.civiliteBox=[
      { label: 'Monsieur', value: { id: 1, name: 'Monsieur', code: 'M' } }, 
      { label: 'Mlle', value: { id: 2, name: 'Mlle', code: 'Mlle' } },      
      { label: 'Mme', value: { id: 3, name: 'Mme', code: 'Mme' } },

    ]
    this.sitFamilialeBox=[
      { label: 'Marié(e)', value: { id: 1, name: 'Marié', code: 'Marié' } },
      { label: 'Divorcé(e)', value: { id: 2, name: 'Divorce', code: 'D' } },
      { label: 'Célibataire', value: { id: 1, name: 'Celibataire', code: 'C' } },
      { label: 'Veuf(ve)', value: { id: 1, name: 'veuf', code: 'M' } },

    ]
  }

  creer(){
    console.log('###### '+ JSON.stringify(this.creationForm.value,null,2))
  }
  showSuccessViaToast() {
    console.log("#### showSuccessViaToast called")
    this.messageservice.add({ key: 'tst', severity: 'success', summary: 'Success Message', detail: 'Client creer avec succes' });
  }
}
