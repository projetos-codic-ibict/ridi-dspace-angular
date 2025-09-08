import {
  AsyncPipe,
  DatePipe,
} from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FooterComponent as BaseComponent } from '../../../../app/footer/footer.component';

@Component({
  selector: 'ds-themed-footer',
  // styleUrls: ['./footer.component.scss'],
  styleUrls: ['./footer.component.scss'],
  // templateUrl: './footer.component.html'
  templateUrl: './footer.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    RouterLink,
    TranslateModule,
  ],
})
export class FooterComponent extends BaseComponent {
 showButton = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
  this.showButton = window.scrollY > 100; 
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}


