'use strict';

import { Sequelize } from 'sequelize';
import { config as envConfig } from '../../config/env.config';
import UserModel from './user.model';
import ProductModel from './product.model';
import CategoryModel from './category.model';
import OrderModel from './order.model';
import OrderItemModel from './orderItem.model';
import ReviewModel from './review.model';
import SellerModel from './seller.model';
import PromotionModel from './promotion.model';
import ShippingOptionModel from './shippingOption.model';
import PaymentModel from './payment.model';
import CartModel from './cart.model'; // 1. Impor Cart
import CartItemModel from './cartItem.model'; // 2. Impor CartItem
import UserAddressModel from './userAddress.model';

// Tentukan environment (default: development)
const env = process.env.NODE_ENV || 'development';
const dbConfig = require('../../config/database.config.ts')[env];


// Inisialisasi Sequelize
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
const Cart = CartModel(sequelize); // 3. Init Cart
const CartItem = CartItemModel(sequelize); // 4. Init CartItem
const UserAddress = UserAddressModel(sequelize);

// Kumpulan model dan instance Sequelize
const db = {
  sequelize,
  Sequelize,
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
  Cart, // 5. Masukkan ke object db
  CartItem, // 6. Masukkan ke object db
  UserAddress,
};

// Definisikan asosiasi antar model
Object.values(db).forEach((model: any) => {
  if (model?.associate) {
    model.associate(db);
  }
});

export default db;