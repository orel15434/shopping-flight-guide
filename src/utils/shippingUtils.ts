
/**
 * Utility functions for shipping calculations
 */

/**
 * Fetches shipping options from CSSBUY API
 * @param weightInGrams Weight in grams
 * @param countryCode Country code (default: 97 for Israel)
 * @returns Promise with shipping options
 */
export const fetchCSSBUYShippingRates = async (weightInGrams: number, countryCode: number = 97) => {
  try {
    // Create form data
    const formData = new URLSearchParams();
    formData.append('weight', weightInGrams.toString());
    formData.append('country', countryCode.toString());
    formData.append('currency', 'CNY');
    formData.append('price', '0');
    formData.append('volume', '');

    // Use a CORS proxy if needed
    const useProxy = true;
    const directUrl = 'https://www.cssbuy.com/estimatesTest';
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(directUrl)}`;
    
    const response = await fetch(useProxy ? proxyUrl : directUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching CSSBUY shipping rates:", error);
    return { error: true, message: error instanceof Error ? error.message : "Unknown error" };
  }
};

/**
 * Formats shipping data from CSSBUY API response
 */
export const formatCSSBUYShippingData = (data: any) => {
  if (!data || data.error) {
    return [];
  }

  try {
    // CSSBUY API returns shipping options in a specific format
    // We need to transform it to match our application's format
    return Object.entries(data).map(([key, value]: [string, any]) => {
      if (typeof value !== 'object' || value === null) return null;

      return {
        id: key,
        name: value.name || key,
        price: parseFloat(value.feeRMB || 0),
        deliveryTime: value.time || 'Unknown',
        description: `${value.name || key} - ${value.time || 'Unknown delivery time'}`,
      };
    }).filter(Boolean);
  } catch (error) {
    console.error("Error formatting CSSBUY data:", error);
    return [];
  }
};
