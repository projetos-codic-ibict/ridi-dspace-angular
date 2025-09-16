import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DSpaceObject } from '../../../../../../../../app/core/shared/dspace-object.model';
import {
  hasValue,
  isEmpty,
} from '../../../../../../../../app/shared/empty.util';
import { getResourceTypeValueFor } from '../../../../../../../../app/core/cache/object-cache.reducer';

@Component({
  selector: 'ds-themed-type-badge',
  // styleUrls: ['./type-badge.component.scss'],
  templateUrl: './type-badge.component.html',
  // templateUrl: '../../../../../../../../app/shared/object-collection/shared/badges/type-badge/type-badge.component.html',
  standalone: true,
  imports: [TranslateModule, CommonModule],
})
export class TypeBadgeComponent {
  private _object: DSpaceObject;
  private _typeMessage: string;

  /**
   * The component used to retrieve the type from
   */
  @Input() set object(object: DSpaceObject) {
    this._object = object;

    const renderTypes = this._object.getRenderTypes();
    if (!isEmpty(renderTypes.length)) {
      const renderType = renderTypes[0];
      if (renderType instanceof Function) {
        const resourceTypeValue = getResourceTypeValueFor(object.type);
        if (hasValue(resourceTypeValue)) {
          this._typeMessage =
            this.getTypeMessageFromResourceTypeValue(resourceTypeValue);
        } else {
          this._typeMessage = this.getTypeMessageFromResourceTypeValue(
            renderType.name
          );
        }
      } else {
        this._typeMessage =
          this.getTypeMessageFromResourceTypeValue(renderType);
      }
    }
  }

  private getTypeMessageFromResourceTypeValue(resourceTypeValue: string) {
    resourceTypeValue = resourceTypeValue.toLowerCase();

    if (resourceTypeValue === 'item') {
      return this._object.firstMetadataValue('dc.type');
    }

    return `${resourceTypeValue}.listelement.badge`;
  }

  get object(): DSpaceObject {
    return this._object;
  }

  get typeMessage(): string {
    return this._typeMessage;
  }
  get typeStyle(): any {
    const type = (this._typeMessage || '').toLowerCase();

    const typeColors: Record<string, { background: string; color: string }> = {
      apresentação: { background: '#17a2b8', color: '#fff' },
      artigo: { background: '#007bff', color: '#fff' },
      'artigo de periódico': { background: '#0056b3', color: '#fff' },
      'capítulo de livro': { background: '#218838', color: '#fff' },
      dissertação: { background: '#6f42c1', color: '#fff' },
      livro: { background: '#28a745', color: '#fff' },
      outro: { background: '#6c757d', color: '#fff' },
      tese: { background: '#e83e8c', color: '#fff' },
      'trabalho apresentado em evento': {
        background: '#fd7e14',
        color: '#fff',
      },
    };

    return typeColors[type] || { background: '#343a40', color: '#fff' }; // fallback caso nao tenha o dc.type
  }
}
