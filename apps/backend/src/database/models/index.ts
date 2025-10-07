'use strict';

import { Sequelize } from 'sequelize';
import { config as envConfig } from '../../config/env.config';
import UserModel from './user.model';
import ProductModel from './product.model';
import CategoryModel from './category.model';
import OrderModel from './order.model';
import OrderItemModel from './orderItem.model';
import ReviewModel from './review.model'; // 1. Impor model Review

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
const Review = ReviewModel(sequelize); // 2. Inisialisasi model Review

// Kumpulan model dan instance Sequelize
const db = {
  sequelize,
  Sequelize,
  User,
  Product,
  Category,
  Order,
  OrderItem,
  Review, // 3. Tambahkan model Review ke objek db
};

// Definisikan asosiasi antar model
Object.values(db).forEach((model: any) => {
  if (model?.associate) {
    model.associate(db);
  }
});

export default db;