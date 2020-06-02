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
      return this.messageService.readMessage(this.channelId, index, count).pipe((take(1)))
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
  ) { }

  ngOnInit(): void {
     // get first 50 items
    this.messageService.readMessage(this.channelId, 50, 0).subscribe((res) => {
      console.log(res)
    }, (err) => console.log(err))
  }

}
