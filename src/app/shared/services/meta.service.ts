import { Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ProductModel } from 'src/app/models/products.model';

@Injectable({ providedIn: 'root' })
export class MetaService {
  constructor(private meta: Meta) {}

  updateMetaTags(data: ProductModel) {
    const metaTags: {
      name: string | null;
      property: string | null;
      content: string | null;
    }[] = [
      {
        name: 'description',
        content: data.description,
        property: null,
      },
      {
        property: 'og:title',
        content: 'RENAMARKET - ' + data.name,
        name: null,
      },
      {
        property: 'og:description',
        content: 'RENAMARKET - ' + data.description,
        name: null,
      },
      {
        property: 'og:url',
        content:
          'https://renamarkets.com/homepage/product/2b9610d8-fc3e-4aa0-86a4-0a8e11f720b9' +
          data.id,
        name: null,
      },
      {
        property: 'og:image',
        content: data.imageUrl,
        name: null,
      },
      {
        name: 'twitter:image',
        content: data.imageUrl,
        property: null,
      },
      {
        name: 'twitter:description',
        content: data.description,
        property: null,
      },
      {
        name: 'twitter:title',
        content: data.name,
        property: null,
      },
    ];

    metaTags.forEach((tag) => {
      if (tag.name) {
        this.meta.updateTag({ name: tag.name, content: tag.content });
      } else if (tag.property) {
        this.meta.updateTag({
          property: tag.property,
          content: tag.content,
        });
      }
    });
  }
}
