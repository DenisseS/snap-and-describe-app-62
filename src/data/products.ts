import { Product } from './types';
import { productsCoreDB } from './products-core';

/**
 * DEPRECATED: Use productsCoreDB instead
 * This file is kept for backward compatibility
 * It simply re-exports data from products-core.ts
 */
export const productsDB: Product[] = productsCoreDB;