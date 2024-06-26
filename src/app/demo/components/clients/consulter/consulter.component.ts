import { Component, OnInit } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, lastValueFrom, switchMap } from 'rxjs';
import { ClientService } from 'src/app/demo/service/client.service';

@Component({
  selector: 'app-consulter',
  templateUrl: './consulter.component.html',
  styleUrl: './consulter.component.css'
})
export class ConsulterComponent implements OnInit {
  clients:any | undefined;
  searchLabel:string | undefined;
  clientssearched:any | undefined;
  private searchTerms = new Subject<string>();

  constructor(private clientService:ClientService){}

  async ngOnInit(): Promise<void> {

    this.clients= await lastValueFrom(this.clientService.getAllClients());
    console.log('#####'+JSON.stringify(this.clients,null,2))
  }

  search(event: any) {
    const query = event.target as HTMLInputElement;
    let label = query.value
    console.log('Search query:  ', label);
    this.clientService.searchByLabel(label).subscribe({
      next: (responce)=>{
        console.log("responce "+ JSON.stringify(responce,null,2))
      },
      error: (error)=>{
        console.log("error "+ JSON.stringify(error))
      }
    })
  }

  async search1(term: string): Promise<void> {
    if(term.indexOf(' ') < 0 && term!=""){
      console.log('#### 2'+term)
      this.searchTerms.next(term);
      this.searchTerms.pipe(
        debounceTime(3000), // wait for 2000ms (2 seconds) after each keystroke before considering the term
        distinctUntilChanged(), // ignore if next search term is same as previous
        switchMap((term: string) => this.clientService.searchByLabel(term))
      ).subscribe({
        next: (response) => {
          console.log("Response:", response);
          this.clientssearched=response;
          this.clients=null
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
      this.clientssearched=null;
      this.clients= await lastValueFrom(this.clientService.getAllClients());
    }
  }
}
