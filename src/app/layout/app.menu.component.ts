
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { ItemBarService } from './service/items.service';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AuthService } from '../demo/service/auth.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit, OnDestroy {

    model: any[] = [];
    isLoading: boolean = false;
    private menuSubscription?: Subscription;

    items;
    items1: any[] = [];
    menu:any[]=[];
    constructor(public layoutService: LayoutService, public itemBarService:ItemBarService,private authService: AuthService) { }

    async ngOnInit() {
        // ✅ Charger le menu au démarrage
        await this.loadMenu();

        // ✅ S'abonner aux changements de menu (optionnel)
        this.menuSubscription = this.itemBarService.menu$.subscribe(menu => {
        if (menu) {
            this.model = menu;
            console.log('📬 Menu updated from observable');
        }
        });

        console.log('##### '+JSON.stringify(this.items,null,2))

    }

    ngOnDestroy() {
        this.menuSubscription?.unsubscribe();
    }
    async loadMenu(forceRefresh: boolean = false) {
        // ✅ Vérifier si l'utilisateur est connecté
        if (!this.authService.isLoggedIn()) {
            console.log('❌ User not logged in, skipping menu load');
        return;
        }

        this.isLoading = true;

        try {
            // ✅ Charge depuis le cache ou l'API
            const items = await this.itemBarService.getAllmenu(forceRefresh);
            this.items = items;

            console.log('##### Menu loaded');
            console.log('📦 Menu is cached:', this.itemBarService.isLoaded());
            } catch (error) {
            console.error('Error loading menu:', error);
            this.model = [{ items: [] }];
            } finally {
            this.isLoading = false;
        }
    }
    /**
   * Rafraîchir le menu manuellement (si besoin)
   */
    async refreshMenu() {
        console.log('🔄 Manually refreshing menu...');
        await this.loadMenu(true);
    }
    
}


