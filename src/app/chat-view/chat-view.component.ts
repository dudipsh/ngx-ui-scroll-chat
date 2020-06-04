import {Component, Input, OnInit} from '@angular/core';
import {Datasource} from 'ngx-ui-scroll';
import {MessageService} from './services/message.service';
import {debounceTime, filter, map, take} from 'rxjs/operators';

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
  lastValue;
  datasource = new Datasource({
    get: (index, count) => {
      return this.messageService.readMessagesData(index, count).pipe((map(items => {
        this.startIndex += items.length;
        this.totalItems = this.messageService.totalItems;
        return items;
      }))).pipe(debounceTime(1000));
    },
    settings: {
      startIndex: this.totalItems,
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
    this.datasource.adapter.isLoading$
       .pipe((debounceTime(300))) //
      .subscribe((res) => {
        if (this.lastValue !== res) {
          if (res) {
            this.processNewMessages();
          }
          // this.processNewMessages();
        }
        this.lastValue = res;
      });
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
