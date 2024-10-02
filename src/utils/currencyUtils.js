const API_URL = 'https://v6.exchangerate-api.com/v6/f040b0796e723a7f55c7dd20/latest/VND';

export async function fetchExchangeRate() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rate');
      }
      const data = await response.json();
      return data.conversion_rates; 
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      return null; 
    }
  }

    export function convertVNDToUSD(vndAmount, exchangeRate) {
        if (!exchangeRate) return null; // If exchange rate is not available
        console.log(vndAmount * exchangeRate);
        return (vndAmount * exchangeRate).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        });
    }

    export function convertVNDToJPY(vndAmount, exchangeRate) {
        if (!exchangeRate) return null; // If exchange rate is not available
        console.log(vndAmount * exchangeRate);
        return (vndAmount * exchangeRate).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        });
    }

  export const formatVNDPrice = (price) => {
    if (price === null || price === undefined) {
      return null; 
    }
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  export const currencyConverters = {
    USD: convertVNDToUSD,
    JPY: convertVNDToJPY,
  };
  
  export function formattedPrice(price, currency, exchangeRates) {
    const vndAmount = price; 
  
    if (currency in currencyConverters) {
      return currencyConverters[currency](vndAmount, exchangeRates[currency]);
    }

    return formatVNDPrice(vndAmount); 
  }

  