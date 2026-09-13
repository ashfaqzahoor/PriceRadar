export class BaseProvider {
  constructor({ id, name, logoUrl }) {
    this.id = id;
    this.name = name;
    this.logoUrl = logoUrl;
  }

  async searchProducts() {
    throw new Error('Provider must implement searchProducts(query)');
  }

  normalize(rawProduct) {
    return {
      provider: this.id,
      providerName: this.name,
      providerLogoUrl: this.logoUrl,
      providerProductId: rawProduct.id,
      name: rawProduct.name,
      brand: rawProduct.brand,
      category: rawProduct.category,
      quantity: rawProduct.quantity,
      price: rawProduct.price,
      mrp: rawProduct.mrp,
      currency: rawProduct.currency || 'INR',
      available: rawProduct.available,
      imageUrl: rawProduct.imageUrl,
      productUrl: rawProduct.productUrl,
      deliveryEta: rawProduct.deliveryEta,
      pincode: rawProduct.pincode || null
    };
  }
}
