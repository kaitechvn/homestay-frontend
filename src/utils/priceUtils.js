export const formatPrice = (price) => {
    if (price === null || price === undefined) {
      return null; 
    }
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
