import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {InterceptorService} from './factory/interceptor';
import {UiScrollModule} from 'ngx-ui-scroll';
import {ChatComponent} from "./chat/chat.component";
import {ChatListItemsComponent} from "./chat/chat-list-items/chat-list-items.component";

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    ChatListItemsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    UiScrollModule,
    HttpClientModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
