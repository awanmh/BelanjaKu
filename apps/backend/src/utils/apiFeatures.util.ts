import { ParsedQs } from 'qs';
import { FindOptions, Model, Op } from 'sequelize';

// Definisikan tipe untuk hasil paginasi
export interface PaginationResult {
  limit: number;
  offset: number;
}

/**
 * Kelas untuk membangun query Sequelize secara dinamis dari query string URL.
 * Mendukung filtering, sorting, dan field limiting.
 * PAGINASI sekarang ditangani secara terpisah.
 */
class APIFeatures {
  public queryOptions: FindOptions;
  private queryString: ParsedQs;

  constructor(queryString: ParsedQs) {
    this.queryString = queryString;
    this.queryOptions = {};
  }

  /**
   * Menambahkan filter ke queryOptions berdasarkan query string.
   */
  public filter(): this {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete (queryObj as any)[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in|ne)\b/g, (match) => `[Op.${match}]`);

    // Konversi string kembali ke simbol Op Sequelize
    const whereClause = JSON.parse(queryStr, (key, value) => {
      if (typeof value === 'string' && value.startsWith('[Op.')) {
        const opKey = value.substring(4, value.length - 1);
        return (Op as any)[opKey];
      }
      return value;
    });

    this.queryOptions.where = whereClause;
    return this;
  }

  /**
   * Menambahkan sorting ke queryOptions.
   */
  public sort(): this {
    if (typeof this.queryString.sort === 'string') {
      const sortBy = this.queryString.sort.split(',').map((field) => {
        if (field.startsWith('-')) {
          return [field.substring(1), 'DESC'];
        }
        return [field, 'ASC'];
      });
      this.queryOptions.order = sortBy as any;
    } else {
      this.queryOptions.order = [['createdAt', 'DESC']];
    }
    return this;
  }

  /**
   * Membatasi field yang dikembalikan oleh query.
   */
  public limitFields(): this {
    if (typeof this.queryString.fields === 'string') {
      const fields = this.queryString.fields.split(',');
      this.queryOptions.attributes = fields;
    }
    return this;
  }

  /**
   * [DIPERBARUI] Hanya menghitung dan mengembalikan nilai limit dan offset.
   * @returns Objek PaginationResult { limit, offset }
   */
  public paginate(): PaginationResult {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 100;
    const offset = (page - 1) * limit;

    // Tidak lagi menerapkan ke queryOptions secara langsung
    // this.queryOptions.limit = limit;
    // this.queryOptions.offset = offset;

    return { limit, offset };
  }
}

export default APIFeatures;

