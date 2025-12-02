import ShippingOptionService from '../shipping.service';
import db from '../../database/models';
import HttpException from '../../utils/http-exception.util';
import { StatusCodes } from 'http-status-codes';

// Mock dependensi eksternal
jest.mock('../../database/models', () => ({
  ShippingOption: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    destroy: jest.fn(),
  },
}));

const mockShippingOption = db.ShippingOption as jest.Mocked<typeof db.ShippingOption>;

describe('ShippingOptionService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const shippingData = {
    name: 'JNE Reguler',
    description: 'Layanan reguler JNE',
    price: 10000,
    estimatedDays: 3,
  };
  const mockShippingInstance = {
    ...shippingData,
    id: 'ship-uuid',
    toJSON: () => ({ ...shippingData, id: 'ship-uuid' }),
    update: jest.fn(),
    destroy: jest.fn(),
  };

  describe('create', () => {
    it('should create a new shipping option successfully', async () => {
      mockShippingOption.findOne.mockResolvedValue(null);
      mockShippingOption.create.mockResolvedValue(mockShippingInstance as any);

      const result = await ShippingOptionService.create(shippingData);

      expect(mockShippingOption.findOne).toHaveBeenCalledWith({ where: { name: shippingData.name } });
      expect(mockShippingOption.create).toHaveBeenCalledWith(shippingData);
      expect(result).toEqual(mockShippingInstance.toJSON());
    });

    it('should throw CONFLICT if shipping option name already exists', async () => {
      mockShippingOption.findOne.mockResolvedValue(mockShippingInstance as any);

      await expect(ShippingOptionService.create(shippingData)).rejects.toThrow(
        new HttpException(StatusCodes.CONFLICT, 'Shipping option with this name already exists')
      );
    });
  });

  describe('findAll', () => {
    it('should return a list of shipping options', async () => {
      const mockOptions = [mockShippingInstance, { ...mockShippingInstance, id: 'ship-uuid-2' }];
      mockShippingOption.findAll.mockResolvedValue(mockOptions as any);

      const result = await ShippingOptionService.findAll();
      expect(result.length).toBe(2);
      expect(mockShippingOption.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a single shipping option if found', async () => {
        mockShippingOption.findByPk.mockResolvedValue(mockShippingInstance as any);
        const result = await ShippingOptionService.findById('ship-uuid');
        expect(mockShippingOption.findByPk).toHaveBeenCalledWith('ship-uuid');
        expect(result).toEqual(mockShippingInstance.toJSON());
    });

    it('should throw NOT_FOUND if option is not found', async () => {
        mockShippingOption.findByPk.mockResolvedValue(null);
        await expect(ShippingOptionService.findById('ship-uuid')).rejects.toThrow(
            new HttpException(StatusCodes.NOT_FOUND, 'Shipping option not found')
        );
    });
  });
  
  describe('update', () => {
    it('should update a shipping option successfully', async () => {
        const updateData = { name: 'JNE YES' };
        mockShippingOption.findByPk.mockResolvedValue(mockShippingInstance as any);
        mockShippingInstance.update.mockResolvedValue({ ...mockShippingInstance, ...updateData } as any);

        await ShippingOptionService.update('ship-uuid', updateData);
        expect(mockShippingOption.findByPk).toHaveBeenCalledWith('ship-uuid');
        expect(mockShippingInstance.update).toHaveBeenCalledWith(updateData);
    });

    it('should throw NOT_FOUND if option to update is not found', async () => {
        mockShippingOption.findByPk.mockResolvedValue(null);
        await expect(ShippingOptionService.update('ship-uuid', {})).rejects.toThrow(
            new HttpException(StatusCodes.NOT_FOUND, 'Shipping option not found')
        );
    });
  });

  describe('delete', () => {
    it('should delete a shipping option successfully', async () => {
      mockShippingOption.findByPk.mockResolvedValue(mockShippingInstance as any);
      
      await ShippingOptionService.delete('ship-uuid');

      expect(mockShippingOption.findByPk).toHaveBeenCalledWith('ship-uuid');
      expect(mockShippingInstance.destroy).toHaveBeenCalledTimes(1);
    });

    it('should throw NOT_FOUND if option to delete is not found', async () => {
        mockShippingOption.findByPk.mockResolvedValue(null);
        await expect(ShippingOptionService.delete('ship-uuid')).rejects.toThrow(
            new HttpException(StatusCodes.NOT_FOUND, 'Shipping option not found')
        );
    });
  });
});
