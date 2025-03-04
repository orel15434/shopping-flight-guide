
# Secret Chinese Marketplace Search Feature

This document outlines the implementation of the hidden search feature for Chinese marketplaces.

## Access

The secret search page is accessible at: `/secret-search`

No password protection is implemented. The page is only hidden from navigation but can be accessed directly via URL.

## Features

- Search for products on Chinese marketplaces (Weidian, 1688, Taobao)
- Translate search queries to Chinese using LibreTranslate
- Display results from Google Custom Search API
- Sort results by price (lowest to highest when available)
- Show approximate price conversion to ILS (Israeli Shekel)
- Balance results across all three marketplaces

## Implementation Notes

### Current Implementation

The current implementation uses:
- Google Custom Search API with the following credentials:
  - API Key: AIzaSyA6xA8dr2RNKQE2Li5fRIBkjgR6SmZyByk
  - Search Engine ID: 94549664e44b34ac8
- LibreTranslate for translating search queries to Chinese
- Fallback to a predefined translation mapping when LibreTranslate is unavailable
- Site-restricted searches to weidian.com, 1688.com, and taobao.com
- Basic price extraction from search results
- Translation mapping for common product terms

### Limitations

- Direct API calls to Google Custom Search have quota limits (100 queries per day for free tier)
- LibreTranslate public server may have rate limits or reliability issues
- Price extraction may not always be accurate as it depends on how prices appear in search snippets
- Translation quality may vary based on the complexity of the search query
- Images and links may not always match the exact product
- CORS restrictions prevent implementing direct web scraping from the frontend

### Known Issues

1. **Price Inconsistency**: Prices shown in search results may differ from actual prices on product pages
2. **Missing Prices**: Some products may show "מחיר לא זמין" (price not available)
3. **Link Accuracy**: Links may lead to store pages instead of specific product pages
4. **Image Matching**: Images may not always match the actual product
5. **Translation Limitations**: Complex queries or specific brand names may not translate accurately

## Future Implementation

To fully enhance this feature, you would need:

1. **Backend API**: Create a server-side API that handles:
   - Proxying requests to Google Custom Search API
   - More reliable translation services
   - Web scraping for accurate price, image, and link extraction
   - Proper caching to reduce API calls

2. **Advanced Translation**: Implement more sophisticated translation:
   - Use professional translation APIs like DeepL or Google Translate
   - Build a custom dictionary for fashion and product terms
   - Handle brand names and product models correctly

3. **Web Scraping**: For more accurate results, implement server-side scraping using tools like:
   - Puppeteer or Playwright for browser automation
   - Proxy services to avoid IP bans from the Chinese marketplaces

## Technical Limitations

- **CORS Restrictions**: The Google Custom Search API can be called from the frontend, but web scraping cannot due to CORS restrictions
- **API Rate Limits**: Google Custom Search API has quotas (100 requests/day on free tier)
- **Translation Quality**: Free translation services may not provide optimal translations for specialized terms
- **Data Accuracy**: Data extraction from search results is limited without full page scraping

## Next Steps

1. Implement a proper backend service for web scraping and API proxying
2. Integrate with a more reliable translation service
3. Improve price extraction and conversion
4. Add filtering options (e.g., by marketplace, price range)
5. Consider implementing a caching mechanism to reduce API calls
