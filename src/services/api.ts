import {
  WebsiteRecord,
  WebsiteAnalysisPayload,
  FullAnalysisResponse,
  TextDetectionResult,
  ImageDetectionResult,
  URLSafetyResult
} from '../types';

/**
 * AI Website Analyzer - FastAPI Backend Integration Service
 * 
 * ARCHITECTURE NOTE:
 * Backend requests are disabled in this phase.
 * All functions below are prepared with exact signatures, types, and endpoints
 * for immediate plug-and-play connection when the Python FastAPI server is running.
 */

export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000',
  IS_BACKEND_ENABLED: false, // Set to true once FastAPI is deployed
  ENDPOINTS: {
    ANALYZE_WEBSITE: '/api/analyze/website',
    ANALYZE_TEXT: '/api/analyze/text',
    ANALYZE_IMAGE: '/api/analyze/image',
    ANALYZE_URL: '/api/analyze/url',
    HEALTH: '/api/health',
  }
};

/**
 * Centralized data preparation function.
 * Converts a chrome.storage.local WebsiteRecord into the standardized JSON payload
 * required by the future FastAPI /api/analyze/website endpoint.
 */
export function prepareWebsiteAnalysisPayload(
  websiteRecord: WebsiteRecord
): WebsiteAnalysisPayload {
  return {
    scanId: websiteRecord.id,
    extractedAt: websiteRecord.extractedAt,
    metadata: {
      title: websiteRecord.title,
      url: websiteRecord.url,
      favicon: websiteRecord.favicon,
      description: websiteRecord.description,
    },
    text: websiteRecord.text,
    headings: websiteRecord.headings,
    wordCount: websiteRecord.wordCount,
    characterCount: websiteRecord.characterCount,
    images: websiteRecord.images.map((img) => ({
      src: img.src,
      alt: img.alt,
      width: img.width,
      height: img.height,
    })),
  };
}

/**
 * Placeholder API service function for full website AI analysis.
 * In the future, this sends the prepared payload to FastAPI:
 * POST /api/analyze/website
 * Content-Type: application/json
 */
export async function analyzeWebsite(
  payload: WebsiteAnalysisPayload
): Promise<FullAnalysisResponse> {
  if (!API_CONFIG.IS_BACKEND_ENABLED) {
    // Return pending status without fabricating fake AI scores
    return {
      scanId: payload.scanId,
      analyzedAt: new Date().toISOString(),
      textAnalysis: {
        status: 'pending',
        message: 'Analysis Pending – Backend Not Connected (FastAPI offline)',
      },
      imageAnalysis: {
        status: 'pending',
        message: 'Analysis Pending – Backend Not Connected (FastAPI offline)',
      },
      urlAnalysis: {
        status: 'pending',
        message: 'Analysis Pending – Backend Not Connected (FastAPI offline)',
      },
    };
  }

  // TODO: Future FastAPI integration:
  // const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ANALYZE_WEBSITE}`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload)
  // });
  // if (!response.ok) throw new Error(`FastAPI error: ${response.statusText}`);
  // return await response.json();
  throw new Error('FastAPI backend integration is not enabled.');
}

/**
 * Future endpoint: POST /api/analyze/text
 */
export async function analyzeText(text: string): Promise<TextDetectionResult> {
  if (!API_CONFIG.IS_BACKEND_ENABLED) {
    return {
      status: 'pending',
      message: 'Analysis Pending – Backend Not Connected',
    };
  }

  // TODO: Future FastAPI implementation
  throw new Error('Backend disabled');
}

/**
 * Future endpoint: POST /api/analyze/image
 */
export async function analyzeImage(imageUrl: string): Promise<ImageDetectionResult> {
  if (!API_CONFIG.IS_BACKEND_ENABLED) {
    return {
      status: 'pending',
      message: 'Analysis Pending – Backend Not Connected',
    };
  }

  // TODO: Future FastAPI implementation
  throw new Error('Backend disabled');
}

/**
 * Future endpoint: POST /api/analyze/url
 */
export async function analyzeUrl(url: string): Promise<URLSafetyResult> {
  if (!API_CONFIG.IS_BACKEND_ENABLED) {
    return {
      status: 'pending',
      message: 'Analysis Pending – Backend Not Connected',
    };
  }

  // TODO: Future FastAPI implementation
  throw new Error('Backend disabled');
}
