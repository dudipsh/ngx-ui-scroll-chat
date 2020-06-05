import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Datasource} from 'ngx-ui-scroll';
import {MessageService} from './services/message.service';
import {filter, map, take} from 'rxjs/operators';

@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.scss']
})
export class ChatViewComponent implements OnInit, AfterViewInit {
  MIN = 1;
  MAX = 1000;
  @ViewChild('list', {static: true}) list: ElementRef;
  @Input() channelId;
  startIndex = 1;
  apiCounter = 0;
  totalItems;
  data = [];
  indexTrack = [];
  countTrack = [];
  lastValue;
  setState = {};
  datasource = new Datasource({
    get: (index, count) => {
      this.indexTrack.push(index);
      this.countTrack.push(count);
      const _index = -index - count + this.MIN;
      console.log(index);
      return this.messageService.readMessagesData(index, count).pipe((map(items => {
        this.startIndex += items.length;
        this.totalItems = this.messageService.totalItems;
        this.data = [...new Set([...this.data, ...items])];
        this.apiCounter = this.messageService.apiCallCounter;
        return items;
      })));
    },
    settings: {

      startIndex: 1,
      inverse: true,

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
      .pipe(take(1)) //
      .subscribe((res) => {
        this.processNewMessages();
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
