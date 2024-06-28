import { Component, OnInit } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, lastValueFrom, switchMap } from 'rxjs';
import { DossierService } from 'src/app/demo/service/dossier.service';

@Component({
  selector: 'app-consulter',
  templateUrl: './consulter.component.html',
  styleUrl: './consulter.component.css'
})
export class ConsulterComponent implements OnInit {
  dossiers:any | undefined;
  searchLabel:string | undefined;
  dossierssearched:any | undefined;
  private searchTerms = new Subject<string>();

  constructor( public dossierService: DossierService){}

  async ngOnInit(): Promise<void> {

    this.dossiers= await lastValueFrom(this.dossierService.getAllDossiers());
    console.log('#####'+JSON.stringify(this.dossiers,null,2))
  }

  async search1(term: string): Promise<void> {
    if(term.indexOf(' ') < 0 && term!=""){
      console.log('#### 2'+term)
      this.searchTerms.next(term);
      this.searchTerms.pipe(
        debounceTime(3000), // wait for 2000ms (2 seconds) after each keystroke before considering the term
        distinctUntilChanged(), // ignore if next search term is same as previous
        switchMap((term: string) => this.dossierService.searchByLabel(term))
      ).subscribe({
        next: (response) => {
          console.log("Response:", response);
          this.dossierssearched=response;
          this.dossiers=null
          // Handle the response here as needed
        },

        error: async (error) => {
          console.error("Error:", error);
          //this.clientssearched=undefined
          // Handle errors here as needed
        }
      }
      );
    }
    if(term==""){
      console.log('####inside if')
      this.dossierssearched=null;
      this.dossiers= await lastValueFrom(this.dossierService.getAllDossiers());
    }
  }
}
