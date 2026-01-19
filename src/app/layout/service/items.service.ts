import { HttpClient } from '@angular/common/http';
import { ElementRef, Injectable, ViewChild } from '@angular/core';
import {BehaviorSubject, lastValueFrom } from 'rxjs';
//import { MenuItem } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { BarDto } from 'src/app/shared/models/BarDto';
import { MenuDto } from 'src/app/shared/models/MenuDto';
import { MenuItems } from 'src/app/shared/models/MenuItems';

@Injectable({
  providedIn: 'root'
})
export class ItemBarService {

// ✅ Cache qui persiste jusqu'au logout
  private menuCache: { items: MenuItems[] }[] | null = null;
  private isMenuLoaded: boolean = false;

  // ✅ BehaviorSubject pour observer les changements
  private menuSubject = new BehaviorSubject<{ items: MenuItems[] }[] | null>(null);
  
  public menu$ = this.menuSubject.asObservable();

  menuItem: MenuItems[] | undefined=[];

  public sidebarVisible: boolean = true;

  constructor(private http: HttpClient) {}

  

  getMenus() {
    return this.http.get<BarDto[]>(`${environment.appUrl}app/get-bars`);
  }

  getMenuByid(id:number) {
    return this.http.get<BarDto>(`${environment.appUrl}app/get-bar/${id}`);
  }
  /**
   * Récupère les menus depuis le cache ou depuis l'API
   * @param forceRefresh - Force le rechargement depuis l'API
  */
  async getAllmenu(forceRefresh: boolean = false): Promise<{ items: MenuItems[] }[]> {
    // ✅ Si le cache existe et qu'on ne force pas le refresh
    if (!forceRefresh && this.isMenuLoaded && this.menuCache) {
      console.log('📦 Returning menu from cache (cached until logout)');
      return this.menuCache;
    }

    // ✅ Charger depuis l'API
    console.log('🌐 Loading menu from API');
    await this.loadMenusFromApi();
    
    return this.menuCache!;
  }

  async loadMenusFromApi(){
    const menuItem: { items: MenuItems[] }[] = [{ items: [] }];

    try {
      const barDto = await lastValueFrom(this.getMenus());

      for (const bar of barDto) {
        const response: BarDto = await lastValueFrom(this.getMenuByid(bar.id));
        console.log('#### Loading bar:', response.title);

        let newItem: MenuItems | undefined;

        if (response.hasChild) {
          newItem = {
            label: response.title,
            hasChild: true,
            items: await this.getsubMenuItems(response),
          };
        } else {
          newItem = {
            label: response.title,
            hasChild: false,
            routerLink: ['/salaf/' + response.title.toLowerCase().replace(/\s/g, '')],
          };
        }

        if (newItem) {
          menuItem[0].items.push(newItem);
        }
      }

      // ✅ Mettre à jour le cache
      this.menuCache = menuItem;
      this.isMenuLoaded = true;
      
      // ✅ Notifier les observateurs
      this.menuSubject.next(menuItem);

      console.log('✅ Menu cached successfully (will persist until logout)');
    } catch (error) {
      console.error('❌ Error loading menus:', error);
      throw error;
    }
  }
  clearCache() {
    console.log('🗑️ Clearing menu cache (user logged out)');
    this.menuCache = null;
    this.isMenuLoaded = false;
    this.menuSubject.next(null);
  }
  isLoaded(): boolean {
    return this.isMenuLoaded;
  }
  async getsubMenuItems(response: BarDto): Promise<MenuItems[]> {
    const subMenuItems: MenuItems[] = [];
    // ✅ Protection contre null/undefined

    if (!response.menusDto || !Array.isArray(response.menusDto)) {
      console.warn('menusDto is null or not an array for bar:', response.title);
      return subMenuItems;
    }

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
    // ✅ Protection contre null/undefined
    if (!menus.menusDto || !Array.isArray(menus.menusDto)) {
      return SubMenuItemsSubItems;
    }

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
  
}
