import { HttpClient } from '@angular/common/http';
import { ElementRef, Injectable, ViewChild } from '@angular/core';
import {lastValueFrom } from 'rxjs';
//import { MenuItem } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { BarDto } from 'src/app/shared/models/BarDto';
import { MenuDto } from 'src/app/shared/models/MenuDto';
import { MenuItems } from 'src/app/shared/models/MenuItems';

@Injectable({
  providedIn: 'root'
})
export class ItemBarService {

  menuItem: MenuItems[] | undefined=[];

  public sidebarVisible: boolean = true;

  constructor(private http: HttpClient) {}

  

  getMenus() {
    return this.http.get<BarDto[]>(`${environment.appUrl}app/get-bars`);
  }

  getMenuByid(id:number) {
    return this.http.get<BarDto>(`${environment.appUrl}app/get-bar/${id}`);
  }

  async getMenusItem(){
    this.menuItem = [{ items: [] }];
    const barDto = await lastValueFrom(this.getMenus());
    for (const bar of barDto) {
        const observable = this.getMenuByid(bar.id);
        const response: BarDto = await lastValueFrom(observable);
        let newItem: MenuItems | undefined;
        console.log('#### response '+JSON.stringify(response,null,2))
        if(response.hasChild){
          newItem = {
              label: response.title,
              hasChild: true,
              items:await this.getsubMenuItems(response),
          };
        }
        else{
          newItem = {
            label: response.title,
            hasChild: false,
            routerLink: ['/salaf/'+response.title.toLowerCase().replace(/\s/g, "")],
        };
        }
        if (newItem) {
          this.menuItem[0].items.push(newItem);
        }
    }

  }

  async getsubMenuItems(response: BarDto): Promise<MenuItems[]> {
    const subMenuItems: MenuItems[] = [];
    for (const menu of response.menusDto) {
      let newItem: MenuItems | undefined;
      
      if (menu.hasChild && menu.parentId === 0) {
        let url='/salaf/'+response.title+'/'
        console.log('#### '+url)
        const subMenuItems = await this.getSubMenuItemsSubItems(menu, response, url);
        newItem = {
          label: menu.name,
          hasChild: true,
          items: subMenuItems,
        };
      } else if (menu.parentId === 0) {
        newItem = {
          label: menu.name,
          hasChild: false,
          routerLink: ['/salaf/'+ response.title.toLowerCase().replace(/\s/g, "") + '/' + menu.name.toLowerCase().replace(/\s/g, "") ],
        };
      }  
      if (newItem) {
        subMenuItems.push(newItem);
      }
    }
    return subMenuItems;
  }
  
  private async getSubMenuItemsSubItems(parent: MenuDto, menus:BarDto,url:string): Promise<MenuItems[]> {
    const SubMenuItemsSubItems: MenuItems[] = [];
    url+=parent.name+'/'
    console.log('#### '+ url)
    for (const menu of menus.menusDto) {
      if (menu.parentId === parent.id) {
        const subMenuItem: MenuItems = {
          label: menu.name,
        };

        if (menu.hasChild) {
          subMenuItem.hasChild=true
          console.log('#### '+ url)
          subMenuItem.items = await this.getSubMenuItemsSubItems(menu,menus,url);
        }

        else{
          subMenuItem.hasChild=false
          subMenuItem.routerLink=[url.toLowerCase().replace(/\s/g, "")+'/'+menu.name]
        }
  
        SubMenuItemsSubItems.push(subMenuItem);
      }
    }
    return SubMenuItemsSubItems;
  }
  
async getAllmenu(): Promise<MenuItems> {
    await this.getMenusItem();
    return this.menuItem;
}

}
