import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'repository-policy',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './repository-policy.component.html',
  styleUrls: ['./repository-policy.component.scss']
})
export class RepositoryPolicyComponent { }
