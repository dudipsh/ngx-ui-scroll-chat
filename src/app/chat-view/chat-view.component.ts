import {Component, Input, OnInit} from '@angular/core';
import {Datasource} from 'ngx-ui-scroll';
import {MessageService} from './services/message.service';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.scss']
})
export class ChatViewComponent implements OnInit {

  @Input() channelId;

  datasource = new Datasource({
    get: (index, count) => {
      console.log(index, count)
      return this.messageService.requestData(this.channelId, index, count)
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
    this.messageService.loadFirstBulk(this.channelId);
    //  get first 50 items

  }

}
