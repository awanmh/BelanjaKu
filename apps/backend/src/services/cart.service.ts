import db from "../database/models";
import HttpException from "../utils/http-exception.util";

export const getCart = async (userId: string) => {
  const cartItems = await db.CartItem.findAll({
    where: { userId },
    include: [
      {
        model: db.Product,
        as: "product",
        attributes: ["id", "name", "price", "stock", "imageUrl"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  // Hitung total belanja
  let grandTotal = 0;
  const items = cartItems.map((item: any) => {
    const subtotal = parseFloat(item.product.price) * item.quantity;
    grandTotal += subtotal;
    return {
      id: item.id,
      productId: item.productId,
      productName: item.product.name,
      productImage: item.product.imageUrl,
      price: parseFloat(item.product.price),
      quantity: item.quantity,
      stockAvailable: item.product.stock,
      subtotal: subtotal,
    };
  });

  return { items, grandTotal };
};

export const addToCart = async (
  userId: string,
  productId: string,
  quantity: number
) => {
  const product = await db.Product.findByPk(productId);
  if (!product) throw new HttpException(404, "Product not found");

  // Cek apakah item sudah ada di keranjang user
  const existingItem = await db.CartItem.findOne({
    where: { userId, productId },
  });

  let newQuantity = quantity;
  if (existingItem) {
    newQuantity += existingItem.quantity;
  }

  // Cek stok produk
  if (newQuantity > product.stock) {
    throw new HttpException(
      400,
      `Insufficient stock. Only ${product.stock} left.`
    );
  }

  if (existingItem) {
    // Update quantity jika sudah ada
    existingItem.quantity = newQuantity;
    await existingItem.save();
    return existingItem;
  } else {
    // Buat baru jika belum ada
    const newItem = await db.CartItem.create({
      userId,
      productId,
      quantity,
    });
    return newItem;
  }
};

export const updateCartItem = async (
  userId: string,
  cartItemId: string,
  quantity: number
) => {
  const cartItem = await db.CartItem.findOne({
    where: { id: cartItemId, userId },
    include: [{ model: db.Product, as: "product" }],
  });

  if (!cartItem) throw new HttpException(404, "Item not found in cart");

  // Validasi stok
  if (quantity > cartItem.product.stock) {
    throw new HttpException(
      400,
      `Insufficient stock. Max available: ${cartItem.product.stock}`
    );
  }

  cartItem.quantity = quantity;
  await cartItem.save();
  return cartItem;
};

export const removeCartItem = async (userId: string, cartItemId: string) => {
  const result = await db.CartItem.destroy({
    where: { id: cartItemId, userId },
  });

  if (!result) throw new HttpException(404, "Item not found in cart");
  return true;
};

export const clearCart = async (userId: string) => {
  await db.CartItem.destroy({
    where: { userId },
  });
  return true;
};
