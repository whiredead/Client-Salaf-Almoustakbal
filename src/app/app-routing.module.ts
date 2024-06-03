import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from './layout/app.layout.component';
import { AuthorizationGuard } from './demo/guards/authorization.guard';
import { AcceuilComponent } from './demo/components/acceuil/acceuil.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: 'connecter', loadChildren: () => import('./demo/components/auth/login/login.module').then(m => m.LoginModule) },
            {
                path: 'salaf', component: AppLayoutComponent,
                runGuardsAndResolvers: 'always',
                canActivate: [AuthorizationGuard],
                children: [
                    {path: '', loadChildren: () => import('./demo/components/pages/empty/emptydemo.module').then(m => m.EmptyDemoModule),},
                    //{ path: '', loadChildren: () => import('./demo/components/dashboard/dashboard.module').then(m => m.DashboardModule) },
                    //{ path: 'uikit', loadChildren: () => import('./demo/components/uikit/uikit.module').then(m => m.UIkitModule) },
                    { path: 'utilities', loadChildren: () => import('./demo/components/utilities/utilities.module').then(m => m.UtilitiesModule) },
                    { path: 'documentation', loadChildren: () => import('./demo/components/documentation/documentation.module').then(m => m.DocumentationModule) },
                    { path: 'blocks', loadChildren: () => import('./demo/components/primeblocks/primeblocks.module').then(m => m.PrimeBlocksModule) },
                    { path: 'pages', loadChildren: () => import('./demo/components/pages/pages.module').then(m => m.PagesModule) },
                    { path: 'landing', loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule) },
                    { path: 'dossiers', loadChildren: () => import('./demo/components/dossiers/dossiers.module').then(m => m.DossiersModule) },
                    { path:'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule)},
                    {path:'administration', loadChildren:()=>import('./demo/components/administration/administration.module').then(m => m.AdministrationModule)},
                    {path:'clients', loadChildren:()=>import('./demo/components/clients/clients.module').then(m => m.ClientsModule)}
                ]
            },

            {   path: 'salaf', component: AppLayoutComponent,
                children: [
                    {path:'acceuil',component:AcceuilComponent}
                ]
            },

            { path:'', redirectTo: '/salaf/acceuil', pathMatch:'full' },
            { path: 'notfound', component: NotfoundComponent },
            { path: 'landing', loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule) },
            { path: '**', redirectTo: 'notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
