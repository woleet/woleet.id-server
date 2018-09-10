import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { PageDataService } from '@services/page-data';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private pageDataService: PageDataService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map((route) => {
        while (route.firstChild) {
          route = route.firstChild;
        }

        return route;
      }),
      filter((route) => route.outlet === 'primary'),
      mergeMap((route) => route.data),
    ).subscribe((event) => {
      this.pageDataService.setTitle(event['title']);
      this.titleService.setTitle(event['title']);
    });
  }

}
