import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Datasource} from 'ngx-ui-scroll';
import {MessageService} from './services/message.service';
import {debounceTime, filter, map, take, throttle} from 'rxjs/operators';
import {of} from 'rxjs';

@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.scss']
})
export class ChatViewComponent implements OnInit , AfterViewInit{
  MIN = 1;

  @ViewChild('list', {static: true}) list: ElementRef
  @Input() channelId;
  startIndex = 1;
  totalItems;
  data = [];
  lastValue;
  setState = {};
  datasource = new Datasource({
    get:  (index, count) => {
      const _index = -index - count + this.MIN;
      return  this.messageService.readMessagesData(_index, count).pipe((map(items => {
        this.startIndex += items.length;
        this.totalItems = this.messageService.totalItems;
        return items
      })));
    },
    settings: {
      startIndex: -10,
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
    console.log(el)
    // el.getBoundingClientRect().height
    el.scrollTop = el.getBoundingClientRect().height;

  }

}
