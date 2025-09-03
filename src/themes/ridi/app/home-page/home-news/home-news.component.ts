import { Component } from '@angular/core';
import { HomeNewsComponent as BaseComponent } from '../../../../../app/home-page/home-news/home-news.component';

@Component({
  selector: 'ds-themed-home-news',
  templateUrl: './home-news.component.html',
  styleUrls: ['./home-news.component.scss'],
  standalone: true,
})
export class HomeNewsComponent extends BaseComponent {}



