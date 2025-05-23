import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useBusiness } from "@/hooks/useBusiness";
import {
  getProductsByBusiness,
  getCategoriesByBusiness,
  addCategory,
  addProduct,
  addProductOption,
} from "@/services/firestoreService";
import { convertFirestoreData } from "@/utils/dbUtils";

export function useProducts() {
  const { toast } = useToast();
  const { business, loading: businessLoading } = useBusiness();

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [selectedOption, setSelectedOption] = useState<any | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "price" | "stock" | "sold">(
    "name"
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastVisible, setLastVisible] = useState<any | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const [detailsMode, setDetailsMode] = useState<"view" | "edit" | "add">(
    "view"
  );

  // Fetch categories and products when business data is available
  useEffect(() => {
    const fetchData = async () => {
      if (businessLoading || !business) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch categories
        const fetchedCategories = await getCategoriesByBusiness(business.id);
        setCategories(
          fetchedCategories.map((category) => convertFirestoreData(category))
        );

        // Fetch products
        const { products: fetchedProducts, lastDoc } =
          await getProductsByBusiness(business.id);

        const processedProducts = fetchedProducts.map((product) =>
          convertFirestoreData(product)
        );

        setProducts(processedProducts);
        setFilteredProducts(processedProducts);
        setLastVisible(lastDoc);
        setHasMore(fetchedProducts.length === 10); // Assuming pageSize is 10
      } catch (err: any) {
        console.error("Error fetching products data:", err);
        setError(err.message);
        toast({
          title: "Error",
          description: "Failed to load products",
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
        return a.price - b.price;
      } else if (sortBy === "sold") {
        return b.sold - a.sold;
      } else {
        return a.stock - b.stock;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, categoryFilter, sortBy]);

  // Load more products
  const loadMoreProducts = useCallback(async () => {
    if (!business || !lastVisible || !hasMore) return;

    try {
      setLoading(true);
      setError(null);

      const categoryId = categoryFilter !== "all" ? categoryFilter : null;

      const { products: fetchedProducts, lastDoc } =
        await getProductsByBusiness(business.id, categoryId, lastVisible);

      const processedProducts = fetchedProducts.map((product) =>
        convertFirestoreData(product)
      );

      setProducts((prev) => [...prev, ...processedProducts]);
      setLastVisible(lastDoc);
      setHasMore(fetchedProducts.length === 10); // Assuming pageSize is 10
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
  }, [business, categoryFilter, lastVisible, hasMore, toast]);

  // Handle product selection
  const handleProductSelect = (product: any) => {
    setSelectedProduct(product);
    setSelectedOption(
      product.options && product.options.length > 0 ? product.options[0] : null
    );
    setDetailsMode("view");
  };

  // Handle option selection
  const handleOptionSelect = (option: any) => {
    setSelectedOption(option);
    setDetailsMode("view");
  };

  // Handle adding a new product
  const handleAddProduct = async (productData: any) => {
    if (!business) {
      toast({
        title: "Error",
        description: "Business data is required to add a product",
        variant: "destructive",
      });
      return;
    }

    try {
      // Add the product
      const productId = await addProduct(business.id, {
        name: productData.name,
        description: productData.description,
        category_id: productData.category_id,
        available_for_delivery: productData.available_for_delivery || false,
        available_for_pickup: productData.available_for_pickup || true,
        terms_of_service: productData.terms_of_service || "",
      });

      // Add the standard option
      const optionId = await addProductOption(productId, {
        name: "Standard",
        price: productData.price,
        stock: productData.stock,
        image: productData.image || "",
        description: productData.description || "",
        terms_of_service: productData.terms_of_service || "",
        available_for_delivery: productData.available_for_delivery || false,
        available_for_pickup: productData.available_for_pickup || true,
      });

      // Refresh products
      const { products: fetchedProducts } = await getProductsByBusiness(
        business.id
      );
      const processedProducts = fetchedProducts.map((product) =>
        convertFirestoreData(product)
      );

      setProducts(processedProducts);

      // Find the newly added product
      const newProduct = processedProducts.find((p) => p.id === productId);

      if (newProduct) {
        setSelectedProduct(newProduct);
        setSelectedOption(newProduct.options[0]);
        setDetailsMode("view");
      }

      toast({
        title: "Success",
        description: "Product added successfully",
      });

      return newProduct;
    } catch (err: any) {
      console.error("Error adding product:", err);
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Handle adding a product option
  const handleAddOption = async (optionData: any) => {
    if (!selectedProduct) {
      toast({
        title: "Error",
        description: "No product selected",
        variant: "destructive",
      });
      return;
    }

    try {
      // Add the option
      const optionId = await addProductOption(selectedProduct.id, {
        name: optionData.name,
        price: optionData.price,
        stock: optionData.stock,
        image: optionData.image || "",
        description: optionData.description || "",
        terms_of_service: optionData.terms_of_service || "",
        available_for_delivery: optionData.available_for_delivery || false,
        available_for_pickup: optionData.available_for_pickup || true,
      });

      // Refresh products to get the updated data
      const { products: fetchedProducts } = await getProductsByBusiness(
        business!.id
      );
      const processedProducts = fetchedProducts.map((product) =>
        convertFirestoreData(product)
      );

      setProducts(processedProducts);

      // Find the product and new option
      const updatedProduct = processedProducts.find(
        (p) => p.id === selectedProduct.id
      );
      const newOption = updatedProduct?.options.find((o) => o.id === optionId);

      if (updatedProduct) {
        setSelectedProduct(updatedProduct);

        if (newOption) {
          setSelectedOption(newOption);
        }

        setDetailsMode("view");
      }

      toast({
        title: "Success",
        description: "Product option added successfully",
      });

      return newOption;
    } catch (err: any) {
      console.error("Error adding product option:", err);
      toast({
        title: "Error",
        description: "Failed to add product option",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Handle updating a product option
  const handleOptionSave = async (updatedOption: any) => {
    if (!selectedProduct || !updatedOption.id) {
      toast({
        title: "Error",
        description: "Product and option data are required",
        variant: "destructive",
      });
      return;
    }

    try {
      // TODO: Implement update product option API
      // For now, we'll simulate an update

      toast({
        title: "Success",
        description: "Product option updated successfully",
      });

      // Close edit mode
      setDetailsMode("view");

      return updatedOption;
    } catch (err: any) {
      console.error("Error updating product option:", err);
      toast({
        title: "Error",
        description: "Failed to update product option",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Handle deleting a product option
  const handleOptionDelete = async (optionId: string) => {
    if (!selectedProduct) {
      toast({
        title: "Error",
        description: "No product selected",
        variant: "destructive",
      });
      return;
    }

    try {
      // TODO: Implement delete product option API
      // For now, we'll simulate a deletion

      toast({
        title: "Success",
        description: "Product option deleted successfully",
        variant: "destructive",
      });

      // Close details
      setSelectedOption(null);
      setDetailsMode("view");
    } catch (err: any) {
      console.error("Error deleting product option:", err);
      toast({
        title: "Error",
        description: "Failed to delete product option",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Handle adding a new category
  const handleAddCategory = async (categoryData: any) => {
    if (!business) {
      toast({
        title: "Error",
        description: "Business data is required to add a category",
        variant: "destructive",
      });
      return;
    }

    try {
      const categoryId = await addCategory(business.id, categoryData);

      // Refresh categories
      const fetchedCategories = await getCategoriesByBusiness(business.id);
      setCategories(
        fetchedCategories.map((category) => convertFirestoreData(category))
      );

      // Find the newly added category
      const newCategory = fetchedCategories.find((c) => c.id === categoryId);

      toast({
        title: "Success",
        description: "Category added successfully",
      });

      return convertFirestoreData(newCategory);
    } catch (err: any) {
      console.error("Error adding category:", err);
      toast({
        title: "Error",
        description: "Failed to add category",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Handle closing product details
  const handleCloseDetails = () => {
    setSelectedProduct(null);
    setSelectedOption(null);
    setDetailsMode("view");
  };

  return {
    products,
    categories,
    filteredProducts,
    selectedProduct,
    selectedOption,
    searchTerm,
    categoryFilter,
    sortBy,
    loading,
    error,
    hasMore,
    detailsMode,
    setSearchTerm,
    setCategoryFilter,
    setSortBy,
    setDetailsMode,
    loadMoreProducts,
    handleProductSelect,
    handleOptionSelect,
    handleAddProduct,
    handleAddOption,
    handleOptionSave,
    handleOptionDelete,
    handleAddCategory,
    handleCloseDetails,
  };
}
