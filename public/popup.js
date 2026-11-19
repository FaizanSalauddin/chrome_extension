// AI Website Analyzer - Automatic Detection Popup Script (Manifest V3)

document.addEventListener('DOMContentLoaded', async () => {
  const elements = {
    statusBadge: document.getElementById('extensionStatus'),
    statusLabel: document.getElementById('statusLabel'),
    autoDetectToggle: document.getElementById('autoDetectToggle'),
    pageProtocol: document.getElementById('pageProtocol'),
    pageFavicon: document.getElementById('pageFavicon'),
    pageTitle: document.getElementById('pageTitle'),
    pageUrl: document.getElementById('pageUrl'),
    extractBtn: document.getElementById('extractBtn'),
    extractBtnText: document.getElementById('extractBtnText'),
    extractIcon: document.getElementById('extractIcon'),
    extractSpinner: document.getElementById('extractSpinner'),
    statusMessage: document.getElementById('statusMessage'),
    messageText: document.getElementById('messageText'),
    statWords: document.getElementById('statWords'),
    statImages: document.getElementById('statImages'),
    statHeadings: document.getElementById('statHeadings'),
    openDashboardBtn: document.getElementById('openDashboardBtn')
  };

  const STORAGE_KEY = 'analyzed_websites';
  const SETTINGS_KEY = 'auto_detect_enabled';

  let currentTab = null;
  let isExtractable = false;

  // 1. Load auto-detect preference (default true)
  chrome.storage.local.get([SETTINGS_KEY], (res) => {
    const isEnabled = res[SETTINGS_KEY] !== false;
    elements.autoDetectToggle.checked = isEnabled;
  });

  // Handle auto-detect toggle change
  elements.autoDetectToggle.addEventListener('change', (e) => {
    const isEnabled = e.target.checked;
    chrome.storage.local.set({ [SETTINGS_KEY]: isEnabled }, () => {
      if (isEnabled) {
        showSuccess('Auto-detection enabled on page visit.');
      } else {
        showWarning('Auto-detection paused. Manual scanning enabled.');
      }
    });
  });

  // 2. Initialize active tab
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tabs || tabs.length === 0) {
      showError('Unable to detect active tab.');
      return;
    }

    currentTab = tabs[0];
    const url = currentTab.url || '';

    if (url.startsWith('http://') || url.startsWith('https://')) {
      isExtractable = true;
      elements.pageProtocol.textContent = url.startsWith('https://') ? 'HTTPS' : 'HTTP';
      elements.pageTitle.textContent = currentTab.title || 'Untitled Webpage';
      elements.pageUrl.textContent = url;
      if (currentTab.favIconUrl) {
        elements.pageFavicon.src = currentTab.favIconUrl;
      }

      // Check if content.js already auto-extracted this page
      chrome.storage.local.get([STORAGE_KEY], async (res) => {
        const websites = res[STORAGE_KEY] || [];
        const existing = websites.find(item => item.url === url);

        if (existing) {
          // Found existing auto-extraction
          updateStatsUI(existing.wordCount, existing.images?.length || 0, existing.headings?.length || 0);
          showSuccess('Webpage automatically analyzed & synced to storage.');
        } else {
          // Automatically trigger extraction immediately! (No button press required)
          await triggerExtraction(true);
        }
      });
    } else {
      isExtractable = false;
      elements.pageProtocol.textContent = 'RESTRICTED';
      elements.pageProtocol.style.color = '#EF4444';
      elements.pageProtocol.style.borderColor = 'rgba(239, 68, 68, 0.4)';
      elements.pageTitle.textContent = currentTab.title || 'System Page';
      elements.pageUrl.textContent = url || 'Special browser page';
      elements.extractBtn.disabled = true;
      showWarning('Analysis restricted to public HTTP/HTTPS web pages.');
    }
  } catch (err) {
    console.error('Popup init error:', err);
    showError('Error initializing extension.');
  }

  // 3. Manual Re-scan button
  elements.extractBtn.addEventListener('click', async () => {
    await triggerExtraction(false);
  });

  // 4. Open React Dashboard
  elements.openDashboardBtn.addEventListener('click', () => {
    const dashboardUrl = chrome.runtime.getURL('index.html');
    chrome.tabs.create({ url: dashboardUrl });
  });

  /**
   * Performs DOM extraction (either automatically on popup open or on manual re-scan)
   */
  async function triggerExtraction(isAuto) {
    if (!isExtractable || !currentTab || !currentTab.id) return;

    setExtractingState(true, isAuto);

    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId: currentTab.id },
        func: extractPageDataInContentScript,
      });

      if (!results || !results[0] || !results[0].result) {
        throw new Error('Webpage DOM returned empty content.');
      }

      const extractedData = results[0].result;

      const scanRecord = {
        id: (isAuto ? 'auto_' : 'scan_') + Date.now() + '_' + Math.random().toString(36).substring(2, 8),
        title: extractedData.title || currentTab.title || 'Untitled Page',
        url: currentTab.url,
        favicon: extractedData.favicon || currentTab.favIconUrl || '',
        text: extractedData.text || '',
        headings: extractedData.headings || [],
        description: extractedData.description || '',
        images: extractedData.images || [],
        wordCount: extractedData.wordCount || 0,
        characterCount: (extractedData.text || '').length,
        extractedAt: new Date().toISOString(),
        isAutoDetected: isAuto
      };

      // Save to chrome.storage.local
      await saveScanToStorage(scanRecord);

      // Update UI
      updateStatsUI(scanRecord.wordCount, scanRecord.images.length, scanRecord.headings.length);
      showSuccess(
        isAuto
          ? `Auto-detected ${scanRecord.wordCount.toLocaleString()} words & ${scanRecord.images.length} images!`
          : `Re-scanned ${scanRecord.wordCount.toLocaleString()} words & ${scanRecord.images.length} images!`
      );
    } catch (error) {
      console.error('Extraction error:', error);
      showError(error.message || 'Auto-detection failed. Page might still be loading.');
    } finally {
      setExtractingState(false, isAuto);
    }
  }

  function updateStatsUI(words, images, headings) {
    elements.statWords.textContent = (words || 0).toLocaleString();
    elements.statImages.textContent = (images || 0).toLocaleString();
    elements.statHeadings.textContent = (headings || 0).toLocaleString();
  }

  function saveScanToStorage(newRecord) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([STORAGE_KEY], (result) => {
        if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
        const existing = result[STORAGE_KEY] || [];
        const updated = [newRecord, ...existing].slice(0, 100);
        chrome.storage.local.set({ [STORAGE_KEY]: updated }, () => {
          if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
          else resolve();
        });
      });
    });
  }

  function setExtractingState(isExtracting, isAuto) {
    if (isExtracting) {
      elements.extractBtn.disabled = true;
      elements.extractIcon.classList.add('hidden');
      elements.extractSpinner.classList.remove('hidden');
      elements.extractBtnText.textContent = isAuto ? 'Auto-Detecting...' : 'Re-Scanning...';
      elements.statusLabel.textContent = isAuto ? 'Auto-Scanning' : 'Scanning...';
      elements.statusBadge.style.color = '#A78BFA';
      elements.statusBadge.style.borderColor = 'rgba(167, 139, 250, 0.4)';
    } else {
      elements.extractBtn.disabled = false;
      elements.extractIcon.classList.remove('hidden');
      elements.extractSpinner.classList.add('hidden');
      elements.extractBtnText.textContent = 'Re-Scan Webpage';
      elements.statusLabel.textContent = 'Auto-Active';
      elements.statusBadge.style.color = '#10B981';
      elements.statusBadge.style.borderColor = 'rgba(16, 185, 129, 0.25)';
    }
  }

  function showSuccess(msg) {
    elements.statusMessage.className = 'status-message success';
    elements.messageText.textContent = msg;
    elements.statusMessage.classList.remove('hidden');
  }

  function showError(msg) {
    elements.statusMessage.className = 'status-message error';
    elements.messageText.textContent = msg;
    elements.statusMessage.classList.remove('hidden');
  }

  function showWarning(msg) {
    elements.statusMessage.className = 'status-message warning';
    elements.messageText.textContent = msg;
    elements.statusMessage.classList.remove('hidden');
  }
});

/**
 * In-page Content Extraction Function (executed inside the webpage DOM)
 */
function extractPageDataInContentScript() {
  try {
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

    // 3. Headings extraction
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
  } catch (err) {
    console.error('In-page extraction error:', err);
    return null;
  }
}
