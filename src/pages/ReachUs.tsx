import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, ExternalLink, Globe, MessageCircle, CheckCircle2, Sparkles } from 'lucide-react';

const ReachUs: React.FC = () => {
  const stores = [
    {
      name: "Main Store - Marathe Wada",
      address: "Marathe Wada Building, L.I.C\n588/599, Near Common Wealth\nSadashiv Peth, Pune – 411030\nMaharashtra, India",
      mapLink: "https://maps.google.com/?q=Marathe+Wada+Building+Sadashiv+Peth+Pune",
      embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.4121516625!2d73.8475!3d18.5125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c06fa5b4227d%3A0x863458870918819e!2sSadashiv%20Peth%2C%20Pune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1710800000000!5m2!1sen!2sin"
    },
    {
      name: "Boutique - Kumpthekar Road",
      address: "Arianth Morgaonkar Market\nKumpthekar Road, Near Annabhau Sathe School\nSadashiv Peth, Pune – 411030\nMaharashtra, India",
      mapLink: "https://maps.google.com/?q=Kumpthekar+Road+Sadashiv+Peth+Pune",
      embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.4121516625!2d73.8475!3d18.5125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c06fa5b4227d%3A0x863458870918819e!2sSadashiv%20Peth%2C%20Pune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1710800000000!5m2!1sen!2sin"
    }
  ];

  const whyChooseUs = [
    { title: "Custom Tailoring for Every Groom", icon: <Sparkles className="w-5 h-5" /> },
    { title: "Premium Fabrics & Handcrafted Details", icon: <CheckCircle2 className="w-5 h-5" /> },
    { title: "Perfect Fit Guarantee", icon: <CheckCircle2 className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen py-12 px-4 md:px-8 max-w-6xl mx-auto relative">
      {/* Floating WhatsApp Button */}
      <motion.a
        href="https://wa.me/919834142285"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(212, 175, 55, 0.4)" }}
        className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl md:bottom-12 md:right-12"
      >
        <MessageCircle className="w-7 h-7 fill-current" />
      </motion.a>

      {/* Page Title */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-6xl font-serif text-pe-gold mb-4 tracking-tight">Reach Us</h1>
        <div className="w-24 h-1 bg-pe-gold/30 mx-auto rounded-full mb-4" />
        <p className="text-pe-gold/60 text-sm tracking-widest uppercase">Serving grooms across Pune with 2 physical stores.</p>
      </motion.div>

      {/* About Us Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-20"
      >
        <div className="bg-pe-surface p-8 md:p-12 relative overflow-hidden group rounded-3xl border border-pe-gold/10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-pe-gold/5 rounded-full blur-3xl -mr-48 -mt-48 transition-colors group-hover:bg-pe-gold/10" />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-serif text-pe-gold mb-6">Our Heritage & Craft</h2>
            <p className="text-pe-text-muted leading-relaxed text-lg italic font-serif mb-6">
              "Pune Ethnic is dedicated to crafting timeless groom wear that blends tradition with modern elegance. We specialize in customized sherwanis, Jodhpuri suits, indo-western outfits, and luxury ethnic ensembles tailored to reflect each individual's personality."
            </p>
            <p className="text-pe-text-muted leading-relaxed mb-4">
              From intricate embroidery to premium fabrics and precise fittings, every outfit is designed with attention to detail and a commitment to excellence. Your vision, combined with our craftsmanship, creates a look that is truly unforgettable.
            </p>
            <p className="text-pe-gold font-medium tracking-wide">
              By appointment or walk-in. Personalized styling sessions available.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Why Choose Us Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-20"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {whyChooseUs.map((item, index) => (
            <div key={index} className="bg-pe-surface p-6 rounded-2xl border border-pe-gold/5 flex items-center gap-4 group hover:border-pe-gold/20 transition-all">
              <div className="p-3 bg-pe-gold/10 rounded-full text-pe-gold group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <p className="text-pe-text font-medium text-sm leading-tight">{item.title}</p>
            </div>
          ))}
        </div>
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Our Stores Section */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-serif text-pe-gold mb-8 flex items-center gap-3">
            <Globe className="w-6 h-6" />
            Visit Our Stores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stores.map((store, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(212, 175, 55, 0.1)" }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-pe-surface p-6 flex flex-col h-full group rounded-2xl border border-pe-gold/10 transition-all duration-500"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-pe-gold/10 rounded-xl text-pe-gold group-hover:bg-pe-gold group-hover:text-pe-dark transition-colors duration-300">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-pe-text mb-1">{store.name}</h3>
                    <p className="text-pe-text-muted text-sm uppercase tracking-wider">Sadashiv Peth, Pune</p>
                  </div>
                </div>
                
                <p className="text-pe-text-muted text-sm leading-relaxed mb-6 whitespace-pre-line flex-grow">
                  {store.address}
                </p>

                {/* Embedded Map */}
                <div className="w-full h-40 rounded-xl overflow-hidden mb-6 border border-pe-gold/5 grayscale hover:grayscale-0 transition-all duration-700">
                  <iframe 
                    src={store.embedUrl}
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                <a 
                  href={store.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto flex items-center justify-center gap-2 py-3 px-6 bg-pe-gold/10 text-pe-gold rounded-full border border-pe-gold/20 hover:bg-pe-gold hover:text-pe-dark transition-all duration-300 font-medium text-sm group/btn relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    View on Map
                    <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-shine" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-serif text-pe-gold mb-8">Get in Touch</h2>
          <div className="space-y-6">
            <motion.a
              href="tel:+919834142285"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4 p-6 bg-pe-surface rounded-2xl border border-pe-gold/5 group hover:border-pe-gold/30 transition-all duration-300 block"
            >
              <div className="p-4 bg-pe-gold/10 rounded-full text-pe-gold group-hover:scale-110 transition-transform duration-300">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-pe-text-muted text-xs uppercase tracking-widest mb-1">Call Us</p>
                <p className="text-xl font-medium text-pe-text">+91 98341 42285</p>
              </div>
            </motion.a>

            <motion.a
              href="mailto:puneethnic01@gmail.com"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-4 p-6 bg-pe-surface rounded-2xl border border-pe-gold/5 group hover:border-pe-gold/30 transition-all duration-300 block"
            >
              <div className="p-4 bg-pe-gold/10 rounded-full text-pe-gold group-hover:scale-110 transition-transform duration-300">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="text-pe-text-muted text-xs uppercase tracking-widest mb-1">Email Us</p>
                <p className="text-lg font-medium text-pe-text break-all">puneethnic01@gmail.com</p>
              </div>
            </motion.a>

            <motion.a
              href="https://wa.me/919834142285"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-4 p-6 bg-[#25D366]/10 rounded-2xl border border-[#25D366]/20 group hover:bg-[#25D366]/20 transition-all duration-300 block"
            >
              <div className="p-4 bg-[#25D366]/20 rounded-full text-[#25D366] group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="w-6 h-6 fill-current" />
              </div>
              <div>
                <p className="text-[#25D366] text-xs uppercase tracking-widest mb-1 font-semibold">WhatsApp</p>
                <p className="text-lg font-medium text-pe-text">Chat on WhatsApp</p>
              </div>
            </motion.a>

            <div className="mt-12 space-y-4">
              <motion.a 
                href="https://wa.me/919834142285"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-3 py-4 px-8 bg-pe-gold text-pe-dark rounded-full font-bold text-lg shadow-xl shadow-pe-gold/20 hover:shadow-pe-gold/40 transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10">Book Your Outfit Consultation</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shine" />
              </motion.a>
              
              <p className="text-center text-pe-text-muted text-sm font-serif italic">
                "Crafting statements, not just outfits."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReachUs;
