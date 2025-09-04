import { Component } from '@angular/core';
import { HomeNewsComponent as BaseComponent } from '../../../../../app/home-page/home-news/home-news.component';
import { ThemedSearchFormComponent } from 'src/app/shared/search-form/themed-search-form.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ds-themed-home-news',
  templateUrl: './home-news.component.html',
  styleUrls: ['./home-news.component.scss'],
  standalone: true,
  imports: [ThemedSearchFormComponent, TranslateModule],
})
export class HomeNewsComponent extends BaseComponent {}



