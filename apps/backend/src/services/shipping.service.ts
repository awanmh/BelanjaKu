import { StatusCodes } from "http-status-codes";
import db from "../database/models";
import { ShippingOptionAttributes } from "../database/models/shippingOption.model";
import ApiError from "../utils/api-error.util";

// Mengambil model ShippingOption dari objek db yang sudah diinisialisasi
const ShippingOption = db.ShippingOption;

// Tipe data spesifik untuk input pembuatan opsi pengiriman
export type CreateShippingOptionInput = Pick<
  ShippingOptionAttributes,
  "name" | "description" | "price" | "estimatedDays"
>;

// Tipe data spesifik untuk input pembaruan opsi pengiriman
export type UpdateShippingOptionInput = Partial<
  CreateShippingOptionInput & { isActive: boolean }
>;

/**
 * Service untuk menangani semua logika bisnis yang terkait dengan opsi pengiriman.
 */
class ShippingOptionService {
  /**
   * Membuat opsi pengiriman baru.
   * @param data Data untuk opsi pengiriman baru.
   * @returns Opsi pengiriman yang baru dibuat.
   */
  public async create(
    data: CreateShippingOptionInput
  ): Promise<ShippingOptionAttributes> {
    const { name } = data;

    // Cek apakah nama opsi pengiriman sudah ada
    const existingOption = await ShippingOption.findOne({ where: { name } });
    if (existingOption) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        "Shipping option with this name already exists"
      );
    }

    const newOption = await ShippingOption.create(data);
    return newOption.toJSON();
  }

  /**
   * Mengambil semua opsi pengiriman dari database.
   * @returns Array berisi semua opsi pengiriman.
   */
  public async findAll(): Promise<ShippingOptionAttributes[]> {
    const options = await ShippingOption.findAll({
      order: [["price", "ASC"]],
    });
    return options.map((option) => option.toJSON());
  }

  /**
   * Mengambil satu opsi pengiriman berdasarkan ID.
   * @param id ID opsi pengiriman.
   * @returns Objek opsi pengiriman.
   */
  public async findById(id: string): Promise<ShippingOptionAttributes> {
    const option = await ShippingOption.findByPk(id);
    if (!option) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Shipping option not found"
      );
    }
    return option.toJSON();
  }

  /**
   * Memperbarui opsi pengiriman berdasarkan ID.
   * @param id ID opsi pengiriman.
   * @param data Data pembaruan.
   * @returns Opsi pengiriman yang sudah diperbarui.
   */
  public async update(
    id: string,
    data: UpdateShippingOptionInput
  ): Promise<ShippingOptionAttributes> {
    const option = await ShippingOption.findByPk(id);
    if (!option) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Shipping option not found"
      );
    }

    await option.update(data);
    return option.toJSON();
  }

  /**
   * Menghapus opsi pengiriman berdasarkan ID.
   * @param id ID opsi pengiriman.
   */
  public async delete(id: string): Promise<void> {
    const option = await ShippingOption.findByPk(id);
    if (!option) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Shipping option not found"
      );
    }

    await option.destroy();
  }

  /**
   * Menghitung ongkos kirim (Simulasi RajaOngkir)
   */
  public async calculateShippingCost(
    origin: string,
    destination: string,
    weight: number,
    courier: string
  ) {
    // LOGIKA MOCK / SIMULASI
    // Di produksi, Anda akan menggunakan axios untuk request ke API RajaOngkir
    // const response = await axios.post('https://api.rajaongkir.com/starter/cost', { ... })

    const basePrice = 10000;
    const weightFactor = Math.ceil(weight / 1000); // per kg

    let courierMultiplier = 1;
    if (courier === "jne") courierMultiplier = 1.2;
    if (courier === "pos") courierMultiplier = 1.0;
    if (courier === "tiki") courierMultiplier = 1.1;

    const cost = basePrice * weightFactor * courierMultiplier;

    return {
      courier,
      service: "REG",
      description: "Layanan Reguler",
      cost: cost,
      etd: "2-3 Days",
    };
  }
}

// Ekspor sebagai singleton instance
export default new ShippingOptionService();
