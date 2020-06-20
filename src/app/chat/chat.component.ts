import {AfterViewInit, Component, Directive, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subject} from "rxjs";
import {Message} from "../interfaces/message";
import {ChatService} from "./services/chat.service";
import {MessageService} from "./services/message.service";
import {MessagesFetchDataResult} from "../interfaces/messages-fetch-data-result";

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy  {

    isInitialized = false;
    activeChannel: string;
    destroy$ = new Subject<void>();
    startIndex;
    emojiPosition;

    messages: Message[];


    constructor(
        private route: ActivatedRoute,
        private chatService: ChatService,
        private messageService: MessageService,
    ) {
    }

    ngOnInit(): void {
      this.activeChannel = '5eec5bf61cfa5bd2b297a496';
      this.chatService.readMessagesInChannel(this.activeChannel, 0, 1, 'ts')
        .subscribe((serverData: MessagesFetchDataResult) => {
          if (serverData.totalCount > 0) {
            this.messageService.initialize(this.activeChannel, 0)
              .then(value => {
                console.log('value', value)
                this.isInitialized = value
              });
          }

        });

    }


    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

}



