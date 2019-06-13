import { Component, Input, OnInit, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'

@Pipe({ name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform  {
  constructor(private sanitized: DomSanitizer) {}
  transform(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}

@Component({
  selector: 'html-frame',
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class HtmlFrameComponent implements OnInit {

  @Input()
  HTMLFrame: ApiServerConfig['HTMLFrame'];

  currentHTMLFrame: string;
  defaultHTMLFrame: string;

  constructor() {
  }

  ngOnInit() {
    this.defaultHTMLFrame = '';
    this.currentHTMLFrame = this.HTMLFrame || this.defaultHTMLFrame;
  }
}
