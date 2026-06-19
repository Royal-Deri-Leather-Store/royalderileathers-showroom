import React, { useState, useEffect } from 'react';
import { seedProducts, getProducts, loadCart, saveCart } from './productStore';
import AdminPortal from './AdminPortal';

// DESIGN SYSTEM COLORS
// Background: #0A0A0A (Pure Pitch Black)
// Section Blocks: #141414 (Deep Velvet Charcoal)
// Interactive Accent: #B07D4F (Italian Whiskey Tan)
// Typography: #F9F9F9 (Crisp Ivory White)

export default function Contact() {
  // Seed product catalog synchronously before first render
  seedProducts();
  const [products, setProducts] = useState(getProducts());
  const [scrollY, setScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    address: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Cart Drawer & Page Cart State
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [customItem, setCustomItem] = useState({ name: '', price: '' });
  const [showCustomFields, setShowCustomFields] = useState(false);
  const [cartError, setCartError] = useState('');

  // Five Extra Dropdown options
  const [extraProducts, setExtraProducts] = useState(
    Array.from({ length: 5 }, () => ({ productId: '', quantity: 1 }))
  );

  // Admin / Merchant Portal State
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Submit / Redirect State
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');

  // Sync cart helper
  const updateCartState = (newCart) => {
    setCartItems(newCart);
    saveCart(newCart);
  };

  // Sync standard cart items to form extra product slot dropdowns
  useEffect(() => {
    const standardItems = cartItems.filter(item => !item.isCustom);
    const newExtras = Array.from({ length: 5 }, (_, idx) => {
      if (idx < standardItems.length) {
        return {
          productId: standardItems[idx].id,
          quantity: standardItems[idx].quantity
        };
      }
      return { productId: '', quantity: 1 };
    });
    setExtraProducts(newExtras);
  }, [cartItems]);

  const handleExtraProductChange = (idx, newProductId) => {
    const standardItems = cartItems.filter(item => !item.isCustom);
    const customItems = cartItems.filter(item => item.isCustom);
    
    if (newProductId === '') {
      if (idx < standardItems.length) {
        standardItems.splice(idx, 1);
      }
    } else {
      const prod = products.find(p => p.id === newProductId);
      if (prod) {
        if (idx < standardItems.length) {
          standardItems[idx] = {
            id: prod.id,
            name: prod.name,
            price: prod.price,
            image: prod.images?.[0] || prod.image || '/assets/images/wholecut_oxford.png',
            quantity: standardItems[idx].quantity,
            isCustom: false
          };
        } else {
          standardItems.push({
            id: prod.id,
            name: prod.name,
            price: prod.price,
            image: prod.images?.[0] || prod.image || '/assets/images/wholecut_oxford.png',
            quantity: 1,
            isCustom: false
          });
        }
      }
    }
    
    const newCart = [...standardItems, ...customItems];
    updateCartState(newCart);
  };

  const handleExtraQtyChange = (idx, newQty) => {
    const standardItems = cartItems.filter(item => !item.isCustom);
    const customItems = cartItems.filter(item => item.isCustom);
    
    if (idx < standardItems.length) {
      standardItems[idx].quantity = newQty;
      const newCart = [...standardItems, ...customItems];
      updateCartState(newCart);
    }
  };

  // Check scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parse pending order or load cart on mount
  useEffect(() => {
    const pendingOrder = localStorage.getItem('royalderi_pending_order');
    if (pendingOrder) {
      try {
        const item = JSON.parse(pendingOrder);
        const newCart = [
          {
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.images?.[0] || item.image || '/assets/images/wholecut_oxford.png',
            quantity: item.quantity || 1,
            isCustom: false
          }
        ];
        updateCartState(newCart);
        localStorage.removeItem('royalderi_pending_order');
      } catch (e) {
        console.error('Error parsing pending order:', e);
      }
    } else {
      setCartItems(loadCart());
    }
  }, []);

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Add Item to Cart
  const handleAddItem = (e) => {
    e.preventDefault();
    setCartError('');

    if (showCustomFields) {
      // Validate Custom Fields
      if (!customItem.name.trim()) {
        setCartError('Please enter custom item name.');
        return;
      }
      const priceVal = parseFloat(customItem.price);
      if (isNaN(priceVal) || priceVal <= 0) {
        setCartError('Please enter a valid price greater than 0.');
        return;
      }

      // Add custom item
      const newItem = {
        id: `custom_${Date.now()}`,
        name: customItem.name.trim(),
        price: priceVal,
        quantity: 1,
        isCustom: true
      };

      setCartItems((prev) => [...prev, newItem]);
      setCustomItem({ name: '', price: '' });
      setShowCustomFields(false);
      setSelectedProductId('');
    } else {
      if (!selectedProductId) {
        setCartError('Please select a product from the list.');
        return;
      }

      const product = products.find((p) => p.id === selectedProductId);
      if (!product) return;

      // Check if already in cart
      setCartItems((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          return [...prev, { ...product, quantity: 1, isCustom: false }];
        }
      });

      setSelectedProductId('');
    }
  };

  // Update Item Quantity
  const handleQtyChange = (itemId, change) => {
    const updated = cartItems.map((item) => {
      if (item.id === itemId) {
        const newQty = item.quantity + change;
        return { ...item, quantity: newQty > 0 ? newQty : 1 };
      }
      return item;
    });
    updateCartState(updated);
  };

  // Remove Item
  const handleRemoveItem = (itemId) => {
    const updated = cartItems.filter((item) => item.id !== itemId);
    updateCartState(updated);
  };

  const handlePlaceOrder = () => {
    setIsCartOpen(false);
  };

  // Select Dropdown Handler
  const handleSelectChange = (e) => {
    const val = e.target.value;
    setSelectedProductId(val);
    if (val === 'custom') {
      setShowCustomFields(true);
    } else {
      setShowCustomFields(false);
    }
  };

  // Validate form details
  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const nameRegex = /^[a-zA-Z\s]+$/;

    if (!formData.name.trim()) {
      errors.name = 'Full name is required.';
    } else if (formData.name.trim().length < 3) {
      errors.name = 'Name must be at least 3 characters.';
    } else if (!nameRegex.test(formData.name.trim())) {
      errors.name = 'Name should only contain letters and spaces.';
    }

    if (!formData.mobile.trim()) {
      errors.mobile = 'Mobile number is required.';
    } else if (!phoneRegex.test(formData.mobile.trim())) {
      errors.mobile = 'Please enter a valid 10-digit mobile number.';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!formData.address.trim()) {
      errors.address = 'Shipping address is required.';
    } else if (formData.address.trim().length < 10) {
      errors.address = 'Please provide a complete shipping address (min 10 chars).';
    }

    const hasCartItems = cartItems.length > 0;
    if (!hasCartItems) {
      setCartError('Please add at least one product to check out.');
      return false;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };



  // Calculate Cart Totals
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const grandTotal = cartTotal;

  // Submit Order Handler
  const handleSubmitOrder = (e) => {
    e.preventDefault();
    setCartError('');

    if (!validateForm()) {
      return;
    }

    // Combine cart items
    const finalItems = cartItems.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      totalPrice: item.price * item.quantity
    }));

    const orderItemsText = finalItems
      .map(
        (item) =>
          `• *${item.name}* (Qty: ${item.quantity}) - ₹${item.totalPrice.toLocaleString('en-IN')}`
      )
      .join('\n');

    const message = `*NEW ORDER - ROYAL DERI LEATHERS*
----------------------------------
*Customer Details:*
*Name:* ${formData.name.trim()}
*Mobile:* ${formData.mobile.trim()}
*Email:* ${formData.email.trim()}
*Shipping Address:*
${formData.address.trim()}

*Order Details:*
${orderItemsText}

*Grand Total:* ₹${grandTotal.toLocaleString('en-IN')}
----------------------------------
Please confirm my order. Thank you!`;

    // WhatsApp base URL for 918903553679
    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/918903553679?text=${encodedMessage}`;

    setWhatsappUrl(waUrl);
    setIsRedirecting(true);

    // Clear cart in local storage upon checkout placement
    updateCartState([]);

    // Auto redirect
    window.location.href = waUrl;
  };

  // Helper check for gmail
  const isGmail = formData.email.trim().toLowerCase().endsWith('@gmail.com');

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F9F9F9] font-sans selection:bg-[#B07D4F] selection:text-[#0A0A0A] overflow-x-hidden">
      
      {/* LUXURY NAVIGATION HEADER */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        scrollY > 50 ? 'bg-[#0A0A0A]/95' : 'bg-[#0A0A0A]/80'
      } backdrop-blur-md border-b border-[#F9F9F9]/5`}>
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

            <a href="#menu" className="hover:text-[#B07D4F] transition-colors duration-300 relative group py-2">
              Menu
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#B07D4F] transition-all duration-300 group-hover:w-full"></span>
            </a>

            <a href="#contact" className="text-[#B07D4F] relative py-2">
              Contact
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#B07D4F]"></span>
            </a>



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
        {/* Backdrop overlay */}
        <div 
          onClick={() => setIsMenuOpen(false)}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        {/* Drawer Panel */}
        <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-[#141414] border-l border-[#B07D4F]/20 p-8 flex flex-col justify-between shadow-2xl transition-transform duration-500 ease-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div>
            <div className="flex justify-between items-center pb-8 border-b border-[#F9F9F9]/5 mb-10">
              <span className="text-xs tracking-[0.3em] uppercase text-[#B07D4F] font-semibold">Navigation Directory</span>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="text-[#F9F9F9]/60 hover:text-[#B07D4F] text-sm tracking-widest uppercase transition-colors"
              >
                Close ✕
              </button>
            </div>

            {/* Menu options structure */}
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

          {/* Bottom Call & Order details */}
          <div className="border-t border-[#F9F9F9]/5 pt-8 mt-8 space-y-4">
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-[#F9F9F9]/75 mb-3">Direct Ordering Hotline</p>
              <a 
                href="tel:8903553679"
                className="w-full py-4 bg-[#B07D4F] text-[#0A0A0A] hover:bg-[#F9F9F9] transition-all duration-300 font-semibold text-xs tracking-[0.2em] uppercase text-center block"
              >
                Call & Order: 8903553679
              </a>
            </div>
            <div>
              <a 
                href="#contact"
                onClick={() => setIsMenuOpen(false)}
                className="w-full py-4 border border-[#B07D4F] text-[#B07D4F] hover:bg-[#B07D4F] hover:text-[#0A0A0A] transition-all duration-300 font-semibold text-xs tracking-[0.2em] uppercase text-center block"
              >
                WhatsApp Order Form
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* REDIRECT SCREEN OVERLAY */}
      {isRedirecting && (
        <div className="fixed inset-0 z-[150] flex flex-col items-center justify-center bg-[#0A0A0A] p-6 text-center">
          <div className="w-20 h-20 border border-[#B07D4F] rounded-full flex items-center justify-center animate-spin mb-8">
            <div className="w-16 h-16 border-t-2 border-[#F9F9F9] rounded-full"></div>
          </div>
          <h2 className="text-3xl font-serif text-[#F9F9F9] tracking-wide mb-4">ORDER PREPARED</h2>
          <p className="text-[#F9F9F9]/75 text-sm max-w-md leading-relaxed mb-8">
            We are redirecting you to WhatsApp to complete your order. If it does not load automatically, please click the button below.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <a 
              href={whatsappUrl}
              className="px-8 py-4 bg-[#B07D4F] text-[#0A0A0A] hover:bg-[#F9F9F9] transition-all duration-300 font-semibold text-xs tracking-[0.2em] uppercase text-center"
            >
              Open WhatsApp Manually
            </a>
            <button 
              onClick={() => setIsRedirecting(false)}
              className="px-8 py-4 border border-[#F9F9F9]/20 hover:border-[#B07D4F] transition-all duration-300 font-semibold text-xs tracking-[0.2em] uppercase text-center"
            >
              Edit Order Details
            </button>
          </div>
        </div>
      )}

      {/* CONTACT PAGE MAIN WRAPPER */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-36 pb-24">
        
        {/* Page Intro Block */}
        <div className="mb-16">
          <div className="inline-flex items-center space-x-3 mb-4">
            <span className="h-[1px] w-8 bg-[#B07D4F]"></span>
            <span className="text-xs uppercase tracking-[0.4em] text-[#B07D4F] font-semibold">Bespoke Orders</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-[#F9F9F9] tracking-tight">
            CONTACT & <span className="italic font-light text-[#B07D4F]">CHECKOUT</span>
          </h1>
          <p className="text-[#F9F9F9]/60 text-sm max-w-xl mt-4 leading-relaxed font-light">
            Fill in your contact details and specify the products you wish to purchase. Submitting this form prepares your order invoice and forwards it directly to our master craftsmen on WhatsApp.
          </p>
        </div>

        {/* Form + Cart Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Form & Address Details */}
          <div className="lg:col-span-7 bg-[#141414] border border-[#F9F9F9]/5 p-8 md:p-10 relative">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-[#B07D4F]"></div>
            
            <h2 className="text-2xl font-serif text-[#F9F9F9] mb-8 tracking-wide">Customer Details</h2>
            
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-[10px] tracking-[0.2em] text-[#B07D4F] uppercase font-semibold block">Full Name</label>
                <input 
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Rahul Sharma"
                  className={`w-full bg-[#0A0A0A] border ${
                    formErrors.name ? 'border-red-500' : 'border-[#F9F9F9]/10 focus:border-[#B07D4F]'
                  } text-sm text-[#F9F9F9] px-5 py-4 outline-none transition-colors duration-300`}
                />
                {formErrors.name && (
                  <p className="text-[11px] text-red-400 font-light mt-1">{formErrors.name}</p>
                )}
              </div>

              {/* Mobile Number */}
              <div className="space-y-2">
                <label className="text-[10px] tracking-[0.2em] text-[#B07D4F] uppercase font-semibold block">Mobile Number</label>
                <input 
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="e.g. 9876543210"
                  className={`w-full bg-[#0A0A0A] border ${
                    formErrors.mobile ? 'border-red-500' : 'border-[#F9F9F9]/10 focus:border-[#B07D4F]'
                  } text-sm text-[#F9F9F9] px-5 py-4 outline-none transition-colors duration-300`}
                />
                {formErrors.mobile && (
                  <p className="text-[11px] text-red-400 font-light mt-1">{formErrors.mobile}</p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] tracking-[0.2em] text-[#B07D4F] uppercase font-semibold block">Email Address</label>
                  {isGmail && (
                    <span className="text-[8px] bg-[#B07D4F]/20 text-[#B07D4F] px-2 py-0.5 font-mono uppercase tracking-widest font-semibold rounded">
                      Gmail Verified
                    </span>
                  )}
                </div>
                <input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g. rahul@gmail.com"
                  className={`w-full bg-[#0A0A0A] border ${
                    formErrors.email ? 'border-red-500' : 'border-[#F9F9F9]/10 focus:border-[#B07D4F]'
                  } text-sm text-[#F9F9F9] px-5 py-4 outline-none transition-colors duration-300`}
                />
                {formErrors.email && (
                  <p className="text-[11px] text-red-400 font-light mt-1">{formErrors.email}</p>
                )}
              </div>

              {/* Shipping Address */}
              <div className="space-y-2">
                <label className="text-[10px] tracking-[0.2em] text-[#B07D4F] uppercase font-semibold block">Full Shipping Address</label>
                <textarea 
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="House No., Street Name, Area, City, Pin Code (Minimum 10 characters)"
                  className={`w-full bg-[#0A0A0A] border ${
                    formErrors.address ? 'border-red-500' : 'border-[#F9F9F9]/10 focus:border-[#B07D4F]'
                  } text-sm text-[#F9F9F9] px-5 py-4 outline-none transition-colors duration-300 resize-none`}
                />
                {formErrors.address && (
                  <p className="text-[11px] text-red-400 font-light mt-1">{formErrors.address}</p>
                )}
              </div>

              {/* Five More Options Dropdowns */}
              <div className="border-t border-[#F9F9F9]/10 pt-6 mt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs uppercase tracking-[0.2em] text-[#B07D4F] font-semibold">
                    Add Extra Products (Up to 5)
                  </h3>
                  <span className="text-[9px] text-[#F9F9F9]/40 tracking-wider">OPTIONAL</span>
                </div>
                
                <div className="space-y-3">
                  {extraProducts.map((extra, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-3 items-center bg-[#0A0A0A] p-3 border border-[#F9F9F9]/5">
                      <div className="col-span-8">
                        <label className="text-[9px] tracking-[0.2em] text-[#B07D4F] uppercase font-semibold block mb-1">
                          Product Slot #{idx + 1}
                        </label>
                        <select
                          value={extra.productId}
                          onChange={(e) => {
                            handleExtraProductChange(idx, e.target.value);
                          }}
                          className="w-full bg-[#141414] border border-[#F9F9F9]/10 text-xs tracking-wider text-[#F9F9F9] px-3 py-2 outline-none focus:border-[#B07D4F] transition-colors"
                        >
                          <option value="">-- SELECT PRODUCT --</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} (₹{p.price.toLocaleString('en-IN')})
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="col-span-4">
                        <label className="text-[9px] tracking-[0.2em] text-[#B07D4F] uppercase font-semibold block mb-1">
                          Quantity
                        </label>
                        <select
                          value={extra.quantity}
                          onChange={(e) => {
                            handleExtraQtyChange(idx, parseInt(e.target.value) || 1);
                          }}
                          className="w-full bg-[#141414] border border-[#F9F9F9]/10 text-xs text-[#F9F9F9] px-3 py-2 outline-none focus:border-[#B07D4F] transition-colors font-mono"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((q) => (
                            <option key={q} value={q}>
                              {q}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full py-4 bg-[#B07D4F] text-[#0A0A0A] hover:bg-[#F9F9F9] hover:text-[#0A0A0A] transition-colors duration-300 text-xs tracking-[0.25em] uppercase font-semibold shadow-lg"
                >
                  Send Order via WhatsApp
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Order Items Basket (Cart) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Basket Panel */}
            <div className="bg-[#141414] border border-[#F9F9F9]/5 p-8 relative">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[#B07D4F]"></div>
              
              <h2 className="text-2xl font-serif text-[#F9F9F9] mb-6 tracking-wide">Your Items</h2>

              {/* Cart List */}
              {cartItems.length === 0 ? (
                <div className="text-center py-12 border border-[#F9F9F9]/5 bg-[#0A0A0A] px-4">
                  <p className="text-sm text-[#F9F9F9]/55 font-light">No pre-selected items in basket.</p>
                  <p className="text-[10px] text-[#B07D4F] font-semibold tracking-wider uppercase mt-2">
                    Use the 'Add Extra Products' dropdown options in the form to select items.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex items-center justify-between p-4 bg-[#0A0A0A] border border-[#F9F9F9]/5"
                    >
                      <div className="flex-grow pr-4">
                        <h4 className="text-sm font-semibold text-[#F9F9F9] truncate max-w-[200px]" title={item.name}>
                          {item.name}
                        </h4>
                        <p className="text-xs text-[#B07D4F] font-mono mt-0.5">
                          ₹{item.price.toLocaleString('en-IN')} each
                        </p>
                      </div>

                      {/* Quantity Toggles */}
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleQtyChange(item.id, -1)}
                          className="w-7 h-7 bg-[#141414] hover:bg-[#B07D4F] hover:text-[#0A0A0A] transition-colors border border-[#F9F9F9]/10 text-xs flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-mono font-semibold">{item.quantity}</span>
                        <button 
                          onClick={() => handleQtyChange(item.id, 1)}
                          className="w-7 h-7 bg-[#141414] hover:bg-[#B07D4F] hover:text-[#0A0A0A] transition-colors border border-[#F9F9F9]/10 text-xs flex items-center justify-center"
                        >
                          +
                        </button>

                        {/* Remove Action */}
                        <button 
                          onClick={() => handleRemoveItem(item.id)}
                          className="w-7 h-7 bg-red-950/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors border border-red-500/20 text-xs flex items-center justify-center ml-2"
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Total Calculation */}
              {cartItems.length > 0 && (
                <div className="border-t border-[#F9F9F9]/10 mt-6 pt-6 flex justify-between items-center">
                  <span className="text-xs uppercase tracking-[0.2em] text-[#F9F9F9]/70 font-semibold">Grand Total</span>
                  <span className="text-2xl font-serif text-[#B07D4F] font-bold">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
            </div>

            {/* Add Products Tool Panel */}
            <div className="bg-[#141414] border border-[#F9F9F9]/5 p-8 relative">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[#B07D4F]"></div>
              
              <h2 className="text-xl font-serif text-[#F9F9F9] mb-6 tracking-wide">Add Items to Order</h2>
              
              <form onSubmit={handleAddItem} className="space-y-4">
                
                {/* Select dropdown */}
                <div className="space-y-2">
                  <label className="text-[9px] tracking-[0.2em] text-[#B07D4F] uppercase font-semibold block">Select Product</label>
                  <select 
                    value={selectedProductId}
                    onChange={handleSelectChange}
                    className="w-full bg-[#0A0A0A] border border-[#F9F9F9]/10 text-xs tracking-wider text-[#F9F9F9] px-4 py-3.5 outline-none focus:border-[#B07D4F] transition-colors"
                  >
                    <option value="">-- CHOOSE A PRODUCT --</option>
                    {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (₹{p.price.toLocaleString('en-IN')})
                        </option>
                      ))}
                    <option value="custom">Other Custom Item...</option>
                  </select>
                </div>

                {/* Custom Item Details (Conditional) */}
                {showCustomFields && (
                  <div className="space-y-4 border border-[#B07D4F]/20 p-4 bg-[#0A0A0A] transition-all">
                    <p className="text-[9px] tracking-widest text-[#B07D4F] font-bold uppercase mb-1">Custom Item Details</p>
                    
                    {/* Item Name */}
                    <div className="space-y-1">
                      <input 
                        type="text" 
                        placeholder="e.g. Premium Leather Belt"
                        value={customItem.name}
                        onChange={(e) => setCustomItem((prev) => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-[#141414] border border-[#F9F9F9]/10 text-xs px-3 py-2.5 outline-none text-[#F9F9F9]"
                      />
                    </div>

                    {/* Item Price */}
                    <div className="space-y-1">
                      <input 
                        type="number" 
                        placeholder="Price in INR (e.g. 450)"
                        value={customItem.price}
                        onChange={(e) => setCustomItem((prev) => ({ ...prev, price: e.target.value }))}
                        className="w-full bg-[#141414] border border-[#F9F9F9]/10 text-xs px-3 py-2.5 outline-none text-[#F9F9F9]"
                      />
                    </div>
                  </div>
                )}

                {/* Cart Errors */}
                {cartError && (
                  <p className="text-xs text-[#B07D4F] font-light italic mt-1">{cartError}</p>
                )}

                {/* Add to list trigger */}
                <button 
                  type="submit"
                  className="w-full py-3 bg-transparent border border-[#B07D4F] text-[#B07D4F] hover:bg-[#B07D4F] hover:text-[#0A0A0A] transition-colors duration-300 text-[10px] tracking-[0.2em] uppercase font-semibold"
                >
                  {showCustomFields ? 'Add Custom Item' : 'Add Selected Product'}
                </button>

              </form>
            </div>
            
          </div>
        </div>

      </main>

      {/* FOOTER SECTION & STORE DETAILS */}
      <footer id="footer-contact" className="bg-[#141414] border-t border-[#F9F9F9]/5 pt-24 pb-12 relative z-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Directory Links & Store Details */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 py-20 border-b border-[#F9F9F9]/5">
            
            {/* Store Address & Contact Block */}
            <div className="md:col-span-4 flex flex-col space-y-6">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 border border-[#B07D4F]/30 rounded-full bg-[#0A0A0A]">
                  <svg className="w-8 h-8 text-[#B07D4F]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="45" stroke="#B07D4F" strokeWidth="0.5" strokeDasharray="2 2" />
                    <path d="M38 35V65M38 35H48C53 35 53 47 48 47H38M48 47L58 65" stroke="#F9F9F9" strokeWidth="3.5" />
                    <path d="M48 35H55C62 35 62 65 55 65H48" stroke="#B07D4F" strokeWidth="3" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-serif tracking-[0.15em] text-[#F9F9F9]">ROYAL DERI</span>
                  <span className="text-[8px] tracking-[0.3em] text-[#B07D4F] uppercase font-semibold">Leathers</span>
                </div>
              </div>
              
              <div className="text-xs text-[#F9F9F9]/60 leading-relaxed font-light space-y-1">
                <p className="font-semibold text-[#F9F9F9] tracking-wider mb-2">ROYAL DERI LEATHER STORE</p>
                <p>#33, G1, 3rd Avenue</p>
                <p>Indira Nagar, Adyar</p>
                <p>Chennai - 600020</p>
                <p className="pt-4 flex items-center space-x-2">
                  <span className="text-[#B07D4F] font-semibold">Call & Order:</span>
                  <a href="tel:8903553679" className="hover:text-[#B07D4F] font-mono transition-colors duration-200">8903553679</a>
                </p>
                <p className="flex items-center space-x-2">
                  <span className="text-[#B07D4F] font-semibold">Email:</span>
                  <a href="mailto:royalderi.in@gmail.com" className="hover:text-[#B07D4F] transition-colors duration-200">royalderi.in@gmail.com</a>
                </p>
              </div>
            </div>

            {/* Bags Column */}
            <div className="md:col-span-2 md:col-start-6">
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#B07D4F] mb-6 font-semibold">Bags</h4>
              <ul className="space-y-4 text-xs text-[#F9F9F9]/60 font-light">
                <li><a href="#menu" className="hover:text-[#B07D4F] transition-colors duration-300 block w-full text-left">School Bag</a></li>
                <li><a href="#menu" className="hover:text-[#B07D4F] transition-colors duration-300 block w-full text-left">College Bag</a></li>
                <li><a href="#menu" className="hover:text-[#B07D4F] transition-colors duration-300 block w-full text-left">Ladies Hand Bag</a></li>
                <li><a href="#menu" className="hover:text-[#B07D4F] transition-colors duration-300 block w-full text-left">Travel Bag</a></li>
              </ul>
            </div>

            {/* Accessories Column */}
            <div className="md:col-span-2">
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#B07D4F] mb-6 font-semibold">Accessories</h4>
              <ul className="space-y-4 text-xs text-[#F9F9F9]/60 font-light">
                <li><a href="#menu" className="hover:text-[#B07D4F] transition-colors duration-300 block w-full text-left">Ladies Hand Purse</a></li>
                <li><a href="#menu" className="hover:text-[#B07D4F] transition-colors duration-300 block w-full text-left">Men's Wallet</a></li>
                <li><a href="#menu" className="hover:text-[#B07D4F] transition-colors duration-300 block w-full text-left">Men's Belt</a></li>
              </ul>
            </div>

            {/* Footwear Column */}
            <div className="md:col-span-2">
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#B07D4F] mb-6 font-semibold">Footwear</h4>
              <ul className="space-y-4 text-xs text-[#F9F9F9]/60 font-light">
                <li><a href="#menu" className="hover:text-[#B07D4F] transition-colors duration-300 block w-full text-left">Shoes</a></li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright Block */}
          <div className="flex flex-col md:flex-row justify-between items-center pt-12 text-[10px] tracking-[0.2em] text-[#F9F9F9]/65 uppercase">
            <p>© {new Date().getFullYear()} RoyalDeriLeathers. All Rights Reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0 font-light">
              <a href="#home" className="hover:text-[#B07D4F] transition-colors duration-300">Home</a>
              <span>/</span>
              <a href="#about" className="hover:text-[#B07D4F] transition-colors duration-300">About</a>
              <span>/</span>
              <a href="#menu" className="hover:text-[#B07D4F] transition-colors duration-300">Menu</a>
              <span>/</span>
              <a href="#contact" className="hover:text-[#B07D4F] transition-colors duration-300 text-[#B07D4F]">Contact</a>
            </div>
          </div>

        </div>
      </footer>



      {/* MERCHANT / ADMIN PORTAL MODAL */}
      <AdminPortal 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
        onCatalogChange={() => setProducts(getProducts())}
      />

    </div>
  );
}
