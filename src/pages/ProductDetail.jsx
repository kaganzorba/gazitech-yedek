import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import '../styles/ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const { products, categoryNames } = useProducts();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ürün ID'sine göre ürünü bul
    const foundProduct = products.find(p => p.id === id);
    
    if (foundProduct) {
      setProduct(foundProduct);
    }
    
    setLoading(false);
  }, [id, products]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.stock || 10)) {
      setQuantity(value);
    }
  };

  const increaseQuantity = () => {
    if (quantity < (product?.stock || 10)) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return <div className="text-center py-5">Yükleniyor...</div>;
  }

  if (!product) {
    return (
      <div className="text-center py-5">
        <h2>Ürün bulunamadı</h2>
        <p>Aradığınız ürün mevcut değil veya kaldırılmış olabilir.</p>
        <Link to="/products" className="btn btn-primary">Ürünlere Dön</Link>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <div className="row">
        <div className="col-md-6">
          <div className="product-image-container">
            <img 
              src={product.image || 'https://via.placeholder.com/500x500?text=Ürün+Görseli'} 
              alt={product.name} 
              className="product-detail-image"
              onError={(e) => {e.target.src = 'https://via.placeholder.com/500x500?text=Ürün+Görseli'}}
            />
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-category">
              <span className="badge bg-secondary">
                {categoryNames[product.category] || product.category}
              </span>
            </div>
            
            <div className="product-price">
              {product.price.toLocaleString('tr-TR')} ₺
            </div>
            
            <div className="product-stock">
              <span className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {product.stock > 0 ? 'Stokta' : 'Stokta Yok'}
              </span>
              {product.stock > 0 && <span className="stock-quantity">({product.stock} adet)</span>}
            </div>
            
            <div className="product-description">
              <h3>Ürün Açıklaması</h3>
              <p>{product.description}</p>
            </div>
            
            {product.stock > 0 && (
              <div className="product-actions">
                <div className="quantity-selector">
                  <button className="btn btn-outline-secondary" onClick={decreaseQuantity}>-</button>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={quantity} 
                    onChange={handleQuantityChange}
                    min="1"
                    max={product.stock}
                  />
                  <button className="btn btn-outline-secondary" onClick={increaseQuantity}>+</button>
                </div>
                
                <button className="btn btn-primary add-to-cart-btn">
                  Sepete Ekle
                </button>
              </div>
            )}
            
            <div className="back-link">
              <Link to="/products">← Ürünlere Dön</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;