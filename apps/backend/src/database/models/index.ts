"use strict";

import { Sequelize } from "sequelize";
<<<<<<< HEAD
import { config as envConfig } from "../../config/env.config";

// Import semua model
=======
// import { config as envConfig } from "../../config/env.config"; // (Opsional, bawaan file anda)
>>>>>>> 49b30cf
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
<<<<<<< HEAD
import CartModel from "./cart.model";
=======
>>>>>>> 49b30cf
import CartItemModel from "./cartItem.model";
import ProductImageModel from "./productImage.model";
import UserAddressModel from "./userAddress.model";
import WishlistModel from "./wishlist.model";
import NotificationModel from "./notification.model";
import ProductVariantModel from "./productVariant.model";
import ProductDiscussionModel from "./productDiscussion.model";

// Tentukan environment (default: development)
const env = process.env.NODE_ENV || "development";
<<<<<<< HEAD
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
=======
// Pastikan path config ini benar sesuai struktur project anda
const dbConfig = require("../../config/database.config.ts")[env] || require("../../config/database.config.js")[env];

// Inisialisasi Sequelize
let sequelize: Sequelize;
if (dbConfig?.use_env_variable) {
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable]!, dbConfig);
} else {
  sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    dbConfig
  );
}

// Inisialisasi semua model
const User = UserModel(sequelize);
const Product = ProductModel(sequelize);
const Category = CategoryModel(sequelize);
const Order = OrderModel(sequelize);
const OrderItem = OrderItemModel(sequelize);
const Review = ReviewModel(sequelize);
const Seller = SellerModel(sequelize);
const Promotion = PromotionModel(sequelize);
const ShippingOption = ShippingOptionModel(sequelize);
const Payment = PaymentModel(sequelize);
const CartItem = CartItemModel(sequelize);
const UserAddress = UserAddressModel(sequelize);
const ProductImage = ProductImageModel(sequelize);
const Wishlist = WishlistModel(sequelize);
const Notification = NotificationModel(sequelize);
const ProductVariant = ProductVariantModel(sequelize);
const ProductDiscussion = ProductDiscussionModel(sequelize);
>>>>>>> 49b30cf

// Kumpulan model dan instance Sequelize
const db = {
  sequelize,
  Sequelize,
<<<<<<< HEAD
  ...models,
};

=======
  User,
  Product,
  Category,
  Order,
  OrderItem,
  Review,
  Seller,
  Promotion,
  ShippingOption,
  Payment,
  CartItem,
  UserAddress,
  ProductImage,
  Wishlist,
  Notification,
  ProductVariant,
  ProductDiscussion,
};

// Definisikan asosiasi antar model (bawaan file)
Object.values(db).forEach((model: any) => {
  if (model?.associate) {
    model.associate(db);
  }
});


>>>>>>> 49b30cf
export default db;