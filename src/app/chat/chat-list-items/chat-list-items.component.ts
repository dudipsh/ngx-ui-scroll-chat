import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {Datasource} from 'ngx-ui-scroll';
import {takeUntil} from 'rxjs/operators';
import {MessageService} from '../services/message.service';
import {Message} from '../../interfaces/message';


@Component({
  selector: 'app-chat-list-items',
  templateUrl: './chat-list-items.component.html',
  styleUrls: ['./chat-list-items.component.css']
})
export class ChatListItemsComponent implements OnInit {
  @ViewChild('viewport', {read: ElementRef}) viewport: ElementRef;

  destroy$ = new Subject<void>();
  datasource: Datasource; // need service initialization
  constructor(
    private messageService: MessageService
  ) {
  }

  ngOnInit(): void {
    const startIndex = this.messageService.lastIndex;

    this.datasource = new Datasource({
      get: (index, count) =>
        this.messageService.request(index, count)
      ,
      settings: {
        // minIndex: 0,
        startIndex,
        inverse: true
      },
      devSettings: {
        debug: false
      }
    });

    this.messageService.onPush$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
          console.log(data)
          this.processNewItems(data)
        }
      );
  }


  async processNewItems(items: Message[]) {
    const {adapter} = this.datasource;
    const element = this.viewport.nativeElement;
    adapter.append({items, bof: true});
    await adapter.relax();
    element.scrollTop = element.scrollHeight;
    adapter.clip();
  }

}
