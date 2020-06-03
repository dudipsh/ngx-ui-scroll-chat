import {Component, Input, OnInit} from '@angular/core';
import {Datasource} from 'ngx-ui-scroll';
import {MessageService} from './services/message.service';
import {of} from 'rxjs';
import {filter, take} from 'rxjs/operators';

@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.scss']
})
export class ChatViewComponent implements OnInit {

  @Input() channelId;
  itemsCount = 0;
  data = [];
  datasource = new Datasource({
    get: (index, count) => {
      return this.messageService.requestData(this.channelId, count, index);
    },
    settings: {
      startIndex: 50,
      inverse: true
    },
    devSettings: {
      // debug: true
    }
  });

  constructor(
    private messageService: MessageService,
  ) {
  }


  ngOnInit(): void {
    console.log( 'lengt55h')
    // this.messageService.requestData(this.channelId, 0, 50).subscribe((data) => {
    //   //data.forEach((d) => this.data.push(d))
    //   this.data = data;
    //   console.log( 'length', this.data)
    // }, (error => console.log(error)))
   // this.processNewMessages();
    // this.messageService.loadFirstBulk(this.channelId);
    //  get first 50 items

  }

  processNewMessages() {
    const { adapter } = this.datasource;
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
