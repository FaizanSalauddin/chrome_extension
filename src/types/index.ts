// Core TypeScript Interfaces for AI Website Analyzer

export interface ExtractedImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface WebsiteRecord {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  text: string;
  headings: string[];
  description: string;
  images: ExtractedImage[];
  wordCount: number;
  characterCount: number;
  extractedAt: string; // ISO string
  isAutoDetected?: boolean;
}

// -------------------------------------------------------------
// Future FastAPI Integration Interfaces
// Ready for POST /api/analyze/* endpoints
// -------------------------------------------------------------

export interface WebsiteMetadata {
  title: string;
  url: string;
  favicon?: string;
  description: string;
}

export interface WebsiteAnalysisPayload {
  scanId: string;
  extractedAt: string;
  metadata: WebsiteMetadata;
  text: string;
  headings: string[];
  wordCount: number;
  characterCount: number;
  images: ExtractedImage[];
}

export type AnalysisStatus = 'pending' | 'analyzing' | 'completed' | 'failed';

export interface TextDetectionResult {
  status: AnalysisStatus;
  aiProbability?: number; // 0.0 to 1.0 (future backend)
  perplexityScore?: number;
  burstinessScore?: number;
  message?: string;
}

export interface ImageDetectionResult {
  status: AnalysisStatus;
  aiProbability?: number; // 0.0 to 1.0 (future backend)
  artifactTags?: string[];
  message?: string;
}

export interface URLSafetyResult {
  status: AnalysisStatus;
  riskScore?: number; // 0 to 100
  isPhishing?: boolean;
  domainAgeDays?: number;
  message?: string;
}

export interface FullAnalysisResponse {
  scanId: string;
  analyzedAt: string;
  textAnalysis: TextDetectionResult;
  imageAnalysis: ImageDetectionResult;
  urlAnalysis: URLSafetyResult;
  overallScore?: number;
}

// UI State Types
export type NavigationTab = 'overview' | 'websites' | 'details';
export type SortOption = 'newest' | 'oldest' | 'words' | 'images';
