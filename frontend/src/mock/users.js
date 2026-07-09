/**
 * 用户与订单 Mock 数据
 */

/**
 * 模拟用户数据
 */
export const mockUsers = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    nickname: '小明',
    avatar: 'https://picsum.photos/seed/avatar1/100/100',
    mobile: '13800138000',
    email: 'xiaoming@example.com',
    addresses: [
      {
        id: 1,
        name: '张三',
        mobile: '13800138000',
        province: '广东省',
        city: '深圳市',
        district: '南山区',
        detail: '科技园路1号创新大厦A座1001室',
        isDefault: true,
      },
      {
        id: 2,
        name: '张三',
        mobile: '13900139000',
        province: '北京市',
        city: '北京市',
        district: '朝阳区',
        detail: '望京街道SOHO 3Q B座502',
        isDefault: false,
      },
    ],
  },
]

/**
 * 模拟订单数据
 */
export const mockOrders = [
  {
    id: '20240701001',
    userId: 1,
    status: 'completed',
    totalAmount: 11248.00,
    items: [
      { productId: 1, name: 'iPhone 15 Pro Max 256GB', price: 9999.00, quantity: 1, image: 'https://picsum.photos/seed/iphone15/100/100' },
      { productId: 4, name: 'Sony WH-1000XM5', price: 1249.00, quantity: 1, image: 'https://picsum.photos/seed/sonyxm5/100/100' },
    ],
    address: { name: '张三', mobile: '13800138000', full: '广东省深圳市南山区科技园路1号创新大厦A座1001室' },
    createTime: '2024-07-01 10:30:00',
    payTime: '2024-07-01 10:35:00',
  },
  {
    id: '20240702002',
    userId: 1,
    status: 'shipped',
    totalAmount: 128.00,
    items: [
      { productId: 7, name: '良品铺子 坚果大礼包 1888g', price: 128.00, quantity: 1, image: 'https://picsum.photos/seed/nuts/100/100' },
    ],
    address: { name: '张三', mobile: '13800138000', full: '广东省深圳市南山区科技园路1号创新大厦A座1001室' },
    createTime: '2024-07-02 14:20:00',
    payTime: '2024-07-02 14:22:00',
    shipTime: '2024-07-03 09:00:00',
  },
  {
    id: '20240703003',
    userId: 1,
    status: 'pending',
    totalAmount: 4799.00,
    items: [
      { productId: 11, name: 'iPad Air M2 11英寸', price: 4799.00, quantity: 1, image: 'https://picsum.photos/seed/ipadair/100/100' },
    ],
    address: { name: '张三', mobile: '13900139000', full: '北京市朝阳区望京街道SOHO 3Q B座502' },
    createTime: '2024-07-03 16:45:00',
    payTime: null,
  },
]
