import React, { useState, useEffect, useRef } from 'react';

// DESIGN SYSTEM COLORS
// Background: #0A0A0A (Pure Pitch Black)
// Section Blocks: #141414 (Deep Velvet Charcoal)
// Interactive Accent: #B07D4F (Italian Whiskey Tan)
// Typography: #F9F9F9 (Crisp Ivory White)

export default function About() {
  const [scrollY, setScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeEra, setActiveEra] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Refs for tracking timeline sections viewport entry
  const eraRefs = [
    useRef(null), useRef(null), useRef(null), useRef(null),
    useRef(null), useRef(null), useRef(null), useRef(null)
  ];
  const countersRef = useRef(null);
  const [countersVisible, setCountersVisible] = useState(false);
  const storeRef = useRef(null);
  const [storeVisible, setStoreVisible] = useState(false);

  const [typedTitle, setTypedTitle] = useState("");
  const [typedDesc, setTypedDesc] = useState("");

  // Trigger load animation on mount
  useEffect(() => {
    setTimeout(() => {
      setHasLoaded(true);
    }, 100);
  }, []);

  // Scroll handler for parallax background and components visibility
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      // Track counters section visibility
      if (countersRef.current) {
        const rect = countersRef.current.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.85) {
          setCountersVisible(true);
        }
      }

      // Track store section visibility
      if (storeRef.current) {
        const rect = storeRef.current.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.85) {
          setStoreVisible(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Typing animation for active material (every time activeEra changes)
  useEffect(() => {
    const titleText = shoemakingMaterials[activeEra]?.title || "";
    const descText = shoemakingMaterials[activeEra]?.description || "";
    
    let titleIndex = 0;
    let descIndex = 0;
    setTypedTitle("");
    setTypedDesc("");
    
    const titleInterval = setInterval(() => {
      if (titleIndex < titleText.length) {
        setTypedTitle(titleText.slice(0, titleIndex + 1));
        titleIndex++;
      } else {
        clearInterval(titleInterval);
      }
    }, 20);

    const descInterval = setInterval(() => {
      if (descIndex < descText.length) {
        setTypedDesc(descText.slice(0, descIndex + 1));
        descIndex++;
      } else {
        clearInterval(descInterval);
      }
    }, 8);

    return () => {
      clearInterval(titleInterval);
      clearInterval(descInterval);
    };
  }, [activeEra]);

  // Auto-play timer every 15 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveEra((prev) => (prev + 1) % 8);
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // Material sections (zigzag layout)
  const shoemakingMaterials = [
    {
      title: "100% Full-Grain Calf Hide",
      label: "THE SKIN",
      description: "Our shoes are born from premium vegetable-tanned full-grain hides, sourced directly from historic Tuscan tanneries. Unlike split leather or corrected hides, full-grain preserves the skin's natural breathability, developing a rich, self-healing patina over a lifetime.",
      image: "/assets/images/raw_leather_material.png"
    },
    {
      title: "Waxed Irish Linen Thread",
      label: "THE BIND",
      description: "To bind structural panels watertight, we utilize heavy-gauge Irish linen threads saturated with a proprietary blend of pure beeswax and rosin. This traditional treatment prevents rot, fills stitch holes completely, and provides extreme tensile strength.",
      image: "/assets/images/shoemaking_threads.png"
    },
    {
      title: "Oak-Bark Insoles & Cork Fill",
      label: "THE CORE",
      description: "Underneath the foot rests an oak-bark tanned leather insole combined with a pure, hot-stuffed cork paste filling. Over a few weeks of wear, the cork conforms directly to your foot's unique anatomy, creating a custom orthopedic footbed.",
      image: "/assets/images/leather_shoe_soles.png"
    },
    {
      title: "Carnauba Wax & Beeswax",
      label: "THE SEAL",
      description: "The finishing touch. Multiple layers of organic beeswax and Brazilian carnauba cream are massaged by hand into the leather pores, followed by intensive hot-air buffing. This shields the shoe from moisture and builds the iconic whiskey depth.",
      image: "/assets/images/shoemaking_wax.png"
    },
    {
      title: "Tempered Steel Shank",
      label: "THE SPINE",
      description: "Forged from tempered spring steel, the shank is tucked between the insole and outsole to support the foot's arch. It acts as the structural spine of the shoe, preventing collapse and maintaining shoe geometry under high stress.",
      image: "/assets/images/shoemaking_steel_shank.png"
    },
    {
      title: "Stacked Leather Heels",
      label: "THE FOUNDATION",
      description: "Constructed from individually cut disks of dense vegetable-tanned shoulder leather, stacked layer-by-layer and secured with brass nails. Finished with a durable rubber key-insert for slip resistance and longevity.",
      image: "/assets/images/shoemaking_leather_heels.png"
    },
    {
      title: "Glove-Soft Kidskin Lining",
      label: "THE NEST",
      description: "The interior lining is made from glove-soft aniline kidskin or vegetable-tanned calfskin. It provides a velvety touch against the skin, absorbs moisture naturally, and prevents friction to ensure blister-free comfort.",
      image: "/assets/images/shoemaking_lining_leather.png"
    },
    {
      title: "Solid Brass Pegging",
      label: "THE ANCHOR",
      description: "Solid brass pegs and lemonwood tacks are hand-driven into the waist and heel seat. Unlike steel, brass does not rust when exposed to perspiration, keeping the welt and outsoles permanently anchored to the lasted upper.",
      image: "/assets/images/shoemaking_brass_nails.png"
    }
  ];

  // Crafting steps for the horizontal track
  const craftSteps = [
    {
      step: "01",
      title: "Sourcing Hides",
      description: "Only the top 5% of tanneries qualify. We inspect raw grain patterns for consistency and strength, rejecting any piece with artificial coatings.",
      image: "/assets/images/raw_leather_material.png"
    },
    {
      step: "02",
      title: "Bespoke Hand-Lasting",
      description: "The leather upper is pulled firmly over our custom anatomical lasts by hand, held under tension for ten days to lock in the shape.",
      image: "/assets/images/artisan_workspace.png"
    },
    {
      step: "03",
      title: "Goodyear Welted",
      description: "A solid leather welt strip is stitched directly to the upper and insole. This allows the shoe to be completely resoled infinite times.",
      image: "/assets/images/leather_shoe_soles.png"
    },
    {
      step: "04",
      title: "Sole Stitching & Channeling",
      description: "Stitching the dense oak-bark leather outsoles to the welt with waxed Irish linen thread, using a closed-channel stitch for moisture resistance.",
      image: "/assets/images/leather_shoe_soles.png"
    },
    {
      step: "05",
      title: "Stacked Heel Building",
      description: "Securing layered vegetable-tanned leather heel lifts with solid brass nails, shaped manually with glass shards for a glassy finish.",
      image: "/assets/images/shoemaking_leather_heels.png"
    },
    {
      step: "06",
      title: "Carnauba Wax Burnishing",
      description: "Infusing multiple coats of organic beeswax and carnauba cream into the pores with hot irons, hand-buffing to produce a mirror sheen.",
      image: "/assets/images/shoemaking_wax.png"
    }
  ];

  // Store service cards
  const storeCards = [
    {
      title: "Customer Support",
      description: "Our dedicated support team is available 24/7 to assist with your order logistics, personal sizing records, or shipping enquiries.",
      image: "/assets/images/service_support.png",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      title: "Doubt Clarification",
      description: "Direct styling and fit advice from our master craftsmen. Resolve leather inquiries, size selections, and style match doubts instantly.",
      image: "/assets/images/service_consultation.png",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Better Experience",
      description: "Private showroom consultations. Enjoy sensory leather selection and tailored measurement sessions in an ultra-exclusive setup.",
      image: "/assets/images/service_showroom.png",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    {
      title: "Bespoke Restoration",
      description: "Complimentary lifetime servicing. We offer custom resoling, stitch rebuilding, and deep wax polishing to protect your purchase forever.",
      image: "/assets/images/service_restoration.png",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F9F9F9] font-sans selection:bg-[#B07D4F] selection:text-[#0A0A0A] overflow-x-hidden">
      
      {/* GLOBAL EMBEDDED KEYFRAME ANIMATIONS */}
      <style dangerouslySetInnerHTML={{ __html: `
        .whiskey-glow {
          box-shadow: 0 0 50px -10px rgba(176, 125, 79, 0.15);
        }
        .timeline-line {
          background: linear-gradient(to bottom, #141414, #B07D4F, #141414);
        }
        @keyframes assemble-last {
          0% { transform: translate(-80px, -60px) rotate(-15deg); opacity: 0; }
          100% { transform: translate(0, 0) rotate(0deg); opacity: 0.12; }
        }
        @keyframes assemble-upper {
          0% { transform: translate(-40px, -40px) rotate(-10deg); opacity: 0; }
          100% { transform: translate(0, 0) rotate(0deg); opacity: 0.1; }
        }
        @keyframes assemble-sole {
          0% { transform: translate(80px, 60px) rotate(15deg); opacity: 0; }
          100% { transform: translate(0, 0) rotate(0deg); opacity: 0.12; }
        }
        @keyframes assemble-stitch {
          0% { stroke-dashoffset: 200; opacity: 0; }
          100% { stroke-dashoffset: 0; opacity: 0.2; }
        }
        @keyframes scan {
          0% { left: 0%; opacity: 0.2; }
          50% { left: 100%; opacity: 0.9; }
          100% { left: 0%; opacity: 0.2; }
        }
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .scrollbar-thin::-webkit-scrollbar {
          height: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #141414;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #B07D4F;
          border-radius: 3px;
        }
      `}} />

      {/* LUXURY NAVIGATION HEADER */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#0A0A0A]/85 backdrop-blur-md border-b border-[#F9F9F9]/5">
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
            
            <a href="#about" className="text-[#B07D4F] relative py-2">
              About
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#B07D4F]"></span>
            </a>

            <a href="#footer-contact" className="hover:text-[#B07D4F] transition-colors duration-300 relative group py-2">
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#B07D4F] transition-all duration-300 group-hover:w-full"></span>
            </a>

            <button 
              onClick={() => setIsMenuOpen(true)}
              className="hover:text-[#B07D4F] transition-colors duration-300 relative group py-2 uppercase flex items-center space-x-1"
            >
              <span>Menu</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#B07D4F] transition-all duration-300 group-hover:w-full"></span>
            </button>
          </nav>

          {/* Hamburger Trigger visible on mobile/tablet */}
          <div className="flex lg:hidden items-center">
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
              <span className="text-xs tracking-[0.3em] uppercase text-[#B07D4F] font-semibold">Catalog Directory</span>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="text-[#F9F9F9]/60 hover:text-[#B07D4F] text-sm tracking-widest uppercase transition-colors"
              >
                Close ✕
              </button>
            </div>

            {/* Menu options structure */}
            <div className="space-y-8">
              {/* Bags Section */}
              <div>
                <h4 className="text-[10px] tracking-[0.25em] text-[#B07D4F] uppercase font-semibold mb-3">Bags</h4>
                <ul className="space-y-3 pl-2 border-l border-[#B07D4F]/10">
                  <li><a href="#home" onClick={() => setIsMenuOpen(false)} className="text-sm text-[#F9F9F9]/75 hover:text-[#B07D4F] transition-colors block">School Bag</a></li>
                  <li><a href="#home" onClick={() => setIsMenuOpen(false)} className="text-sm text-[#F9F9F9]/75 hover:text-[#B07D4F] transition-colors block">College Bag</a></li>
                  <li><a href="#home" onClick={() => setIsMenuOpen(false)} className="text-sm text-[#F9F9F9]/75 hover:text-[#B07D4F] transition-colors block">Ladies Hand Bag</a></li>
                  <li><a href="#home" onClick={() => setIsMenuOpen(false)} className="text-sm text-[#F9F9F9]/75 hover:text-[#B07D4F] transition-colors block">Travel Bag</a></li>
                </ul>
              </div>

              {/* Accessories Section */}
              <div>
                <h4 className="text-[10px] tracking-[0.25em] text-[#B07D4F] uppercase font-semibold mb-3">Accessories</h4>
                <ul className="space-y-3 pl-2 border-l border-[#B07D4F]/10">
                  <li><a href="#home" onClick={() => setIsMenuOpen(false)} className="text-sm text-[#F9F9F9]/75 hover:text-[#B07D4F] transition-colors block">Ladies Hand Purse</a></li>
                  <li><a href="#home" onClick={() => setIsMenuOpen(false)} className="text-sm text-[#F9F9F9]/75 hover:text-[#B07D4F] transition-colors block">Men's Wallet</a></li>
                  <li><a href="#home" onClick={() => setIsMenuOpen(false)} className="text-sm text-[#F9F9F9]/75 hover:text-[#B07D4F] transition-colors block">Men's Belt</a></li>
                </ul>
              </div>

              {/* Footwear Section */}
              <div>
                <h4 className="text-[10px] tracking-[0.25em] text-[#B07D4F] uppercase font-semibold mb-3">Footwear</h4>
                <ul className="space-y-3 pl-2 border-l border-[#B07D4F]/10">
                  <li><a href="#home" onClick={() => setIsMenuOpen(false)} className="text-sm text-[#F9F9F9]/75 hover:text-[#B07D4F] transition-colors block">Shoes</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Call & Order details */}
          <div className="border-t border-[#F9F9F9]/5 pt-8 mt-8">
            <p className="text-[9px] uppercase tracking-[0.2em] text-[#F9F9F9]/75 mb-3">Direct Ordering Hotline</p>
            <a 
              href="tel:8903553679"
              className="w-full py-4 bg-[#B07D4F] text-[#0A0A0A] hover:bg-[#F9F9F9] transition-all duration-300 font-semibold text-xs tracking-[0.2em] uppercase text-center block"
            >
              Call & Order: 8903553679
            </a>
          </div>
        </div>
      </div>

      {/* 1. THE MANIFESTO HERO HEADER */}
      <section className="relative min-h-[70vh] flex flex-col justify-center items-center px-6 md:px-12 pt-40 pb-20 overflow-hidden">
        
        {/* Background Grain Texture */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.05]"
          style={{ 
            backgroundImage: `url('/assets/images/leather_grain_texture.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-3 mb-6">
            <span className="h-[1px] w-8 bg-[#B07D4F]"></span>
            <span className="text-xs uppercase tracking-[0.4em] text-[#B07D4F] font-semibold">The Manifesto</span>
            <span className="h-[1px] w-8 bg-[#B07D4F]"></span>
          </div>

          <h1 
            className={`text-5xl sm:text-6xl md:text-8xl font-serif text-[#F9F9F9] leading-[1.05] tracking-tight mb-8 transform transition-all duration-[1200ms] ease-out ${
              hasLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            THE ARCHITECTURE <br />
            OF <span className="italic font-light text-[#B07D4F]">CRAFTSMANSHIP</span>.
          </h1>

          <p 
            className={`text-[#F9F9F9]/75 text-sm md:text-lg leading-relaxed max-w-3xl mx-auto font-light tracking-wide transform transition-all duration-[1200ms] ease-out ${
              hasLoaded ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            At Royal Deri Leathers, we stand against the tide of mass production. We believe a shoe is not simply wear; it is an architectural structure, designed to carry you through life. By sourcing only pure, raw components from scratch and slow-stitching each shoe over days, we shape luxury that endures.
          </p>
        </div>
      </section>

      {/* 2. OUR MANUFACTURING TIMELINE LAYER (Single Material auto-cycling with Typing Animation) */}
      <section className="relative bg-[#141414]/90 py-28 border-y border-[#F9F9F9]/5 overflow-hidden">
        
        {/* Fixed Background Video Parallax (Mirror Effect) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="fixed top-0 left-0 w-screen h-screen object-cover opacity-20 pointer-events-none"
            style={{ zIndex: 0 }}
          >
            <source src="/assets/videos/shoemaker.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[#0A0A0A]/70 mix-blend-multiply z-1" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#141414] via-transparent to-[#141414] z-1" />
        </div>

        {/* Section Heading */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16 relative z-10">
          <div className="inline-flex items-center space-x-3 mb-4">
            <span className="h-[1px] w-8 bg-[#B07D4F]"></span>
            <span className="text-xs uppercase tracking-[0.4em] text-[#B07D4F] font-semibold">Our Materials</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-serif text-[#F9F9F9] tracking-tight">
            THE ART OF <span className="italic font-light text-[#B07D4F]">CREATION</span>
          </h2>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          
          {/* Elegant Horizontal Tabs Selector */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-16 border-b border-[#F9F9F9]/5 pb-6">
            {shoemakingMaterials.map((material, idx) => (
              <button
                key={idx}
                onClick={() => setActiveEra(idx)}
                className={`group transition-all duration-300 relative py-2 ${
                  activeEra === idx ? 'text-[#B07D4F]' : 'text-[#F9F9F9]/40 hover:text-[#F9F9F9]/75'
                }`}
              >
                <span className="text-[11px] sm:text-xs font-serif tracking-widest uppercase font-medium">{material.label}</span>
                {/* Active Indicator Underline */}
                <span className={`absolute bottom-0 left-0 h-[2px] bg-[#B07D4F] transition-all duration-500 ${
                  activeEra === idx ? 'w-full' : 'w-0 group-hover:w-1/2'
                }`} />
              </button>
            ))}
          </div>

          {/* Interactive Material Showcase Block */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[450px]">
            
            {/* Left Column: Image with Scanline and Fade transition */}
            <div className="lg:col-span-5 relative aspect-square bg-[#0A0A0A] border border-[#F9F9F9]/5 overflow-hidden group">
              <img 
                src={shoemakingMaterials[activeEra].image} 
                alt={shoemakingMaterials[activeEra].title} 
                className="w-full h-full object-cover opacity-80 scale-100 group-hover:scale-105 transition-transform duration-[800ms]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
              
              {/* Glowing Scan Line Animation */}
              <div 
                className="absolute top-0 bottom-0 w-[3px] bg-[#B07D4F] shadow-[0_0_15px_#B07D4F] pointer-events-none"
                style={{
                  left: '100%',
                  animation: 'scan 2.5s cubic-bezier(0.25, 1, 0.5, 1) infinite'
                }}
              />
            </div>

            {/* Right Column: Typed Details with Custom Layout */}
            <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-6 lg:pl-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-xs font-mono tracking-[0.3em] text-[#B07D4F] uppercase">
                    0{activeEra + 1} OF 08
                  </span>
                  <span className="h-[1px] w-12 bg-[#B07D4F]/30" />
                  <span className="text-[10px] font-mono tracking-widest text-[#F9F9F9]/40 uppercase">
                    {shoemakingMaterials[activeEra].label}
                  </span>
                </div>
                
                {/* Typed Title */}
                <h3 className="text-3xl sm:text-4xl font-serif text-[#F9F9F9] min-h-[48px] flex items-center">
                  {typedTitle}
                  <span className="w-[2px] h-[30px] bg-[#B07D4F] ml-1 animate-pulse" />
                </h3>
                
                {/* Typed Description */}
                <p className="text-sm md:text-base text-[#F9F9F9]/70 leading-relaxed font-light min-h-[120px]">
                  {typedDesc}
                </p>
              </div>

              {/* Progress bar for the 15 seconds cycle */}
              <div className="space-y-2 pt-6">
                <div className="flex justify-between items-center text-[9px] font-mono tracking-widest text-[#F9F9F9]/40 uppercase">
                  <span>AUTOCYCLING GALLERY</span>
                  <span>15S INTERVAL</span>
                </div>
                <div className="h-[2px] bg-[#F9F9F9]/5 w-full overflow-hidden relative">
                  <div 
                    key={activeEra} // Reset animation when activeEra changes
                    className="h-full bg-[#B07D4F] transition-all"
                    style={{
                      animation: 'progress 15s linear forwards'
                    }}
                  />
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. THE STEP-BY-STEP HORIZONTAL CRAFTING TRACK */}
      <section className="bg-[#0A0A0A] py-32 border-b border-[#F9F9F9]/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16">
          <div className="inline-flex items-center space-x-3 mb-4">
            <span className="h-[1px] w-8 bg-[#B07D4F]"></span>
            <span className="text-xs uppercase tracking-[0.4em] text-[#B07D4F] font-semibold">The Process</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-serif text-[#F9F9F9] tracking-tight">
            FROM RAW TO <span className="italic font-light text-[#B07D4F]">REFINED</span>
          </h2>
        </div>

        {/* Horizontal Track Slider Container */}
        <div className="w-full px-6 md:px-12 overflow-x-auto scrollbar-thin">
          <div className="flex space-x-8 pb-10 min-w-max">
            {craftSteps.map((step, idx) => (
              <div 
                key={idx}
                className="w-[300px] sm:w-[400px] bg-[#141414] border border-[#F9F9F9]/5 relative group flex flex-col justify-between overflow-hidden aspect-[4/5]"
              >
                {/* Interactive Top Border stretching across */}
                <div className="absolute top-0 left-0 w-0 h-[2px] bg-[#B07D4F] group-hover:w-full transition-all duration-500 ease-out z-20" />
                
                {/* Background Zoom Image */}
                <div className="w-full h-1/2 relative overflow-hidden">
                  <img 
                    src={step.image} 
                    alt={step.title} 
                    className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-[1000ms] ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414] to-transparent z-10" />
                </div>

                {/* Content Area */}
                <div className="p-8 relative z-10 flex-grow flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-xs tracking-[0.3em] uppercase text-[#B07D4F] font-mono">{step.step}</span>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-[#F9F9F9]/40 font-semibold">STAGE</span>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-2xl font-serif text-[#F9F9F9] mb-3">{step.title}</h3>
                    <p className="text-xs text-[#F9F9F9]/60 leading-relaxed font-light">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. THE QUALITY MANIFESTO COUNTERS */}
      <section 
        ref={countersRef}
        className="bg-[#141414] py-28 relative overflow-hidden"
      >
        {/* Assembling Blueprint Animation Background */}
        <div className={`absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000 ${countersVisible ? 'opacity-100' : 'opacity-0'}`}>
          {/* Blueprint Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(249,249,249,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(249,249,249,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-15" />
          
          {/* Floating blueprint shapes */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] pointer-events-none opacity-40">
            {/* Last Outline */}
            <svg className="absolute inset-0 w-full h-full text-[#B07D4F]" viewBox="0 0 600 300" fill="none" style={{
              animation: countersVisible ? 'assemble-last 2s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none',
            }}>
              <path d="M 50 150 C 120 70, 200 60, 280 120 C 350 170, 480 180, 520 130 C 530 110, 550 90, 570 120 C 580 140, 550 220, 480 230 C 400 240, 200 240, 100 220 C 50 200, 40 180, 50 150 Z" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
            </svg>
            
            {/* Leather Upper Pattern */}
            <svg className="absolute inset-0 w-full h-full text-[#F9F9F9]" viewBox="0 0 600 300" fill="none" style={{
              animation: countersVisible ? 'assemble-upper 2.5s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none',
              animationDelay: '0.3s'
            }}>
              <path d="M 60 140 C 130 80, 190 70, 260 110 C 320 140, 420 150, 470 130 C 490 120, 510 110, 530 130 C 540 140, 510 190, 450 190 C 380 190, 220 190, 120 180 C 70 170, 50 160, 60 140 Z" stroke="currentColor" strokeWidth="1.5" />
            </svg>

            {/* Leather Sole Pattern */}
            <svg className="absolute inset-0 w-full h-full text-[#B07D4F]" viewBox="0 0 600 300" fill="none" style={{
              animation: countersVisible ? 'assemble-sole 2.2s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none',
              animationDelay: '0.1s'
            }}>
              <path d="M 90 225 C 190 225, 390 225, 470 215 C 530 205, 560 160, 560 140 C 560 130, 540 145, 500 160 C 450 180, 390 195, 290 195 C 190 195, 120 205, 90 225 Z" stroke="currentColor" strokeWidth="2" />
            </svg>

            {/* Stitches Path */}
            <svg className="absolute inset-0 w-full h-full text-[#B07D4F]" viewBox="0 0 600 300" fill="none">
              <path d="M 90 200 C 190 200, 390 200, 470 190 C 530 180, 550 145, 550 135" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" style={{
                strokeDasharray: '200',
                strokeDashoffset: '200',
                animation: countersVisible ? 'assemble-stitch 3s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none',
                animationDelay: '0.6s'
              }} />
            </svg>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center md:text-left">
            
            <div className={`transition-all duration-1000 ease-out transform ${
              countersVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`} style={{ transitionDelay: '100ms' }}>
              <p className="text-5xl md:text-6xl lg:text-7xl font-serif text-[#B07D4F] tracking-tight font-semibold">100%</p>
              <p className="text-[9px] uppercase tracking-[0.25em] text-[#F9F9F9]/70 mt-3 font-semibold font-mono">
                Certified Full-Grain
              </p>
              <p className="text-xs text-[#F9F9F9]/55 mt-2 font-light max-w-xs leading-relaxed">
                Zero artificial corrections. Preserving original leather structures.
              </p>
            </div>

            <div className={`transition-all duration-1000 ease-out transform ${
              countersVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`} style={{ transitionDelay: '300ms' }}>
              <p className="text-5xl md:text-6xl lg:text-7xl font-serif text-[#B07D4F] tracking-tight font-semibold">48 Hrs</p>
              <p className="text-[9px] uppercase tracking-[0.25em] text-[#F9F9F9]/70 mt-3 font-semibold font-mono">
                Hand-Stitched Per Pair
              </p>
              <p className="text-xs text-[#F9F9F9]/55 mt-2 font-light max-w-xs leading-relaxed">
                Constructed stitch-by-stitch with dedicated beeswax Irish threads.
              </p>
            </div>

            <div className={`transition-all duration-1000 ease-out transform ${
              countersVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`} style={{ transitionDelay: '500ms' }}>
              <p className="text-5xl md:text-6xl lg:text-7xl font-serif text-[#B07D4F] tracking-tight font-semibold">300+</p>
              <p className="text-[9px] uppercase tracking-[0.25em] text-[#F9F9F9]/70 mt-3 font-semibold font-mono">
                Artisanal Operations
              </p>
              <p className="text-xs text-[#F9F9F9]/55 mt-2 font-light max-w-xs leading-relaxed">
                Every shoe undergoes over 300 meticulous hand-crafting steps, from pattern drafting to hot-air polishing.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. THE ATELIER SERVICES SECTION (Our Store Features with matching dark-whiskey aesthetics in zigzag layout) */}
      <section 
        ref={storeRef}
        className="bg-[#0A0A0A] py-32 border-t border-[#F9F9F9]/5 relative overflow-hidden"
      >
        <div className={`absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000 ${storeVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(249,249,249,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(249,249,249,0.01)_1px,transparent_1px)] bg-[size:50px_50px] opacity-10" />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="mb-16">
            <div className="inline-flex items-center space-x-3 mb-4">
              <span className="h-[1px] w-8 bg-[#B07D4F]"></span>
              <span className="text-xs uppercase tracking-[0.4em] text-[#B07D4F] font-semibold">Our Services</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-serif text-[#F9F9F9] tracking-tight">
              THE ATELIER <br className="md:hidden" /><span className="italic font-light text-[#B07D4F]">EXPERIENCE</span>
            </h2>
          </div>

          <div className="flex flex-col space-y-16">
            {storeCards.map((card, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div 
                  key={idx}
                  className={`grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#141414] border border-[#F9F9F9]/5 p-8 relative group overflow-hidden transition-all duration-1000 ease-out transform ${
                    storeVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                  }`}
                  style={{ transitionDelay: `${idx * 150}ms` }}
                >
                  {/* Interactive Top Border */}
                  <div className="absolute top-0 left-0 w-0 h-[2px] bg-[#B07D4F] group-hover:w-full transition-all duration-500 ease-out z-20" />
                  
                  {/* Background Glow Effect on Hover */}
                  <div className="absolute inset-0 bg-[#B07D4F]/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />

                  {/* Image Block */}
                  <div className={`md:col-span-5 relative overflow-hidden aspect-[4/3] bg-[#0A0A0A] border border-[#F9F9F9]/5 z-10 ${
                    isEven ? 'md:order-1' : 'md:order-2'
                  }`}>
                    <img 
                      src={card.image} 
                      alt={card.title} 
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[800ms] ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent pointer-events-none" />
                  </div>

                  {/* Content Block */}
                  <div className={`md:col-span-7 flex flex-col justify-center space-y-4 z-10 ${
                    isEven ? 'md:order-2 md:pl-8' : 'md:order-1 md:pr-8'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div className="text-[#B07D4F] group-hover:scale-110 transition-transform duration-300">
                        {card.icon}
                      </div>
                      <span className="text-[10px] tracking-[0.2em] uppercase text-[#F9F9F9]/40 font-semibold font-mono">
                        SERVICE {idx + 1}
                      </span>
                    </div>

                    <h3 className="text-2xl font-serif text-[#F9F9F9] group-hover:text-[#B07D4F] transition-colors duration-300">
                      {card.title}
                    </h3>
                    
                    <p className="text-sm text-[#F9F9F9]/60 leading-relaxed font-light">
                      {card.description}
                    </p>

                    <div className="pt-2 flex items-center space-x-2 text-[10px] tracking-[0.2em] uppercase text-[#B07D4F] font-semibold cursor-pointer">
                      <span>Explore Service</span>
                      <span className="transform group-hover:translate-x-2 transition-transform duration-300">→</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER SECTION & STORE DETAILS */}
      <footer id="footer-contact" className="bg-[#0A0A0A] border-t border-[#F9F9F9]/5 pt-24 pb-12 relative z-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Main Directory grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 py-20">
            
            {/* Store Address & Contact Block */}
            <div className="md:col-span-4 flex flex-col space-y-6">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 border border-[#B07D4F]/30 rounded-full bg-[#141414]">
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
              <ul className="space-y-4 text-xs text-[#F9F9F9]/60">
                <li><a href="#home" className="hover:text-[#B07D4F] transition-colors duration-300">School Bag</a></li>
                <li><a href="#home" className="hover:text-[#B07D4F] transition-colors duration-300">College Bag</a></li>
                <li><a href="#home" className="hover:text-[#B07D4F] transition-colors duration-300">Ladies Hand Bag</a></li>
                <li><a href="#home" className="hover:text-[#B07D4F] transition-colors duration-300">Travel Bag</a></li>
              </ul>
            </div>

            {/* Accessories Column */}
            <div className="md:col-span-2">
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#B07D4F] mb-6 font-semibold">Accessories</h4>
              <ul className="space-y-4 text-xs text-[#F9F9F9]/60 font-light">
                <li><a href="#home" className="hover:text-[#B07D4F] transition-colors duration-300">Ladies Hand Purse</a></li>
                <li><a href="#home" className="hover:text-[#B07D4F] transition-colors duration-300">Men's Wallet</a></li>
                <li><a href="#home" className="hover:text-[#B07D4F] transition-colors duration-300">Men's Belt</a></li>
              </ul>
            </div>

            {/* Footwear Column */}
            <div className="md:col-span-2">
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#B07D4F] mb-6 font-semibold">Footwear</h4>
              <ul className="space-y-4 text-xs text-[#F9F9F9]/60 font-light">
                <li><a href="#home" className="hover:text-[#B07D4F] transition-colors duration-300">Shoes</a></li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright Block */}
          <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-[#F9F9F9]/5 text-[10px] tracking-[0.2em] text-[#F9F9F9]/65 uppercase">
            <p>© {new Date().getFullYear()} RoyalDeriLeathers. All Rights Reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0 font-light">
              <a href="#" className="hover:text-[#B07D4F] transition-colors duration-300">Privacy Policy</a>
              <span>/</span>
              <a href="#" className="hover:text-[#B07D4F] transition-colors duration-300">Terms of Service</a>
              <span>/</span>
              <a href="#" className="hover:text-[#B07D4F] transition-colors duration-300">Sitemap</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
