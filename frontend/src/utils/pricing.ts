interface Saleable {
  price: number;
  onSale?: boolean;
  salePrice?: number;
}

export const getEffectivePrice = (product: Saleable): number =>
  product.onSale && product.salePrice != null && product.salePrice < product.price
    ? product.salePrice
    : product.price;
