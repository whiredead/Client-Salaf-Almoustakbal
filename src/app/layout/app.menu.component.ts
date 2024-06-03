
import { Component, OnInit } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { ItemBarService } from './service/items.service';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];
    items;
    items1: any[] = [];
    menu:any[]=[];
    constructor(public layoutService: LayoutService, public itemBarService:ItemBarService) { }

    async ngOnInit() {

        this.items= await this.itemBarService.getAllmenu()
        console.log('##### '+JSON.stringify(this.items,null,2))

        this.model = [{
            
            items: [
                {   
                    label:'Dossier',
                    url: "/",
                    items:[
                        {
                            "label": "Relevé",
                            "hasChild": true,
                            "items": [
                            {
                                "label": "RelveChild1",
                                "hasChild": true,
                                "items": [
                                {
                                    "label": "Relevechild11",
                                    "url": "/",
                                    "hasChild": false
                                }
                                ]
                            },
                            {
                                "label": "RelveChild2",
                                "url": "salaf",
                                "hasChild": false
                            }
                            ]
                        },

                        {
                            label: "Example",
                            items: [
            
                                {
                                    label: "ExampleChild",
                                },
                                {
                                    label: "ExampleChild3",
                                    items: [
                                        {
                                            label: "ExampleChild31",
                                            items: [
                                                {
                                                    label: "exampleChild311",
                                                }
                                            ]
                                        },
                                    
                                    ]
                                }
                            ]
                        },

                    ],

                },

                {
                    label: 'Home',
                    items: [
                        { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/salaf'] }
                    ]
                },
                {
                    label: 'UI Components',
                    items: [
                        { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', routerLink: ['/salaf/uikit/formlayout'] },
                        { label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/salaf/uikit/input'] },
                        { label: 'Float Label', icon: 'pi pi-fw pi-bookmark', routerLink: ['/salaf/uikit/floatlabel'] },
                        { label: 'Invalid State', icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['/salaf/uikit/invalidstate'] },
                        { label: 'Button', icon: 'pi pi-fw pi-box', routerLink: ['/salaf/uikit/button'] },
                        { label: 'Table', icon: 'pi pi-fw pi-table', routerLink: ['/salaf/uikit/table'] },
                        { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/salaf/uikit/list'] },
                        { label: 'Tree', icon: 'pi pi-fw pi-share-alt', routerLink: ['/salaf/uikit/tree'] },
                        { label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/salaf/uikit/panel'] },
                        { label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/salaf/uikit/overlay'] },
                        { label: 'Media', icon: 'pi pi-fw pi-image', routerLink: ['/salaf/uikit/media'] },
                        { label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/salaf/uikit/menu'], routerLinkActiveOptions: { paths: 'subset', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' } },
                        { label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/salaf/uikit/message'] },
                        { label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['/salaf/uikit/file'] },
                        { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/salaf/uikit/charts'] },
                        { label: 'Misc', icon: 'pi pi-fw pi-circle', routerLink: ['/salaf/uikit/misc'] }
                    ]
                },
                {
                    label: 'Prime Blocks',
                    items: [
                        { label: 'Free Blocks', icon: 'pi pi-fw pi-eye', routerLink: ['/salaf/blocks'], badge: 'NEW' },
                        { label: 'All Blocks', icon: 'pi pi-fw pi-globe', url: ['https://www.primefaces.org/primeblocks-ng'], target: '_blank' },
                    ]
                },
                {
                    label: 'Utilities',
                    items: [
                        { label: 'PrimeIcons', icon: 'pi pi-fw pi-prime', routerLink: ['/salaf/utilities/icons'] },
                        { label: 'PrimeFlex', icon: 'pi pi-fw pi-desktop', url: ['https://www.primefaces.org/primeflex/'], target: '_blank' },
                    ]
                },
                {
                    label: 'Pages',
                    icon: 'pi pi-fw pi-briefcase',
                    items: [
                        {
                            label: 'Landing',
                            icon: 'pi pi-fw pi-globe',
                            routerLink: ['/landing']
                        },
                        {
                            label: 'Auth',
                            icon: 'pi pi-fw pi-user',
                            items: [
                                {
                                    label: 'Login',
                                    icon: 'pi pi-fw pi-sign-in',
                                    routerLink: ['/salaf/auth/login']
                                },
                                {
                                    label: 'Error',
                                    icon: 'pi pi-fw pi-times-circle',
                                    routerLink: ['/salaf/auth/error']
                                },
                                {
                                    label: 'Access Denied',
                                    icon: 'pi pi-fw pi-lock',
                                    routerLink: ['/salaf/auth/access']
                                }
                            ]
                        },
                        {
                            label: 'Crud',
                            icon: 'pi pi-fw pi-pencil',
                            routerLink: ['/salaf/pages/crud']
                        },
                        {
                            label: 'Timeline',
                            icon: 'pi pi-fw pi-calendar',
                            routerLink: ['/salaf/pages/timeline']
                        },
                        {
                            label: 'Not Found',
                            icon: 'pi pi-fw pi-exclamation-circle',
                            routerLink: ['/notfound']
                        },
                        {
                            label: 'Empty',
                            icon: 'pi pi-fw pi-circle-off',
                            routerLink: ['']
                        },
                    ]
                },
                {
                    label: 'Hierarchy',
                    items: [
                        {
                            label: 'Submenu 1', icon: 'pi pi-fw pi-bookmark',
                            items: [
                                {
                                    label: 'Submenu 1.1', icon: 'pi pi-fw pi-bookmark',
                                    items: [
                                        { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                                        { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                                        { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' },
                                    ]
                                },
                                {
                                    label: 'Submenu 1.2', icon: 'pi pi-fw pi-bookmark',
                                    items: [
                                        { label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }
                                    ]
                                },
                            ]
                        },
                        {
                            label: 'Submenu 2', icon: 'pi pi-fw pi-bookmark',
                            items: [
                                {
                                    label: 'Submenu 2.1', icon: 'pi pi-fw pi-bookmark',
                                    items: [
                                        { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
                                        { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' },
                                    ]
                                },
                                {
                                    label: 'Submenu 2.2', icon: 'pi pi-fw pi-bookmark',
                                    items: [
                                        { label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' },
                                    ]
                                },
                            ]
                        }
                    ]
                },
                {
                    label: 'Get Started',
                    items: [
                        {
                            label: 'Documentation', icon: 'pi pi-fw pi-question', routerLink: ['/documentation']
                        },
                        {
                            label: 'View Source', icon: 'pi pi-fw pi-search', url: ['https://github.com/primefaces/sakai-ng'], target: '_blank'
                        }
                    ]
                }
            ]
    }];

       
        this.items1 = [
            
            {
                label: 'Documents',
                items: [
                    {
                        label: 'New',
                        icon: 'pi pi-plus',
                        shortcut: '⌘+N'
                    },
                    {
                        label: 'Search',
                        icon: 'pi pi-search',
                        shortcut: '⌘+S'
                    }
                ]
            },
            {
                label: 'Profile',
                items: [
                    {
                        label: 'Settings',
                        icon: 'pi pi-cog',
                        shortcut: '⌘+O'
                    },
                    {
                        label: 'Messages',
                        icon: 'pi pi-inbox',
                        badge: '2'
                    },
                    {
                        label: 'Logout',
                        icon: 'pi pi-sign-out',
                        shortcut: '⌘+Q'
                    }
                ]
            },
        ];
    }
    
}


