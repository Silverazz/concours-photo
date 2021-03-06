import { NgModule } from '@angular/core';
import {ExtraOptions, RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {LoginComponent} from './components/authentication/login/login.component';
import {RegisterComponent} from './components/authentication/register/register.component';
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';
import {FeedComponent} from './components/feed/feed.component';
import {ThemeComponent} from './components/theme/theme.component';
import {ProfileComponent} from './components/profile/profile.component';
import {OtherProfileComponent} from './components/other-profile/other-profile.component';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { AuthGuardService } from './services/auth-guard.service';
import {LeaderboardComponent} from "./components/leaderboard/leaderboard.component";

const routes: Routes = [
    { path : 'feed', component: FeedComponent },
    { path : 'settings', canActivate: [AuthGuardService], component: UserSettingsComponent },
    { path : 'login', component: LoginComponent },
    { path : 'me', component: ProfileComponent },
    { path : 'user/:id', component: OtherProfileComponent },
    { path : 'register', component: RegisterComponent },
    { path : 'leaderboard', component: LeaderboardComponent},
    { path : 'themes', component: ThemeComponent },
    { path : '', redirectTo: '/feed', pathMatch: 'full'},
    { path : '**', component: PageNotFoundComponent }
];

const routerOptions: ExtraOptions = {
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled',
};

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes, routerOptions)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
