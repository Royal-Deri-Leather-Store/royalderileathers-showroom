import React, { useState, useEffect, useRef } from 'react';
import { seedProducts, getProducts, loadCart, saveCart } from './productStore';
import AdminPortal from './AdminPortal';

// DESIGN SYSTEM COLORS
// Background: #0A0A0A (Pure Pitch Black)
// Section Blocks: #141414 (Deep Velvet Charcoal)
// Interactive Accent: #B07D4F (Italian Whiskey Tan)
// Typography: #F9F9F9 (Crisp Ivory White)

export default function Home() {
  // Seed product catalog synchronously
  seedProducts();

  // Load products dynamically from localStorage
  const [products, setProducts] = useState(getProducts());
  const [scrollY, setScrollY] = useState(0);
  const [selectedShoe, setSelectedShoe] = useState(null);
  const [isNewsletterSubscribed, setIsNewsletterSubscribed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fallback items to prevent crash if database is cleared
  const fallbackShowcase = [
    {
      id: 'oxford',
      name: 'The Florence Wholecut Oxford',
      category: 'Shoes',
      price: 9000,
      images: ['/assets/images/wholecut_oxford.png'],
      description: 'Sculpted from a single flawless piece of full‑grain calfskin. Hand‑burnished to create a deep, layered patina that matures with character.',
      specs: ['Single Piece Leather Cut', 'Closed Channel Goodyear Welt']
    },
    {
      id: 'travelbag',
      name: 'The Voyager Leather Duffle',
      category: 'Travel Bag',
      price: 18000,
      images: ['/assets/images/leather_travel_bag.png'],
      description: 'Crafted for the modern wanderer. Structured from vegetable‑tanned Italian leather with hand‑set brass rivets and a water‑resistant lining.',
      specs: ['Full‑Grain Vegetable Leather', 'YKK Excella Solid Brass Zippers']
    },
    {
      id: 'handbag',
      name: 'The Siena Designer Satchel',
      category: 'Ladies Hand Bag',
      price: 15000,
      images: ['/assets/images/leather_ladies_handbag.png'],
      description: 'The epitome of architectural grace. Hand‑shaped curves, premium whiskey‑tan hardware, and an incredibly soft suede‑lined interior.',
      specs: ['Hand‑Stretched Calfskin', 'Premium Whiskey Gold Hardware']
    }
  ];

  const showcaseProduct0 = products.find(p => p.id === 'oxford') || products[0] || fallbackShowcase[0];
  const showcaseProduct1 = products.find(p => p.id === 'travelbag') || products[1] || fallbackShowcase[1];
  const showcaseProduct2 = products.find(p => p.id === 'handbag') || products[2] || fallbackShowcase[2];

  // Admin / Merchant Portal State
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Modal Detail Active Image Index
  const [activeDetailImageIndex, setActiveDetailImageIndex] = useState(0);



  // Helper to add product to cart and redirect to Contact Page
  const handleOrderViaWhatsApp = (product) => {
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

  // Parallax refs
  const editorialRef = useRef(null);
  const [editorialOffset, setEditorialOffset] = useState(0);

  const artisanRef = useRef(null);
  const [artisanOffset, setArtisanOffset] = useState(0);
  const [artisanVisible, setArtisanVisible] = useState(false);

  // Scroll handler for hardware-accelerated parallax calculations
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setScrollY(currentScrollY);

          // Section 2: Editorial Brand Statement parallax calculation
          if (editorialRef.current) {
            const rect = editorialRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const offset = windowHeight - rect.top;
            if (offset > 0) {
              setEditorialOffset(offset);
            }
          }

          // Section 4: Artisan Workshop parallax calculation
          if (artisanRef.current) {
            const rect = artisanRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const sectionHeight = rect.height;
            const progress = (windowHeight - rect.top) / (windowHeight + sectionHeight);
            
            if (progress >= 0 && progress <= 1) {
              setArtisanOffset(progress);
              setArtisanVisible(true);
            }
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F9F9F9] font-sans selection:bg-[#B07D4F] selection:text-[#0A0A0A] overflow-x-hidden">
      
      {/* GLOBAL EMBEDDED KEYFRAME ANIMATIONS */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateZ(0);
          }
          50% {
            transform: translateY(-12px) translateZ(0);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes white-glow-pulse {
          0%, 100% {
            filter: drop-shadow(0 0 15px rgba(249, 249, 249, 0.15)) drop-shadow(0 25px 40px rgba(0,0,0,0.8));
          }
          50% {
            filter: drop-shadow(0 0 35px rgba(249, 249, 249, 0.45)) drop-shadow(0 25px 40px rgba(0,0,0,0.8));
          }
        }
        .animate-white-glow {
          animation: float 6s ease-in-out infinite, white-glow-pulse 4s ease-in-out infinite;
        }
        
        .whiskey-glow {
          box-shadow: 0 0 50px -10px rgba(176, 125, 79, 0.15);
        }
        
        .whiskey-glow-hover:hover {
          box-shadow: 0 25px 60px -15px rgba(176, 125, 79, 0.35);
        }
      `}} />

      {/* LUXURY NAVIGATION HEADER */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#0A0A0A]/85 backdrop-blur-md border-b border-[#F9F9F9]/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-24 flex items-center justify-between">
          
          {/* Logo Section: Custom Monogram combining initial letters RDL */}
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

          {/* Clean Navbar Links (Home, About, Contact, Menu) */}
          <nav className="hidden lg:flex items-center space-x-12 text-xs tracking-[0.22em] uppercase font-semibold">
            <a href="#hero" className="hover:text-[#B07D4F] transition-colors duration-300 relative group py-2">
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

            <a href="#contact" className="hover:text-[#B07D4F] transition-colors duration-300 relative group py-2">
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#B07D4F] transition-all duration-300 group-hover:w-full"></span>
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

      {/* 1. HERO SHOWCASE SECTOR (Fluid Height and Generous Padding to Prevent Clipping) */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center pt-32 pb-16 lg:pt-28 lg:pb-20 overflow-hidden">
        
        {/* Parallax Layer 1: Background hide texture */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.08]"
          style={{ 
            transform: `translateY(${scrollY * 0.2}px) translateZ(0)`,
            backgroundImage: `url('/assets/images/leather_grain_texture.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            willChange: 'transform'
          }}
        />

        {/* Subtle Ambient Light Gradients */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#B07D4F]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-black rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10 py-6">
          
          {/* Left Content */}
          <div className="lg:col-span-6 flex flex-col justify-center text-left order-2 lg:order-1">
            <div className="inline-flex items-center space-x-3 mb-4">
              <span className="h-[1px] w-8 bg-[#B07D4F]"></span>
              <span className="text-xs uppercase tracking-[0.4em] text-[#B07D4F] font-semibold">Premium Leather Goods</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-[#F9F9F9] leading-[1.05] tracking-tight mb-6">
              THE ART OF <span className="italic font-light text-[#B07D4F]">FORM</span>.<br />
              THE SOLE OF <br />
              <span className="text-[#B07D4F] italic">LUXURY</span>.
            </h1>
            
            <p className="text-[#F9F9F9]/75 text-sm md:text-base leading-relaxed max-w-xl mb-8 font-light tracking-wide">
              Every curve sculpted with devotion. From premium school and college bags to designer travel luggage, fine wallets, belts, and footwear. Royal Deri Leathers represents a heritage of leather mastery.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <a 
                href="tel:8903553679" 
                className="group relative px-8 py-4 bg-[#B07D4F] border border-[#B07D4F] text-[#0A0A0A] overflow-hidden transition-all duration-500 ease-out text-center"
              >
                <span className="text-xs tracking-[0.3em] uppercase font-semibold block">
                  Call & Order: 8903553679
                </span>
              </a>
              
              <a 
                href="#collection" 
                className="group px-6 py-4 text-center text-xs tracking-[0.2em] uppercase font-semibold text-[#F9F9F9]/80 hover:text-[#B07D4F] transition-colors duration-300"
              >
                View Collection →
              </a>
            </div>

            {/* Quick stats grid */}
            <div className="grid grid-cols-3 gap-6 border-t border-[#F9F9F9]/10 pt-8 mt-10">
              <div>
                <p className="text-xl font-serif text-[#B07D4F]">100%</p>
                <p className="text-[9px] uppercase tracking-[0.2em] text-[#F9F9F9]/75 mt-1">Genuine Leather</p>
              </div>
              <div>
                <p className="text-xl font-serif text-[#B07D4F]">Handmade</p>
                <p className="text-[9px] uppercase tracking-[0.2em] text-[#F9F9F9]/75 mt-1">Bespoke Stitch</p>
              </div>
              <div>
                <p className="text-xl font-serif text-[#B07D4F]">Premium</p>
                <p className="text-[9px] uppercase tracking-[0.2em] text-[#F9F9F9]/75 mt-1">Indian Heritage</p>
              </div>
            </div>
          </div>

          {/* Right Content: Flagship plain black formal shoe scaled to perfect viewport size */}
          <div className="lg:col-span-6 flex justify-center items-center order-1 lg:order-2 relative mt-8 lg:mt-0">
            <div className="absolute w-[260px] h-[260px] sm:w-[360px] sm:h-[360px] bg-[#141414] rounded-full border border-[#B07D4F]/10 flex items-center justify-center whiskey-glow pointer-events-none">
              <div className="w-[85%] h-[85%] rounded-full border border-[#F9F9F9]/5" />
            </div>
            
            <div className="relative z-10 w-full max-w-[280px] sm:max-w-[360px] aspect-square flex items-center justify-center p-4">
              <img 
                src="/assets/images/plain_black_formal_shoe.png" 
                alt="Royal Deri Flagship Plain Black Formal Shoe" 
                className="w-full h-auto object-contain animate-white-glow select-none pointer-events-none"
                style={{ willChange: 'transform' }}
              />
            </div>
          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center space-y-1 pointer-events-none hidden lg:flex">
          <span className="text-[8px] tracking-[0.4em] uppercase text-[#F9F9F9]/70">Scroll Down</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-[#B07D4F] to-transparent"></div>
        </div>
      </section>

      {/* 2. EDITORIAL BRAND STATEMENT (With Parallax Layer 2) */}
      <section 
        id="editorial" 
        ref={editorialRef}
        className="relative bg-[#141414] py-32 md:py-48 overflow-hidden flex items-center border-y border-[#F9F9F9]/5"
      >
        {/* Parallax Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-[#0A0A0A]"
          style={{
            backgroundImage: `url('/assets/images/leather_cutting_bg.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            opacity: 0.25,
          }}
        />

        {/* Parallax Layer 2: Massive, bold, outline-stroked typography text */}
        <div 
          className="absolute whitespace-nowrap text-[12vw] font-serif font-black uppercase tracking-[0.2em] pointer-events-none select-none text-transparent opacity-10"
          style={{
            WebkitTextStroke: '2.5px #F9F9F9',
            transform: `translateX(${-300 + editorialOffset * 0.25}px) translateZ(0)`,
            willChange: 'transform',
            transition: 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)'
          }}
        >
          ROYAL DERI LEATHERS • QUALITY UNCOMPROMISED
        </div>

        <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10 text-center">
          <div className="inline-flex items-center justify-center space-x-3 mb-8">
            <span className="h-[1px] w-6 bg-[#B07D4F]"></span>
            <span className="text-xs uppercase tracking-[0.4em] text-[#B07D4F]">Our Promise</span>
            <span className="h-[1px] w-6 bg-[#B07D4F]"></span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-7xl font-serif text-[#F9F9F9] leading-snug tracking-wide mb-12 max-w-4xl mx-auto italic font-light">
            "We construct artifacts of enduring beauty, stitching together premium utility with raw, hand-burnished luxury."
          </h2>

          <p className="text-[#F9F9F9]/60 text-sm md:text-base tracking-[0.15em] uppercase max-w-2xl mx-auto leading-loose font-light">
            Whether carrying your laptop to a lecture, traveling across borders, or strapping on a bespoke belt—our products are forged to accompany you on every journey, developing a unique character over a lifetime.
          </p>
        </div>
      </section>

      {/* 3. THE ASYMMETRICAL FEATURED PRODUCT SHOWCASE */}
      <section id="collection" className="bg-[#0A0A0A] py-32 md:py-48 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Section Heading */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24">
            <div>
              <div className="inline-flex items-center space-x-3 mb-4">
                <span className="h-[1px] w-8 bg-[#B07D4F]"></span>
                <span className="text-xs uppercase tracking-[0.4em] text-[#B07D4F] font-semibold">The Showcase</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-serif text-[#F9F9F9] tracking-tight">
                SIGNATURE <span className="italic font-light text-[#B07D4F]">CREATIONS</span>
              </h2>
            </div>
            <p className="text-[#F9F9F9]/50 text-sm max-w-md mt-6 md:mt-0 font-light leading-relaxed">
              Explore our handpicked highlights. Select an item to study the premium materials and call us to order.
            </p>
          </div>

          {/* Highly Creative 3-Column Irregular CSS Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-y-20 md:gap-x-12 lg:gap-x-16 items-start">
            
            {/* Card 1: The Florence Wholecut Oxford (Shoes) */}
            <div 
              className="md:col-span-7 group relative cursor-pointer"
              onClick={() => setSelectedShoe(showcaseProduct0)}
            >
              <div className="relative overflow-hidden bg-[#141414] border border-[#F9F9F9]/5 aspect-[4/5] whiskey-glow-hover transition-all duration-700 ease-out">
                {/* Product Image */}
                <div className="w-full h-full p-8 flex items-center justify-center transition-transform duration-[700ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.08]">
                  <img 
                    src="/assets/images/wholecut_oxford.png" 
                    alt={showcaseProduct0.name} 
                    className="w-[90%] h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                  />
                </div>

                {/* Glassmorphic Informational Tray */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-[700ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] backdrop-blur-md bg-black/40 border-t border-[#B07D4F]/20 flex flex-col justify-end">
                  <div className="flex justify-between items-start mb-4 gap-4">
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-[#B07D4F] mb-1 break-words">{showcaseProduct0.category}</p>
                      <h3 className="text-xl md:text-2xl font-serif text-[#F9F9F9] break-words">{showcaseProduct0.name}</h3>
                    </div>
                    <span className="text-lg font-serif text-[#B07D4F] font-semibold break-all whitespace-normal flex-shrink-0">₹{showcaseProduct0.price.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-sm text-[#F9F9F9]/75 mb-6 font-light leading-relaxed break-words">
                    {showcaseProduct0.description}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedShoe(showcaseProduct0);
                      }}
                      className="py-3 border border-[#B07D4F] text-[#B07D4F] hover:bg-[#B07D4F] hover:text-[#0A0A0A] transition-colors duration-300 text-[9px] tracking-[0.1em] uppercase font-semibold"
                    >
                      Examine
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOrderViaWhatsApp(showcaseProduct0);
                      }}
                      className="py-3 bg-[#B07D4F] text-[#0A0A0A] hover:bg-[#F9F9F9] hover:text-[#0A0A0A] transition-colors duration-300 text-[9px] tracking-[0.1em] uppercase font-semibold"
                    >
                      WhatsApp Order
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-between items-center px-2 gap-4">
                <div className="min-w-0">
                  <h4 className="font-serif text-2xl text-[#F9F9F9] break-words">{showcaseProduct0.name}</h4>
                  <p className="text-[11px] text-[#F9F9F9]/70 tracking-wider mt-1 break-words">{showcaseProduct0.category}</p>
                </div>
                <span className="font-serif text-xl text-[#B07D4F] break-all whitespace-normal flex-shrink-0">₹{showcaseProduct0.price.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Card 2: The Voyager Leather Duffle (Travel Bag) */}
            <div 
              className="md:col-span-5 md:translate-y-24 group relative cursor-pointer"
              onClick={() => setSelectedShoe(showcaseProduct1)}
            >
              <div className="relative overflow-hidden bg-[#141414] border border-[#F9F9F9]/5 aspect-[4/5] whiskey-glow-hover transition-all duration-700 ease-out">
                {/* Product Image */}
                <div className="w-full h-full p-8 flex items-center justify-center transition-transform duration-[700ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.08]">
                  <img 
                    src="/assets/images/leather_travel_bag.png" 
                    alt={showcaseProduct1.name} 
                    className="w-[90%] h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                  />
                </div>

                {/* Glassmorphic Informational Tray */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-[700ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] backdrop-blur-md bg-black/40 border-t border-[#B07D4F]/20 flex flex-col justify-end">
                  <div className="flex justify-between items-start mb-4 gap-4">
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-[#B07D4F] mb-1 break-words">{showcaseProduct1.category}</p>
                      <h3 className="text-xl md:text-2xl font-serif text-[#F9F9F9] break-words">{showcaseProduct1.name}</h3>
                    </div>
                    <span className="text-lg font-serif text-[#B07D4F] font-semibold break-all whitespace-normal flex-shrink-0">₹{showcaseProduct1.price.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-sm text-[#F9F9F9]/75 mb-6 font-light leading-relaxed break-words">
                    {showcaseProduct1.description}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedShoe(showcaseProduct1);
                      }}
                      className="py-3 border border-[#B07D4F] text-[#B07D4F] hover:bg-[#B07D4F] hover:text-[#0A0A0A] transition-colors duration-300 text-[9px] tracking-[0.1em] uppercase font-semibold"
                    >
                      Examine
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOrderViaWhatsApp(showcaseProduct1);
                      }}
                      className="py-3 bg-[#B07D4F] text-[#0A0A0A] hover:bg-[#F9F9F9] hover:text-[#0A0A0A] transition-colors duration-300 text-[9px] tracking-[0.1em] uppercase font-semibold"
                    >
                      WhatsApp Order
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-between items-center px-2 gap-4">
                <div className="min-w-0">
                  <h4 className="font-serif text-2xl text-[#F9F9F9] break-words">{showcaseProduct1.name}</h4>
                  <p className="text-[11px] text-[#F9F9F9]/70 tracking-wider mt-1 break-words">{showcaseProduct1.category}</p>
                </div>
                <span className="font-serif text-xl text-[#B07D4F] break-all whitespace-normal flex-shrink-0">₹{showcaseProduct1.price.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Card 3: The Siena Designer Satchel (Ladies Hand Bag) */}
            <div 
              className="md:col-span-6 md:col-start-4 md:mt-32 group relative cursor-pointer"
              onClick={() => setSelectedShoe(showcaseProduct2)}
            >
              <div className="relative overflow-hidden bg-[#141414] border border-[#F9F9F9]/5 aspect-[16/10] whiskey-glow-hover transition-all duration-700 ease-out">
                {/* Product Image */}
                <div className="w-full h-full p-8 flex items-center justify-center transition-transform duration-[700ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.08]">
                  <img 
                    src="/assets/images/leather_ladies_handbag.png" 
                    alt={showcaseProduct2.name} 
                    className="w-[70%] h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                  />
                </div>

                {/* Glassmorphic Informational Tray */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-[700ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] backdrop-blur-md bg-black/40 border-t border-[#B07D4F]/20 flex flex-col justify-end">
                  <div className="flex justify-between items-start mb-4 gap-4">
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-[#B07D4F] mb-1 break-words">{showcaseProduct2.category}</p>
                      <h3 className="text-xl md:text-2xl font-serif text-[#F9F9F9] break-words">{showcaseProduct2.name}</h3>
                    </div>
                    <span className="text-lg font-serif text-[#B07D4F] font-semibold break-all whitespace-normal flex-shrink-0">₹{showcaseProduct2.price.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-sm text-[#F9F9F9]/75 mb-6 font-light leading-relaxed break-words">
                    {showcaseProduct2.description}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedShoe(showcaseProduct2);
                      }}
                      className="py-3 border border-[#B07D4F] text-[#B07D4F] hover:bg-[#B07D4F] hover:text-[#0A0A0A] transition-colors duration-300 text-[9px] tracking-[0.1em] uppercase font-semibold"
                    >
                      Examine
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOrderViaWhatsApp(showcaseProduct2);
                      }}
                      className="py-3 bg-[#B07D4F] text-[#0A0A0A] hover:bg-[#F9F9F9] hover:text-[#0A0A0A] transition-colors duration-300 text-[9px] tracking-[0.1em] uppercase font-semibold"
                    >
                      WhatsApp Order
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-between items-center px-2 gap-4">
                <div className="min-w-0">
                  <h4 className="font-serif text-2xl text-[#F9F9F9] break-words">{showcaseProduct2.name}</h4>
                  <p className="text-[11px] text-[#F9F9F9]/70 tracking-wider mt-1 break-words">{showcaseProduct2.category}</p>
                </div>
                <span className="font-serif text-xl text-[#B07D4F] break-all whitespace-normal flex-shrink-0">₹{showcaseProduct2.price.toLocaleString('en-IN')}</span>
              </div>
            </div>

          </div>
        </div>
      </section>



      {/* 4. THE ARTISAN WORKSHOP EXPERIENTIAL BLOCK (With Parallax Layer 3) */}
      <section 
        id="workshop" 
        ref={artisanRef}
        className="relative h-screen flex items-center justify-center overflow-hidden border-t border-[#F9F9F9]/5"
      >
        
        {/* Parallax Layer 3: Scroll-tied zoom scale */}
        <div 
          className="absolute inset-0 z-0 bg-[#0A0A0A]"
          style={{
            backgroundImage: `url('/assets/images/artisan_workspace.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            opacity: 0.35,
          }}
        />

        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A] z-10 pointer-events-none opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-transparent to-[#0A0A0A] z-10 pointer-events-none opacity-40" />

        {/* Content Block */}
        <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-20 text-center">
          <div className="inline-flex items-center justify-center space-x-3 mb-6">
            <span className="h-[1px] w-6 bg-[#B07D4F]"></span>
            <span className="text-xs uppercase tracking-[0.4em] text-[#B07D4F]">The Workshop</span>
            <span className="h-[1px] w-6 bg-[#B07D4F]"></span>
          </div>

          <h2 className="text-4xl md:text-6xl font-serif text-[#F9F9F9] tracking-tight mb-8 italic font-light">
            WHERE HERITAGE <br />
            <span className="font-serif text-[#B07D4F] not-italic font-bold">MEETS</span> INTENTION
          </h2>
          
          <p className="text-[#F9F9F9]/80 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-12 font-light">
            In our workshop, there are no assembly lines. There are only hands. Over a hundred detailed steps guide each bag, wallet, and shoe from raw leather hide to a finished collector's piece. We stitch with pure patience.
          </p>

          <a 
            href="tel:8903553679"
            className="group relative px-10 py-5 bg-transparent border border-[#B07D4F] inline-block"
          >
            <span className="text-xs tracking-[0.3em] uppercase font-semibold text-[#B07D4F] hover:text-[#F9F9F9] transition-colors duration-500">
              Call & Order: 8903553679
            </span>
          </a>
        </div>
      </section>

      {/* FOOTER SECTION & STORE DETAILS */}
      <footer id="footer-contact" className="bg-[#141414] border-t border-[#F9F9F9]/5 pt-24 pb-12 relative z-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Newsletter Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-20 border-b border-[#F9F9F9]/5">
            <div className="lg:col-span-6">
              <h3 className="text-xl md:text-2xl font-serif text-[#F9F9F9] tracking-wide mb-4">
                THE ATELIER JOURNAL
              </h3>
              <p className="text-[#F9F9F9]/60 text-xs md:text-sm max-w-md font-light leading-relaxed">
                Receive private collection previews, invitations to regional trunk shows, and editorial stories on the craft of luxury leather goods.
              </p>
            </div>
            
            <div className="lg:col-span-6 flex flex-col justify-center">
              {isNewsletterSubscribed ? (
                <div className="p-4 border border-[#B07D4F]/30 bg-[#B07D4F]/5 text-[#B07D4F] text-xs uppercase tracking-wider text-center font-medium">
                  Thank you. You have been added to our private roster.
                </div>
              ) : (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    setIsNewsletterSubscribed(true);
                  }}
                  className="flex flex-col sm:flex-row space-y-4 sm:space-y-0"
                >
                  <input 
                    type="email" 
                    required 
                    placeholder="ENTER YOUR EMAIL ADDRESS" 
                    className="flex-grow bg-[#0A0A0A] border border-[#F9F9F9]/10 text-xs tracking-widest text-[#F9F9F9] px-6 py-4 outline-none focus:border-[#B07D4F] transition-colors duration-300"
                  />
                  <button 
                    type="submit" 
                    className="bg-[#B07D4F] hover:bg-[#F9F9F9] hover:text-[#0A0A0A] text-[#0A0A0A] font-semibold text-[10px] tracking-[0.25em] uppercase px-8 py-4 transition-colors duration-300"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Directory Links & Store Details */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 py-20">
            
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
          <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-[#F9F9F9]/5 text-[10px] tracking-[0.2em] text-[#F9F9F9]/65 uppercase">
            <p>© {new Date().getFullYear()} RoyalDeriLeathers. All Rights Reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0 font-light">
              <a href="#home" className="hover:text-[#B07D4F] transition-colors duration-300">Home</a>
              <span>/</span>
              <a href="#about" className="hover:text-[#B07D4F] transition-colors duration-300">About</a>
              <span>/</span>
              <a href="#menu" className="hover:text-[#B07D4F] transition-colors duration-300">Menu</a>
              <span>/</span>
              <a href="#contact" className="hover:text-[#B07D4F] transition-colors duration-300">Contact</a>
            </div>
          </div>

        </div>
      </footer>

      {/* ANATOMY / DETAIL MODAL (Quick Add Experiential Interaction) */}
      {selectedShoe && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/90 backdrop-blur-lg transition-opacity duration-500">
          <div className="relative w-full max-w-4xl bg-[#141414] border border-[#B07D4F]/30 overflow-hidden shadow-2xl">
            
            {/* Close Button */}
            <button 
              onClick={() => {
                setSelectedShoe(null);
                setActiveDetailImageIndex(0);
              }}
              className="absolute top-6 right-6 z-50 text-[#F9F9F9]/60 hover:text-[#B07D4F] text-xl transition-colors duration-300"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12">
              
              {/* Product Visual Container with Multi-image Scroll */}
              <div className="md:col-span-6 bg-[#0A0A0A] flex flex-col items-center justify-center p-8 border-b md:border-b-0 md:border-r border-[#F9F9F9]/5 min-h-[300px]">
                <div className="w-full flex items-center justify-center max-h-[250px] relative overflow-hidden">
                  <img 
                    src={selectedShoe.images?.[activeDetailImageIndex] || selectedShoe.images?.[0] || selectedShoe.image || '/assets/images/wholecut_oxford.png'} 
                    alt={selectedShoe.name} 
                    className="max-h-[250px] object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.8)] transition-all duration-300"
                  />
                </div>

                {/* Horizontal Swipe Scroll Flex Container */}
                {selectedShoe.images && selectedShoe.images.length > 1 && (
                  <div className="flex overflow-x-auto gap-2 py-2 mt-4 max-w-full justify-center scrollbar-none snap-x">
                    {selectedShoe.images.map((img, idx) => (
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
                  <h3 className="text-3xl font-serif text-[#F9F9F9] mt-2 mb-4 break-words">{selectedShoe.name}</h3>
                  <p className="text-xs text-[#F9F9F9]/70 tracking-wider mb-6 break-words">{selectedShoe.category}</p>
                  
                  <p className="text-sm text-[#F9F9F9]/80 font-light leading-relaxed mb-8 break-words">
                    {selectedShoe.description}
                  </p>

                  <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#B07D4F] mb-4 font-semibold">Craft Specifications</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#F9F9F9]/70 mb-8 font-light">
                    {selectedShoe.specs?.map((spec, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <span className="h-[3px] w-[3px] bg-[#B07D4F] rounded-full"></span>
                        <span className="break-words">{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between border-t border-[#F9F9F9]/5 pt-6 mt-6">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-[#F9F9F9]/70">Exclusive Price</p>
                    <p className="text-xl font-serif text-[#B07D4F] font-semibold mt-1 break-all">₹{selectedShoe.price.toLocaleString('en-IN')}</p>
                  </div>
                  
                  <div className="w-full">
                    <button 
                      onClick={() => {
                        handleOrderViaWhatsApp(selectedShoe);
                        setSelectedShoe(null);
                      }}
                      className="w-full py-4 bg-[#B07D4F] text-[#0A0A0A] hover:bg-[#F9F9F9] hover:text-[#0A0A0A] font-semibold text-[10px] tracking-[0.15em] uppercase transition-colors duration-300 text-center block"
                    >
                      Buy Now (WhatsApp Order)
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* CART DRAWER REMOVED FROM HOME PAGE */}

      {/* MERCHANT / ADMIN PORTAL MODAL */}
      <AdminPortal 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
        onCatalogChange={() => setProducts(getProducts())}
      />

    </div>
  );
}
