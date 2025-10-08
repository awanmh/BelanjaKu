import { Model, FindOptions, Order } from 'sequelize';
import { ParsedQs } from 'qs'; // 1. Impor tipe ParsedQs

/**
 * Kelas untuk membangun query Sequelize secara dinamis dari query string URL.
 * Mendukung filtering, sorting, field limiting, dan pagination.
 */
class APIFeatures<T extends Model> {
  public queryOptions: FindOptions;
  private queryString: ParsedQs; // 2. Gunakan tipe ParsedQs
  private model: { new(): T } & typeof Model;

  constructor(model: { new(): T } & typeof Model, queryString: ParsedQs) { // 3. Terima ParsedQs di constructor
    this.model = model;
    this.queryString = queryString;
    this.queryOptions = {};
  }

  /**
   * Menambahkan filter ke queryOptions berdasarkan query string.
   * Contoh: /products?price[lt]=100000&stock[gte]=5
   */
  public filter(): this {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete (queryObj as any)[el]);

    // Mengonversi operator seperti [gt], [gte], [lt], [lte] menjadi format Sequelize
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `[Op.${match}]`);
    
    // Hapus 'Op.' agar bisa di-parse oleh Sequelize dengan benar
    // Sequelize v6 secara otomatis mengenali simbol operator
    queryStr = queryStr.replace(/\[Op\./g, '[Symbol(op).'); 

    this.queryOptions.where = JSON.parse(queryStr, (key, value) => {
        // Mengonversi string operator kembali ke simbol Sequelize
        if (typeof value === 'string' && value.startsWith('[Symbol(op).')) {
            const opKey = value.substring('[Symbol(op).'.length, value.length - 1);
            const { Op } = require('sequelize');
            return Op[opKey];
        }
        return value;
    });

    return this;
  }

  /**
   * Menambahkan sorting ke queryOptions.
   * Contoh: /products?sort=-price,createdAt
   */
  public sort(): this {
    if (typeof this.queryString.sort === 'string') {
      const sortBy = this.queryString.sort.split(',').map((field) => {
        if (field.startsWith('-')) {
          return [field.substring(1), 'DESC'];
        }
        return [field, 'ASC'];
      });
      this.queryOptions.order = sortBy as Order;
    } else {
      // Default sort
      this.queryOptions.order = [['createdAt', 'DESC']];
    }
    return this;
  }

  /**
   * Membatasi field yang dikembalikan oleh query.
   * Contoh: /products?fields=name,price
   */
  public limitFields(): this {
    if (typeof this.queryString.fields === 'string') {
      const fields = this.queryString.fields.split(',');
      this.queryOptions.attributes = fields;
    }
    return this;
  }

  /**
   * Menambahkan paginasi ke queryOptions.
   * Contoh: /products?page=2&limit=10
   */
  public paginate(): this {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 100;
    const offset = (page - 1) * limit;

    this.queryOptions.limit = limit;
    this.queryOptions.offset = offset;

    return this;
  }
}

export default APIFeatures;

