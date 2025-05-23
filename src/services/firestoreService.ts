import {
  doc,
  collection,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  serverTimestamp,
  addDoc,
  startAt,
  endAt,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "@/config/firebase";
import { format } from "date-fns";
import { convertFirestoreData } from "@/utils/dbUtils";
import { useToast } from "@/hooks/use-toast";



// USER FUNCTIONS

export const getUserData = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const updateUserData = async (userId: string, data: any) => {
  try {
    await updateDoc(doc(db, "users", userId), {
      ...data,
      updated_at: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating user data:", error);
    throw error;
  }
};

// BUSINESS FUNCTIONS

export const getBusinessData = async (businessId: string) => {
  try {
    const businessDoc = await getDoc(doc(db, "businesses", businessId));
    if (businessDoc.exists()) {
      return { id: businessDoc.id, ...businessDoc.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching business data:", error);
    throw error;
  }
};

export const updateBusinessData = async (businessId: string, data: any) => {
  try {
    await updateDoc(doc(db, "businesses", businessId), {
      ...data,
      updated_at: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating business data:", error);
    throw error;
  }
};

export const getBusinessByOwnerId = async (ownerId: string) => {
  try {
    const businessesRef = collection(db, "businesses");
    const q = query(businessesRef, where("owner_id", "==", ownerId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const businessDoc = querySnapshot.docs[0];
      return { id: businessDoc.id, ...businessDoc.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching business by owner ID:", error);
    throw error;
  }
};

// BUSINESS CONTACT FUNCTIONS

export const getBusinessContact = async (businessId: string) => {
  try {
    const contactDoc = await getDoc(doc(db, "business_contacts", businessId));
    if (contactDoc.exists()) {
      return { id: contactDoc.id, ...contactDoc.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching business contact:", error);
    throw error;
  }
};

export const updateBusinessContact = async (businessId: string, data: any) => {
  try {
    const contactRef = doc(db, "business_contacts", businessId);
    const contactDoc = await getDoc(contactRef);

    if (contactDoc.exists()) {
      await updateDoc(contactRef, {
        ...data,
        updated_at: serverTimestamp(),
      });
    } else {
      await setDoc(contactRef, {
        ...data,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error("Error updating business contact:", error);
    throw error;
  }
};

// BUSINESS ADDRESS FUNCTIONS

export const getBusinessAddress = async (businessId: string) => {
  try {
    const addressDoc = await getDoc(doc(db, "business_addresses", businessId));
    if (addressDoc.exists()) {
      return { id: addressDoc.id, ...addressDoc.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching business address:", error);
    throw error;
  }
};

export const updateBusinessAddress = async (businessId: string, data: any) => {
  try {
    const addressRef = doc(db, "business_addresses", businessId);
    const addressDoc = await getDoc(addressRef);

    if (addressDoc.exists()) {
      await updateDoc(addressRef, {
        ...data,
        updated_at: serverTimestamp(),
      });
    } else {
      await setDoc(addressRef, {
        ...data,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error("Error updating business address:", error);
    throw error;
  }
};

// CUSTOMER FUNCTIONS

export const addCustomer = async (businessId: string, customerData: any) => {
  try {
    const customerRef = collection(db, "customers");
    const newCustomer = await addDoc(customerRef, {
      business_id: businessId,
      ...customerData,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });

    return newCustomer.id;
  } catch (error) {
    console.error("Error adding customer:", error);
    throw error;
  }
};

export const getCustomer = async (customerId: string) => {
  try {
    const customerDoc = await getDoc(doc(db, "customers", customerId));
    if (customerDoc.exists()) {
      return { id: customerDoc.id, ...customerDoc.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching customer:", error);
    throw error;
  }
};

export const updateCustomer = async (customerId: string, data: any) => {
  try {
    await updateDoc(doc(db, "customers", customerId), {
      ...data,
      updated_at: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
};

export const deleteCustomer = async (customerId: string) => {
  try {
    await deleteDoc(doc(db, "customers", customerId));
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw error;
  }
};

export const getCustomersByBusiness = async (
  businessId: string,
  lastVisible: any = null,
  pageSize: number = 10
) => {
  try {
    const customersRef = collection(db, "customers");
    let q = query(
      customersRef,
      where("business_id", "==", businessId),
      orderBy("created_at", "desc"),
      limit(pageSize)
    );

    if (lastVisible) {
      q = query(q, startAfter(lastVisible));
    }

    const querySnapshot = await getDocs(q);
    const customers: any[] = [];

    querySnapshot.forEach((doc) => {
      customers.push({ id: doc.id, ...doc.data() });
    });

    const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

    return { customers, lastDoc };
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};

// PRODUCT FUNCTIONS

export const addCategory = async (businessId: string, categoryData: any) => {
  try {
    const categoryRef = collection(db, "categories");
    const newCategory = await addDoc(categoryRef, {
      business_id: businessId,
      ...categoryData,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });

    return newCategory.id;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

export const getCategoriesByBusiness = async (businessId: string) => {
  try {
    const categoriesRef = collection(db, "categories");
    const q = query(
      categoriesRef,
      where("business_id", "==", businessId),
      orderBy("name")
    );

    const querySnapshot = await getDocs(q);
    const categories: any[] = [];

    querySnapshot.forEach((doc) => {
      categories.push({ id: doc.id, ...doc.data() });
    });

    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const addProduct = async (businessId: string, productData: any) => {
  try {
    const productRef = collection(db, "products");
    const newProduct = await addDoc(productRef, {
      business_id: businessId,
      ...productData,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });

    return newProduct.id;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

export const addProductOption = async (productId: string, optionData: any) => {
  try {
    const optionRef = collection(db, "product_options");
    const newOption = await addDoc(optionRef, {
      product_id: productId,
      ...optionData,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });

    return newOption.id;
  } catch (error) {
    console.error("Error adding product option:", error);
    throw error;
  }
};

export const getProductsByBusiness = async (
  businessId: string,
  categoryId: string | null = null,
  lastVisible: any = null,
  pageSize: number = 10
) => {
  try {
    const productsRef = collection(db, "products");
    let q;

    if (categoryId) {
      q = query(
        productsRef,
        where("business_id", "==", businessId),
        where("category_id", "==", categoryId),
        orderBy("name"),
        limit(pageSize)
      );
    } else {
      q = query(
        productsRef,
        where("business_id", "==", businessId),
        orderBy("name"),
        limit(pageSize)
      );
    }

    if (lastVisible) {
      q = query(q, startAfter(lastVisible));
    }

    const querySnapshot = await getDocs(q);
    const products: any[] = [];

    for (const docSnapshot of querySnapshot.docs) {
      const productData = { id: docSnapshot.id, ...(docSnapshot.data() as Record<string, any>) };

      // Get product options
      const optionsRef = collection(db, "product_options");
      const optionsQuery = query(
        optionsRef,
        where("product_id", "==", docSnapshot.id)
      );
      const optionsSnapshot = await getDocs(optionsQuery);

      const options: any[] = [];
      optionsSnapshot.forEach((doc) => {
        options.push({ id: doc.id, ...doc.data() });
      });

      products.push({
        ...productData,
        options,
      });
    }

    const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

    return { products, lastDoc };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};




export const addTransaction = async (transactionData: any) => {
  try {
    const transactionRef = collection(db, "transactions");
    const newTransaction = await addDoc(transactionRef, {
      ...transactionData,
      created_at: serverTimestamp(),
    });

    return newTransaction.id;
  } catch (error) {
    console.error("Error adding transaction:", error);
    throw error;
  }
};


// SUBSCRIPTION FUNCTIONS

export const getSubscriptionPlans = async () => {
  try {
    const plansRef = collection(db, "subscription_plans");
    const q = query(plansRef, orderBy("price"));

    const querySnapshot = await getDocs(q);
    const plans: any[] = [];

    querySnapshot.forEach((doc) => {
      plans.push({ id: doc.id, ...doc.data() });
    });

    return plans;
  } catch (error) {
    console.error("Error fetching subscription plans:", error);
    throw error;
  }
};

export const addSubscription = async (subscriptionData: any) => {
  try {
    const subscriptionRef = collection(db, "subscriptions");
    const newSubscription = await addDoc(subscriptionRef, {
      ...subscriptionData,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });

    return newSubscription.id;
  } catch (error) {
    console.error("Error adding subscription:", error);
    throw error;
  }
};

export const getBusinessSubscription = async (businessId: string) => {
  try {
    const subscriptionsRef = collection(db, "subscriptions");
    const q = query(
      subscriptionsRef,
      where("business_id", "==", businessId),
      where("status", "==", "active"),
      orderBy("start_date", "desc"),
      limit(1)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }

    return null;
  } catch (error) {
    console.error("Error fetching business subscription:", error);
    throw error;
  }
};

// This is an extension to firestoreService.ts which updates the getTransactionsByBusiness function 
// to support the dashboard requirements

export const getTransactionsByBusiness = async (
  businessId: string,
  startDate?: Date,
  endDate?: Date,
  lastVisible: any = null,
  pageSize: number = 10
) => {
  try {
    const transactionsRef = collection(db, "transactions");
    let q;

    if (startDate && endDate) {
      q = query(
        transactionsRef,
        where("business_id", "==", businessId),
        where("payment_date", ">=", Timestamp.fromDate(startDate)),
        where("payment_date", "<=", Timestamp.fromDate(endDate)),
        orderBy("payment_date", "desc"),
        limit(pageSize)
      );
    } else {
      q = query(
        transactionsRef,
        where("business_id", "==", businessId),
        orderBy("payment_date", "desc"),
        limit(pageSize)
      );
    }

    if (lastVisible) {
      q = query(q, startAfter(lastVisible));
    }

    const querySnapshot = await getDocs(q);
    const transactions: any[] = [];

    querySnapshot.forEach((doc) => {
      transactions.push({ id: doc.id, ...(doc.data() as Record<string, any>) });
    });

    const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

    return { transactions, lastDoc };
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

// Function to update product's sold count when a transaction occurs
export const updateProductSoldCount = async (
  productId: string, 
  optionId: string, 
  quantity: number
) => {
  try {
    // Get the product option
    const optionRef = doc(db, "product_options", optionId);
    const optionDoc = await getDoc(optionRef);
    
    if (optionDoc.exists()) {
      // Update the sold count
      const currentSold = optionDoc.data().sold || 0;
      await updateDoc(optionRef, {
        sold: currentSold + quantity,
        updated_at: serverTimestamp()
      });
    }
    
    return true;
  } catch (error) {
    console.error("Error updating product sold count:", error);
    throw error;
  }
};

// Function to get the customer name for orders - useful for dashboard displays
export const getCustomerNameById = async (customerId: string) => {
  try {
    const customerDoc = await getDoc(doc(db, "customers", customerId));
    if (customerDoc.exists()) {
      return customerDoc.data().name || "Unknown Customer";
    }
    return "Unknown Customer";
  } catch (error) {
    console.error("Error fetching customer name:", error);
    return "Unknown Customer";
  }
};



// Helper function to get order statistics for a business
export const getOrderStatisticsByBusiness = async (businessId: string) => {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
      where("business_id", "==", businessId)
    );
    
    const querySnapshot = await getDocs(q);
    
    // Initialize statistics
    const stats = {
      total: querySnapshot.size,
      completed: 0,
      pending: 0,
      processing: 0,
      canceled: 0,
      // Date ranges
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
      lastMonth: 0
    };
    
    // Get date boundaries
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Start of current week (Sunday)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    
    // Process each order
    querySnapshot.forEach((doc) => {
      const order = doc.data();
      
      // Count by status
      if (order.status) {
        stats[order.status as keyof typeof stats] += 1;
      }
      
      // Count by date ranges
      const orderDate = order.created_at?.toDate();
      if (orderDate) {
        if (orderDate >= startOfToday) {
          stats.today += 1;
        }
        if (orderDate >= startOfWeek) {
          stats.thisWeek += 1;
        }
        if (orderDate >= startOfMonth) {
          stats.thisMonth += 1;
        }
        if (orderDate >= startOfLastMonth && orderDate <= endOfLastMonth) {
          stats.lastMonth += 1;
        }
      }
    });
    
    return stats;
  } catch (error) {
    console.error("Error getting order statistics:", error);
    throw error;
  }
};


// Update to firestoreService.ts to handle missing index errors

// First, let's create a helper function to handle Firestore index errors
const handleIndexError = (error: any) => {
  console.error("Firestore Index Error:", error);
  
  // Check if the error is related to missing index
  if (error.code === "failed-precondition" && error.message.includes("requires an index")) {
    // Extract the index creation URL from the error message
    const indexUrlMatch = error.message.match(/(https:\/\/console\.firebase\.google\.com\S+)/);
    const indexUrl = indexUrlMatch ? indexUrlMatch[0] : null;
    
    if (indexUrl) {
      console.info("Index creation URL:", indexUrl);
      // Return a friendly error with guidance
      return {
        code: "missing-index",
        message: "This query requires a Firestore index that hasn't been created yet.",
        indexUrl: indexUrl,
        originalError: error
      };
    }
  }
  
  // For other errors, just return the original error
  return error;
};



// Add a function to create or check indices programmatically
export const checkRequiredIndices = () => {
  console.info("Firestore requires the following indices for optimal performance:");
  console.info("1. Collection: orders, Fields: business_id (Ascending), created_at (Descending)");
  console.info("2. Collection: orders, Fields: business_id (Ascending), status (Ascending), created_at (Descending)");
  console.info("3. Collection: transactions, Fields: business_id (Ascending), payment_date (Descending)");
  console.info("4. Collection: transactions, Fields: business_id (Ascending), payment_date (Range)");
  
  return {
    message: "Check the console for index requirements",
    indices: [
      {
        collection: "orders",
        fields: [
          { fieldPath: "business_id", order: "ASCENDING" },
          { fieldPath: "created_at", order: "DESCENDING" }
        ]
      },
      {
        collection: "orders",
        fields: [
          { fieldPath: "business_id", order: "ASCENDING" },
          { fieldPath: "status", order: "ASCENDING" },
          { fieldPath: "created_at", order: "DESCENDING" }
        ]
      },
      {
        collection: "transactions",
        fields: [
          { fieldPath: "business_id", order: "ASCENDING" },
          { fieldPath: "payment_date", order: "DESCENDING" }
        ]
      },
      {
        collection: "transactions",
        fields: [
          { fieldPath: "business_id", order: "ASCENDING" },
          { fieldPath: "payment_date", order: "RANGE" }
        ]
      }
    ]
  };
};

// Add these functions to the existing firestoreService.ts file

// CATEGORY FUNCTIONS (EXTENDED)

export const updateCategory = async (categoryId: string, data: any) => {
  try {
    await updateDoc(doc(db, "categories", categoryId), {
      ...data,
      updated_at: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};



// PRODUCT FUNCTIONS (EXTENDED)

export const updateProduct = async (productId: string, data: any) => {
  try {
    await updateDoc(doc(db, "products", productId), {
      ...data,
      updated_at: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};



export const getProductById = async (productId: string) => {
  try {
    const productDoc = await getDoc(doc(db, "products", productId));
    
    if (!productDoc.exists()) {
      return null;
    }
    
    const productData = { id: productDoc.id, ...productDoc.data() };
    
    // Get product options
    const optionsRef = collection(db, "product_options");
    const optionsQuery = query(optionsRef, where("product_id", "==", productId));
    const optionsSnapshot = await getDocs(optionsQuery);
    
    const options: any[] = [];
    optionsSnapshot.forEach((doc) => {
      options.push({ id: doc.id, ...doc.data() });
    });
    
    return { ...productData, options };
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

// PRODUCT OPTION FUNCTIONS (EXTENDED)

export const updateProductOption = async (optionId: string, data: any) => {
  try {
    await updateDoc(doc(db, "product_options", optionId), {
      ...data,
      updated_at: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating product option:", error);
    throw error;
  }
};

export const deleteProductOption = async (optionId: string) => {
  try {
    await deleteDoc(doc(db, "product_options", optionId));
  } catch (error) {
    console.error("Error deleting product option:", error);
    throw error;
  }
};

export const getProductOption = async (optionId: string) => {
  try {
    const optionDoc = await getDoc(doc(db, "product_options", optionId));
    if (optionDoc.exists()) {
      return { id: optionDoc.id, ...optionDoc.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching product option:", error);
    throw error;
  }
};

// PRODUCT OPTION STATS FUNCTIONS
// These would be used if we want to track sales statistics for options

export const updateProductOptionSales = async (
  optionId: string,
  quantitySold: number
) => {
  try {
    const optionRef = doc(db, "product_options", optionId);
    const optionDoc = await getDoc(optionRef);

    if (optionDoc.exists()) {
      const currentOption = optionDoc.data();
      const currentSold = currentOption.sold || 0;

      await updateDoc(optionRef, {
        sold: currentSold + quantitySold,
        updated_at: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error("Error updating product option sales:", error);
    throw error;
  }
};

// INVENTORY BATCH OPERATIONS
// These functions help with efficient bulk operations

export const batchAddProducts = async (businessId: string, products: any[]) => {
  try {
    const batch = writeBatch(db);
    const productsRef = collection(db, "products");
    
    // Add all products
    const productRefs = products.map(product => {
      const docRef = doc(productsRef);
      batch.set(docRef, {
        business_id: businessId,
        ...product,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
      return docRef;
    });
    
    await batch.commit();
    return productRefs.map(ref => ref.id);
  } catch (error) {
    console.error("Error batch adding products:", error);
    throw error;
  }
};

export const batchUpdateProductOptions = async (options: any[]) => {
  try {
    const batch = writeBatch(db);
    
    // Update all options
    options.forEach(option => {
      const optionRef = doc(db, "product_options", option.id);
      batch.update(optionRef, {
        ...option,
        updated_at: serverTimestamp(),
      });
    });
    
    await batch.commit();
  } catch (error) {
    console.error("Error batch updating product options:", error);
    throw error;
  }
};

// OPTIMIZED QUERY FUNCTIONS
// These functions use efficient query patterns for better performance

export const getProductsWithStats = async (
  businessId: string,
  categoryId: string | null = null,
  lastVisible: any = null,
  pageSize: number = 10
) => {
  try {
    // Get the products first
    const { products, lastDoc } = await getProductsByBusiness(
      businessId,
      categoryId,
      lastVisible,
      pageSize
    );
    
    // For each product, get stats in parallel
    const productsWithStats = await Promise.all(
      products.map(async (product) => {
        // For each option, get its stats
        const optionsWithStats = await Promise.all(
          (product.options || []).map(async (option) => {
            const stats = await getProductOptionStats(option.id);
            return {
              ...option,
              stats: stats || { sold: 0, revenue: 0 }
            };
          })
        );
        
        // Calculate product-level stats
        const totalSold = optionsWithStats.reduce((sum, option) => sum + (option.stats?.sold || 0), 0);
        const totalRevenue = optionsWithStats.reduce((sum, option) => sum + (option.stats?.revenue || 0), 0);
        
        return {
          ...product,
          options: optionsWithStats,
          stats: {
            sold: totalSold,
            revenue: totalRevenue
          }
        };
      })
    );
    
    return { products: productsWithStats, lastDoc };
  } catch (error) {
    console.error("Error getting products with stats:", error);
    throw error;
  }
};

export const getCategoriesWithProductCount = async (businessId: string) => {
  try {
    // Get categories
    const categories = await getCategoriesByBusiness(businessId);
    
    // Get product counts for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const productsRef = collection(db, "products");
        const q = query(
          productsRef,
          where("business_id", "==", businessId),
          where("category_id", "==", category.id)
        );
        
        const querySnapshot = await getDocs(q);
        
        return {
          ...category,
          productCount: querySnapshot.size
        };
      })
    );
    
    return categoriesWithCount;
  } catch (error) {
    console.error("Error getting categories with product count:", error);
    throw error;
  }
};

// SEARCH FUNCTIONS
// For implementing search functionality beyond simple filtering

export const searchProducts = async (
  businessId: string, 
  searchTerm: string,
  lastVisible: any = null,
  pageSize: number = 10
) => {
  try {
    // In Firestore, we can't do full-text search easily
    // This is a simple implementation using startsWith and endsWith queries
    
    const productsRef = collection(db, "products");
    let q = query(
      productsRef,
      where("business_id", "==", businessId),
      orderBy("name"),
      // We use startsWith to find products that start with the search term
      startAt(searchTerm),
      endAt(searchTerm + '\uf8ff'),
      limit(pageSize)
    );
    
    if (lastVisible) {
      q = query(q, startAfter(lastVisible));
    }
    
    const querySnapshot = await getDocs(q);
    const products: any[] = [];
    
    for (const docSnapshot of querySnapshot.docs) {
      const productData = { id: docSnapshot.id, ...(docSnapshot.data() as Record<string, any>) };
      
      // Get product options
      const optionsRef = collection(db, "product_options");
      const optionsQuery = query(
        optionsRef,
        where("product_id", "==", docSnapshot.id)
      );
      const optionsSnapshot = await getDocs(optionsQuery);
      
      const options: any[] = [];
      optionsSnapshot.forEach((doc) => {
        options.push({ id: doc.id, ...doc.data() });
      });
      
      products.push({
        ...productData,
        options,
      });
    }
    
    const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
    
    return { products, lastDoc };
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};

export const updateProductStats = async (productId: string, data: any) => {
  try {
    const statsRef = doc(db, "product_stats", productId);
    const statsDoc = await getDoc(statsRef);

    if (statsDoc.exists()) {
      await updateDoc(statsRef, {
        ...data,
        updated_at: serverTimestamp(),
      });
    } else {
      await setDoc(statsRef, {
        product_id: productId,
        ...data,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error("Error updating product stats:", error);
    throw error;
  }
};

// Create or update product option stats
export const updateProductOptionStats = async (optionId: string, data: any) => {
  try {
    const statsRef = doc(db, "product_option_stats", optionId);
    const statsDoc = await getDoc(statsRef);

    if (statsDoc.exists()) {
      await updateDoc(statsRef, {
        ...data,
        updated_at: serverTimestamp(),
      });
    } else {
      await setDoc(statsRef, {
        option_id: optionId,
        ...data,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error("Error updating product option stats:", error);
    throw error;
  }
};

// Get product option stats
export const getProductOptionStats = async (optionId: string) => {
  try {
    const statsDoc = await getDoc(doc(db, "product_option_stats", optionId));
    if (statsDoc.exists()) {
      return { id: statsDoc.id, ...statsDoc.data() };
    }
    return { id: optionId, sold: 0, revenue: 0 }; // Default stats if none exist
  } catch (error) {
    console.error("Error fetching product option stats:", error);
    throw error;
  }
};


interface SalesStats {
  sold: number;
  revenue: number;
  created_at?: any;
  updated_at?: any;
  option_id?: string;
}


export const updateSalesDataForOrder = async (orderItems: any[]) => {
  try {
    const batch = writeBatch(db);

    // Group items by product option for efficiency
    const optionSales: Record<string, { sold: number; revenue: number }> = {};

    // Process each order item
    for (const item of orderItems) {
      const { product_option_id, quantity, price } = item;

      if (!optionSales[product_option_id]) {
        optionSales[product_option_id] = {
          sold: 0,
          revenue: 0,
        };
      }

      optionSales[product_option_id].sold += quantity;
      optionSales[product_option_id].revenue += price * quantity;
    }

    // Update stats for each option
    for (const [optionId, stats] of Object.entries(optionSales)) {
      // Get current stats
      const statsRef = doc(db, "product_option_stats", optionId);
      const statsDoc = await getDoc(statsRef);

      if (statsDoc.exists()) {
        // Type assertion to fix the TypeScript error
        const currentStats = statsDoc.data() as SalesStats;

        batch.update(statsRef, {
          // Use nullish coalescing to handle undefined values
          sold: (currentStats.sold ?? 0) + stats.sold,
          revenue: (currentStats.revenue ?? 0) + stats.revenue,
          updated_at: serverTimestamp(),
        });
      } else {
        batch.set(statsRef, {
          option_id: optionId,
          sold: stats.sold,
          revenue: stats.revenue,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        });
      }

      // Also update the stock quantity on the product option
      const optionRef = doc(db, "product_options", optionId);
      const optionDoc = await getDoc(optionRef);

      if (optionDoc.exists()) {
        const currentOption = optionDoc.data();
        const newStock = Math.max(0, (currentOption.stock || 0) - stats.sold);

        batch.update(optionRef, {
          stock: newStock,
          updated_at: serverTimestamp(),
        });
      }
    }

    // Commit all updates in a single batch
    await batch.commit();
  } catch (error) {
    console.error("Error updating sales data:", error);
    throw error;
  }
};





// Order Statuses functions




/**
 * Enhanced deleteProduct function that also deletes all associated product options
 * @param productId The ID of the product to delete
 */
export const deleteProduct = async (productId: string) => {
  try {
    // Create a batch operation for atomic updates
    const batch = writeBatch(db);

    // Step 1: Find all product options associated with this product
    const optionsRef = collection(db, "product_options");
    const optionsQuery = query(
      optionsRef,
      where("product_id", "==", productId)
    );
    const optionsSnapshot = await getDocs(optionsQuery);

    // Step 2: Add all option deletions to the batch
    optionsSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Step 3: Find and delete any product option stats
    const statsRef = collection(db, "product_option_stats");
    for (const optionDoc of optionsSnapshot.docs) {
      const optionId = optionDoc.id;
      const statsDoc = doc(statsRef, optionId);
      const statsSnapshot = await getDoc(statsDoc);

      if (statsSnapshot.exists()) {
        batch.delete(statsDoc);
      }
    }

    // Step 4: Delete the product itself
    const productRef = doc(db, "products", productId);
    batch.delete(productRef);

    // Execute all the deletions in a single batch
    await batch.commit();

    console.log(
      `Product ${productId} and all associated options deleted successfully`
    );
  } catch (error) {
    console.error("Error deleting product and options:", error);
    throw error;
  }
};

/**
 * Enhanced deleteCategory function that also deletes all products in the category and their options
 * @param categoryId The ID of the category to delete
 */
export const deleteCategory = async (categoryId: string) => {
  try {
    // Create a batch operation for atomic updates
    const batch = writeBatch(db);

    // Step 1: Find all products in this category
    const productsRef = collection(db, "products");
    const productsQuery = query(
      productsRef,
      where("category_id", "==", categoryId)
    );
    const productsSnapshot = await getDocs(productsQuery);

    // Step 2: For each product, find and delete all its options and stats
    for (const productDoc of productsSnapshot.docs) {
      const productId = productDoc.id;

      // Step 2a: Find all options for this product
      const optionsRef = collection(db, "product_options");
      const optionsQuery = query(
        optionsRef,
        where("product_id", "==", productId)
      );
      const optionsSnapshot = await getDocs(optionsQuery);

      // Step 2b: Delete all options
      optionsSnapshot.forEach((optionDoc) => {
        batch.delete(optionDoc.ref);
      });

      // Step 2c: Delete any option stats
      for (const optionDoc of optionsSnapshot.docs) {
        const optionId = optionDoc.id;
        const statsDoc = doc(db, "product_option_stats", optionId);
        const statsSnapshot = await getDoc(statsDoc);

        if (statsSnapshot.exists()) {
          batch.delete(statsDoc);
        }
      }

      // Step 2d: Delete the product
      batch.delete(productDoc.ref);
    }

    // Step 3: Delete the category itself
    const categoryRef = doc(db, "categories", categoryId);
    batch.delete(categoryRef);

    // Execute all the deletions in a single batch
    await batch.commit();

    console.log(
      `Category ${categoryId} and all associated products and options deleted successfully`
    );
  } catch (error) {
    console.error("Error deleting category and products:", error);
    throw error;
  }
};

/**
 * Note: For large categories with many products, the batch might exceed the 500 operations limit.
 * In such cases, we need to use multiple batches or a different approach.
 * Here's an implementation that handles large numbers of products:
 */
export const deleteLargeCategory = async (categoryId: string) => {
  try {
    const BATCH_LIMIT = 450; // Keeping some room below Firestore's 500 limit
    let totalDeleted = 0;
    let hasMoreToDelete = true;

    while (hasMoreToDelete) {
      // Create a new batch for each chunk
      const batch = writeBatch(db);
      let operationCount = 0;

      // Step 1: Get a limited number of products
      const productsRef = collection(db, "products");
      const productsQuery = query(
        productsRef,
        where("category_id", "==", categoryId),
        limit(BATCH_LIMIT / 2) // Assuming each product has at least one option
      );
      const productsSnapshot = await getDocs(productsQuery);

      if (productsSnapshot.empty) {
        hasMoreToDelete = false;

        // If this is the first iteration and no products found, delete the category
        if (totalDeleted === 0) {
          const categoryRef = doc(db, "categories", categoryId);
          batch.delete(categoryRef);
          operationCount++;
        }
      } else {
        // Process each product
        for (const productDoc of productsSnapshot.docs) {
          const productId = productDoc.id;

          // Step 2a: Find options for this product
          const optionsRef = collection(db, "product_options");
          const optionsQuery = query(
            optionsRef,
            where("product_id", "==", productId)
          );
          const optionsSnapshot = await getDocs(optionsQuery);

          // Check if adding these operations would exceed our batch limit
          if (operationCount + optionsSnapshot.size + 1 > BATCH_LIMIT) {
            // Stop processing this product, we'll get it in the next batch
            break;
          }

          // Step 2b: Delete options
          optionsSnapshot.forEach((optionDoc) => {
            batch.delete(optionDoc.ref);
            operationCount++;
          });

          // Step 2c: Delete the product
          batch.delete(productDoc.ref);
          operationCount++;
          totalDeleted++;
        }

        // If we have reached the end and all products are deleted, delete the category
        if (productsSnapshot.size < BATCH_LIMIT / 2) {
          hasMoreToDelete = false;
          const categoryRef = doc(db, "categories", categoryId);
          batch.delete(categoryRef);
          operationCount++;
        }
      }

      // Execute the batch if we have operations
      if (operationCount > 0) {
        await batch.commit();
        console.log(`Batch completed: ${operationCount} operations`);
      } else {
        hasMoreToDelete = false;
      }
    }

    console.log(
      `Category ${categoryId} and all associated data deleted successfully. Total items: ${totalDeleted}`
    );
  } catch (error) {
    console.error("Error in batch deletion of category:", error);
    throw error;
  }
};

// Add these functions to your existing firestoreService.ts file

// ORDER FUNCTIONS


export const getOrder = async (orderId: string) => {
  try {
    const orderDoc = await getDoc(doc(db, "orders", orderId));
    if (orderDoc.exists()) {
      const orderData = { id: orderDoc.id, ...orderDoc.data() };

      // Get order items
      const itemsRef = collection(db, "orders", orderId, "items");
      const itemsSnapshot = await getDocs(itemsRef);

      const items: any[] = [];
      itemsSnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });

      return { ...orderData, items };
    }
    return null;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};



export const deleteOrder = async (orderId: string) => {
  try {
    // Delete order items subcollection first
    const itemsRef = collection(db, "orders", orderId, "items");
    const itemsSnapshot = await getDocs(itemsRef);
    
    const deleteItemPromises = itemsSnapshot.docs.map(async (doc) => {
      return deleteDoc(doc.ref);
    });
    
    await Promise.all(deleteItemPromises);
    
    // Then delete the order document
    await deleteDoc(doc(db, "orders", orderId));
    
    return true;
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
};







// Add these functions to your existing firestoreService.ts file

// ORDER STATUS FUNCTIONS
export const getOrderStatusesByBusiness = async (businessId: string) => {
  try {
    const statusesRef = collection(db, "order_statuses");
    const q = query(
      statusesRef,
      where("business_id", "==", businessId),
      orderBy("name")
    );

    const querySnapshot = await getDocs(q);
    const statuses: any[] = [];

    querySnapshot.forEach((doc) => {
      statuses.push({ id: doc.id, ...doc.data() });
    });

    return statuses;
  } catch (error) {
    console.error("Error fetching order statuses:", error);
    throw error;
  }
};

export const getOrderStatus = async (statusId: string) => {
  try {
    const statusDoc = await getDoc(doc(db, "order_statuses", statusId));
    if (statusDoc.exists()) {
      return { id: statusDoc.id, ...statusDoc.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching order status:", error);
    throw error;
  }
};

// Add this to firestoreService.ts

export const getStatusColorByName = async (
  businessId: string,
  statusName: string
): Promise<string> => {
  try {
    // Default colors as fallback
    const defaultColors: Record<string, string> = {
      "pending": "#f59e0b",    // Yellow
      "processing": "#3b82f6", // Blue
      "completed": "#10b981",  // Green
      "canceled": "#ef4444",   // Red
      "default": "#6b7280"     // Gray (fallback)
    };

    // Normalize the status name for comparison
    const normalizedStatusName = statusName.toLowerCase();
    
    // Check default colors first (case insensitive)
    const defaultKey = Object.keys(defaultColors).find(
      key => key.toLowerCase() === normalizedStatusName
    );
    
    if (defaultKey && !businessId) {
      return defaultColors[defaultKey];
    }
    
    // If no business ID, return default color
    if (!businessId) {
      return defaultColors.default;
    }

    // Query Firestore for custom statuses
    const statusesRef = collection(db, "order_statuses");
    const q = query(
      statusesRef,
      where("business_id", "==", businessId),
      // Using a separate where clause for case insensitivity would require a custom index
      // Filtering will be done in memory after fetching results
      limit(20) // Limiting to prevent excessive reads
    );

    const querySnapshot = await getDocs(q);
    
    // Find the matching status (case insensitive)
    for (const doc of querySnapshot.docs) {
      const status = doc.data();
      if (status.name.toLowerCase() === normalizedStatusName) {
        return status.color;
      }
    }
    
    // If no custom status found, check default colors again
    if (defaultKey) {
      return defaultColors[defaultKey];
    }
    
    // Fallback to default color
    return defaultColors.default;
  } catch (error) {
    console.error("Error fetching status color:", error);
    // Return a default color if there's an error
    return "#6b7280"; // Gray
  }
};

/**
 * Get status color by status name (cached version for improved performance)
 * Uses a memory cache to reduce Firestore reads
 */
// Create a cache to store colors by business and status name
const colorCache: Record<string, Record<string, { color: string, timestamp: number }>> = {};
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

export const getStatusColorByNameCached = async (
  businessId: string,
  statusName: string
): Promise<string> => {
  // Normalize status name for consistency
  const normalizedStatusName = statusName.toLowerCase();
  
  // Check cache first
  if (
    businessId &&
    colorCache[businessId] &&
    colorCache[businessId][normalizedStatusName] &&
    Date.now() - colorCache[businessId][normalizedStatusName].timestamp < CACHE_EXPIRY
  ) {
    return colorCache[businessId][normalizedStatusName].color;
  }
  
  // Fetch from Firestore if not in cache or expired
  const color = await getStatusColorByName(businessId, statusName);
  
  // Update cache
  if (businessId) {
    if (!colorCache[businessId]) {
      colorCache[businessId] = {};
    }
    
    colorCache[businessId][normalizedStatusName] = {
      color,
      timestamp: Date.now()
    };
  }
  
  return color;
};
























// Add these functions to your existing firestoreService.ts file

// Type definitions for Order
export interface Order {
  id: string;
  business_id: string;
  customer: {
    name: string;
    email?: string;
    phone?: string;
    id?: string; // Optional reference to customers collection
  };
  status: string;
  shipping_method: string;
  shipping_address?: string;
  city?: string;
  subtotal: number;
  shipping_fee: number;
  tax: number;
  total: number;
  payment_method: string;
  payment_status: string;
  payment_reference?: string;
  notes?: string;
  item_count: number;
  tracking_number?: string;
  created_at: any; // Firestore timestamp
  updated_at: any; // Firestore timestamp
  completed_at?: any; // Optional Firestore timestamp
}

// Type definitions for OrderItem
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_option_id?: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  image?: string;
  created_at: any; // Firestore timestamp
}

/**
 * Add a new order to Firestore
 */
export const addOrder = async (orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const orderRef = collection(db, "orders");
    const newOrder = await addDoc(orderRef, {
      ...orderData,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });

    return newOrder.id;
  } catch (error) {
    console.error("Error adding order:", error);
    throw error;
  }
};


/**
 * Get order status counts for business dashboard
 */
export const getOrderStatusCounts = async (businessId: string) => {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("business_id", "==", businessId));
    const querySnapshot = await getDocs(q);

    const counts = {
      total: 0,
      pending: 0,
      processing: 0,
      completed: 0,
      canceled: 0,
    };

    querySnapshot.forEach((doc) => {
      const orderData = doc.data();
      counts.total++;

      if (orderData.status === "pending") counts.pending++;
      else if (orderData.status === "processing") counts.processing++;
      else if (orderData.status === "completed") counts.completed++;
      else if (orderData.status === "canceled") counts.canceled++;
    });

    return counts;
  } catch (error) {
    console.error("Error fetching order counts:", error);
    throw error;
  }
};

/**
 * Get recent orders for a business
 */
export const getRecentOrders = async (businessId: string, pageSize: number = 5) => {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
      where("business_id", "==", businessId),
      orderBy("created_at", "desc"),
      limit(pageSize)
    );

    const querySnapshot = await getDocs(q);
    const orders: any[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as Record<string, any>;
      if (data) {
        orders.push({ id: doc.id, ...data });
      }
    });

    return orders;
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    throw error;
  }
};

/**
 * Get orders by date range
 */
export const getOrdersByDateRange = async (
  businessId: string,
  startDate: Date,
  endDate: Date
) => {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
      where("business_id", "==", businessId),
      where("created_at", ">=", Timestamp.fromDate(startDate)),
      where("created_at", "<=", Timestamp.fromDate(endDate)),
      orderBy("created_at", "desc")
    );

    const querySnapshot = await getDocs(q);
    const orders: any[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as Record<string, any>;
      orders.push({ id: doc.id, ...data });
    });

    return orders;
  } catch (error) {
    console.error("Error fetching orders by date range:", error);
    throw error;
  }
};

/**
 * Get sales analytics data (daily, weekly, monthly)
 */
export const getSalesAnalytics = async (
  businessId: string,
  period: "daily" | "weekly" | "monthly",
  startDate: Date,
  endDate: Date
) => {
  try {
    const orders = await getOrdersByDateRange(businessId, startDate, endDate);

    // Process orders into analytics data based on period
    const salesData: { date: string; total: number }[] = [];
    
    if (period === "daily") {
      // Group by day
      const groupedByDay = groupBy(orders, (order) => {
        const date = order.created_at.toDate();
        return format(date, "yyyy-MM-dd");
      });

      Object.entries(groupedByDay).forEach(([date, orders]) => {
        const total = (orders as any[]).reduce((sum, order) => sum + order.total, 0);
        salesData.push({ date, total });
      });
    } else if (period === "weekly") {
      // Group by week
      const groupedByWeek = groupBy(orders, (order) => {
        const date = order.created_at.toDate();
        return `${format(date, "yyyy")}-w${format(date, "w")}`;
      });

      Object.entries(groupedByWeek).forEach(([week, orders]) => {
        const total = (orders as { total: number }[]).reduce((sum, order) => sum + order.total, 0);
        salesData.push({ date: week, total });
      });
    } else if (period === "monthly") {
      // Group by month
      const groupedByMonth = groupBy(orders, (order) => {
        const date = order.created_at.toDate();
        return format(date, "yyyy-MM");
      });

      Object.entries(groupedByMonth).forEach(([month, orders]) => {
        const total = (orders as { total: number }[]).reduce((sum, order) => sum + order.total, 0);
        salesData.push({ date: month, total });
      });
    }

    return salesData.sort((a, b) => a.date.localeCompare(b.date));
  } catch (error) {
    console.error("Error fetching sales analytics:", error);
    throw error;
  }
};

// Helper function to group array items by a key
function groupBy(array: any[], keyGetter: (item: any) => string) {
  return array.reduce((acc, item) => {
    const key = keyGetter(item);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<string, any[]>);
}

// Update to firestoreService.ts to handle missing indexes

/**
 * Get order statuses for a business
 */
export const getOrderStatuses = async (businessId: string) => {
  try {
    // Create a basic query without ordering first
    const statusesRef = collection(db, "order_statuses");
    let q = query(statusesRef, where("business_id", "==", businessId));
    
    // Try the basic query
    const querySnapshot = await getDocs(q);
    const statuses: any[] = [];
    
    querySnapshot.forEach((doc) => {
      statuses.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort in memory instead of in the query
    statuses.sort((a, b) => {
      // First sort by default status (defaults first)
      if (a.is_default && !b.is_default) return -1;
      if (!a.is_default && b.is_default) return 1;
      
      // Then by name
      return a.name.localeCompare(b.name);
    });
    
    return statuses;
  } catch (error) {
    console.error("Error fetching order statuses:", error);
    
    // If it's an indexing error, let's provide a more helpful message
    if (error instanceof Error && error.toString().includes("requires an index")) {
      console.error("This error is due to a missing Firestore index. Please click the URL above to create the required index.");
    }
    
    throw error;
  }
};

/**
 * Get orders for a business with optional filters
 */
export const getOrdersByBusiness = async (
  businessId: string,
  status: string | null = null,
  lastVisible: any = null,
  pageSize: number = 10
) => {
  try {
    const ordersRef = collection(db, "orders");
    let q;

    // Basic query without ordering first to avoid index issues
    if (status) {
      q = query(
        ordersRef,
        where("business_id", "==", businessId),
        where("status", "==", status)
      );
    } else {
      q = query(
        ordersRef,
        where("business_id", "==", businessId)
      );
    }

    // Execute the basic query
    const querySnapshot = await getDocs(q);
    const orders: any[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as Record<string, any>;
      if (data) {
        orders.push({ id: doc.id, ...data });
      }
    });

    // Sort in memory instead of in the query
    // This avoids the need for complex indexes
    orders.sort((a, b) => {
      // Convert timestamps to dates if needed
      const dateA = a.created_at instanceof Date ? a.created_at : a.created_at?.toDate?.() || new Date(0);
      const dateB = b.created_at instanceof Date ? b.created_at : b.created_at?.toDate?.() || new Date(0);
      
      // Sort descending by date (newest first)
      return dateB.getTime() - dateA.getTime();
    });

    // Handle pagination manually
    let paginatedOrders = orders;
    let lastDoc = null;
    
    if (lastVisible) {
      // Find the index of the last visible document
      const lastVisibleIndex = orders.findIndex(order => order.id === lastVisible.id);
      if (lastVisibleIndex !== -1) {
        // Get the next batch of orders
        paginatedOrders = orders.slice(lastVisibleIndex + 1, lastVisibleIndex + 1 + pageSize);
      } else {
        paginatedOrders = [];
      }
    } else {
      // First page
      paginatedOrders = orders.slice(0, pageSize);
    }
    
    // Set the last document for the next pagination
    if (paginatedOrders.length > 0) {
      lastDoc = {
        id: paginatedOrders[paginatedOrders.length - 1].id
      };
    }

    return { orders: paginatedOrders, lastDoc };
  } catch (error) {
    console.error("Error fetching orders:", error);
    
    // If it's an indexing error, let's provide a more helpful message
    if (error instanceof Error && error.toString().includes("requires an index")) {
      console.error("This error is due to a missing Firestore index. Please click the URL above to create the required index.");
    }
    
    throw error;
  }
};

/**
 * Add a new order status
 */
export const addOrderStatus = async (statusData: any) => {
  try {
    const statusRef = collection(db, "order_statuses");
    const newStatus = await addDoc(statusRef, {
      ...statusData,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });

    return newStatus.id;
  } catch (error) {
    console.error("Error adding order status:", error);
    throw error;
  }
};

/**
 * Update an order status
 */


/**
 * Delete an order status
 */
export const deleteOrderStatus = async (statusId: string) => {
  try {
    await deleteDoc(doc(db, "order_statuses", statusId));
  } catch (error) {
    console.error("Error deleting order status:", error);
    throw error;
  }
};

// Fixed function to get order items from subcollection
export const getOrderItemsByOrder = async (orderId: string) => {
  try {
    // Targeting the subcollection 'items' under the specific order document
    const itemsRef = collection(db, "orders", orderId, "items");
    const q = query(itemsRef, orderBy("created_at", "asc"));
    
    const querySnapshot = await getDocs(q);
    const items: any[] = [];

    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });

    return items;
  } catch (error) {
    console.error("Error fetching order items:", error);
    throw error;
  }
};

// Alternative implementation if items are stored in a top-level collection
export const getOrderItemsByOrderAlternative = async (orderId: string) => {
  try {
    // Target top-level collection 'order_items' and filter by order_id
    const itemsRef = collection(db, "order_items");
    const q = query(
      itemsRef,
      where("order_id", "==", orderId),
      orderBy("created_at", "asc")
    );
    
    const querySnapshot = await getDocs(q);
    const items: any[] = [];

    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });

    return items;
  } catch (error) {
    console.error("Error fetching order items:", error);
    throw error;
  }
};

// Implementation for retrieving orders with their items in a single function
export const getOrderWithItems = async (orderId: string) => {
  try {
    // First, get the order document
    const orderDoc = await getDoc(doc(db, "orders", orderId));
    
    if (!orderDoc.exists()) {
      return null;
    }
    
    const orderData = { id: orderDoc.id, ...orderDoc.data() };
    
    // Then, get the items subcollection
    const itemsRef = collection(db, "orders", orderId, "items");
    const itemsSnapshot = await getDocs(query(itemsRef, orderBy("created_at", "asc")));
    
    const items: any[] = [];
    itemsSnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });
    
    // Return combined data
    return {
      ...orderData,
      items
    };
  } catch (error) {
    console.error("Error fetching order with items:", error);
    throw error;
  }
};

// Helper function to add items to an order
export const addOrderItems = async (orderId: string, items: any[]) => {
  try {
    const batch = writeBatch(db);
    
    items.forEach((item) => {
      const itemRef = doc(collection(db, "orders", orderId, "items"));
      batch.set(itemRef, {
        ...item,
        created_at: serverTimestamp()
      });
    });
    
    await batch.commit();
  } catch (error) {
    console.error("Error adding order items:", error);
    throw error;
  }
};


// Enhanced Order Functions with Proper Customer Handling



// Get a single order with detailed customer information if available
export const getOrderWithCustomerDetails = async (orderId: string) => {
  try {
    // Get the order document
    const orderDoc = await getDoc(doc(db, "orders", orderId));
    
    if (!orderDoc.exists()) {
      return null;
    }
    
    // Convert order data
    const orderData = convertFirestoreData({ 
      id: orderDoc.id, 
      ...(orderDoc.data() || {}) 
    });
    
    // If the order has a customer.id reference, fetch the full customer data
    if (orderData.customer && orderData.customer.id) {
      try {
        const customerDoc = await getDoc(doc(db, "customers", orderData.customer.id));
        
        if (customerDoc.exists()) {
          const customerData = convertFirestoreData({
            id: customerDoc.id,
            ...customerDoc.data()
          });
          
          // Merge customer data from the customers collection with the embedded customer data
          // keeping any fields that might only exist in the order's customer object
          orderData.customer = {
            ...orderData.customer,
            ...customerData,
            // Ensure the embedded customer fields take precedence if they differ
            // (e.g., shipping address that might be different from the customer's default)
            name: orderData.customer.name || customerData.name,
            email: orderData.customer.email || customerData.email,
            phone: orderData.customer.phone || customerData.phone,
          };
          
          // Add a flag to indicate this customer has full details
          orderData.customer.hasFullDetails = true;
        }
      } catch (customerError) {
        console.error("Error fetching customer details:", customerError);
        // Continue with the order data we have, even if customer fetch fails
      }
    }
    
    // Get order items
    const itemsSnapshot = await getDocs(
      query(collection(db, "orders", orderId, "items"), orderBy("created_at"))
    );
    
    const items = itemsSnapshot.docs.map(doc => 
      convertFirestoreData({ id: doc.id, ...doc.data() })
    );
    
    return {
      ...orderData,
      items
    };
  } catch (error) {
    console.error("Error fetching order with customer details:", error);
    throw error;
  }
};

// Get orders for a business with enhanced customer handling
export const getOrdersWithCustomerDetails = async (
  businessId: string,
  status: string | null = null,
  lastVisible: any = null,
  pageSize: number = 10
) => {
  try {
    // Build the base query
    const ordersRef = collection(db, "orders");
    let q;
    
    if (status) {
      q = query(
        ordersRef,
        where("business_id", "==", businessId),
        where("status", "==", status),
        orderBy("created_at", "desc"),
        limit(pageSize)
      );
    } else {
      q = query(
        ordersRef,
        where("business_id", "==", businessId),
        orderBy("created_at", "desc"),
        limit(pageSize)
      );
    }
    
    // Add pagination if lastVisible is provided
    if (lastVisible) {
      q = query(q, startAfter(lastVisible));
    }
    
    // Execute the query
    const querySnapshot = await getDocs(q);
    const orders: any[] = [];
    
    // Process each order document
    for (const orderDoc of querySnapshot.docs) {
      

      const orderData = convertFirestoreData({
        id: orderDoc.id,
        ...((orderDoc.data() ?? {}) as Record<string, any>),
      });
      
      // For each order, if there's a customer.id, try to fetch full customer data
      if (orderData.customer && orderData.customer.id) {
        try {
          const customerDoc = await getDoc(doc(db, "customers", orderData.customer.id));
          
          if (customerDoc.exists()) {
            const customerData = convertFirestoreData({
              id: customerDoc.id,
              ...customerDoc.data()
            });
            
            // Merge customer data, with order's embedded customer data taking precedence
            orderData.customer = {
              ...orderData.customer,
              ...customerData,
              name: orderData.customer.name || customerData.name,
              email: orderData.customer.email || customerData.email,
              phone: orderData.customer.phone || customerData.phone,
            };
          }
        } catch (customerError) {
          console.error(`Error fetching customer for order ${orderDoc.id}:`, customerError);
          // Continue with the order's embedded customer data
        }
      }
      
      // Add the order to our results
      orders.push(orderData);
    }
    
    // Return orders and the last document for pagination
    const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
    return { orders, lastDoc };
    
  } catch (error) {
    console.error("Error fetching orders with customer details:", error);
    throw error;
  }
};

// Get orders for a specific customer
export const getOrdersByCustomer = async (
  businessId: string,
  customerId: string,
  lastVisible: any = null,
  pageSize: number = 10
) => {
  try {
    const ordersRef = collection(db, "orders");
    let q = query(
      ordersRef,
      where("business_id", "==", businessId),
      where("customer.id", "==", customerId),
      orderBy("created_at", "desc"),
      limit(pageSize)
    );
    
    if (lastVisible) {
      q = query(q, startAfter(lastVisible));
    }
    
    const querySnapshot = await getDocs(q);
    const orders = querySnapshot.docs.map(doc => 
      convertFirestoreData({ id: doc.id, ...doc.data() })
    );
    
    const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
    return { orders, lastDoc };
    
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    throw error;
  }
};


// Add this to your firestoreService.ts file

// Order Status Update Function
export const updateOrderStatus = async (
  orderId: string,
  status: string,
  notes?: string
) => {
  try {
    const orderRef = doc(db, "orders", orderId);

    const updateData: any = {
      status,
      updated_at: serverTimestamp(),
    };

    // Add notes if provided
    if (notes) {
      updateData.notes = notes;
    }

    // If status is completed, add completed_at timestamp
    if (status === "completed") {
      updateData.completed_at = serverTimestamp();
    }

    await updateDoc(orderRef, updateData);

    // Create a record in order_history
    const historyRef = collection(db, "order_history");
    await addDoc(historyRef, {
      order_id: orderId,
      status,
      notes: notes || "",
      created_by: auth.currentUser?.uid || "",
      created_at: serverTimestamp(),
    });

    // Optional: Send notification to customer
    if (notes) {
      // Add notification logic here if needed
    }

    return true;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

// Add an additional helper to get order history
export const getOrderHistory = async (orderId: string) => {
  try {
    const historyRef = collection(db, "order_history");
    const q = query(
      historyRef,
      where("order_id", "==", orderId),
      orderBy("created_at", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const history: any[] = [];

    querySnapshot.forEach((doc) => {
      history.push({ id: doc.id, ...doc.data() });
    });

    return history;
  } catch (error) {
    console.error("Error fetching order history:", error);
    throw error;
  }
};

export const getOrderItems = async (orderId: string) => {
  try {
    const itemsRef = collection(db, "orders", orderId, "items");
    const itemsSnapshot = await getDocs(
      query(itemsRef, orderBy("created_at", "asc"))
    );
    return itemsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() || {}),
    }));
  } catch (error) {
    console.error("Error fetching order items:", error);
    return [];
  }
};



export const createOrder = async (orderData, orderItems = []) => {
  try {
    // Validate required fields
    if (!orderData.customer || !orderData.customer.name) {
      throw new Error("Customer name is required");
    }

    // Get the authenticated user's business ID
    if (!auth.currentUser) {
      throw new Error("You must be logged in to create an order");
    }
    
    // Get business ID
    const businessRef = collection(db, "businesses");
    const businessQuery = query(businessRef, where("owner_id", "==", auth.currentUser.uid));
    const businessSnapshot = await getDocs(businessQuery);
    
    if (businessSnapshot.empty) {
      throw new Error("No business found for your account");
    }
    
    const businessId = businessSnapshot.docs[0].id;
    
    // Create new order document
    const orderRef = doc(collection(db, "orders"));
    const now = serverTimestamp();
    
    // Calculate totals
    const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingFee = orderData.shipping_method === 'delivery' ? subtotal * 0.1 : 0;
    const tax = subtotal * 0.05;
    const total = subtotal + shippingFee + tax;
    
    // Prepare full order data
    const orderDoc = {
      business_id: businessId,
      customer: orderData.customer,
      status: orderData.status || "pending",
      shipping_method: orderData.shipping_method || "delivery",
      shipping_address: orderData.shipping_address,
      city: orderData.city,
      subtotal,
      shipping_fee: shippingFee,
      tax,
      total,
      payment_method: orderData.payment_method || "cash",
      payment_status: orderData.payment_status || "unpaid",
      payment_reference: orderData.payment_reference,
      notes: orderData.notes,
      item_count: orderItems.length,
      created_at: now,
      updated_at: now
    };
    
    // Create the order document
    await setDoc(orderRef, orderDoc);
    
    // Create order items as subcollection documents
    if (orderItems && orderItems.length > 0) {
      const batch = writeBatch(db);
      
      for (const item of orderItems) {
        const itemRef = doc(collection(db, "orders", orderRef.id, "items"));
        batch.set(itemRef, {
          product_id: item.product_id,
          product_option_id: item.product_option_id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity,
          image: item.image,
          created_at: now
        });
      }
      
      await batch.commit();
    }
    
    // Add entry to order history
    await addDoc(collection(db, "order_history"), {
      order_id: orderRef.id,
      status: orderDoc.status,
      notes: "Order created",
      created_by: auth.currentUser.uid,
      created_at: now
    });
    
    // Return the order with ID
    return {
      id: orderRef.id,
      ...orderDoc,
      created_at: new Date(), // Convert serverTimestamp to Date for immediate use
      updated_at: new Date()
    };
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

export const getOrderStatusColorByName = async (
  businessId: string,
  statusName: string
) => {
  try {
    const statusesRef = collection(db, "order_statuses");
    const q = query(
      statusesRef,
      where("business_id", "==", businessId),
      where("name", "==", statusName)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Get the first status that matches the name
      const statusDoc = querySnapshot.docs[0];
      const statusData = statusDoc.data();
      return statusData.color;
    }

    // If no status found with this name, return a default color
    return "#808080"; // Default gray color
  } catch (error) {
    console.error("Error fetching order status color:", error);
    throw error;
  }
};


