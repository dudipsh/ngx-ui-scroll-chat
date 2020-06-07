import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Datasource} from 'ngx-ui-scroll';
import {MessageService} from './services/message.service';
import {filter, map, take, tap} from 'rxjs/operators';
import {ChatApiService} from './services/chat-api.service';
import {MessageServerResult} from './services/message-server-result';

@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.scss']
})
export class ChatViewComponent implements OnInit, AfterViewInit {
  @ViewChild('list', {static: true}) list: ElementRef;
  channelId = '5edaa34844a52a4e8a2159d9';
  messageServerResult: MessageServerResult = new MessageServerResult();
  MIN = 1;


  datasource = new Datasource({
    get: (index, count) => this.chatApiService.getMessages(index, count, this.channelId, '-ts')
      .pipe((map(res => {
        this.messageServerResult = res;
        return res.data;
      }))),
    settings: {
      minIndex: 0,
      startIndex: this.messageServerResult.totalCount + 1,
      inverse: true,
    },
    devSettings: {
      debug: false
    }
  });

  constructor(
    private messageService: MessageService,
    private chatApiService: ChatApiService,
  ) {
  }


  ngOnInit(): void {
    this.datasource.adapter.isLoading$
      .pipe(take(1)) //
      .subscribe((res) => {
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

  ngAfterViewInit(): void {
    const el = this.list.nativeElement;
    if (!el) {
      return;
    }
    console.log(el);
    // el.getBoundingClientRect().height
    el.scrollTop = el.getBoundingClientRect().height;

  }

}
