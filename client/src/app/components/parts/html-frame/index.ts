import { ServerConfigService as ConfigService } from '@services/server-config';
import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'html-frame',
    templateUrl: './index.html',
    styleUrls: ['./style.scss']
})
export class HtmlFrameComponent implements OnInit {

    @Input()
    HtmlFrame: ApiServerConfig['HTMLFrame'];

    frame: string;
    defaultFrame: string;

    constructor(private configService: ConfigService) {
    }

    ngOnInit() {
        this.defaultFrame = '';
        this.frame = this.HtmlFrame || this.defaultFrame;
    }
}
