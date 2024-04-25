
export interface PlantIdentification {
  access_token: string;
  model_version: string;
  custom_id: null;
  input: Input;
  result: PlantIdentificationResult;
  status: string;
  sla_compliant_client: boolean;
  sla_compliant_system: boolean;
  created: number;
  completed: number;
}

export interface Input {
  latitude: number;
  longitude: number;
  similar_images: boolean;
  images: string[];
  datetime: Date;
}

export interface PlantIdentificationResult {
  is_plant: IsPlant;
  classification: Classification;
}

export interface Classification {
  suggestions: Suggestion[];
}

export interface Suggestion {
  id: string;
  name: string;
  probability: number;
  similar_images: SimilarImage[];
  details: PlantDetails;
}

export interface PlantDetails {
  common_names: string[];
  taxonomy: Taxonomy;
  url: string;
  gbif_id: number;
  inaturalist_id: number;
  rank: string;
  description: Description;
  synonyms: string[];
  image: Description;
  edible_parts: null;
  watering: null;
  propagation_methods: null;
  language: string;
  entity_id: string;
}

export interface Description {
  value: string;
  citation: string;
  license_name: string;
  license_url: string;
}

export interface Taxonomy {
  class: string;
  genus: string;
  order: string;
  family: string;
  phylum: string;
  kingdom: string;
}


export interface SimilarImage {
  id: string;
  url: string;
  license_name?: string;
  license_url?: string;
  citation?: string;
  similarity: number;
  url_small: string;
}

export interface IsPlant {
  probability: number;
  binary: boolean;
  threshold: number;
}