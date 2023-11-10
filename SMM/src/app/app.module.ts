import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AppRoutingModule } from './app-routing.module';
import { AvatarModule } from '@coreui/angular';
import { DefaultOptionsInterceptor } from './default-options.interceptor';

import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UserItemComponent } from './components/user-item/user-item.component';
import { VipSelectionComponent } from './pages/vip-selection/vip-selection.component';
import { CharacterDisplayerComponent } from './components/character-displayer/character-displayer.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { FeedComponent } from './components/feed/feed.component';
import { LocalizationPostComponent } from './components/localization-post/localization-post.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    UserItemComponent,
    VipSelectionComponent,
    CharacterDisplayerComponent,
    TopBarComponent,
    CreatePostComponent,
    FeedComponent,
    LocalizationPostComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    BsDropdownModule.forRoot(),
    MatIconModule,
    HttpClientModule,
    AvatarModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DefaultOptionsInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
