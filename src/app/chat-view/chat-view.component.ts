import {Component, Input, OnInit} from '@angular/core';
import {Datasource} from 'ngx-ui-scroll';
import {MessageService} from './services/message.service';
import {filter, map, take} from 'rxjs/operators';
import {QueryRef} from 'apollo-angular';
import {ChatApiService} from './services/chat-api.service';

@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.scss']
})
export class ChatViewComponent implements OnInit {
  @Input() channelId;
  startIndex = 1;
  totalItems;
  data = [];
  datasource = new Datasource({
    get: (index, count) => {
      return this.messageService.readMessagesData(index, count).pipe((map(items => {
        this.totalItems = this.messageService.totalItems
        return items;
      })))
    },
    settings: {
      startIndex: 2  ,
      inverse: true
    },
    devSettings: {
      debug: false
    }
  });

  constructor(
    private messageService: MessageService,
  ) {
  }


  ngOnInit(): void {
    this.totalItems = this.messageService.totalItems;
    this.processNewMessages();
  }

  processNewMessages() {
    const {adapter} = this.datasource;
    if (!adapter.isLoading) {
      return;
    }
    const viewportElement = document.getElementById('viewport');
    adapter.isLoading$
      .pipe(filter(isLoading => !isLoading), take(1))
      .subscribe(() => {
        viewportElement.scrollTop = viewportElement.scrollHeight;
        adapter.clip();
      });
  }

}
