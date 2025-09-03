import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'ds-community-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './community-stats.component.html',
  styleUrls: ['./community-stats.component.scss'],
})
export class CommunityStatsComponent implements OnInit {
  stats$!: Observable<{ name: string; count: number }[]>;

  private communityUuids = [
    '5d2f67ee-2a26-490f-8b95-645bb25338c1',
    'd6629df6-2d7c-4200-89de-2d5d944f4140',
    'b997bdb4-85b6-4d56-9d36-24e58299bf2f',
    '6ec1c2fe-b16d-422a-8d0c-117af0e7a8fe',
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const requests = this.communityUuids.map(uuid =>
      this.http.get<any>(`/server/api/core/communities/${uuid}`).pipe(
        switchMap(comm => {
          if (!comm.collections || comm.collections.length === 0) {
            return of({ name: comm.name, count: 0 });
          }
          const collectionRequests = comm.collections.map((col: any) =>
            this.http.get<any>(col._links.self.href).pipe(
              map(colData => colData.numberOfItems || 0)
            )
          );
          return forkJoin<number[]>(collectionRequests).pipe(
            map((counts: number[]) => ({
              name: comm.name,
              count: counts.reduce((a, b) => a + b, 0)
            }))
          );
        })
      )
    );

    this.stats$ = forkJoin<{ name: string; count: number }[]>(requests);
  }
}
