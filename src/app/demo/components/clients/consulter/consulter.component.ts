import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ClientService } from 'src/app/demo/service/client.service';

@Component({
  selector: 'app-consulter',
  templateUrl: './consulter.component.html',
  styleUrl: './consulter.component.css'
})
export class ConsulterComponent implements OnInit {
  clients:any;
  searchLabel:string | undefined;
  constructor(private clientService:ClientService){}

  async ngOnInit(): Promise<void> {
    this.clients= await lastValueFrom(this.clientService.getAllClients());
    console.log('##### '+JSON.stringify(this.clients,null,2))
  }

  search(event: any) {
    const query = event.target.value;
    console.log('Search query:  ', query);
    if(this.searchLabel)
      console.log('value '+ this.searchLabel)
      if(!this.searchLabel) 
      console.log('value dddd'+ this.searchLabel)
  }
}
