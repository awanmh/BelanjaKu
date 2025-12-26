import { ParsedQs } from 'qs';
import { FindOptions, Model, Op, Sequelize } from 'sequelize';

// Definisikan tipe untuk hasil paginasi
export interface PaginationResult {
  limit: number;
  offset: number;
}

/**
 * Kelas untuk membangun query Sequelize secara dinamis dari query string URL.
 * Mendukung filtering, sorting, dan field limiting.
 */
class APIFeatures {
  public queryOptions: FindOptions;
  private queryString: ParsedQs;
  private isSearching: boolean = false; // Property baru

  constructor(queryString: ParsedQs) {
    this.queryString = queryString;
    this.queryOptions = {};
  }

  /**
   * Method Baru: Menangani Full Text Search
   */
  public search(): this {
    if (this.queryString.search && typeof this.queryString.search === 'string') {
      this.isSearching = true;
      const searchTerm = this.queryString.search;

      // Sanitasi sederhana: hapus karakter kutip tunggal agar aman
      const safeSearchTerm = searchTerm.replace(/'/g, "''");

      // Tambahkan kondisi WHERE dengan operator @@
      this.queryOptions.where = {
        ...this.queryOptions.where,
        [Op.and]: Sequelize.literal(
          `search_vector @@ plainto_tsquery('english', '${safeSearchTerm}')`
        ),
      };
    }
    return this;
  }

  /**
   * Menambahkan filter ke queryOptions berdasarkan query string.
   */
  public filter(): this {
    const queryObj = { ...this.queryString };
    // Tambahkan 'search' ke excludedFields agar tidak dianggap filter kolom biasa
    const excludedFields = ['page', 'sort', 'limit', 'offset', 'fields', 'search'];
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

    this.queryOptions.where = {
      ...this.queryOptions.where, // Gabungkan dengan where dari search()
      ...whereClause,
    };

    return this;
  }

  /**
   * Menambahkan sorting ke queryOptions.
   */
  public sort(): this {
    if (this.queryString.sort && typeof this.queryString.sort === 'string') {
      const sortBy = this.queryString.sort.split(',').map((field) => {
        if (field.startsWith('-')) {
          return [field.substring(1), 'DESC'];
        }
        return [field, 'ASC'];
      });
      this.queryOptions.order = sortBy as any;
    } else {
      // Jika user sedang mencari (isSearching = true), urutkan berdasarkan RELEVANSI
      if (this.isSearching) {
        const searchTerm = (this.queryString.search as string).replace(/'/g, "''");
        this.queryOptions.order = [
          [Sequelize.literal(`ts_rank(search_vector, plainto_tsquery('english', '${searchTerm}'))`), 'DESC'],
          ['createdAt', 'DESC']
        ];
      } else {
        this.queryOptions.order = [['createdAt', 'DESC']];
      }
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
   * Mengembalikan nilai limit dan offset.
   */
  public paginate(): PaginationResult {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 100;
    const offset = (page - 1) * limit;

    return { limit, offset };
  }
}

export default APIFeatures;