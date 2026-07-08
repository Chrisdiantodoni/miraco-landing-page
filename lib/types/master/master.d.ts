import { Collection } from "@/lib/types/settings";
export interface Type {
  id: number;
  type_name: string;
  collection_id: string;
  collection: Collection;
}

export interface Thickness {
  id: number;
  thickness: string;
  collection_id: string;
}

export interface Size {
  id: number;
  size: string;
  size_ft: string;
  collection_id: string;
}

export interface Design {
  id: number;
  design_name: string;
  collection_id: string;
  collection: Collection;
}

export interface Finishing {
  id: string | number;
  finishing_name: string;
  collection_id: string;
  collection: Collection;
}
