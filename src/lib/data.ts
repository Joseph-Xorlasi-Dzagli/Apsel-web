// Sample data for our application
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'canceled';

export interface Order {
  id: string;
  customerName: string;
  total: number;
  date: string;
  status: OrderStatus;
  items: number;
  shippingMethod: 'delivery' | 'pickup';
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
  category: string;
  sold: number;
  description?: string;
  termsOfService?: string;
  availableForDelivery?: boolean;
  availableForPickup?: boolean;
  options?: ProductOption[];
}

export interface ProductOption {
  id: string;
  productId: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
  description?: string;
  termsOfService?: string;
  availableForDelivery?: boolean;
  availableForPickup?: boolean;
}

export interface Category {
  id: string;
  name: string;
  productCount: number;
  image: string;
  description?: string;
}

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type OrderType = {
  id: string;
  customerName: string;
  email?: string;
  phone?: string;
  address?: string;
  date: string;
  time: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shipping?: number;
  tax?: number;
  total: number;
  notes?: string;
  paymentMethod?: string;
};

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'sale' | 'refund';
  orderId: string;
  customerName: string;
}

export const generateRandomOrders = (count: number): Order[] => {
  const statuses: OrderStatus[] = ['pending', 'processing', 'completed', 'canceled'];
  const shippingMethods: ('delivery' | 'pickup')[] = ['delivery', 'pickup'];
  const customers = [
    'Tina Awuntastubborn',
    'Joseph Akurugu Avoka',
    'Winifred Korewaa Adjei',
    'Mike Mazowski',
    'Sarah Johnson',
    'James Williams',
    'Emily Brown'
  ];
  
  const orders: Order[] = [];
  
  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    orders.push({
      id: `${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: customers[Math.floor(Math.random() * customers.length)],
      total: parseFloat((Math.random() * 200 + 20).toFixed(2)),
      date: date.toISOString(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      items: Math.floor(Math.random() * 5) + 1,
      shippingMethod: shippingMethods[Math.floor(Math.random() * shippingMethods.length)]
    });
  }
  
  return orders;
};

export const generateRandomProducts = (count: number): Product[] => {
  const categories = ['Mobile Phones', 'Accessories', 'Headphones', 'Chargers', 'Cases', 'Speakers'];
  const products = [
    'iPhone 13 Pro',
    'Samsung Galaxy S21',
    'AirPods Pro',
    'Pixel 6',
    'Beats Studio Wireless',
    'Fast Charger USB-C',
    'Phone Case',
    'Bluetooth Speaker',
    'Wireless Charger',
    'Screen Protector'
  ];
  
  const descriptions = [
    'Premium quality product with 1-year warranty.',
    'Latest model with enhanced features and performance.',
    'Durable design with premium materials.',
    'Best-in-class technology with excellent battery life.',
    'High-performance device with sleek design.'
  ];
  
  const termsOfService = [
    'Returns accepted within 14 days of purchase. Product must be in original packaging.',
    'Limited warranty covers manufacturing defects only. Does not cover accidental damage.',
    '30-day money-back guarantee. Shipping charges are non-refundable.',
    'All sales are final. Please check specifications before purchasing.',
    'Warranty void if product is tampered with or misused.'
  ];

  const optionNames = [
    'Standard',
    'Extra Memory',
    'Premium',
    'Extra Cheese',
    'Spicy',
    'Large Size',
    'Medium Size',
    'Small Size',
    'Deluxe',
    'Basic'
  ];
  
  const result: Product[] = [];
  
  for (let i = 0; i < count; i++) {
    const productName = products[Math.floor(Math.random() * products.length)];
    const basePrice = parseFloat((Math.random() * 500 + 20).toFixed(2));
    const baseStock = Math.floor(Math.random() * 100) + 5;
    const productId = `prod-${i + 1}`;
    
    // Generate 1-4 options per product
    const options: ProductOption[] = [];
    const numOptions = Math.floor(Math.random() * 3) + 1;
    
    // First option is always 'Standard'
    options.push({
      id: `option-${productId}-1`,
      productId,
      name: 'Standard',
      price: basePrice,
      stock: baseStock,
      image: `/public/lovable-uploads/${Math.floor(Math.random() * 20) + 1}2345678-abcd-4ef5-6789-abcdef123456.png`,
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      termsOfService: termsOfService[Math.floor(Math.random() * termsOfService.length)],
      availableForDelivery: Math.random() > 0.3,
      availableForPickup: Math.random() > 0.2
    });
    
    // Add additional options
    for (let j = 1; j < numOptions; j++) {
      const optionName = optionNames[Math.floor(Math.random() * optionNames.length)];
      if (optionName === 'Standard' || options.some(opt => opt.name === optionName)) {
        continue; // Skip duplicates
      }
      
      options.push({
        id: `option-${productId}-${j+1}`,
        productId,
        name: optionName,
        price: basePrice + parseFloat((Math.random() * 50).toFixed(2)), // Slightly higher price for options
        stock: Math.max(5, baseStock - Math.floor(Math.random() * 20)), // Slightly less stock for options
        image: `/public/lovable-uploads/${Math.floor(Math.random() * 20) + 1}2345678-abcd-4ef5-6789-abcdef123456.png`,
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        termsOfService: termsOfService[Math.floor(Math.random() * termsOfService.length)],
        availableForDelivery: Math.random() > 0.3,
        availableForPickup: Math.random() > 0.2
      });
    }
    
    result.push({
      id: productId,
      name: productName,
      price: basePrice,
      stock: baseStock,
      image: `/public/lovable-uploads/${Math.floor(Math.random() * 20) + 1}2345678-abcd-4ef5-6789-abcdef123456.png`,
      category: categories[Math.floor(Math.random() * categories.length)],
      sold: Math.floor(Math.random() * 200),
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      termsOfService: termsOfService[Math.floor(Math.random() * termsOfService.length)],
      availableForDelivery: Math.random() > 0.3,
      availableForPickup: Math.random() > 0.2,
      options
    });
  }
  
  return result;
};

export const generateRandomCategories = (): Category[] => {
  return [
    { id: 'cat-1', name: 'Mobile Phones', productCount: 24, image: '/public/lovable-uploads/feae015c-07aa-4011-8d01-4365061b0988.png' },
    { id: 'cat-2', name: 'Accessories', productCount: 45, image: '/public/lovable-uploads/53cffad4-01e5-4c4d-8b49-7f8f515660ca.png' },
    { id: 'cat-3', name: 'Headphones', productCount: 18, image: '/public/lovable-uploads/c0739a7b-c18d-4445-9dfc-764bc1ea741e.png' },
    { id: 'cat-4', name: 'Chargers', productCount: 32, image: '/public/lovable-uploads/5f613f49-031f-415b-bcb7-e2043cff9a76.png' },
    { id: 'cat-5', name: 'Cases', productCount: 56, image: '/public/lovable-uploads/623a978f-9952-4b96-bc2f-f20d25053fbb.png' },
    { id: 'cat-6', name: 'Speakers', productCount: 12, image: '/public/lovable-uploads/5a362dac-f34a-48b0-95e7-25049bed3494.png' }
  ];
};

export const generateRandomTransactions = (count: number): Transaction[] => {
  const types: ('sale' | 'refund')[] = ['sale', 'sale', 'sale', 'sale', 'refund']; // 80% sales, 20% refunds
  const customers = [
    'Tina Awuntastubborn',
    'Joseph Akurugu Avoka',
    'Winifred Korewaa Adjei',
    'Mike Mazowski',
    'Sarah Johnson',
    'James Williams',
    'Emily Brown'
  ];
  
  const result: Transaction[] = [];
  
  // Generate transactions for the last 3 months
  const now = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(now.getMonth() - 3);
  
  for (let i = 0; i < count; i++) {
    const date = new Date(
      threeMonthsAgo.getTime() + Math.random() * (now.getTime() - threeMonthsAgo.getTime())
    );
    
    const type = types[Math.floor(Math.random() * types.length)];
    const amount = parseFloat((Math.random() * 200 + 20).toFixed(2));
    
    result.push({
      id: `trans-${i + 1}`,
      date: date.toISOString(),
      amount: type === 'refund' ? -amount : amount,
      type,
      orderId: `${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: customers[Math.floor(Math.random() * customers.length)]
    });
  }
  
  // Sort by date (newest first)
  result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return result;
};

