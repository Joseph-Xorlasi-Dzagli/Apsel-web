import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useBusiness } from "@/hooks/useBusiness";
import {
  getProductsByBusiness,
  getCategoriesByBusiness,
  addCategory,
  updateCategory,
  deleteCategory,
  addProduct,
  updateProduct,
  addProductOption,
  updateProductOption,
  deleteProductOption,
  deleteProduct,
  getProductOptionStats,
  deleteLargeCategory,
} from "@/services/firestoreService";
import { convertFirestoreData } from "@/utils/dbUtils";
import {
  doc,
  getDoc,
  serverTimestamp,
  query,
  collection,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
} from "firebase/firestore";
import { db } from "@/config/firebase";

// Type definitions
export interface Category {
  id: string;
  business_id: string;
  name: string;
  description: string;
  image_url?: string;
  productCount?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface ProductOption {
  id: string;
  product_id: string;
  name: string;
  price: number;
  stock: number;
  image_url?: string;
  description?: string;
  terms_of_service?: string;
  available_for_delivery: boolean;
  available_for_pickup: boolean;
  sold?: number; // Add the sold property as optional
  created_at?: Date;
  updated_at?: Date;
}

export interface Product {
  id: string;
  business_id: string;
  category_id: string;
  name: string;
  description?: string;
  image_url?: string;
  terms_of_service?: string;
  available_for_delivery: boolean;
  available_for_pickup: boolean;
  created_at?: Date;
  updated_at?: Date;
  options?: ProductOption[];
  category?: string; // Category name for display
}

// Constants for query configuration
const PAGE_SIZE = 10;
const DEFAULT_SORT = "name";

export function useInventory() {
  const { toast } = useToast();
  const { business, loading: businessLoading } = useBusiness();

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOption, setSelectedOption] = useState<ProductOption | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "price" | "stock" | "sold">(
    DEFAULT_SORT
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastVisible, setLastVisible] = useState<any | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const [productDetailsMode, setProductDetailsMode] = useState<
    "view" | "editOption" | "editProduct" | "add"
  >("view");
  const [categoryDetailsMode, setCategoryDetailsMode] = useState<
    "view" | "edit" | "add"
  >("view");

  // Function to fetch categories with optimized indices
  const fetchCategories = async (businessId: string) => {
    try {
      // Using the recommended index: business_id ASC, name ASC
      const categoriesRef = collection(db, "categories");
      const q = query(
        categoriesRef,
        where("business_id", "==", businessId),
        orderBy("name", "asc") // Sorting by name requires an index
      );

      const querySnapshot = await getDocs(q);
      const categories: any[] = [];

      querySnapshot.forEach((doc) => {
        categories.push({ id: doc.id, ...doc.data() });
      });

      // Calculate product counts for each category (this requires another index)
      const categoriesWithCount = await Promise.all(
        categories.map(async (category) => {
          const productsRef = collection(db, "products");
          const productsQuery = query(
            productsRef,
            where("business_id", "==", businessId),
            where("category_id", "==", category.id)
          );

          const productsSnapshot = await getDocs(productsQuery);

          console.log("Category ID:", category.name, "Product Count:", productsSnapshot.size);

          return {
            ...category,
            productCount: productsSnapshot.size,
          };
        })
      );

      return categoriesWithCount.map((category) =>
        convertFirestoreData(category)
      );
    } catch (error) {
      console.error("Error fetching categories with indices:", error);
      throw error;
    }
  };

