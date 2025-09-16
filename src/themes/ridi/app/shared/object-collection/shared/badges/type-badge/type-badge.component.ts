import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DSpaceObject } from '../../../../../../../../app/core/shared/dspace-object.model';
import { hasValue, isEmpty } from '../../../../../../../../app/shared/empty.util';
import { getResourceTypeValueFor } from '../../../../../../../../app/core/cache/object-cache.reducer';

@Component({
  selector: 'ds-themed-type-badge',
  // styleUrls: ['./type-badge.component.scss'],
  // templateUrl: './type-badge.component.html',
  templateUrl: '../../../../../../../../app/shared/object-collection/shared/badges/type-badge/type-badge.component.html',
  standalone: true,
  imports: [
    TranslateModule,
  ],
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
          this._typeMessage = this.getTypeMessageFromResourceTypeValue(resourceTypeValue);
        } else {
          this._typeMessage = this.getTypeMessageFromResourceTypeValue(renderType.name);
        }
      } else {
        this._typeMessage = this.getTypeMessageFromResourceTypeValue(renderType);
      }
    }
  }

  private getTypeMessageFromResourceTypeValue(resourceTypeValue: string) {
    resourceTypeValue = resourceTypeValue.toLowerCase();

    if (resourceTypeValue === "item") {
      return this._object.firstMetadataValue("dc.type");
    }

    return `${resourceTypeValue}.listelement.badge`;
  }

  get object(): DSpaceObject {
    return this._object;
  }

  get typeMessage(): string {
    return this._typeMessage;
  }
}
