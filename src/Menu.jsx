import React, { useState, useEffect } from 'react';
import { seedProducts, getProducts, saveCart, loadCart } from './productStore';
import AdminPortal from './AdminPortal';

export default function Menu() {
  // Seed the catalog on load
  seedProducts();

  // State Management
  const [products, setProducts] = useState(getProducts());
  const [scrollY, setScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');

  // Admin Portal State
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Card Image Index Tracker (maps productId to active image index)
  const [cardImageIndices, setCardImageIndices] = useState({});

  // Product Detail Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeDetailImageIndex, setActiveDetailImageIndex] = useState(0);

  const getProductActiveImageIndex = (productId) => {
    return cardImageIndices[productId] || 0;
  };

  const handleNextCardImage = (e, product) => {
    e.stopPropagation();
    const currentIndex = getProductActiveImageIndex(product.id);
    const imagesCount = product.images?.length || 1;
    const nextIndex = (currentIndex + 1) % imagesCount;
    setCardImageIndices({ ...cardImageIndices, [product.id]: nextIndex });
  };

  const handlePrevCardImage = (e, product) => {
    e.stopPropagation();
    const currentIndex = getProductActiveImageIndex(product.id);
    const imagesCount = product.images?.length || 1;
    const prevIndex = (currentIndex - 1 + imagesCount) % imagesCount;
    setCardImageIndices({ ...cardImageIndices, [product.id]: prevIndex });
  };

  // Track scroll position to style navigation header
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOrderNow = (product) => {
    const currentCart = loadCart();
    const existingIndex = currentCart.findIndex(item => item.id === product.id);
    if (existingIndex > -1) {
      currentCart[existingIndex].quantity += 1;
    } else {
      currentCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || product.image || '/assets/images/wholecut_oxford.png',
        quantity: 1,
        isCustom: false
      });
    }
    saveCart(currentCart);
    window.location.hash = '#contact';
  };



  // Star Ratings Renderer (Full / Empty / Half SVGs)
  const renderStars = (rating = 5) => {
    const stars = [];
    const floorRating = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= floorRating) {
        stars.push(
          <svg key={i} className="w-3.5 h-3.5 text-[#B07D4F] fill-current" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        );
      } else if (i - 0.5 <= rating) {
        stars.push(
          <svg key={i} className="w-3.5 h-3.5 text-[#B07D4F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <defs>
              <linearGradient id={`halfGrad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="50%" stopColor="#B07D4F" />
                <stop offset="50%" stopColor="transparent" stopOpacity="1" />
              </linearGradient>
            </defs>
            <path fill={`url(#halfGrad-${i})`} stroke="#B07D4F" strokeLinejoin="round" strokeLinecap="round" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        );
      } else {
        stars.push(
          <svg key={i} className="w-3.5 h-3.5 text-[#F9F9F9]/20 fill-current" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        );
      }
    }
    return <div className="flex space-x-1">{stars}</div>;
  };



  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F9F9F9] font-sans selection:bg-[#B07D4F] selection:text-[#0A0A0A] overflow-x-hidden">
      
      {/* LUXURY NAVIGATION HEADER */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        scrollY > 50 ? 'bg-[#0A0A0A]/95 border-b border-[#F9F9F9]/5' : 'bg-[#0A0A0A]/80 border-b border-transparent'
      } backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-24 flex items-center justify-between">
          
          {/* Logo Section */}
          <a href="#home" className="flex items-center space-x-4 group">
            <div className="relative flex items-center justify-center w-12 h-12 border border-[#B07D4F]/30 rounded-full bg-[#141414] group-hover:border-[#B07D4F] transition-colors duration-300">
              <svg className="w-10 h-10 text-[#B07D4F]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" stroke="#B07D4F" strokeWidth="0.5" strokeDasharray="2 2" />
                <path d="M36 32V68M36 32H50C57 32 57 46 50 46H36M50 46L62 68" stroke="#F9F9F9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M46 32H56C65 32 65 68 56 68H46" stroke="#B07D4F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M58 48V68H70" stroke="#F9F9F9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-serif tracking-[0.2em] text-[#F9F9F9] group-hover:text-[#B07D4F] transition-colors duration-300">
                ROYAL DERI
              </span>
              <span className="text-[9px] tracking-[0.35em] text-[#B07D4F] uppercase font-semibold">
                Leathers
              </span>
            </div>
          </a>

          {/* Clean Navbar Links */}
          <nav className="hidden lg:flex items-center space-x-12 text-xs tracking-[0.22em] uppercase font-semibold">
            <a href="#home" className="hover:text-[#B07D4F] transition-colors duration-300 relative group py-2">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#B07D4F] transition-all duration-300 group-hover:w-full"></span>
            </a>
            
            <a href="#about" className="hover:text-[#B07D4F] transition-colors duration-300 relative group py-2">
              About
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#B07D4F] transition-all duration-300 group-hover:w-full"></span>
            </a>

            <a href="#menu" className="text-[#B07D4F] relative py-2">
              Menu
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#B07D4F]"></span>
            </a>

            <a href="#contact" className="hover:text-[#B07D4F] transition-colors duration-300 relative group py-2">
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#B07D4F] transition-all duration-300 group-hover:w-full"></span>
            </a>



            {/* Admin Portal Toggle */}
            <button 
              onClick={() => setIsAdminOpen(true)}
              className="hover:text-[#B07D4F] transition-colors duration-300 py-2 uppercase flex items-center space-x-1 text-[#B07D4F]"
              title="Admin Portal"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Portal</span>
            </button>
          </nav>

          {/* Hamburger Trigger visible on mobile/tablet */}
          <div className="flex lg:hidden items-center space-x-4">


            <button 
              onClick={() => setIsAdminOpen(true)}
              className="text-[#F9F9F9] hover:text-[#B07D4F] transition-colors duration-300 p-2"
              title="Admin Portal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </button>

            <button 
              onClick={() => setIsMenuOpen(true)}
              className="flex items-center space-x-2 px-4 py-3 bg-[#141414] hover:bg-[#B07D4F] hover:text-[#0A0A0A] text-[#F9F9F9] transition-all duration-300 border border-[#F9F9F9]/5"
            >
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold">Menu</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* CLICK-ACTIVATED SIDE MENU DRAWER */}
      <div className={`fixed inset-0 z-[100] transition-all duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div onClick={() => setIsMenuOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-[#141414] border-l border-[#B07D4F]/20 p-8 flex flex-col justify-between shadow-2xl transition-transform duration-500 ease-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div>
            <div className="flex justify-between items-center pb-8 border-b border-[#F9F9F9]/5 mb-10">
              <span className="text-xs tracking-[0.3em] uppercase text-[#B07D4F] font-semibold">Navigation Directory</span>
              <button onClick={() => setIsMenuOpen(false)} className="text-[#F9F9F9]/60 hover:text-[#B07D4F] text-sm tracking-widest uppercase transition-colors">Close ✕</button>
            </div>

            <div className="space-y-8">
              <div>
                <h4 className="text-[10px] tracking-[0.25em] text-[#B07D4F] uppercase font-semibold mb-3">Sections</h4>
                <ul className="space-y-4 pl-2 border-l border-[#B07D4F]/10">
                  <li><a href="#home" onClick={() => setIsMenuOpen(false)} className="text-base font-serif uppercase tracking-wider text-[#F9F9F9]/80 hover:text-[#B07D4F] transition-colors block">Home</a></li>
                  <li><a href="#about" onClick={() => setIsMenuOpen(false)} className="text-base font-serif uppercase tracking-wider text-[#F9F9F9]/80 hover:text-[#B07D4F] transition-colors block">About</a></li>
                  <li><a href="#menu" onClick={() => setIsMenuOpen(false)} className="text-base font-serif uppercase tracking-wider text-[#F9F9F9]/80 hover:text-[#B07D4F] transition-colors block">Menu</a></li>
                  <li><a href="#contact" onClick={() => setIsMenuOpen(false)} className="text-base font-serif uppercase tracking-wider text-[#F9F9F9]/80 hover:text-[#B07D4F] transition-colors block">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-[#F9F9F9]/5 pt-8 mt-8 space-y-4">
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-[#F9F9F9]/75 mb-3">Direct Ordering Hotline</p>
              <a href="tel:8903553679" className="w-full py-4 bg-[#B07D4F] text-[#0A0A0A] hover:bg-[#F9F9F9] transition-all duration-300 font-semibold text-xs tracking-[0.2em] uppercase text-center block">
                Call & Order: 8903553679
              </a>
            </div>
            <div>
              <a href="#contact" onClick={() => setIsMenuOpen(false)} className="w-full py-4 border border-[#B07D4F] text-[#B07D4F] hover:bg-[#B07D4F] hover:text-[#0A0A0A] transition-all duration-300 font-semibold text-xs tracking-[0.2em] uppercase text-center block">
                WhatsApp Order Form
              </a>
            </div>
          </div>
        </div>
      </div>



      {/* MERCHANT / ADMIN PORTAL MODAL */}
      <AdminPortal 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
        onCatalogChange={() => setProducts(getProducts())}
      />

      {/* PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-5xl bg-[#141414] border border-[#B07D4F]/30 grid grid-cols-1 md:grid-cols-12 max-h-[90vh] overflow-y-auto">
            {/* Close */}
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-6 right-6 text-[#F9F9F9]/60 hover:text-[#B07D4F] text-xl font-semibold z-50"
            >
              ✕
            </button>

            {/* Product Image Section */}
            <div className="md:col-span-6 bg-black/40 border-b md:border-b-0 md:border-r border-[#F9F9F9]/5 p-8 flex flex-col items-center justify-center min-h-[350px]">
              <div className="relative w-full flex items-center justify-center aspect-square max-w-[360px]">
                <img 
                  src={selectedProduct.images?.[activeDetailImageIndex] || selectedProduct.image || '/assets/images/wholecut_oxford.png'} 
                  alt={selectedProduct.name} 
                  className="max-h-[320px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)]"
                />

                {/* Left/Right controls inside detail modal if multiple images */}
                {selectedProduct.images && selectedProduct.images.length > 1 && (
                  <>
                    <button 
                      onClick={() => setActiveDetailImageIndex(prev => prev === 0 ? selectedProduct.images.length - 1 : prev - 1)}
                      className="absolute left-2 w-10 h-10 border border-[#F9F9F9]/10 bg-black/60 hover:border-[#B07D4F] text-[#F9F9F9] flex items-center justify-center transition-colors"
                    >
                      ‹
                    </button>
                    <button 
                      onClick={() => setActiveDetailImageIndex(prev => prev === selectedProduct.images.length - 1 ? 0 : prev + 1)}
                      className="absolute right-2 w-10 h-10 border border-[#F9F9F9]/10 bg-black/60 hover:border-[#B07D4F] text-[#F9F9F9] flex items-center justify-center transition-colors"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails indicator */}
              {selectedProduct.images && selectedProduct.images.length > 1 && (
                <div className="flex space-x-2 mt-6 overflow-x-auto max-w-full pb-2 snap-x">
                  {selectedProduct.images.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveDetailImageIndex(idx)}
                      className={`w-12 h-12 flex-shrink-0 border bg-black snap-center transition-all ${
                        activeDetailImageIndex === idx ? 'border-[#B07D4F] scale-105' : 'border-[#F9F9F9]/10 hover:border-[#B07D4F]/50'
                      }`}
                    >
                      <img src={img} className="w-full h-full object-contain" alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info Panel */}
            <div className="md:col-span-6 p-8 md:p-12 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#B07D4F] font-semibold">Bespoke Detail</span>
                <h3 className="text-3xl font-serif text-[#F9F9F9] mt-2 mb-4 break-words">{selectedProduct.name}</h3>
                <p className="text-xs text-[#F9F9F9]/70 tracking-wider mb-6 break-words">{selectedProduct.category}</p>
                
                <p className="text-sm text-[#F9F9F9]/80 font-light leading-relaxed mb-8 break-words">
                  {selectedProduct.description}
                </p>

                <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#B07D4F] mb-4 font-semibold">Craft Specifications</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#F9F9F9]/70 mb-8 font-light">
                  {selectedProduct.specs?.map((spec, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <span className="h-[3px] w-[3px] bg-[#B07D4F] rounded-full"></span>
                      <span className="break-words">{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between border-t border-[#F9F9F9]/5 pt-6 mt-6 gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-[#F9F9F9]/70">Exclusive Price</p>
                  <p className="text-xl font-serif text-[#B07D4F] font-semibold mt-1 break-all">₹{selectedProduct.price.toLocaleString('en-IN')}</p>
                </div>
                
                <div className="flex-shrink-0">
                  <button 
                    onClick={() => {
                      handleOrderNow(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="px-6 py-4 bg-[#B07D4F] text-[#0A0A0A] hover:bg-[#F9F9F9] hover:text-[#0A0A0A] font-semibold text-[10px] tracking-[0.15em] uppercase transition-colors duration-300 text-center block"
                  >
                    Buy Now (WhatsApp Order)
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MENU PAGE HERO */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-36 pb-24">
        <div className="mb-16">
          <div className="inline-flex items-center space-x-3 mb-4">
            <span className="h-[1px] w-8 bg-[#B07D4F]"></span>
            <span className="text-xs uppercase tracking-[0.4em] text-[#B07D4F] font-semibold">Exquisite Collection</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-[#F9F9F9] tracking-tight">
            THE LEATHER <span className="italic font-light text-[#B07D4F]">CATALOGUE</span>
          </h1>
          <p className="text-[#F9F9F9]/60 text-sm max-w-xl mt-4 leading-relaxed font-light">
            Browse our complete selection of handcrafted leather artifacts. From everyday school and college bags to designer satchels, English bridle belts, HorweenChromexcel wallets, and Goodyear-welted footwear.
          </p>
        </div>

        {/* Dynamic Category Filters */}
        <div className="flex flex-wrap gap-3 mb-12 text-[10px] tracking-[0.2em] uppercase font-semibold">
          {['All', 'Footwear', 'Bags', 'Accessories'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-5 py-2.5 border transition-all duration-300 ${
                activeCategoryFilter === cat 
                  ? 'bg-[#B07D4F] border-[#B07D4F] text-[#0A0A0A]' 
                  : 'border-[#F9F9F9]/10 text-[#F9F9F9]/70 hover:border-[#B07D4F]/50 hover:text-[#B07D4F]'
              }`}
            >
              {cat === 'All' ? 'All Goods' : cat}
            </button>
          ))}
        </div>



        {/* Product Cards Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products
            .filter((product) => {
              if (activeCategoryFilter === 'All') return true;
              if (activeCategoryFilter === 'Footwear') return product.category === 'Shoes';
              if (activeCategoryFilter === 'Bags') {
                return ['Travel Bag', 'Ladies Hand Bag', 'School Bag', 'College Bag'].includes(product.category);
              }
              if (activeCategoryFilter === 'Accessories') {
                return ["Men's Belt", "Men's Wallet", 'Ladies Hand Purse'].includes(product.category);
              }
              return true;
            })
            .map((product) => {
              const activeImgIndex = getProductActiveImageIndex(product.id);
              const activeImg = product.images?.[activeImgIndex] || product.image || '/assets/images/wholecut_oxford.png';

              return (
                <div 
                  key={product.id}
                  onClick={() => {
                    setSelectedProduct(product);
                    setActiveDetailImageIndex(0);
                  }}
                  className="bg-[#141414] border border-[#F9F9F9]/5 hover:border-[#B07D4F]/20 transition-all duration-500 flex flex-col justify-between group relative cursor-pointer"
                >


                  {/* Card Image Wrapper */}
                  <div className="p-8 flex items-center justify-center bg-[#0A0A0A]/40 border-b border-[#F9F9F9]/5 relative min-h-[220px]">
                    <img 
                      src={activeImg} 
                      alt={product.name}
                      className="max-h-[180px] object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.7)] transform group-hover:scale-105 transition-transform duration-700 ease-out select-none"
                    />

                    {/* Local Arrow controls if multiple images */}
                    {product.images && product.images.length > 1 && (
                      <>
                        <button 
                          onClick={(e) => handlePrevCardImage(e, product)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-[#F9F9F9]/10 bg-black/60 hover:border-[#B07D4F] text-[#F9F9F9] flex items-center justify-center transition-colors z-10 font-bold"
                        >
                          ‹
                        </button>
                        <button 
                          onClick={(e) => handleNextCardImage(e, product)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-[#F9F9F9]/10 bg-black/60 hover:border-[#B07D4F] text-[#F9F9F9] flex items-center justify-center transition-colors z-10 font-bold"
                        >
                          ›
                        </button>
                      </>
                    )}
                  </div>

                  {/* Card Details & Interaction */}
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] uppercase tracking-[0.25em] text-[#B07D4F] font-semibold break-words">
                          {product.category}
                        </span>
                        {renderStars(product.rating || 5)}
                      </div>
                      
                      <h3 className="text-xl font-serif text-[#F9F9F9] group-hover:text-[#B07D4F] transition-colors duration-300 break-words">
                        {product.name}
                      </h3>
                      
                      <p className="text-xs text-[#F9F9F9]/60 font-light leading-relaxed break-words">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-[#F9F9F9]/5 gap-4">
                      <div className="flex flex-col min-w-0 flex-1 pr-2">
                        <span className="text-[8px] uppercase tracking-widest text-[#F9F9F9]/40">Price</span>
                        <span className="text-base sm:text-lg font-serif text-[#B07D4F] font-bold break-all whitespace-normal">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOrderNow(product);
                        }}
                        className="px-6 py-3 bg-[#B07D4F] text-[#0A0A0A] hover:bg-[#F9F9F9] hover:text-[#0A0A0A] transition-all duration-300 text-[10px] tracking-[0.2em] uppercase font-semibold shadow-lg flex-shrink-0"
                      >
                        Order Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </main>

      {/* DYNAMIC CATEGORY FOOTER */}
      <footer className="bg-[#141414] border-t border-[#F9F9F9]/5 py-16 relative z-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 mb-12">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative flex items-center justify-center w-8 h-8 border border-[#B07D4F]/30 rounded-full bg-[#0A0A0A]">
                <span className="text-[10px] font-serif text-[#B07D4F] font-bold">RD</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-serif tracking-[0.2em] text-[#F9F9F9]">ROYAL DERI</span>
                <span className="text-[7px] tracking-[0.3em] text-[#B07D4F] uppercase font-semibold">Leathers</span>
              </div>
            </div>
            <p className="text-[10px] text-[#F9F9F9]/50 leading-relaxed font-light uppercase tracking-wider">
              Master craftsmen of premium leather products. Enduring style and bespoke quality.
            </p>
          </div>

          {/* Column 2: Bags */}
          <div>
            <h4 className="text-[10px] tracking-[0.25em] text-[#B07D4F] uppercase font-semibold mb-4">Bags</h4>
            <ul className="space-y-2.5 text-[10px] tracking-[0.15em] text-[#F9F9F9]/60 uppercase font-light">
              <li><a href="#menu" onClick={() => setActiveCategoryFilter('Bags')} className="hover:text-[#B07D4F] transition-colors">School Bag</a></li>
              <li><a href="#menu" onClick={() => setActiveCategoryFilter('Bags')} className="hover:text-[#B07D4F] transition-colors">College Bag</a></li>
              <li><a href="#menu" onClick={() => setActiveCategoryFilter('Bags')} className="hover:text-[#B07D4F] transition-colors">Ladies Hand Bag</a></li>
              <li><a href="#menu" onClick={() => setActiveCategoryFilter('Bags')} className="hover:text-[#B07D4F] transition-colors">Travel Bag</a></li>
            </ul>
          </div>

          {/* Column 3: Accessories */}
          <div>
            <h4 className="text-[10px] tracking-[0.25em] text-[#B07D4F] uppercase font-semibold mb-4">Accessories</h4>
            <ul className="space-y-2.5 text-[10px] tracking-[0.15em] text-[#F9F9F9]/60 uppercase font-light">
              <li><a href="#menu" onClick={() => setActiveCategoryFilter('Accessories')} className="hover:text-[#B07D4F] transition-colors">Ladies Hand Purse</a></li>
              <li><a href="#menu" onClick={() => setActiveCategoryFilter('Accessories')} className="hover:text-[#B07D4F] transition-colors">Men's Wallet</a></li>
              <li><a href="#menu" onClick={() => setActiveCategoryFilter('Accessories')} className="hover:text-[#B07D4F] transition-colors">Men's Belt</a></li>
            </ul>
          </div>

          {/* Column 4: Footwear */}
          <div>
            <h4 className="text-[10px] tracking-[0.25em] text-[#B07D4F] uppercase font-semibold mb-4">Footwear</h4>
            <ul className="space-y-2.5 text-[10px] tracking-[0.15em] text-[#F9F9F9]/60 uppercase font-light">
              <li><a href="#menu" onClick={() => setActiveCategoryFilter('Footwear')} className="hover:text-[#B07D4F] transition-colors">Shoes</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 border-t border-[#F9F9F9]/5 flex flex-col md:flex-row justify-between items-center text-[10px] tracking-[0.2em] text-[#F9F9F9]/65 uppercase space-y-4 md:space-y-0">
          <p>© {new Date().getFullYear()} RoyalDeriLeathers. All Rights Reserved.</p>
          <div className="flex space-x-6 font-light">
            <a href="#home" className="hover:text-[#B07D4F] transition-colors duration-300">Home</a>
            <span>/</span>
            <a href="#about" className="hover:text-[#B07D4F] transition-colors duration-300">About</a>
            <span>/</span>
            <a href="#menu" className="hover:text-[#B07D4F] transition-colors duration-300 text-[#B07D4F]">Menu</a>
            <span>/</span>
            <a href="#contact" className="hover:text-[#B07D4F] transition-colors duration-300">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
