export interface Variants {
  title: string;
  value: string;
  shortDescription: string | null;
  imageUrl: string;
  cost: number;
  unit: number;
  isMultiple: boolean;
}

export interface VariantOptions {
  name: string;
  categoryId: any;
  category: any;
  userId: any;
  id: string;
  createdOn: any;
  createdBy: any;
  updatedBy: any;
  deletedBy: any;
  updatedOn: any;
  deletedOn: any;
  isActive: boolean;
  isDeleted: boolean;
}
