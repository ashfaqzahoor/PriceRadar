import { productService } from '../services/product.service.js';
import { asyncHandler } from '../utils/helper.js';
import { AppError, sendSuccess } from '../utils/response.js';

export const productController = {
  search: asyncHandler(async (req, res) => {
    const { q, category, pincode, page, limit, sort, provider, availableOnly } = req.validated.query;
    const result = await productService.compareProducts(q, {
      sort,
      provider,
      availableOnly,
      category,
      pincode,
      userId: req.user?.id || null
    });
    const start = (page - 1) * limit;
    const paginated = result.items.slice(start, start + limit);

    sendSuccess(res, paginated, 'Products compared', 200, {
      query: q,
      category: category || null,
      pincode: pincode || null,
      cache: result.cache,
      page,
      limit,
      total: result.items.length,
      totalPages: Math.ceil(result.items.length / limit) || 1
    });
  }),

  getDetails: asyncHandler(async (req, res) => {
    const { productKey } = req.validated.params;
    const { pincode } = req.validated.query;
    const product = await productService.getProductDetails(productKey, { pincode });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    sendSuccess(res, product, 'Product details retrieved', 200);
  })
};
