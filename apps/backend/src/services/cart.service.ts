import { StatusCodes } from 'http-status-codes';
import db from '../database/models';
import HttpException from '../utils/http-exception.util';

// Akses model dari objek db
const Cart = db.Cart;
const CartItem = db.CartItem;
const Product = db.Product;

class CartService {
  /**
   * Mengambil keranjang user beserta detail produk di dalamnya.
   * Jika user belum memiliki keranjang, sistem akan membuatnya otomatis.
   * @param userId ID User
   */
  public async getUserCart(userId: string) {
    let cart = await Cart.findOne({
      where: { userId },
      include: [
        {
          model: CartItem,
          as: 'items',
          attributes: ['id', 'quantity', 'productId'], // Ambil field yang perlu saja
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'price', 'imageUrl', 'stock', 'sellerId'],
            },
          ],
        },
      ],
      order: [[{ model: CartItem, as: 'items' }, 'createdAt', 'DESC']], // Urutkan item terbaru di atas
    });

    // Jika belum ada, buat baru
    if (!cart) {
      cart = await Cart.create({ userId });
      // Return struktur kosong agar frontend tidak error
      return { ...cart.toJSON(), items: [] };
    }

    return cart;
  }

  /**
   * Menambahkan produk ke keranjang.
   * Jika produk sudah ada, quantity akan ditambah.
   */
  public async addToCart(userId: string, productId: string, quantity: number) {
    // 1. Pastikan Cart ada (atau buat baru)
    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      cart = await Cart.create({ userId });
    }

    // 2. Cek Validitas Produk
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Product not found');
    }

    // 3. Cek Stok Awal (untuk penambahan baru)
    if (product.stock < quantity) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST, 
        `Insufficient stock. Only ${product.stock} items left.`
      );
    }

    // 4. Cek apakah item sudah ada di keranjang
    const existingItem = await CartItem.findOne({
      where: {
        cartId: cart.id,
        productId: productId,
      },
    });

    if (existingItem) {
      // Logic Update: Tambahkan quantity yang diminta ke quantity lama
      const newQuantity = existingItem.quantity + quantity;

      // Cek stok lagi untuk total quantity baru
      if (product.stock < newQuantity) {
        throw new HttpException(
          StatusCodes.BAD_REQUEST, 
          `Cannot add item. Total quantity (${newQuantity}) exceeds available stock (${product.stock}).`
        );
      }

      await existingItem.update({ quantity: newQuantity });
    } else {
      // Logic Create: Masukkan item baru
      await CartItem.create({
        cartId: cart.id,
        productId: productId,
        quantity: quantity,
      });
    }

    // 5. Kembalikan data keranjang terbaru
    return this.getUserCart(userId);
  }

  /**
   * Mengupdate quantity item di keranjang secara langsung.
   * Digunakan saat user menekan tombol (+) atau (-) di halaman keranjang.
   */
  public async updateItemQuantity(userId: string, cartItemId: string, quantity: number) {
    // Cari item dan pastikan milik user yang request
    const item = await CartItem.findOne({
      where: { id: cartItemId },
      include: [
        { model: Cart, as: 'cart' },
        { model: Product, as: 'product' }
      ]
    });

    // -------------------------------------------------------------
    // PERBAIKAN ERROR TYPESCRIPT DISINI
    // Gunakan 'Optional Chaining' (?.) untuk mengecek properti relasi
    // -------------------------------------------------------------
    
    // Validasi kepemilikan
    // "item?.cart?.userId" aman diakses meskipun cart undefined
    if (!item || !item.cart || item.cart.userId !== userId) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Cart item not found or access denied');
    }

    // Pastikan Product juga ada (untuk menghindari error "possibly undefined")
    if (!item.product) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Product associated with this item is missing');
    }

    // Logic Hapus jika quantity 0 atau kurang
    if (quantity <= 0) {
      await item.destroy();
    } else {
      // Validasi Stok
      // TypeScript sekarang tahu item.product pasti ada karena pengecekan if di atas
      if (item.product.stock < quantity) {
        throw new HttpException(
          StatusCodes.BAD_REQUEST, 
          `Insufficient stock. Only ${item.product.stock} items available.`
        );
      }
      await item.update({ quantity });
    }

    return this.getUserCart(userId);
  }

  /**
   * Menghapus satu item spesifik dari keranjang.
   */
  public async removeItem(userId: string, cartItemId: string) {
    const item = await CartItem.findOne({
      where: { id: cartItemId },
      include: [{ model: Cart, as: 'cart' }]
    });

    // -------------------------------------------------------------
    // PERBAIKAN ERROR TYPESCRIPT DISINI
    // -------------------------------------------------------------
    if (!item || !item.cart || item.cart.userId !== userId) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Cart item not found');
    }

    await item.destroy(); // Soft delete
    return this.getUserCart(userId);
  }

  /**
   * Mengosongkan keranjang (contoh: setelah checkout sukses).
   */
  public async clearCart(userId: string) {
    const cart = await Cart.findOne({ where: { userId } });
    if (cart) {
      await CartItem.destroy({ where: { cartId: cart.id } });
    }
    return { message: 'Cart cleared successfully' };
  }
}

export default new CartService();