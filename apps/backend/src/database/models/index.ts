"use strict";

import { Sequelize } from "sequelize";
import { config as envConfig } from "../../config/env.config";

// Import semua model
import UserModel from "./user.model";
import ProductModel from "./product.model";
import CategoryModel from "./category.model";
import OrderModel from "./order.model";
import OrderItemModel from "./orderItem.model";
import ReviewModel from "./review.model";
import SellerModel from "./seller.model";
import PromotionModel from "./promotion.model";
import ShippingOptionModel from "./shippingOption.model";
import PaymentModel from "./payment.model";
import CartModel from "./cart.model";
import CartItemModel from "./cartItem.model";
import ProductImageModel from "./productImage.model";
import UserAddressModel from "./userAddress.model";
import WishlistModel from "./wishlist.model";
import NotificationModel from "./notification.model";
import ProductVariantModel from "./productVariant.model";
import ProductDiscussionModel from "./productDiscussion.model";

// Tentukan environment (default: development)
const env = process.env.NODE_ENV || "development";
const dbConfig = require("../../config/database.config")[env];

// Inisialisasi Sequelize
const sequelize: Sequelize = dbConfig.use_env_variable
  ? new Sequelize(process.env[dbConfig.use_env_variable]!, dbConfig)
  : new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);

// Inisialisasi semua model
const models = {
  User: UserModel(sequelize),
  Product: ProductModel(sequelize),
  Category: CategoryModel(sequelize),
  Order: OrderModel(sequelize),
  OrderItem: OrderItemModel(sequelize),
  Review: ReviewModel(sequelize),
  Seller: SellerModel(sequelize),
  Promotion: PromotionModel(sequelize),
  ShippingOption: ShippingOptionModel(sequelize),
  Payment: PaymentModel(sequelize),
  Cart: CartModel(sequelize),
  CartItem: CartItemModel(sequelize),
  ProductImage: ProductImageModel(sequelize),
  UserAddress: UserAddressModel(sequelize),
  Wishlist: WishlistModel(sequelize),
  Notification: NotificationModel(sequelize),
  ProductVariant: ProductVariantModel(sequelize),
  ProductDiscussion: ProductDiscussionModel(sequelize),
};

// Definisikan asosiasi antar model
Object.values(models).forEach((model: any) => {
  if (model?.associate) {
    model.associate(models);
  }
});

// Kumpulan model dan instance Sequelize
const db = {
  sequelize,
  Sequelize,
  ...models,
};

export default db;