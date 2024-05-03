import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

interface Variant {
  title: string;
  value: string;
  shortDescription: string | null;
  imageUrl: string;
  cost: number;
  unit: number;
  isMultiple: boolean;
}
@Injectable({ providedIn: 'root' })
export class VariantService {
  colors = [
    'Red',
    'Blue',
    'Green',
    'Yellow',
    'Purple',
    'Orange',
    'Black',
    'White',
    'Pink',
    'Gray',
    'Teal',
    'Cyan',
    'Magenta',
    'Lime',
    'Maroon',
    'Olive',
    'Navy',
    'Aquamarine',
    'Turquoise',
    'Silver',
    'Gold',
    'Bronze',
    'Coral',
    'Indigo',
    'Violet',
    'Lavender',
    'Salmon',
    'Beige',
    'Mint',
    'Emerald',
  ];
  sizes: string[] = ['S', 'M', 'L'];
  productVariants = new BehaviorSubject<Variant[] | null>([]);
  variantToEdit = new Subject<Variant>();
  addNewVariant = new Subject<boolean>();
  isAddingVariant = new BehaviorSubject<boolean>(false);
  deletingVariantUnit = new Subject<number>();
  getVariantCount = new BehaviorSubject<number>(0);
}
