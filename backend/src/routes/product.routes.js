import { Router } from 'express';
import { productController } from '../controllers/product.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { productKeyParamSchema, searchSchema } from '../validations/product.validation.js';

export const productRoutes = Router();

productRoutes.get('/search', validate(searchSchema), productController.search);
productRoutes.get('/:productKey', validate(productKeyParamSchema), productController.getDetails);

