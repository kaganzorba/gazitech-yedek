import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import '../styles/AdminPanel.css';

function AdminPanel() {
  const navigate = useNavigate();
  const { 
    products, 
    categories, 
    categoryNames, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    addCategory 
  } = useProducts();
  
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: '',
    stock: '',
    description: '',
    image: '',
    category: ''
  });
  
  // Kategori ekleme form state
  const [newCategoryKey, setNewCategoryKey] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  
  // Dosya yükleme state
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // Ürünler değiştiğinde filtreleme işlemi
  useEffect(() => {
    if (selectedCategory) {
      setFilteredProducts(products.filter(p => p.category === selectedCategory));
    } else {
      setFilteredProducts(products);
    }
  }, [products, selectedCategory]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Dosya önizleme için FileReader kullanımı
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Ürün verisi oluşturma
    const productData = {
      ...formData,
      // Eğer dosya seçilmişse base64 formatındaki görsel URL'ini kullan
      image: previewUrl || formData.image
    };
    
    if (editingProduct) {
      // Ürün güncelleme
      updateProduct({ ...productData, id: editingProduct.id });
      setEditingProduct(null);
    } else {
      // Yeni ürün ekleme
      addProduct(productData);
    }
    
    // Formu temizle
    resetForm();
  };

  const handleCategorySubmit = (e) => {
    e.preventDefault();
    
    if (newCategoryKey && newCategoryName) {
      // Kategori ekleme
      addCategory(newCategoryKey, newCategoryName);
      
      // Formu temizle
      setNewCategoryKey('');
      setNewCategoryName('');
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      price: '',
      stock: '',
      description: '',
      image: '',
      category: ''
    });
    setSelectedFile(null);
    setPreviewUrl('');
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    
    // Eğer ürünün görseli varsa önizleme olarak ayarla
    if (product.image) {
      setPreviewUrl(product.image);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      deleteProduct(id);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/login');
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <button className="btn btn-danger" onClick={handleLogout}>Çıkış Yap</button>
      </div>
      
      <div className="row">
        <div className="col-md-4">
          {/* Kategori Ekleme Formu */}
          <div className="card mb-4">
            <div className="card-header">
              <h3>Yeni Kategori Ekle</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleCategorySubmit}>
                <div className="form-group">
                  <label>Kategori Anahtarı (İngilizce, boşluksuz)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newCategoryKey}
                    onChange={(e) => setNewCategoryKey(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                    required
                    placeholder="Örn: newcategory"
                  />
                </div>
                
                <div className="form-group">
                  <label>Kategori Adı (Görünen İsim)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    required
                    placeholder="Örn: Yeni Kategori"
                  />
                </div>
                
                <button type="submit" className="btn btn-success">
                  Kategori Ekle
                </button>
              </form>
            </div>
          </div>
          
          {/* Ürün Ekleme/Düzenleme Formu */}
          <div className="card">
            <div className="card-header">
              <h3>{editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Ürün Adı</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Fiyat (₺)</label>
                  <input
                    type="number"
                    name="price"
                    className="form-control"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Stok Adedi</label>
                  <input
                    type="number"
                    name="stock"
                    className="form-control"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Açıklama</label>
                  <textarea
                    name="description"
                    className="form-control"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                
                <div className="form-group">
                  <label>Görsel URL</label>
                  <input
                    type="text"
                    name="image"
                    className="form-control"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <div className="form-group">
                  <label>Görsel Yükle</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  
                  {previewUrl && (
                    <div className="mt-2">
                      <p>Görsel Önizleme:</p>
                      <img 
                        src={previewUrl} 
                        alt="Önizleme" 
                        className="img-thumbnail" 
                        style={{ maxWidth: '100%', maxHeight: '200px' }} 
                      />
                    </div>
                  )}
                </div>
                
                <div className="form-group">
                  <label>Kategori</label>
                  <select
                    name="category"
                    className="form-control"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Kategori Seçin</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {categoryNames[category] || category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <button type="submit" className="btn btn-primary">
                    {editingProduct ? 'Güncelle' : 'Ekle'}
                  </button>
                  {editingProduct && (
                    <button 
                      type="button" 
                      className="btn btn-secondary ml-2"
                      onClick={() => {
                        setEditingProduct(null);
                        resetForm();
                      }}
                    >
                      İptal
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <h3>Ürün Listesi</h3>
                <div className="category-filter">
                  <select
                    className="form-control"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">Tüm Kategoriler</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {categoryNames[category] || category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="card-body">
              {filteredProducts.length === 0 ? (
                <p>Henüz ürün bulunmamaktadır.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Görsel</th>
                        <th>Ürün Adı</th>
                        <th>Kategori</th>
                        <th>Fiyat</th>
                        <th>Stok</th>
                        <th>İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map(product => (
                        <tr key={product.id}>
                          <td>
                            <img 
                              src={product.image || 'https://via.placeholder.com/50x50'} 
                              alt={product.name}
                              className="product-thumbnail"
                              onError={(e) => {e.target.src = 'https://via.placeholder.com/50x50'}}
                            />
                          </td>
                          <td>{product.name}</td>
                          <td>{categoryNames[product.category] || product.category}</td>
                          <td>{product.price.toLocaleString('tr-TR')} ₺</td>
                          <td>{product.stock}</td>
                          <td>
                            <button 
                              className="btn btn-sm btn-info mr-2"
                              onClick={() => handleEdit(product)}
                            >
                              Düzenle
                            </button>
                            <button 
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(product.id)}
                            >
                              Sil
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