// Generate sample data
export const sampleOrders = generateRandomOrders(50);
export const sampleProducts = generateRandomProducts(30);
export const sampleCategories = generateRandomCategories();
export const sampleTransactions = generateRandomTransactions(100);

// Utility functions for data analysis
export const getRevenueByTimeframe = (transactions: Transaction[], timeframe: 'day' | 'week' | 'month' | 'year') => {
  const result: { [key: string]: number } = {};
  
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    let key = '';
    
    switch (timeframe) {
      case 'day':
        key = date.toISOString().split('T')[0]; // YYYY-MM-DD
        break;
      case 'week':
        // Get week number and year
        const oneJan = new Date(date.getFullYear(), 0, 1);
        const weekNum = Math.ceil((((date.getTime() - oneJan.getTime()) / 86400000) + oneJan.getDay() + 1) / 7);
        key = `${date.getFullYear()}-W${weekNum}`;
        break;
      case 'month':
        key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        break;
      case 'year':
        key = date.getFullYear().toString();
        break;
    }
    
    if (!result[key]) {
      result[key] = 0;
    }
    
    result[key] += transaction.amount;
  });
  
  return result;
};

export const getRecentTransactions = (transactions: Transaction[], count: number = 5) => {
  return transactions.slice(0, count);
};

export const getTopSellingProducts = (products: Product[], count: number = 5) => {
  return [...products].sort((a, b) => b.sold - a.sold).slice(0, count);
};

export const getOrdersByStatus = (orders: Order[]) => {
  const result: { [key in OrderStatus]: number } = {
    pending: 0,
    processing: 0,
    completed: 0,
    canceled: 0
  };
  
  orders.forEach(order => {
    result[order.status]++;
  });
  
  return result;
};
