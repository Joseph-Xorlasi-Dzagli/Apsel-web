import {
  getFirestore,
  doc,
  setDoc,
  collection,
  writeBatch,
  Timestamp,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import { mockCustomers } from "@/lib/data";

// Mock data for products
const mockProducts = [
  { name: "iPhone 13 Pro", category: 0, price: 499.99, stock: 25 },
  { name: "Samsung Galaxy S21", category: 0, price: 449.99, stock: 18 },
  { name: "Google Pixel 6", category: 0, price: 399.99, stock: 12 },
  { name: "Xiaomi Redmi Note 11", category: 0, price: 199.99, stock: 30 },
  { name: "Tecno Camon 18", category: 0, price: 179.99, stock: 20 },
  { name: "AirPods Pro", category: 2, price: 199.99, stock: 30 },
  { name: "Samsung Galaxy Buds", category: 2, price: 149.99, stock: 25 },
  { name: "Sony WH-1000XM4", category: 2, price: 249.99, stock: 15 },
  { name: "Beats Studio Buds", category: 2, price: 129.99, stock: 20 },
  { name: "Fast Charger USB-C", category: 3, price: 29.99, stock: 50 },
  { name: "Wireless Charger Pad", category: 3, price: 39.99, stock: 40 },
  { name: "Power Bank 20000mAh", category: 3, price: 49.99, stock: 35 },
  { name: "Car Charger Adapter", category: 3, price: 19.99, stock: 45 },
  {
    name: "Premium Phone Case (iPhone)",
    category: 4,
    price: 19.99,
    stock: 100,
  },
  {
    name: "Premium Phone Case (Samsung)",
    category: 4,
    price: 19.99,
    stock: 90,
  },
  {
    name: "Tempered Glass Screen Protector",
    category: 4,
    price: 9.99,
    stock: 200,
  },
  { name: "Phone Grip Stand", category: 4, price: 7.99, stock: 150 },
  { name: "Bluetooth Speaker", category: 5, price: 59.99, stock: 25 },
  {
    name: "Waterproof Bluetooth Speaker",
    category: 5,
    price: 79.99,
    stock: 20,
  },
  { name: "Mini Portable Speaker", category: 5, price: 29.99, stock: 30 },
];

// Mock order statuses
const orderStatuses = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

// Generate random date within the last 3 months
const getRandomDate = (monthsAgo = 3) => {
  const now = new Date();
  const pastDate = new Date(now);
  pastDate.setMonth(now.getMonth() - monthsAgo);

  const randomTimestamp =
    pastDate.getTime() + Math.random() * (now.getTime() - pastDate.getTime());
  return new Date(randomTimestamp);
};

/**
 * Populates the database with comprehensive mock data for an existing business
 * @param businessId - The ID of the existing business to populate
 * @param ownerId - The user ID that owns the business (for reference)
 * @returns Boolean indicating success
 */
export const populateBusinessData = async (
  businessId: string,
  ownerId: string
) => {
  if (!businessId || !ownerId) {
    throw new Error(
      "Business ID and Owner ID are required to populate business data"
    );
  }

  const db = getFirestore();
  const customerIds: string[] = [];
  const productIds: string[] = [];
  const productOptionIds: Record<string, string[]> = {};
  const categoryIds: string[] = [];
  const orderIds: string[] = [];
  const transactionIds: string[] = [];
  const paymentAccountIds: Record<string, string[]> = {};
  const settlementAccountId = `account-${businessId}`;

  try {
    // We'll use multiple batches to avoid Firestore's 500 operations per batch limit
    let batch = writeBatch(db);
    let operationCount = 0;
    const MAX_OPERATIONS = 450; // Keep some margin from the 500 limit

    // Helper function to check and commit batch if needed
    const checkAndCommitBatch = async () => {
      if (operationCount >= MAX_OPERATIONS) {
        await batch.commit();
        batch = writeBatch(db);
        operationCount = 0;
        console.log("Batch committed, creating new batch");
      }
    };

    // 1. Create/update settlement account
    const accountRef = doc(db, "settlement_accounts", settlementAccountId);
    batch.set(accountRef, {
      business_id: businessId,
      account_number: "2134567890",
      account_holder: "Business Owner",
      account_provider: "GCB Bank",
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });
    operationCount++;

    // 2. Create contact info if doesn't exist
    const contactRef = doc(db, "business_contacts", businessId);
    batch.set(
      contactRef,
      {
        manager: "Joseph Akurugu Avoka",
        email: "hello@gconnectmobile.com",
        phone: "233-506-123-456",
        whatsapp: "+233206252066",
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      },
      { merge: true }
    ); // Use merge to avoid overwriting existing data
    operationCount++;

    // 3. Create address info if doesn't exist
    const addressRef = doc(db, "business_addresses", businessId);
    batch.set(
      addressRef,
      {
        street: "3891 Ranchview Dr.",
        city: "Accra",
        state: "Greater Accra",
        country: "Ghana",
        postal_code: "GA-201-7223",
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      },
      { merge: true }
    ); // Use merge to avoid overwriting existing data
    operationCount++;

    // 4. Create categories
    const categories = [
      {
        name: "Mobile Phones",
        description: "Latest smartphones from all brands",
      },
      {
        name: "Accessories",
        description: "Essential accessories for your devices",
      },
      {
        name: "Headphones",
        description: "Premium audio experience for all devices",
      },
      {
        name: "Chargers",
        description: "Fast charging solutions for all devices",
      },
      {
        name: "Cases",
        description: "Protective and stylish cases for all devices",
      },
      { name: "Speakers", description: "High-quality audio speakers" },
    ];

    console.log("Creating categories...");
    for (const [index, category] of categories.entries()) {
      const categoryId = await addDoc(collection(db, "categories"), {
        business_id: businessId,
        name: category.name,
        description: category.description,
        image_url: `/public/lovable-uploads/${
          Math.floor(Math.random() * 20) + 1
        }2345678-abcd-4ef5-6789-abcdef123456.png`,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      }).then((docRef) => docRef.id);

      categoryIds.push(categoryId);
    }

    await checkAndCommitBatch();
    console.log("Categories created:", categoryIds);

    // 5. Create products
    console.log("Creating products...");
    for (const [index, product] of mockProducts.entries()) {
      // Add the product document
      const productId = await addDoc(collection(db, "products"), {
        business_id: businessId,
        category_id: categoryIds[product.category],
        name: product.name,
        description: `Premium quality ${product.name} with 1-year warranty.`,
        terms_of_service: "Standard 30-day return policy applies.",
        available_for_delivery: true,
        available_for_pickup: true,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      }).then((docRef) => docRef.id);

      productIds.push(productId);
      productOptionIds[productId] = [];

      // Create options for this product (standard and variations if applicable)
      const optionColors = ["Black", "White", "Blue", "Red"];
      const hasVariations = Math.random() > 0.7; // 30% chance to have variations

      // Create standard option
      const standardOptionId = await addDoc(collection(db, "product_options"), {
        product_id: productId,
        name: "Standard",
        price: product.price,
        stock: product.stock,
        image_url: `/public/lovable-uploads/${
          Math.floor(Math.random() * 20) + 1
        }2345678-abcd-4ef5-6789-abcdef123456.png`,
        description: `Standard ${product.name} with factory settings.`,
        terms_of_service: "Standard 30-day return policy applies.",
        available_for_delivery: true,
        available_for_pickup: true,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      }).then((docRef) => docRef.id);

      productOptionIds[productId].push(standardOptionId);

      // Add variations if applicable
      if (hasVariations) {
        for (const [colorIndex, color] of optionColors.entries()) {
          if (Math.random() > 0.3) {
            // Skip some variations randomly
            // Price variation based on color
            const priceAdjustment = (colorIndex + 1) * 5;

            const variationOptionId = await addDoc(
              collection(db, "product_options"),
              {
                product_id: productId,
                name: `${color} Edition`,
                price: product.price + priceAdjustment,
                stock: Math.floor(product.stock / (colorIndex + 2)),
                image_url: `/public/lovable-uploads/${
                  Math.floor(Math.random() * 20) + 1
                }2345678-abcd-4ef5-6789-abcdef123456.png`,
                description: `${color} edition of the ${product.name}.`,
                terms_of_service: "Standard 30-day return policy applies.",
                available_for_delivery: true,
                available_for_pickup: true,
                created_at: serverTimestamp(),
                updated_at: serverTimestamp(),
              }
            ).then((docRef) => docRef.id);

            productOptionIds[productId].push(variationOptionId);
          }
        }
      }

      // Check every 5 products to avoid batch size issues
      if (index % 5 === 0) {
        await checkAndCommitBatch();
      }
    }

    console.log("Products created:", productIds.length);
    console.log(
      "Product options created:",
      Object.values(productOptionIds).flat().length
    );

    // 6. Create customers with payment accounts
    console.log("Creating customers...");
    const fullCustomerList =
      mockCustomers.length > 20 ? mockCustomers.slice(0, 20) : mockCustomers;

    for (const [index, customer] of fullCustomerList.entries()) {
      // Create customer
      const customerId = await addDoc(collection(db, "customers"), {
        business_id: businessId,
        name: customer.name,
        email: customer.email || `customer${index + 1}@example.com`,
        phone:
          customer.phone ||
          `+233${Math.floor(Math.random() * 10000000) + 20000000}`,
        location: customer.location || "Accra, Ghana",
        status: customer.status || "active",
        notes: customer.notes || "",
        avatar_url: customer.avatar || "",
        created_at: Timestamp.fromDate(getRandomDate(6)),
        updated_at: serverTimestamp(),
      }).then((docRef) => docRef.id);

      customerIds.push(customerId);
      paymentAccountIds[customerId] = [];

      // Create payment accounts for customers
      const paymentProviders = ["Mobile Money", "Bank Card", "Bank Transfer"];
      const numPaymentAccounts = Math.floor(Math.random() * 2) + 1; // 1-2 payment accounts per customer

      for (let p = 0; p < numPaymentAccounts; p++) {
        const providerIndex = Math.floor(
          Math.random() * paymentProviders.length
        );
        const paymentProvider = paymentProviders[providerIndex];

        const paymentAccountId = await addDoc(
          collection(db, "payment_accounts"),
          {
            customer_id: customerId,
            account_number: `XXXX${Math.floor(Math.random() * 10000)}`,
            account_holder: customer.name,
            account_provider: paymentProvider,
            is_default: p === 0, // First one is default
            created_at: Timestamp.fromDate(getRandomDate(6)),
            updated_at: serverTimestamp(),
          }
        ).then((docRef) => docRef.id);

        paymentAccountIds[customerId].push(paymentAccountId);
      }

      // Check batch size periodically
      if (index % 5 === 0) {
        await checkAndCommitBatch();
      }
    }

    console.log("Customers created:", customerIds.length);

    // 7. Create orders with order items
    console.log("Creating orders...");
    const numOrders = 30; // Create 30 orders

    for (let i = 0; i < numOrders; i++) {
      const orderDate = getRandomDate(3);
      const customerId =
        customerIds[Math.floor(Math.random() * customerIds.length)];

      // Determine shipping method
      const shippingMethod = Math.random() > 0.5 ? "delivery" : "pickup";

      // Calculate order totals
      const numItems = Math.floor(Math.random() * 3) + 1; // 1-3 items per order
      let subtotal = 0;
      const orderItems = [];

      // Create order items
      for (let j = 0; j < numItems; j++) {
        const productId =
          productIds[Math.floor(Math.random() * productIds.length)];
        const productOptions = productOptionIds[productId];
        const optionId =
          productOptions[Math.floor(Math.random() * productOptions.length)];

        // Find product option details
        // In a real implementation, you would fetch this from the database
        // Here we're using a simplified approach
        const productIndex = productIds.indexOf(productId);
        const productData = mockProducts[productIndex];
        const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 quantity

        // Calculate price - using base product price for simplicity
        // In a real scenario, you'd query the database for the actual option price
        const price = productData.price;
        const itemTotal = price * quantity;
        subtotal += itemTotal;

        orderItems.push({
          product_option_id: optionId,
          name: productData.name,
          price: price,
          quantity: quantity,
          total: itemTotal,
          created_at: Timestamp.fromDate(orderDate),
        });
      }

      // Calculate fees
      const shippingFee = shippingMethod === "delivery" ? 10 : 0;
      const tax = subtotal * 0.05; // 5% tax
      const total = subtotal + shippingFee + tax;

      // Determine order status based on date
      const daysSinceOrder =
        (new Date().getTime() - orderDate.getTime()) / (1000 * 3600 * 24);
      let status;
      if (daysSinceOrder < 1) status = "Pending";
      else if (daysSinceOrder < 2) status = "Processing";
      else if (daysSinceOrder < 4) status = "Shipped";
      else status = Math.random() > 0.1 ? "Delivered" : "Cancelled"; // 10% chance of cancellation

      // Create the order
      const orderId = await addDoc(collection(db, "orders"), {
        business_id: businessId,
        customer_id: customerId,
        status: status,
        shipping_method: shippingMethod,
        shipping_address:
          shippingMethod === "delivery" ? "123 Customer St, Accra, Ghana" : "",
        subtotal: subtotal,
        shipping_fee: shippingFee,
        tax: tax,
        total: total,
        notes: Math.random() > 0.7 ? "Please deliver with care." : "",
        created_at: Timestamp.fromDate(orderDate),
        updated_at: Timestamp.fromDate(orderDate),
      }).then((docRef) => docRef.id);

      orderIds.push(orderId);

      // Create order items
      for (const [itemIndex, item] of orderItems.entries()) {
        await addDoc(collection(db, "order_items", orderId, "items"), item);
      }

      // Create transaction for completed orders
      if (status === "Delivered") {
        const customerPaymentAccounts = paymentAccountIds[customerId];
        if (customerPaymentAccounts && customerPaymentAccounts.length > 0) {
          const paymentAccountId = customerPaymentAccounts[0]; // Use first payment account

          const transactionId = await addDoc(collection(db, "transactions"), {
            business_id: businessId,
            order_id: orderId,
            customer_id: customerId,
            payment_account_id: paymentAccountId,
            settlement_account_id: settlementAccountId,
            type: "payment",
            status: "completed",
            amount: total,
            reference: `TX-${Math.floor(Math.random() * 1000000)}`,
            payment_date: Timestamp.fromDate(orderDate),
            created_at: Timestamp.fromDate(orderDate),
          }).then((docRef) => docRef.id);

          transactionIds.push(transactionId);
        }
      }

      // Check batch size periodically
      if (i % 5 === 0) {
        await checkAndCommitBatch();
      }
    }

    console.log("Orders created:", orderIds.length);
    console.log("Transactions created:", transactionIds.length);

    // 8. Create subscription plans if they don't exist
    console.log("Creating subscription plans...");
    const subscriptionPlans = [
      {
        name: "Basic",
        description: "Essential features for small businesses",
        price: 9.99,
        billing_cycle: "monthly",
        features: {
          orderLimit: 50,
          productLimit: 25,
          customerSupport: "email",
          analytics: "basic",
        },
      },
      {
        name: "Pro",
        description: "Advanced features for growing businesses",
        price: 19.99,
        billing_cycle: "monthly",
        features: {
          orderLimit: 500,
          productLimit: 100,
          customerSupport: "priority",
          analytics: "advanced",
        },
      },
      {
        name: "Enterprise",
        description: "Complete solution for large businesses",
        price: 49.99,
        billing_cycle: "monthly",
        features: {
          orderLimit: "unlimited",
          productLimit: "unlimited",
          customerSupport: "24/7",
          analytics: "comprehensive",
          dedicatedAccount: true,
        },
      },
    ];

    const planIds: string[] = [];
    for (const [index, plan] of subscriptionPlans.entries()) {
      const planId = await addDoc(collection(db, "subscription_plans"), {
        name: plan.name,
        description: plan.description,
        price: plan.price,
        billing_cycle: plan.billing_cycle,
        features: plan.features,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      }).then((docRef) => docRef.id);

      planIds.push(planId);
    }

    // 9. Create an active subscription for the business
    console.log("Creating business subscription...");
    const now = new Date();
    const expiryDate = new Date();
    expiryDate.setMonth(now.getMonth() + 1); // 1 month subscription

    const subscriptionId = await addDoc(collection(db, "subscriptions"), {
      business_id: businessId,
      plan_id: planIds[1], // Pro plan (index 1)
      status: "active",
      start_date: Timestamp.fromDate(now),
      expiry_date: Timestamp.fromDate(expiryDate),
      auto_renew: true,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    }).then((docRef) => docRef.id);

    // 10. Create subscription payment
    await addDoc(collection(db, "subscription_payments"), {
      subscription_id: subscriptionId,
      billing_account_id: "card-default", // Placeholder
      amount: 19.99, // Pro plan price
      reference: `INV-${Math.floor(Math.random() * 10000)}`,
      payment_date: serverTimestamp(),
    });

    console.log(`Successfully populated database for business ${businessId}`);
    return true;
  } catch (error) {
    console.error("Error populating business data:", error);
    throw error;
  }
};

export default populateBusinessData;