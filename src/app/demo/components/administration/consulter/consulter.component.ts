import { Component } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, lastValueFrom, switchMap } from 'rxjs';
import { AuthService } from 'src/app/demo/service/auth.service';

@Component({
  selector: 'app-consulter',
  templateUrl: './consulter.component.html',
  styleUrl: './consulter.component.css'
})
export class ConsulterComponent {
  utilisateurs:any | undefined;
  searchLabel:string | undefined;
  private searchTerms = new Subject<string>();
  utilisateursearched: any | undefined;


  constructor(private authService: AuthService){}

  async ngOnInit(): Promise<void> {

    this.utilisateurs= await lastValueFrom(this.authService.getAllUsers());

    console.log('#####'+JSON.stringify(this.utilisateurs,null,2))
  }

  async search1(term: string): Promise<void> {
    if(term.indexOf(' ') < 0 && term!=""){
      console.log('#### 2'+term)
      this.searchTerms.next(term);
      this.searchTerms.pipe(
        debounceTime(3000), // wait for 2000ms (2 seconds) after each keystroke before considering the term
        distinctUntilChanged(), // ignore if next search term is same as previous
        switchMap((term: string) => this.authService.searchByLabel(term))
      ).subscribe({
        next: (response) => {
          console.log("Response:", response);
          this.utilisateursearched=response;
          console.log('#### dd '+ JSON.stringify(this.utilisateursearched[0]['profile']))
          this.utilisateurs=null
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
      this.utilisateursearched=null;
      this.utilisateurs= await lastValueFrom(this.authService.getAllUsers());
    }
  }

  getProfileImageSrc(profileContent: string): string {
    let image= profileContent;
    console.log('#####image '+image)
    return image
  }
}
