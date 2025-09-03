import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { APP_CONFIG, AppConfig } from 'src/config/app-config.interface';
import { HttpClient } from '@angular/common/http';

import { Site } from '../../../../app/core/shared/site.model';
import { HomeCoarComponent } from '../../../../app/home-page/home-coar/home-coar.component';
import { ThemedHomeNewsComponent } from '../../../../app/home-page/home-news/themed-home-news.component';
import { RecentItemListComponent } from '../../../../app/home-page/recent-item-list/recent-item-list.component';
import { ThemedTopLevelCommunityListComponent } from '../../../../app/home-page/top-level-community-list/themed-top-level-community-list.component';
import { CommunityStatsComponent } from './community-stats/community-stats.component';
import { SuggestionsPopupComponent } from '../../../../app/notifications/suggestions/popup/suggestions-popup.component';
import { ThemedConfigurationSearchPageComponent } from '../../../../app/search-page/themed-configuration-search-page.component';
import { ThemedSearchFormComponent } from '../../../../app/shared/search-form/themed-search-form.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'ds-base-home-page',
  styleUrls: ['./home-page.component.scss'],
  templateUrl: './home-page.component.html',
  standalone: true,
  imports: [
    CommonModule,
    HomeCoarComponent,
    RecentItemListComponent,
    SuggestionsPopupComponent,
    ThemedConfigurationSearchPageComponent,
    ThemedHomeNewsComponent,
    ThemedSearchFormComponent,
    ThemedTopLevelCommunityListComponent,
    TranslateModule,
    CommunityStatsComponent,
    RouterModule,
  ],
})
export class HomePageComponent implements OnInit {
  site$: Observable<Site>;
  recentSubmissionspageSize: number;
  showDiscoverFilters: boolean;

  randomItem1: any = null;
  randomItem2: any = null;
  isLoading: boolean = true;
  types: { name: string; count: number }[] = [];
  iconesMap: Record<string, string> = {
    Apresentação: 'assets/ridi/images/book.svg',
    Artigo: 'assets/ridi/images/bookmark.svg',
    'Artigo de Periódico': 'assets/ridi/images/edit.svg',
    'Capítulo de livro': 'assets/ridi/images/li_file.svg',
    Dissertação: 'assets/ridi/images/quote.svg',
    Livro: 'assets/ridi/images/book.svg',
    Outro: 'assets/ridi/images/bookmark.svg',
    Tese: 'assets/ridi/images/quote.svg',
    'Trabalho apresentado em evento': 'assets/ridi/images/edit.svg',
  };

  constructor(
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    protected route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.recentSubmissionspageSize =
      this.appConfig.homePage.recentSubmissions.pageSize;
    this.showDiscoverFilters = this.appConfig.homePage.showDiscoverFilters;
  }

  ngOnInit(): void {
    this.site$ = this.route.data.pipe(map((data) => data.site as Site));
    this.carregarDestaqueAleatorio();
    this.carregarTiposDocumentos(); // carregamento independente
  }

  onClickDcType(type: string): void {
    const queryParams = { 'query=dc.type:': type };
    // Navega para a página de busca com o filtro aplicado
    window.open(`/search?${new URLSearchParams(queryParams).toString()}`, '_blank');
  }

  getIcon(type: string): string {
    return this.iconesMap[type] || 'assets/ridi/images/bookmark.svg';
  }

  /** ================================
   *  DESTAQUE ALEATÓRIO
   *  ================================ */
  private carregarDestaqueAleatorio(): void {
    this.isLoading = true;
    this.http.get<any>(
  `${environment.rest.baseUrl}/api/discover/search/objects?size=100`
)
      .subscribe({
        next: (data) => {
          const items = this.extrairItens(data);

          if (items.length < 2) {
            console.warn('Itens insuficientes para sortear dois destaques');
            this.isLoading = false;
            this.cdr.detectChanges();
            return;
          }

          // Embaralha os itens
          const shuffled = items.sort(() => 0.5 - Math.random());

          // Pega os dois primeiros diferentes
          this.randomItem1 = shuffled[0];
          this.randomItem2 = shuffled[1];

          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Erro ao buscar itens aleatórios:', err);
          this.isLoading = false;
          this.cdr.detectChanges();
        },
      });
  }

  /** Recupera resumo em pt ou en */
  getResumo(item: any, limit = 300): string {
    const resumo =
      item.metadata['dc.description.resumo']?.[0]?.value ||
      item.metadata['dc.description.abstract']?.[0]?.value ||
      '';
    return this.limitarAbstract(resumo, limit);
  }

  /** ================================
   *  TIPOS DE DOCUMENTOS
   *  ================================ */
  private carregarTiposDocumentos(): void {
    this.http
      .get<any>(
        `${environment.rest.baseUrl}/api/discover/search/objects?size=1000`
      )
      .subscribe({
        next: (data) => {
          const items = this.extrairItens(data);
          const typeCountMap = this.contarTipos(items);

          this.types = Object.keys(typeCountMap)
            .sort()
            .map((key) => ({
              name: key,
              count: typeCountMap[key],
            }));

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Erro ao buscar tipos de documentos:', err);
        },
      });
  }

  /** ================================
   *  AUXILIARES
   *  ================================ */
  private extrairItens(data: any): any[] {
    return (data._embedded?.searchResult?._embedded?.objects || [])
      .map((o: any) => o._embedded.indexableObject)
      .filter((obj: any) => obj.type === 'item');
  }

  private contarTipos(items: any[]): Record<string, number> {
    const typeCountMap: Record<string, number> = {};
    items.forEach((item) => {
      const type = item.metadata['dc.type']?.[0]?.value;
      if (type && typeof type === 'string') {
        typeCountMap[type] = (typeCountMap[type] || 0) + 1;
      }
    });
    return typeCountMap;
  }

  /** Limita o resumo em X caracteres */
  limitarAbstract(text: string, limit = 150): string {
    if (!text) return '';
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  }
}