  // Function to fetch products with optimized indices
  const fetchProducts = async (
    businessId: string,
    categoryId: string | null = null,
    lastDoc: any = null,
    pageSize: number = PAGE_SIZE
  ) => {
    try {
      const productsRef = collection(db, "products");
      let q;

      // Apply different indices based on filters
      if (categoryId) {
        // Using the recommended index: business_id ASC, category_id ASC, name ASC
        q = query(
          productsRef,
          where("business_id", "==", businessId),
          where("category_id", "==", categoryId),
          orderBy("name", "asc"),
          limit(pageSize)
        );
      } else {
        // Using the recommended index: business_id ASC, name ASC
        q = query(
          productsRef,
          where("business_id", "==", businessId),
          orderBy("name", "asc"),
        );
      }

      // Apply pagination if lastDoc is provided
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const querySnapshot = await getDocs(q);
      const products: any[] = [];

      // Process products and their options
      for (const docSnapshot of querySnapshot.docs) {
        const productData = {
          id: docSnapshot.id,
          ...(docSnapshot.data() as Record<string, any>),
        };

        // Get product options
        const optionsRef = collection(db, "product_options");
        // Using the recommended index: product_id ASC, name ASC
        const optionsQuery = query(
          optionsRef,
          where("product_id", "==", docSnapshot.id),
          orderBy("name", "asc")
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

      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

      return { products, lastDoc: lastVisible };
    } catch (error) {
      console.error("Error fetching products with indices:", error);
      throw error;
    }
  };

  // Fetch categories and products when business data is available
  useEffect(() => {
    const fetchData = async () => {
      if (businessLoading || !business) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch categories with optimized indices
        const processedCategories = await fetchCategories(business.id);
        setCategories(processedCategories);

        // Fetch products with optimized indices
        const { products: fetchedProducts, lastDoc } = await fetchProducts(
          business.id
        );

        // Process products and add the category name for display
        const processedProducts = fetchedProducts.map((product) => {
          const processedProduct = convertFirestoreData(product);
          const category = processedCategories.find(
            (cat) => cat.id === processedProduct.category_id
          );

          return {
            ...processedProduct,
            category: category ? category.name : "Uncategorized",
          };
        });

        setProducts(processedProducts);
        setFilteredProducts(processedProducts);
        setLastVisible(lastDoc);
        setHasMore(fetchedProducts.length === PAGE_SIZE);
      } catch (err: any) {
        console.error("Error fetching inventory data:", err);
        setError(err.message);
        toast({
          title: "Error",
          description: "Failed to load inventory data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [business, businessLoading, toast]);

  // Filter products based on search term and category
  useEffect(() => {
    let filtered = [...products];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(term)
      );
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (product) => product.category_id === categoryFilter
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "price") {
        // Check if product has options and sort by first option's price
        const aPrice =
          a.options && a.options.length > 0 ? a.options[0].price : 0;
        const bPrice =
          b.options && b.options.length > 0 ? b.options[0].price : 0;
        return aPrice - bPrice;
      } else if (sortBy === "sold") {
        // For "sold" we now properly check if the property exists
        const aSold =
          a.options && a.options.length > 0
            ? a.options[0].sold !== undefined
              ? a.options[0].sold
              : 0
            : 0;
        const bSold =
          b.options && b.options.length > 0
            ? b.options[0].sold !== undefined
              ? b.options[0].sold
              : 0
            : 0;
        return bSold - aSold; // Descending
      } else {
        // stock
        const aStock =
          a.options && a.options.length > 0 ? a.options[0].stock : 0;
        const bStock =
          b.options && b.options.length > 0 ? b.options[0].stock : 0;
        return aStock - bStock;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, categoryFilter, sortBy]);

  // Load more products using optimized indices
  const loadMoreProducts = useCallback(async () => {
    if (!business || !lastVisible || !hasMore) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch more products with optimized indices
      const categoryId = categoryFilter !== "all" ? categoryFilter : null;
      const { products: fetchedProducts, lastDoc } = await fetchProducts(
        business.id,
        categoryId,
        lastVisible
      );

      // Process products and add category name
      const processedProducts = fetchedProducts.map((product) => {
        const processedProduct = convertFirestoreData(product);
        const category = categories.find(
          (cat) => cat.id === processedProduct.category_id
        );

        return {
          ...processedProduct,
          category: category ? category.name : "Uncategorized",
        };
      });

      setProducts((prev) => [...prev, ...processedProducts]);
      setLastVisible(lastDoc);
      setHasMore(fetchedProducts.length === PAGE_SIZE);
    } catch (err: any) {
      console.error("Error loading more products:", err);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to load more products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [business, categoryFilter, lastVisible, hasMore, toast, categories]);

  // Fetch products with sales data using optimized indices
  const fetchProductsWithSales = async () => {
    if (!business) return;

    try {
      setLoading(true);

      // Fetch products with optimized indices
      const { products: fetchedProducts, lastDoc } = await fetchProducts(
        business.id
      );

      // Process products and add category name + sales data
      const processedProducts = await Promise.all(
        fetchedProducts.map(async (product) => {
          const processedProduct = convertFirestoreData(product);

          // Find the category name
          const category = categories.find(
            (cat) => cat.id === processedProduct.category_id
          );

          // For each option, get its sales stats
          if (processedProduct.options && processedProduct.options.length > 0) {
            const optionsWithStats = await Promise.all(
              processedProduct.options.map(async (option) => {
                const stats = await getProductOptionStats(option.id);
                return {
                  ...option,
                  sold: stats?.sold || 0,
                };
              })
            );

            processedProduct.options = optionsWithStats;
          }

          return {
            ...processedProduct,
            category: category ? category.name : "Uncategorized",
          };
        })
      );

      setProducts(processedProducts);
      setFilteredProducts(processedProducts);
      setLastVisible(lastDoc);
      setHasMore(fetchedProducts.length === PAGE_SIZE);
    } catch (err: any) {
      console.error("Error fetching products with sales:", err);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to load products with sales data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Rest of your code remains the same
  // Product selection handlers
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    // Select the standard option by default
    const standardOption =
      product.options?.find((opt) => opt.name === "Standard") ||
      product.options?.[0] ||
      null;
    setSelectedOption(standardOption);
    setProductDetailsMode("view");
  };

  const handleOptionSelect = (option: ProductOption) => {
    setSelectedOption(option);
    setProductDetailsMode("view");
  };

  // Category selection handlers
  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setCategoryDetailsMode("view");
  };

  // Add new product or category
  const handleAddNew = (type: "product" | "category") => {
    if (type === "product") {
      setProductDetailsMode("add");
      setSelectedProduct(null);
      setSelectedOption(null);
    } else {
      setCategoryDetailsMode("add");
      setSelectedCategory(null);
    }
  };

  // Add product option
  const handleAddOption = () => {
    if (!selectedProduct) return;
    setSelectedOption(null);
    setProductDetailsMode("add");
  };

  // Product CRUD operations
  const handleProductSave = async (productData: any) => {
    if (!business) {
      toast({
        title: "Error",
        description: "Business data is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      if (productDetailsMode === "add" && !selectedProduct) {
        // Adding a new product
        const productId = await addProduct(business.id, {
          name: productData.name,
          description: productData.description || "",
          category_id: productData.category_id,
          available_for_delivery: productData.available_for_delivery || false,
          available_for_pickup: productData.available_for_pickup || true,
          terms_of_service: productData.terms_of_service || "",
          image_url: productData.image_url || "",
        });

        // Add standard option
        await addProductOption(productId, {
          name: "Standard",
          price: productData.price || 0,
          stock: productData.stock || 0,
          sold: 0, // Initialize sold count to zero
          image_url: productData.image_url || "",
          description: productData.description || "",
          terms_of_service: productData.terms_of_service || "",
          available_for_delivery: productData.available_for_delivery || false,
          available_for_pickup: productData.available_for_pickup || true,
        });

        toast({
          title: "Success",
          description: "Product added successfully",
        });

        // Refresh products with optimized indices
        const { products: refreshedProducts } = await fetchProducts(
          business.id
        );
        const processedProducts = refreshedProducts.map((product) => {
          const processedProduct = convertFirestoreData(product);
          const category = categories.find(
            (cat) => cat.id === processedProduct.category_id
          );

          return {
            ...processedProduct,
            category: category ? category.name : "Uncategorized",
          };
        });

        setProducts(processedProducts);

        // Select the newly created product
        const newProduct = processedProducts.find((p) => p.id === productId);
        if (newProduct) {
          setSelectedProduct(newProduct);
          if (newProduct.options && newProduct.options.length > 0) {
            setSelectedOption(newProduct.options[0]);
          }
          setProductDetailsMode("view");
        }
      } else if (productDetailsMode === "editProduct" && selectedProduct) {
        // Update existing product
        await updateProduct(selectedProduct.id, {
          name: productData.name,
          description: productData.description,
          category_id: productData.category_id,
          available_for_delivery: productData.available_for_delivery,
          available_for_pickup: productData.available_for_pickup,
          terms_of_service: productData.terms_of_service,
          image_url: productData.image_url,
        });

        toast({
          title: "Success",
          description: "Product updated successfully",
        });

        // Refresh products to get updated data
        const { products: refreshedProducts } = await fetchProducts(
          business.id
        );
        const processedProducts = refreshedProducts.map((product) => {
          const processedProduct = convertFirestoreData(product);
          const category = categories.find(
            (cat) => cat.id === processedProduct.category_id
          );

          return {
            ...processedProduct,
            category: category ? category.name : "Uncategorized",
          };
        });

        setProducts(processedProducts);

        // Select the updated product
        const updatedProduct = processedProducts.find(
          (p) => p.id === selectedProduct.id
        );
        if (updatedProduct) {
          setSelectedProduct(updatedProduct);
          setProductDetailsMode("view");
        }
      }
    } catch (err: any) {
      console.error("Error saving product:", err);
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSave = async (optionData: any) => {
    if (!selectedProduct) {
      toast({
        title: "Error",
        description: "No product selected",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      if (productDetailsMode === "add") {
        // Add new option
        const optionId = await addProductOption(selectedProduct.id, {
          name: optionData.name || "Option",
          price: optionData.price || 0,
          stock: optionData.stock || 0,
          sold: 0,
          image_url: optionData.image_url || "",
          description: optionData.description || "",
          terms_of_service: optionData.terms_of_service || "",
          available_for_delivery: optionData.available_for_delivery || false,
          available_for_pickup: optionData.available_for_pickup || true,
        });

        toast({
          title: "Success",
          description: "Product option added successfully",
        });
      } else if (productDetailsMode === "editOption" && selectedOption) {
        // Update existing option
        await updateProductOption(selectedOption.id, {
          name: optionData.name,
          price: optionData.price,
          stock: optionData.stock,
          image_url: optionData.image_url,
          description: optionData.description,
          terms_of_service: optionData.terms_of_service,
          available_for_delivery: optionData.available_for_delivery,
          available_for_pickup: optionData.available_for_pickup,
        });

        toast({
          title: "Success",
          description: "Product option updated successfully",
        });
      } else if (selectedOption) {
        // This handles the quick updates (price and quantity)
        await updateProductOption(selectedOption.id, {
          name: optionData.name,
          price: optionData.price,
          stock: optionData.stock,
          image_url: optionData.image_url || "",
          description: optionData.description || "",
          terms_of_service: optionData.terms_of_service || "",
          available_for_delivery: optionData.available_for_delivery,
          available_for_pickup: optionData.available_for_pickup,
        });

        // Don't show toast for quick updates as they handle their own success messages
      }

      // Refresh products to get updated options using optimized indices
      const { products: refreshedProducts } = await fetchProducts(business!.id);
      const processedProducts = refreshedProducts.map((product) => {
        const processedProduct = convertFirestoreData(product);
        const category = categories.find(
          (cat) => cat.id === processedProduct.category_id
        );

        return {
          ...processedProduct,
          category: category ? category.name : "Uncategorized",
        };
      });

      setProducts(processedProducts);

      // Select the updated product
      const updatedProduct = processedProducts.find(
        (p) => p.id === selectedProduct.id
      );
      if (updatedProduct) {
        setSelectedProduct(updatedProduct);
        // Find the updated or new option
        if (selectedOption) {
          const updatedOption = updatedProduct.options?.find(
            (o) => o.id === selectedOption.id
          );
          if (updatedOption) {
            setSelectedOption(updatedOption);
          }
        } else {
          // If adding a new option, select the last one (assuming it's the newly added one)
          const newOption =
            updatedProduct.options?.[updatedProduct.options.length - 1];
          if (newOption) {
            setSelectedOption(newOption);
          }
        }

        // Only change mode for explicit edit/add operations, not quick updates
        if (
          productDetailsMode === "add" ||
          productDetailsMode === "editOption"
        ) {
          setProductDetailsMode("view");
        }
      }
    } catch (err: any) {
      console.error("Error saving product option:", err);
      toast({
        title: "Error",
        description: "Failed to save product option",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProductDelete = async (productId: string) => {
    try {
      setLoading(true);

      // Call the enhanced deleteProduct function that removes all options
      await deleteProduct(productId);

      toast({
        title: "Success",
        description: "Product and all its options deleted successfully",
        variant: "destructive",
      });

      // Update local state by removing the deleted product
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setSelectedProduct(null);
      setSelectedOption(null);
      setProductDetailsMode("view");
    } catch (err: any) {
      console.error("Error deleting product:", err);
      toast({
        title: "Error",
        description:
          "Failed to delete product: " + (err.message || "Unknown error"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOptionDelete = async (optionId: string) => {
    // Implementation remains the same
    if (!selectedProduct) return;

    try {
      setLoading(true);
      await deleteProductOption(optionId);

      toast({
        title: "Success",
        description: "Product option deleted successfully",
        variant: "destructive",
      });

      // Refresh products to get updated options using optimized indices
      const { products: refreshedProducts } = await fetchProducts(business!.id);
      const processedProducts = refreshedProducts.map((product) => {
        const processedProduct = convertFirestoreData(product);
        const category = categories.find(
          (cat) => cat.id === processedProduct.category_id
        );

        return {
          ...processedProduct,
          category: category ? category.name : "Uncategorized",
        };
      });

      setProducts(processedProducts);

      // Select the updated product
      const updatedProduct = processedProducts.find(
        (p) => p.id === selectedProduct.id
      );
      if (updatedProduct) {
        setSelectedProduct(updatedProduct);

        // If we deleted the currently selected option, select another one
        if (selectedOption && selectedOption.id === optionId) {
          const firstOption = updatedProduct.options?.[0] || null;
          setSelectedOption(firstOption);
        }

        setProductDetailsMode("view");
      }
    } catch (err: any) {
      console.error("Error deleting product option:", err);
      toast({
        title: "Error",
        description: "Failed to delete product option",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Category CRUD operations with optimized indices
  const handleCategorySave = async (categoryData: any) => {
    if (!business) {
      toast({
        title: "Error",
        description: "Business data is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      if (categoryDetailsMode === "add") {
        // Add new category
        const categoryId = await addCategory(business.id, {
          name: categoryData.name,
          description: categoryData.description || "",
          image_url: categoryData.image_url || "",
        });

        toast({
          title: "Success",
          description: "Category added successfully",
        });

        // Refresh categories using optimized indices
        const processedCategories = await fetchCategories(business.id);
        setCategories(processedCategories);

        // Select the new category
        const newCategory = processedCategories.find(
          (c) => c.id === categoryId
        );
        if (newCategory) {
          setSelectedCategory(newCategory);
          setCategoryDetailsMode("view");
        }
      } else if (categoryDetailsMode === "edit" && selectedCategory) {
        // Update existing category
        await updateCategory(selectedCategory.id, {
          name: categoryData.name,
          description: categoryData.description,
          image_url: categoryData.image_url,
        });

        toast({
          title: "Success",
          description: "Category updated successfully",
        });

        // Refresh categories using optimized indices
        const processedCategories = await fetchCategories(business.id);
        setCategories(processedCategories);

        // Select the updated category
        const updatedCategory = processedCategories.find(
          (c) => c.id === selectedCategory.id
        );
        if (updatedCategory) {
          setSelectedCategory(updatedCategory);
          setCategoryDetailsMode("view");
        }
      }

      // Also refresh products to update category names using optimized indices
      const { products: refreshedProducts } = await fetchProducts(business.id);
      const processedProducts = refreshedProducts.map((product) => {
        const processedProduct = convertFirestoreData(product);
        const category = categories.find(
          (cat) => cat.id === processedProduct.category_id
        );

        return {
          ...processedProduct,
          category: category ? category.name : "Uncategorized",
        };
      });

      setProducts(processedProducts);
    } catch (err: any) {
      console.error("Error saving category:", err);
      toast({
        title: "Error",
        description: "Failed to save category",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryDelete = async (categoryId: string) => {
    try {
      setLoading(true);

      // For large categories, use the batch approach
      const categoryProducts = products.filter(
        (p) => p.category_id === categoryId
      );

      if (categoryProducts.length > 100) {
        // If there are many products, use the batch deletion approach
        await deleteLargeCategory(categoryId);
      } else {
        // Otherwise use the standard deletion
        await deleteCategory(categoryId);
      }

      toast({
        title: "Success",
        description: "Category and all its products deleted successfully",
        variant: "destructive",
      });

      // Update local state by removing the deleted category
      setCategories((prev) => prev.filter((c) => c.id !== categoryId));

      // Also remove all products from that category
      setProducts((prev) => prev.filter((p) => p.category_id !== categoryId));

      // Reset selections
      setSelectedCategory(null);
      setSelectedProduct(null);
      setSelectedOption(null);
      setCategoryDetailsMode("view");
      setProductDetailsMode("view");
    } catch (err: any) {
      console.error("Error deleting category:", err);
      toast({
        title: "Error",
        description:
          "Failed to delete category: " + (err.message || "Unknown error"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Close details handler
  const handleCloseProductDetails = () => {
    if (productDetailsMode === "add") {
      // If adding a new product, clear everything
      if (!selectedProduct) {
        setSelectedProduct(null);
        setSelectedOption(null);
      } else {
        // If adding an option, go back to view mode for the selected product
        if (selectedProduct.options?.length) {
          setSelectedOption(selectedProduct.options[0]);
        }
      }
    }

    setProductDetailsMode("view");
  };

  const handleCloseCategoryDetails = () => {
    setCategoryDetailsMode("view");
  };

  return {
    // State
    products,
    filteredProducts,
    categories,
    selectedProduct,
    selectedOption,
    selectedCategory,
    searchTerm,
    categoryFilter,
    sortBy,
    loading,
    error,
    hasMore,
    productDetailsMode,
    categoryDetailsMode,

    // State setters
    setSearchTerm,
    setCategoryFilter,
    setSortBy,
    setProductDetailsMode,
    setCategoryDetailsMode,

    // Handlers
    loadMoreProducts,
    handleAddNew,
    handleProductSelect,
    handleOptionSelect,
    handleCategorySelect,
    handleAddOption,
    handleProductSave,
    handleOptionSave,
    handleProductDelete,
    handleOptionDelete,
    handleCategorySave,
    handleCategoryDelete,
    handleCloseProductDetails,
    handleCloseCategoryDetails,
    fetchProductsWithSales,

  };
}
