import { StatusCodes } from "http-status-codes";
import db from "../database/models";
import {
  ProductAttributes,
  Product as ProductModel,
} from "../database/models/product.model";
import ApiError from "../utils/api-error.util";
import APIFeatures from "../utils/apiFeatures.util";
import { ParsedQs } from "qs";
import { Model, Op } from "sequelize";

const Product = db.Product;
const User = db.User;

export type CreateProductInput = Pick<
  ProductAttributes,
  | "name"
  | "description"
  | "price"
  | "stock"
  | "imageUrl"
  | "categoryId"
  | "weight"
  | "length"
  | "width"
  | "height"
  | "attributes"
> & {
  images?: string[];
  variants?: {
    sku: string;
    price: number;
    stock: number;
    attributes: any;
    imageUrl?: string;
  }[];
};

export type UpdateProductInput = Partial<CreateProductInput>;

export interface PaginatedProductResult {
  rows: ProductAttributes[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

class ProductService {
  public async createProduct(
    productData: CreateProductInput,
    sellerId: string
  ): Promise<ProductAttributes> {
    const transaction = await db.sequelize.transaction();
    try {
      const newProduct = await Product.create(
        { ...productData, sellerId },
        { transaction }
      );

      if (productData.images && productData.images.length > 0) {
        const imageRecords = productData.images.map((url, index) => ({
          productId: newProduct.id,
          imageUrl: url,
          isPrimary: index === 0,
          type: "image" as "image",
        }));
        await db.ProductImage.bulkCreate(imageRecords, { transaction });
      }

      if (productData.variants && productData.variants.length > 0) {
        const variantRecords = productData.variants.map((variant) => ({
          ...variant,
          productId: newProduct.id,
        }));
        await db.ProductVariant.bulkCreate(variantRecords, { transaction });
      }

      await transaction.commit();
      return this.getProductById(newProduct.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async getAllProducts(
    queryString: ParsedQs
  ): Promise<PaginatedProductResult> {
    const features = new APIFeatures(queryString)
      .search()
      .filter()
      .sort()
      .limitFields();

<<<<<<< HEAD
    // CUSTOM LOGIC: Handle filtering by Category Name (e.g. ?category=Wanita)
    // APIFeatures maps query params to WHERE directly. If 'category' is passed but not a column, 
    // we need to resolve it to categoryId.
    if (queryString.category) {
       const categoryName = queryString.category as string;
       // Find category by name (case insensitive usually good, but exact for now)
       const category = await db.Category.findOne({ 
         where: { 
            name: db.Sequelize.where(
               db.Sequelize.fn('LOWER', db.Sequelize.col('name')), 
               'LIKE', 
               '%' + categoryName.toLowerCase() + '%'
            ) 
         } as any 
       });

       if (category) {
         // Apply categoryId filter
         if (!features.queryOptions.where) features.queryOptions.where = {};
         (features.queryOptions.where as any).categoryId = category.id;
         
         // Remove the invalid 'category' field from WHERE clause if APIFeatures accidentally added it
         // (APIFeatures puts everything from qs into where, so 'category' might be invalid column)
         if ((features.queryOptions.where as any).category) {
            delete (features.queryOptions.where as any).category;
         }
       }
    }

    // Clean up invalid fields from WHERE clause (pagination params that got added by APIFeatures)
    if (features.queryOptions.where) {
      const invalidFields = ['limit', 'offset', 'page', 'sort', 'fields'];
      invalidFields.forEach(field => {
        if ((features.queryOptions.where as any)[field]) {
          delete (features.queryOptions.where as any)[field];
        }
      });
    }

    // 2. Tambahkan include untuk relasi penjual (seller) DAN Category
    features.queryOptions.include = [
      { model: User, as: 'seller', attributes: ['id', 'fullName'] },
      { model: db.Category, as: 'category' }
=======
    features.queryOptions.include = [
      { model: User, as: "seller", attributes: ["id", "fullName"] },
>>>>>>> frontend-role
    ];

    const { limit, offset } = features.paginate();
    const page = Math.floor(offset / limit) + 1;

    const { rows, count } = await Product.findAndCountAll({
      ...features.queryOptions,
      limit,
      offset,
      distinct: true,
    });

    const totalPages = Math.ceil(count / limit);

    return {
      rows: rows.map((product) => product.toJSON()),
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: page,
        limit,
      },
    };
  }

  public async getProductsBySeller(
    sellerId: string,
    queryString: ParsedQs
  ): Promise<PaginatedProductResult> {
    const features = new APIFeatures(queryString)
      .search()
      .filter()
      .sort()
      .limitFields();

    if (features.queryOptions.where) {
      (features.queryOptions.where as any).sellerId = sellerId;
    } else {
      features.queryOptions.where = { sellerId };
    }

    const { limit, offset } = features.paginate();
    const page = Math.floor(offset / limit) + 1;

    const { rows, count } = await Product.findAndCountAll({
      ...features.queryOptions,
      limit,
      offset,
      distinct: true,
    });

    const totalPages = Math.ceil(count / limit);

    return {
      rows: rows.map((product) => product.toJSON()),
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: page,
        limit,
      },
    };
  }

  public async getProductById(id: string): Promise<ProductAttributes> {
    const product = await Product.findByPk(id, {
      include: [
<<<<<<< HEAD
        { model: User, as: 'seller', attributes: ['id', 'fullName'] },
        { model: db.Category, as: 'category' }
=======
        { model: User, as: "seller", attributes: ["id", "fullName"] },
        { model: db.ProductImage, as: "images" },
        { model: db.ProductVariant, as: "variants" },
>>>>>>> frontend-role
      ],
    });

    if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Product not found");
    }
    return product.toJSON();
  }

  public async updateProduct(
    id: string,
    productData: UpdateProductInput,
    userId: string
  ): Promise<ProductAttributes> {
    const product = await Product.findByPk(id);
    if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Product not found");
    }
    if (product.sellerId !== userId) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        "You are not authorized to update this product"
      );
    }

    const transaction = await db.sequelize.transaction();
    try {
      await product.update(productData, { transaction });

      if (productData.images) {
        await db.ProductImage.destroy({
          where: { productId: id },
          transaction,
        });

        if (productData.images.length > 0) {
          const imageRecords = productData.images.map((url, index) => ({
            productId: id,
            imageUrl: url,
            isPrimary: index === 0,
            type: "image" as "image",
          }));
          await db.ProductImage.bulkCreate(imageRecords, { transaction });
        }
      }

      if (productData.variants) {
        await db.ProductVariant.destroy({
          where: { productId: id },
          transaction,
        });

        if (productData.variants.length > 0) {
          const variantRecords = productData.variants.map((variant) => ({
            ...variant,
            productId: id,
          }));
          await db.ProductVariant.bulkCreate(variantRecords, { transaction });
        }
      }

      await transaction.commit();
      return this.getProductById(id);
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  public async deleteProduct(id: string, userId: string): Promise<void> {
    const product = await Product.findByPk(id);
    if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Product not found");
    }
    if (product.sellerId !== userId) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        "You are not authorized to delete this product"
      );
    }

    await product.destroy();
  }
}

export default new ProductService();
