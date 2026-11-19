// AI Website Analyzer - Automatic Content Script (Manifest V3)
// Runs automatically on document_idle for HTTP and HTTPS pages

(function () {
  // Prevent duplicate execution in sub-frames
  if (window.top !== window.self) return;

  const STORAGE_KEY = 'analyzed_websites';
  const SETTINGS_KEY = 'auto_detect_enabled';
  const DEDUPE_TIME_WINDOW_MS = 15 * 60 * 1000; // 15 minutes deduplication window

  // Check if auto-detect is enabled in settings
  chrome.storage.local.get([SETTINGS_KEY, STORAGE_KEY], (res) => {
    if (chrome.runtime.lastError) return;

    // Default to true if not explicitly set to false
    const isAutoDetectEnabled = res[SETTINGS_KEY] !== false;
    if (!isAutoDetectEnabled) return;

    const currentUrl = window.location.href;

    // Ignore non-http/https or internal pages
    if (!currentUrl.startsWith('http://') && !currentUrl.startsWith('https://')) {
      return;
    }

    const existingWebsites = res[STORAGE_KEY] || [];

    // Check if this URL was already auto-analyzed recently
    const recentMatch = existingWebsites.find((item) => {
      if (item.url !== currentUrl) return false;
      const scanAge = Date.now() - new Date(item.extractedAt).getTime();
      return scanAge < DEDUPE_TIME_WINDOW_MS;
    });

    if (recentMatch) {
      // Already captured recently; skip redundant auto-write
      return;
    }

    // Small delay to ensure dynamic hydration / images have initialized
    setTimeout(() => {
      try {
        const extracted = performAutoExtraction();
        if (extracted && extracted.wordCount > 0) {
          const scanRecord = {
            id: 'auto_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8),
            title: extracted.title || document.title || 'Untitled Page',
            url: currentUrl,
            favicon: extracted.favicon || '',
            text: extracted.text || '',
            headings: extracted.headings || [],
            description: extracted.description || '',
            images: extracted.images || [],
            wordCount: extracted.wordCount || 0,
            characterCount: (extracted.text || '').length,
            extractedAt: new Date().toISOString(),
            isAutoDetected: true
          };

          // Save to chrome.storage.local
          chrome.storage.local.get([STORAGE_KEY], (latestRes) => {
            const currentList = latestRes[STORAGE_KEY] || [];
            const updated = [scanRecord, ...currentList].slice(0, 100);
            chrome.storage.local.set({ [STORAGE_KEY]: updated }, () => {
              if (chrome.runtime.lastError) {
                console.warn('AI Analyzer auto-save warning:', chrome.runtime.lastError);
              } else {
                console.log('AI Website Analyzer: Webpage automatically analyzed and saved to local storage.');
              }
            });
          });
        }
      } catch (err) {
        console.warn('AI Analyzer auto-extraction error:', err);
      }
    }, 800);
  });

  /**
   * DOM Extraction Logic (Excludes hidden elements, forms, passwords, scripts)
   */
  function performAutoExtraction() {
    const pageUrl = window.location.href;
    const pageTitle = document.title || '';

    // 1. Meta Description
    let description = '';
    const descTag = document.querySelector('meta[name="description"]') ||
                     document.querySelector('meta[property="og:description"]') ||
                     document.querySelector('meta[name="twitter:description"]');
    if (descTag) {
      description = (descTag.getAttribute('content') || '').trim();
    }

    // 2. Favicon
    let favicon = '';
    const favLink = document.querySelector('link[rel~="icon"]') ||
                    document.querySelector('link[rel="shortcut icon"]') ||
                    document.querySelector('link[rel="apple-touch-icon"]');
    if (favLink && favLink.getAttribute('href')) {
      try {
        favicon = new URL(favLink.getAttribute('href'), pageUrl).href;
      } catch (e) {
        favicon = favLink.getAttribute('href');
      }
    } else {
      try {
        favicon = new URL('/favicon.ico', pageUrl).href;
      } catch (e) {
        favicon = '';
      }
    }

    // 3. Headings extraction (H1, H2, H3 in order of DOM)
    const headings = [];
    const headingElements = document.querySelectorAll('h1, h2, h3');
    for (let i = 0; i < headingElements.length && headings.length < 100; i++) {
      const el = headingElements[i];
      if (el.offsetParent === null && el.offsetWidth === 0 && el.offsetHeight === 0) continue;
      const text = (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ');
      if (text.length > 0 && text.length < 300) {
        headings.push(`${el.tagName.toUpperCase()}: ${text}`);
      }
    }

    // 4. Text Extraction
    const bodyClone = document.body.cloneNode(true);
    const removeSelectors = [
      'script', 'style', 'noscript', 'svg', 'canvas', 'iframe',
      'input', 'textarea', 'select', 'button', 'form',
      '[hidden]', '[aria-hidden="true"]',
      'footer nav', '.cookie-banner', '#cookie-banner', '.gdpr'
    ];

    removeSelectors.forEach(selector => {
      const elementsToRemove = bodyClone.querySelectorAll(selector);
      elementsToRemove.forEach(el => el.remove());
    });

    let rawText = bodyClone.innerText || bodyClone.textContent || '';
    rawText = rawText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n\n');

    const maxChars = 100000;
    const truncatedText = rawText.length > maxChars ? rawText.substring(0, maxChars) : rawText;
    const words = truncatedText.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // 5. Image Extraction
    const collectedImages = [];
    const seenUrls = new Set();
    const maxImages = 60;
    const imgElements = Array.from(document.querySelectorAll('img'));

    for (const img of imgElements) {
      if (collectedImages.length >= maxImages) break;

      let rawSrc = img.currentSrc ||
                   img.src ||
                   img.getAttribute('data-src') ||
                   img.getAttribute('data-lazy-src') ||
                   img.getAttribute('data-original') ||
                   img.getAttribute('data-srcset');

      if (!rawSrc) continue;

      if (rawSrc.includes(' ')) {
        rawSrc = rawSrc.split(' ')[0];
      }

      let absoluteSrc = '';
      try {
        absoluteSrc = new URL(rawSrc, pageUrl).href;
      } catch (e) {
        continue;
      }

      if (!absoluteSrc.startsWith('http://') && !absoluteSrc.startsWith('https://')) {
        continue;
      }

      if (seenUrls.has(absoluteSrc)) continue;

      const width = img.naturalWidth || img.width || 0;
      const height = img.naturalHeight || img.height || 0;

      if ((width > 0 && width < 30) || (height > 0 && height < 30)) {
        continue;
      }

      const altText = (img.alt || img.getAttribute('aria-label') || '').trim();

      seenUrls.add(absoluteSrc);
      collectedImages.push({
        src: absoluteSrc,
        alt: altText || 'Website Image',
        width: width > 0 ? width : 600,
        height: height > 0 ? height : 400
      });
    }

    return {
      title: pageTitle,
      description: description,
      favicon: favicon,
      text: truncatedText,
      headings: headings,
      images: collectedImages,
      wordCount: wordCount
    };
  }
})();
