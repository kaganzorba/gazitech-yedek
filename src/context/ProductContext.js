import React, { createContext, useState, useEffect, useContext } from 'react';

// Context oluşturma
export const ProductContext = createContext();

// Context Provider bileşeni
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([
    'iphone15series',
    'iphone16series',
    'ipad',
    'macbook',
    'watch',
    'airpods',
    'accessory'
  ]);
  
  // Kategori isimleri
  const [categoryNames, setCategoryNames] = useState({
    'iphone15series': 'iPhone 15 Serisi',
    'iphone16series': 'iPhone 16 Serisi',
    'ipad': 'iPad',
    'macbook': 'MacBook',
    'watch': 'Apple Watch',
    'airpods': 'AirPods',
    'accessory': 'Aksesuarlar'
  });

  // Sayfa yüklendiğinde localStorage'dan verileri al
  useEffect(() => {
    const storedProducts = localStorage.getItem('adminProducts');
    const storedCategories = localStorage.getItem('adminCategories');
    const storedCategoryNames = localStorage.getItem('adminCategoryNames');
    
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
    
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    }
    
    if (storedCategoryNames) {
      setCategoryNames(JSON.parse(storedCategoryNames));
    }
  }, []);

  // Veriler değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('adminProducts', JSON.stringify(products));
    localStorage.setItem('adminCategories', JSON.stringify(categories));
    localStorage.setItem('adminCategoryNames', JSON.stringify(categoryNames));
  }, [products, categories, categoryNames]);

  // Ürün ekleme fonksiyonu
  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now().toString()
    };
    setProducts([...products, newProduct]);
  };

  // Ürün güncelleme fonksiyonu
  const updateProduct = (updatedProduct) => {
    setProducts(products.map(p => 
      p.id === updatedProduct.id ? updatedProduct : p
    ));
  };

  // Ürün silme fonksiyonu
  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  // Kategori ekleme fonksiyonu
  const addCategory = (categoryKey, categoryName) => {
    if (!categories.includes(categoryKey)) {
      setCategories([...categories, categoryKey]);
      setCategoryNames({
        ...categoryNames,
        [categoryKey]: categoryName
      });
    }
  };

  return (
    <ProductContext.Provider 
      value={{ 
        products, 
        categories, 
        categoryNames, 
        addProduct, 
        updateProduct, 
        deleteProduct, 
        addCategory 
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook
export const useProducts = () => useContext(ProductContext);