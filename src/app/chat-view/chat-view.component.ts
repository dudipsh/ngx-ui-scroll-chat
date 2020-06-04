import {Component, Input, OnInit} from '@angular/core';
import {Datasource} from 'ngx-ui-scroll';
import {MessageService} from './services/message.service';
import {filter, take} from 'rxjs/operators';
import {QueryRef} from 'apollo-angular';

@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.scss']
})
export class ChatViewComponent implements OnInit {
  public queryRef: QueryRef<any>;
  @Input() channelId;
  startIndex = 1;
  data = [];
  datasource = new Datasource({
    get: (index, count) => {
      return this.messageService.testFetchMore(this.queryRef, this.channelId, index, count);
    },
    settings: {
      startIndex: 0,
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
    console.log('ngOnInit');
    this.queryRef = this.messageService.requestData(this.channelId, 0, 50);

    // init queryRef
    this.queryRef.valueChanges.subscribe((res) => {
      console.log(res);
      this.processNewMessages();
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
