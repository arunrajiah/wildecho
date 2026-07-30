/**
 * Types mirroring wildecho-api's response schemas (see that repo's
 * src/wildecho_api/schemas.py). Kept hand-written rather than generated so
 * this file stays readable; update it if the backend's schemas change.
 */

export type TaxonomicGroup = "bird" | "frog" | "insect" | "mammal" | "other";

export interface Prediction {
  common_name: string | null;
  scientific_name: string;
  taxonomic_group: TaxonomicGroup;
  /** Softmax confidence after per-group calibration. Show this to the user. */
  confidence: number;
  /** Uncalibrated model confidence. Ranking follows this, not `confidence`. */
  raw_confidence: number;
  low_confidence: boolean;
  class_index: number;
}

export interface ClipMetadata {
  duration_seconds: number;
  windows_processed: number;
  window_seconds: number;
  window_stride_seconds: number;
  source_sample_rate: number;
  source_channels: number;
  processed_sample_rate: number;
  inference_ms: number;
}

export interface IdentifyResponse {
  predictions: Prediction[];
  low_confidence: boolean;
  non_animal_top_class: string | null;
  model_version: string;
  request_id: string;
  metadata: ClipMetadata;
}

export type ModelStatus = "loaded" | "not_loaded" | "error";

export interface HealthResponse {
  status: string;
  model_status: ModelStatus;
  model_path: string;
  model_loaded: boolean;
  detail: string | null;
  num_classes: number | null;
  taxonomy_loaded: boolean;
  feedback_enabled: boolean;
  feedback_store_ready: boolean;
  version: string;
}

/** The uniform `{error, detail}` shape every wildecho-api error response uses. */
export interface ApiErrorBody {
  error: string;
  detail: string;
}
