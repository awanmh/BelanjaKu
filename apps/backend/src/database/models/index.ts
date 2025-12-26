"use strict";

import { Sequelize } from "sequelize";
import { config as envConfig } from "../../config/env.config";

// === Import Model Factory ===
import UserModel from "./user.model";
import SellerModel from "./seller.model";
import ProductModel from "./product.model";
import CategoryModel from "./category.model";
import OrderModel from "./order.model";
import OrderItemModel from "./orderItem.model";
import ReviewModel from "./review.model";
import PromotionModel from "./promotion.model";
import ShippingOptionModel from "./shippingOption.model";
import PaymentModel from "./payment.model";
import CartItemModel from "./cartItem.model";
import ProductImageModel from "./productImage.model";
import UserAddressModel from "./userAddress.model";
import WishlistModel from "./wishlist.model";
import NotificationModel from "./notification.model";
import ProductVariantModel from "./productVariant.model";
import ProductDiscussionModel from "./productDiscussion.model";

// ================= ENV & DB CONFIG =================
const env = process.env.NODE_ENV || "development";
const dbConfig = require("../../config/database.config.ts")[env];

// ================= SEQUELIZE INIT =================
let sequelize: Sequelize;

if (dbConfig.use_env_variable) {
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable]!, dbConfig);
} else {
  sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    dbConfig
  );
}

// ================= DB OBJECT =================
const db: any = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// ================= REGISTER MODELS =================
// ⬇️ Gaya eksplisit (gabungan dari contoh ke-2)
db.User = UserModel(sequelize);
db.Seller = SellerModel(sequelize);

db.Product = ProductModel(sequelize);
db.Category = CategoryModel(sequelize);
db.Order = OrderModel(sequelize);
db.OrderItem = OrderItemModel(sequelize);
db.Review = ReviewModel(sequelize);
db.Promotion = PromotionModel(sequelize);
db.ShippingOption = ShippingOptionModel(sequelize);
db.Payment = PaymentModel(sequelize);
db.CartItem = CartItemModel(sequelize);
db.ProductImage = ProductImageModel(sequelize);
db.UserAddress = UserAddressModel(sequelize);
db.Wishlist = WishlistModel(sequelize);
db.Notification = NotificationModel(sequelize);
db.ProductVariant = ProductVariantModel(sequelize);
db.ProductDiscussion = ProductDiscussionModel(sequelize);

// ================= ASSOCIATIONS =================
Object.keys(db).forEach((modelName) => {
  if (db[modelName]?.associate) {
    db[modelName].associate(db);
  }
});

export default db;
