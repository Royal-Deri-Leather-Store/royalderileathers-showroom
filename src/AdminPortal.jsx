import React, { useState, useEffect } from 'react';
import { 
  getProducts, 
  addProductLocally, 
  editProductLocally,
  deleteProductLocally, 
  verifyAdminPassword, 
  updateCatalogOnGit 
} from './productStore';

export default function AdminPortal({ isOpen, onClose, onCatalogChange }) {
  // Synchronize admin login state with sessionStorage
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(
    sessionStorage.getItem('royalderi_admin_password') !== null
  );
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [products, setProducts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  
  // Track which product is currently being edited (null if adding a new one)
  const [editingProductId, setEditingProductId] = useState(null);

  // Form state for adding/editing product card dynamically
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Shoes',
    price: '',
    description: '',
    rating: '5',
    numImages: 1,
    images: [''],
    specs: ''
  });

  // Load products list whenever isOpen becomes true, or when catalog changes
  useEffect(() => {
    if (isOpen) {
      setProducts(getProducts());
      setIsAdminLoggedIn(sessionStorage.getItem('royalderi_admin_password') !== null);
      setAdminError('');
      setStatusMessage('');
    }
  }, [isOpen]);

  // Update numImages and resize the images array
  const handleNumImagesChange = (count) => {
    const num = parseInt(count) || 1;
    const current = [...newProduct.images];
    while (current.length < num) current.push('');
    setNewProduct({ ...newProduct, numImages: num, images: current.slice(0, num) });
  };

  // Update a specific image slot
  const handleImageChange = (index, value) => {
    const updated = [...newProduct.images];
    updated[index] = value;
    setNewProduct({ ...newProduct, images: updated });
  };

  // Helper utility for client-side image compression using HTML5 canvas
  const compressImage = (file, maxWidth = 500, maxHeight = 500, quality = 0.6) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Maintain aspect ratio
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to compressed JPEG data URL
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  // Handle file upload for a specific slot (convert to Base64 dataURL with compression)
  const handleImageFileUpload = async (index, file) => {
    if (file) {
      try {
        setStatusMessage('Compressing image on-the-fly to optimize catalog size...');
        const compressedBase64 = await compressImage(file);
        handleImageChange(index, compressedBase64);
        setStatusMessage('⚡ Image compressed successfully! Size reduced.');
        setTimeout(() => setStatusMessage(''), 3000);
      } catch (err) {
        alert('Image compression failed: ' + err.message);
      }
    }
  };

  // Admin Portal login validation against serverless function
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminError('');
    setIsSubmitting(true);
    setStatusMessage('Authenticating session...');
    
    try {
      if (adminUsername.trim() !== 'RoyalDeriAdmin') {
        throw new Error('Invalid administrator username.');
      }
      
      await verifyAdminPassword(adminPassword);
      setIsAdminLoggedIn(true);
      sessionStorage.setItem('royalderi_admin_password', adminPassword);
      setAdminError('');
      setStatusMessage('');
      setAdminUsername('');
      setAdminPassword('');
    } catch (err) {
      setAdminError(err.message || 'Invalid username or password.');
      setStatusMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('royalderi_admin_password');
    setAdminUsername('');
    setAdminPassword('');
    setAdminError('');
    setStatusMessage('');
    handleCancelEdit();
  };

  // Populate form for editing product
  const handleStartEdit = (product) => {
    setEditingProductId(product.id);
    setNewProduct({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      description: product.description,
      rating: product.rating.toString(),
      numImages: product.images?.length || 1,
      images: [...(product.images || [''])],
      specs: product.specs?.join(', ') || ''
    });
    
    // Smooth scroll the modal to the top
    const modalEl = document.querySelector('.relative.w-full.max-w-xl');
    if (modalEl) modalEl.scrollTo({ top: 0, behavior: 'smooth' });
    setStatusMessage('');
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setNewProduct({
      name: '',
      category: 'Shoes',
      price: '',
      description: '',
      rating: '5',
      numImages: 1,
      images: [''],
      specs: ''
    });
    setStatusMessage('');
  };

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.description) {
      alert('Please fill in all required fields.');
      return;
    }

    const password = sessionStorage.getItem('royalderi_admin_password');
    if (!password) {
      setAdminError('Session expired. Please log in again.');
      setIsAdminLoggedIn(false);
      return;
    }

    setIsSubmitting(true);
    setStatusMessage('Syncing data with GitHub contents repository...');

    try {
      const finalImages = newProduct.images
        .map(url => url.trim())
        .filter(url => url.length > 0);
      if (finalImages.length === 0) finalImages.push('/assets/images/wholecut_oxford.png');

      const formattedSpecs = newProduct.specs
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const targetId = editingProductId || 'prod_' + Date.now();
      const productData = {
        id: targetId,
        name: newProduct.name.trim(),
        category: newProduct.category,
        price: parseFloat(newProduct.price),
        images: finalImages,
        description: newProduct.description.trim(),
        rating: parseFloat(newProduct.rating) || 5,
        specs: formattedSpecs.length > 0 ? formattedSpecs : ['Premium Crafted Leather']
      };

      if (editingProductId) {
        setStatusMessage(`Committing changes for '${productData.name}' to GitHub...`);
        await updateCatalogOnGit('edit', productData, password);
        editProductLocally(productData);
        setStatusMessage(`✏️ Changes saved! Rebuild triggered on Netlify. Changes live in ~1 min.`);
      } else {
        setStatusMessage(`Committing new product '${productData.name}' to GitHub...`);
        await updateCatalogOnGit('add', productData, password);
        addProductLocally(productData);
        setStatusMessage(`🚀 Product added! Rebuild triggered on Netlify. Live in ~1 min.`);
      }

      // Sync local UI
      const updatedProducts = getProducts();
      setProducts(updatedProducts);
      if (onCatalogChange) onCatalogChange(updatedProducts);

      // Reset form
      setEditingProductId(null);
      setNewProduct({
        name: '',
        category: 'Shoes',
        price: '',
        description: '',
        rating: '5',
        numImages: 1,
        images: [''],
        specs: ''
      });

    } catch (err) {
      setStatusMessage('');
      alert(err.message || 'Operation failed. Check environment configurations.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProductCard = async (productId) => {
    const password = sessionStorage.getItem('royalderi_admin_password');
    if (!password) {
      setAdminError('Session expired. Please log in again.');
      setIsAdminLoggedIn(false);
      return;
    }

    setIsSubmitting(true);
    setStatusMessage('Removing product from GitHub catalog repository...');

    try {
      await updateCatalogOnGit('delete', productId, password);
      
      deleteProductLocally(productId);
      
      const updatedProducts = getProducts();
      setProducts(updatedProducts);
      if (onCatalogChange) onCatalogChange(updatedProducts);

      setStatusMessage('🗑️ Product deleted! Rebuild triggered on Netlify. Live in ~1 min.');
      
      // If we were editing this product, cancel the edit mode
      if (editingProductId === productId) {
        handleCancelEdit();
      }
    } catch (err) {
      setStatusMessage('');
      alert(err.message || 'Failed to delete product from catalog.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Preset images for easy merchant card creation
  const presetImages = [
    { label: 'Florence Oxford Shoe', value: '/assets/images/wholecut_oxford.png' },
    { label: 'Plain Black Oxford Shoe', value: '/assets/images/plain_black_formal_shoe.png' },
    { label: 'Voyager Travel Duffle', value: '/assets/images/leather_travel_bag.png' },
    { label: 'Siena Designer Satchel', value: '/assets/images/leather_ladies_handbag.png' },
    { label: 'Artisan Dress Belt', value: '/assets/images/leather_grain_texture.png' },
    { label: 'Heritage Billfold Wallet', value: '/assets/images/raw_leather_material.png' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-[#141414] border border-[#B07D4F]/30 p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        {/* Close */}
        <button 
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 text-[#F9F9F9]/60 hover:text-[#B07D4F] text-lg font-semibold disabled:opacity-30"
        >
          ✕
        </button>

        {!isAdminLoggedIn ? (
          // Login Panel
          <div>
            <div className="text-center mb-6">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#B07D4F] font-semibold">Security Gate</span>
              <h3 className="text-2xl font-serif text-[#F9F9F9] mt-1">Merchant Portal</h3>
              <p className="text-[10px] text-[#F9F9F9]/55 mt-2 max-w-md mx-auto">
                Authenticate using credentials to manage products dynamically without any code edits.
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="text-[9px] uppercase tracking-[0.2em] text-[#B07D4F] font-semibold block mb-1">Username</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. RoyalDeriAdmin"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#F9F9F9]/10 text-xs px-4 py-3 outline-none text-[#F9F9F9] focus:border-[#B07D4F]"
                />
              </div>
              <div>
                <label className="text-[9px] uppercase tracking-[0.2em] text-[#B07D4F] font-semibold block mb-1">Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="Enter strong password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#F9F9F9]/10 text-xs px-4 py-3 outline-none text-[#F9F9F9] focus:border-[#B07D4F]"
                />
              </div>

              {adminError && (
                <p className="text-xs text-[#B07D4F] italic">{adminError}</p>
              )}

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#B07D4F] text-[#0A0A0A] hover:bg-[#F9F9F9] font-semibold text-xs tracking-widest uppercase transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Authenticating...' : 'Authenticate'}
              </button>
            </form>
          </div>
        ) : (
          // Admin Actions Panel
          <div>
            <div className="flex justify-between items-center border-b border-[#F9F9F9]/5 pb-4 mb-6">
              <div>
                <span className="text-[9px] uppercase tracking-[0.3em] text-[#B07D4F] font-semibold">Authorized Session</span>
                <h3 className="text-xl font-serif text-[#F9F9F9]">Boutique Inventory Manager</h3>
              </div>
              <button 
                onClick={handleAdminLogout}
                disabled={isSubmitting}
                className="px-4 py-2 border border-red-500/30 hover:border-red-500 text-red-400 hover:text-red-300 text-[9px] tracking-widest uppercase transition-colors disabled:opacity-30"
              >
                Logout
              </button>
            </div>

            {statusMessage && (
              <div className="bg-[#B07D4F]/10 border border-[#B07D4F]/30 p-4 mb-6 text-xs text-[#B07D4F] font-semibold tracking-wide rounded flex items-center justify-center text-center animate-pulse">
                {statusMessage}
              </div>
            )}

            {/* Add / Edit Product Form */}
            <form onSubmit={handleAddProductSubmit} className="space-y-4">
              <h4 className="text-xs uppercase tracking-wider text-[#F9F9F9] font-semibold">
                {editingProductId ? 'Edit Product Card' : 'Add New Product Card'}
              </h4>
              
              <div>
                <label className="text-[9px] uppercase tracking-[0.15em] text-[#B07D4F] block mb-1">Product Title *</label>
                <input 
                  type="text" required placeholder="e.g. Classic Tan Belt"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full bg-[#0A0A0A] border border-[#F9F9F9]/10 text-xs px-3 py-2.5 text-[#F9F9F9] outline-none focus:border-[#B07D4F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] uppercase tracking-[0.15em] text-[#B07D4F] block mb-1">Category *</label>
                  <select 
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full bg-[#0A0A0A] border border-[#F9F9F9]/10 text-xs px-3 py-2.5 text-[#F9F9F9] outline-none focus:border-[#B07D4F]"
                  >
                    <option value="School Bag">School Bag</option>
                    <option value="College Bag">College Bag</option>
                    <option value="Ladies Hand Bag">Ladies Hand Bag</option>
                    <option value="Travel Bag">Travel Bag</option>
                    <option value="Ladies Hand Purse">Ladies Hand Purse</option>
                    <option value="Men's Wallet">Men's Wallet</option>
                    <option value="Men's Belt">Men's Belt</option>
                    <option value="Shoes">Shoes</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] uppercase tracking-[0.15em] text-[#B07D4F] block mb-1">Price (₹) *</label>
                  <input 
                    type="number" required placeholder="e.g. 3500" min="1"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full bg-[#0A0A0A] border border-[#F9F9F9]/10 text-xs px-3 py-2.5 text-[#F9F9F9] outline-none focus:border-[#B07D4F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] uppercase tracking-[0.15em] text-[#B07D4F] block mb-1">Card Rating *</label>
                  <select 
                    value={newProduct.rating}
                    onChange={(e) => setNewProduct({...newProduct, rating: e.target.value})}
                    className="w-full bg-[#0A0A0A] border border-[#F9F9F9]/10 text-xs px-3 py-2.5 text-[#F9F9F9] outline-none focus:border-[#B07D4F]"
                  >
                    <option value="5">5 Stars</option>
                    <option value="4.5">4.5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3.5">3.5 Stars</option>
                    <option value="3">3 Stars</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] uppercase tracking-[0.15em] text-[#B07D4F] block mb-1">Number of Images</label>
                  <select
                    value={newProduct.numImages}
                    onChange={(e) => handleNumImagesChange(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-[#F9F9F9]/10 text-xs px-3 py-2.5 text-[#F9F9F9] outline-none focus:border-[#B07D4F]"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n} Image{n > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
              </div>

              {/* Multi-Image Upload Slots */}
              <div>
                <label className="text-[9px] uppercase tracking-[0.15em] text-[#B07D4F] block mb-2">Product Images *</label>
                <div className="flex space-x-4 overflow-x-auto pb-3" style={{ scrollbarWidth: 'thin' }}>
                  {Array.from({ length: newProduct.numImages }).map((_, idx) => {
                    const img = newProduct.images[idx];
                    return (
                      <div key={idx} className="w-56 flex-shrink-0 bg-[#0A0A0A] border border-[#F9F9F9]/10 p-3 rounded space-y-2 flex flex-col justify-between">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] text-[#B07D4F] uppercase tracking-wider font-semibold">Slot {idx + 1}</span>
                          {img && (
                            <button 
                              type="button" 
                              onClick={() => handleImageChange(idx, '')}
                              className="text-red-400 hover:text-red-300 text-[9px] uppercase tracking-widest"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                        
                        {img ? (
                          <div className="w-full h-20 bg-[#141414] border border-[#F9F9F9]/5 rounded flex items-center justify-center overflow-hidden">
                            <img src={img} alt={`Slot ${idx + 1}`} className="w-full h-full object-contain" />
                          </div>
                        ) : (
                          <div className="w-full h-20 bg-[#141414] border border-[#F9F9F9]/5 rounded flex flex-col items-center justify-center p-2 text-center text-[10px] text-[#F9F9F9]/40 border-dashed">
                            <span>No Image Added</span>
                          </div>
                        )}

                        <div className="space-y-1.5">
                          <input
                            type="text"
                            placeholder="Paste Image URL"
                            value={img || ''}
                            onChange={(e) => handleImageChange(idx, e.target.value)}
                            className="w-full bg-[#141414] border border-[#F9F9F9]/10 text-[10px] px-2 py-1 text-[#F9F9F9] outline-none focus:border-[#B07D4F]"
                          />
                          <select
                            onChange={(e) => {
                              if (e.target.value) handleImageChange(idx, e.target.value);
                            }}
                            className="w-full bg-[#141414] border border-[#F9F9F9]/10 text-[10px] px-2 py-1 text-[#F9F9F9] outline-none focus:border-[#B07D4F]"
                            defaultValue=""
                          >
                            <option value="" disabled>Or Select Preset Image...</option>
                            {presetImages.map((p, i) => (
                              <option key={i} value={p.value}>{p.label}</option>
                            ))}
                          </select>
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageFileUpload(idx, e.target.files[0])}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="w-full bg-[#B07D4F] hover:bg-[#F9F9F9] text-[#0A0A0A] text-[9px] font-semibold tracking-wider uppercase text-center py-1 rounded transition-colors duration-200">
                              Upload File
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-[9px] uppercase tracking-[0.15em] text-[#B07D4F] block mb-1">Specifications (Comma-Separated)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Genuine Calfskin Leather, Goodyear Welted Sole, Hand-Burnished"
                  value={newProduct.specs}
                  onChange={(e) => setNewProduct({...newProduct, specs: e.target.value})}
                  className="w-full bg-[#0A0A0A] border border-[#F9F9F9]/10 text-xs px-3 py-2.5 text-[#F9F9F9] outline-none focus:border-[#B07D4F]"
                />
              </div>

              <div>
                <label className="text-[9px] uppercase tracking-[0.15em] text-[#B07D4F] block mb-1">Simple Description *</label>
                <textarea 
                  required placeholder="A short description of materials, zipper quality, pockets..."
                  rows="3"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="w-full bg-[#0A0A0A] border border-[#F9F9F9]/10 text-xs px-3 py-2 text-[#F9F9F9] outline-none resize-none focus:border-[#B07D4F]"
                />
              </div>

              <div className="space-y-2 pt-2">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#B07D4F] hover:bg-[#F9F9F9] hover:text-[#0A0A0A] text-[#0A0A0A] font-semibold text-xs tracking-widest uppercase transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Syncing with GitHub...' : (editingProductId ? 'Save Product Changes' : 'Add Card to Website')}
                </button>

                {editingProductId && (
                  <button 
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={isSubmitting}
                    className="w-full py-2.5 bg-transparent border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white font-semibold text-xs tracking-widest uppercase transition-colors disabled:opacity-30"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>

            {/* Active inventory management list */}
            <div className="mt-8 border-t border-[#F9F9F9]/5 pt-6">
              <h4 className="text-[10px] tracking-[0.2em] text-[#F9F9F9] uppercase font-semibold mb-4">Active Catalog ({products.length} Products)</h4>
              <div className="space-y-2 pr-1 max-h-[220px] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                {products.map(p => (
                  <div key={p.id} className="flex justify-between items-center p-3 bg-[#0A0A0A] border border-[#F9F9F9]/5 text-xs">
                    <div className="flex items-center space-x-3 min-w-0 flex-1 pr-4">
                      <img src={p.images?.[0] || p.image || '/assets/images/wholecut_oxford.png'} className="w-8 h-8 object-contain flex-shrink-0" alt="" />
                      <div className="min-w-0">
                        <p className="font-semibold text-[#F9F9F9] truncate" title={p.name}>{p.name}</p>
                        <p className="text-[10px] text-[#B07D4F] truncate">{p.category} | ₹{p.price.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <button 
                        onClick={() => handleStartEdit(p)}
                        disabled={isSubmitting}
                        className="text-[#B07D4F] hover:text-[#F9F9F9] font-semibold px-2.5 py-1.5 border border-[#B07D4F]/20 hover:border-[#B07D4F] uppercase text-[9px] tracking-wider transition-colors disabled:opacity-30"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteProductCard(p.id)}
                        disabled={isSubmitting}
                        className="text-red-400 hover:text-red-300 font-semibold px-2.5 py-1.5 border border-red-500/10 hover:border-red-500/40 uppercase text-[9px] tracking-wider transition-colors disabled:opacity-30"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
