
# Secret Chinese Marketplace Search Feature

This document outlines the implementation of the hidden search feature for Chinese marketplaces.

## Access

The secret search page is accessible at: `/secret-search`

No password protection is implemented. The page is only hidden from navigation but can be accessed directly via URL.

## Features

- Search for products on Chinese marketplaces (Weidian, 1688, Taobao)
- Display results from Google Custom Search API
- Sort results by price (lowest to highest when available)
- Show approximate price conversion to ILS (Israeli Shekel)

## Implementation Notes

### Current Implementation

The current implementation uses:
- Google Custom Search API with the following credentials:
  - API Key: AIzaSyA6xA8dr2RNKQE2Li5fRIBkjgR6SmZyByk
  - Search Engine ID: 94549664e44b34ac8
- Site-restricted searches to weidian.com, 1688.com, and taobao.com
- Basic price extraction from search results
- Simple translation mapping for common product terms

### Limitations

- Direct API calls to Google Custom Search have quota limits (100 queries per day for free tier)
- Price extraction may not always be accurate as it depends on how prices appear in search snippets
- Translation is currently limited to a few predefined terms

### Future Implementation

To fully enhance this feature, you would need:

1. **Backend API**: Create a server-side API that handles:
   - Proxying requests to Google Custom Search API
   - More sophisticated price and data extraction
   - Proper translation services

2. **Translation Service**: Integrate with a translation API like Google Translate to convert:
   - Hebrew/English queries to Chinese
   - Chinese product names back to Hebrew/English

3. **Web Scraping**: For more accurate results, implement server-side scraping using tools like:
   - Puppeteer or Playwright for browser automation
   - Proxy services to avoid IP bans from the Chinese marketplaces

## Technical Limitations

- **CORS Restrictions**: The Google Custom Search API may be subject to CORS restrictions when called directly from browser
- **API Rate Limits**: Google Custom Search API has quotas (100 requests/day on free tier)
- **Data Accuracy**: Data extraction from search results is limited without full page scraping

## Next Steps

1. Implement a proper backend service for web scraping and API proxying
2. Integrate with a reliable translation service
3. Improve price extraction and conversion
4. Add filtering options (e.g., by marketplace, price range)
