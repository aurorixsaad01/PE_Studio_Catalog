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
    <div className="min-h-screen py-8 md:py-12 px-4 md:px-8 max-w-6xl mx-auto relative">
      {/* Floating WhatsApp Button */}
      <motion.a
        href="https://wa.me/918788987938"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-20 right-4 z-50 w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg md:bottom-12 md:right-12 md:w-14 md:h-14"
      >
        <MessageCircle className="w-6 h-6 md:w-7 md:h-7 fill-current" />
      </motion.a>

      {/* Page Title */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 md:mb-12"
      >
        <h1 className="text-h2 text-pe-gold mb-2 tracking-tight">Reach Us</h1>
        <div className="w-12 md:w-16 h-1 bg-pe-gold/30 mx-auto rounded-full mb-3" />
        <p className="text-pe-gold/60 text-tiny uppercase">Serving grooms across Pune with 2 physical stores.</p>
      </motion.div>

      {/* About Us Section */}
      <motion.section 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 md:mb-16"
      >
        <div className="ios-card p-6 md:p-10 relative group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-pe-gold/5 rounded-full blur-3xl -mr-32 -mt-32 transition-colors group-hover:bg-pe-gold/10" />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="text-h4 text-pe-gold mb-3 md:mb-4">Our Heritage & Craft</h2>
            <p className="text-pe-text-muted text-body italic font-serif mb-4">
              "Pune Ethnic is dedicated to crafting timeless groom wear that blends tradition with modern elegance. We specialize in customized sherwanis, Jodhpuri suits, indo-western outfits, and luxury ethnic ensembles tailored to reflect each individual's personality."
            </p>
            <p className="text-pe-text-muted text-small mb-4">
              From intricate embroidery to premium fabrics and precise fittings, every outfit is designed with attention to detail and a commitment to excellence. Your vision, combined with our craftsmanship, creates a look that is truly unforgettable.
            </p>
            <p className="text-pe-gold text-small font-medium">
              By appointment or walk-in. Personalized styling sessions available.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Why Choose Us Section */}
      <motion.section 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8 md:mb-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {whyChooseUs.map((item, index) => (
            <div key={index} className="ios-card p-4 flex items-center gap-3 group">
              <div className="p-2 bg-pe-gold/10 rounded-full text-pe-gold group-hover:scale-105 transition-transform">
                {item.icon}
              </div>
              <p className="text-pe-text font-medium text-small leading-tight">{item.title}</p>
            </div>
          ))}
        </div>
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Our Stores Section */}
        <div className="lg:col-span-2">
          <h2 className="text-h4 text-pe-gold mb-4 md:mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Visit Our Stores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {stores.map((store, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="ios-card p-5 flex flex-col h-full group"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-pe-gold/10 rounded-xl text-pe-gold group-hover:bg-pe-gold group-hover:text-pe-dark transition-colors duration-300">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-pe-text mb-0.5">{store.name}</h3>
                    <p className="text-pe-text-muted text-tiny uppercase">Sadashiv Peth, Pune</p>
                  </div>
                </div>
                
                <p className="text-pe-text-muted text-small leading-relaxed mb-4 whitespace-pre-line flex-grow">
                  {store.address}
                </p>

                {/* Embedded Map */}
                <div className="w-full h-32 rounded-xl overflow-hidden mb-4 border border-pe-gold/5 grayscale hover:grayscale-0 transition-all duration-500">
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
                  className="ios-btn ios-btn-secondary w-full mt-auto group/btn relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    View on Map
                    <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </span>
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="lg:col-span-1">
          <h2 className="text-h4 text-pe-gold mb-4 md:mb-6">Get in Touch</h2>
          <div className="space-y-3 md:space-y-4">
            <motion.a
              href="tel:+919834142285"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="ios-card p-4 flex items-center gap-3 group block"
            >
              <div className="p-3 bg-pe-gold/10 rounded-full text-pe-gold group-hover:scale-105 transition-transform duration-300">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-pe-text-muted text-tiny uppercase mb-0.5">Call Us</p>
                <p className="text-base font-medium text-pe-text">+91 98341 42285</p>
              </div>
            </motion.a>

            <motion.a
              href="mailto:puneethnic01@gmail.com"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="ios-card p-4 flex items-center gap-3 group block"
            >
              <div className="p-3 bg-pe-gold/10 rounded-full text-pe-gold group-hover:scale-105 transition-transform duration-300">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-pe-text-muted text-tiny uppercase mb-0.5">Email Us</p>
                <p className="text-sm font-medium text-pe-text break-all">puneethnic01@gmail.com</p>
              </div>
            </motion.a>

            <motion.a
              href="https://wa.me/918788987938"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="ios-card p-4 flex items-center gap-3 group block !border-[#25D366]/20 hover:!bg-[#25D366]/10"
            >
              <div className="p-3 bg-[#25D366]/20 rounded-full text-[#25D366] group-hover:scale-105 transition-transform duration-300">
                <MessageCircle className="w-5 h-5 fill-current" />
              </div>
              <div>
                <p className="text-[#25D366] text-tiny uppercase mb-0.5 font-semibold">WhatsApp</p>
                <p className="text-sm font-medium text-pe-text">Chat on WhatsApp</p>
              </div>
            </motion.a>

            <div className="mt-6 md:mt-8 space-y-4">
              <motion.a 
                href="https://wa.me/918788987938"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="ios-btn ios-btn-primary w-full py-4 text-sm font-bold"
              >
                Book Consultation
              </motion.a>
              
              <p className="text-center text-pe-text-muted text-small font-serif italic">
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
