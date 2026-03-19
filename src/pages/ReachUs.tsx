import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, ExternalLink, Globe } from 'lucide-react';

const ReachUs: React.FC = () => {
  const stores = [
    {
      name: "Main Store - Marathe Wada",
      address: "Marathe Wada Building, L.I.C\n588/599, Near Common Wealth\nSadashiv Peth, Pune – 411030\nMaharashtra, India",
      mapLink: "https://maps.google.com/?q=Marathe+Wada+Building+Sadashiv+Peth+Pune"
    },
    {
      name: "Boutique - Kumpthekar Road",
      address: "Arianth Morgaonkar Market\nKumpthekar Road, Near Annabhau Sathe School\nSadashiv Peth, Pune – 411030\nMaharashtra, India",
      mapLink: "https://maps.google.com/?q=Kumpthekar+Road+Sadashiv+Peth+Pune"
    }
  ];

  return (
    <div className="min-h-screen py-12 px-4 md:px-8 max-w-6xl mx-auto">
      {/* Page Title */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-6xl font-serif text-pe-gold mb-4 tracking-tight">Reach Us</h1>
        <div className="w-24 h-1 bg-pe-gold/30 mx-auto rounded-full" />
      </motion.div>

      {/* About Us Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-20"
      >
        <div className="bg-pe-surface p-8 md:p-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-pe-gold/5 rounded-full blur-3xl -mr-32 -mt-32 transition-colors group-hover:bg-pe-gold/10" />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-serif text-pe-gold mb-6">Our Heritage & Craft</h2>
            <p className="text-pe-text-muted leading-relaxed text-lg italic font-serif mb-6">
              "Pune Ethnic is dedicated to crafting timeless groom wear that blends tradition with modern elegance. We specialize in customized sherwanis, Jodhpuri suits, indo-western outfits, and luxury ethnic ensembles tailored to reflect each individual's personality."
            </p>
            <p className="text-pe-text-muted leading-relaxed">
              From intricate embroidery to premium fabrics and precise fittings, every outfit is designed with attention to detail and a commitment to excellence. Your vision, combined with our craftsmanship, creates a look that is truly unforgettable.
            </p>
          </div>
        </div>
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Our Stores Section */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-serif text-pe-gold mb-8 flex items-center gap-3">
            <Globe className="w-6 h-6" />
            Visit Our Stores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stores.map((store, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-pe-surface p-6 flex flex-col h-full group hover:border-pe-gold/30 transition-all duration-300"
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
                
                <p className="text-pe-text-muted text-sm leading-relaxed mb-8 whitespace-pre-line flex-grow">
                  {store.address}
                </p>

                <a 
                  href={store.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto flex items-center justify-center gap-2 py-3 px-6 bg-pe-gold/10 text-pe-gold rounded-full border border-pe-gold/20 hover:bg-pe-gold hover:text-pe-dark transition-all duration-300 font-medium text-sm group/btn"
                >
                  View on Map
                  <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
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
              className="flex items-center gap-4 p-6 bg-pe-surface group hover:border-pe-gold/30 transition-all duration-300 block"
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
              className="flex items-center gap-4 p-6 bg-pe-surface group hover:border-pe-gold/30 transition-all duration-300 block"
            >
              <div className="p-4 bg-pe-gold/10 rounded-full text-pe-gold group-hover:scale-110 transition-transform duration-300">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="text-pe-text-muted text-xs uppercase tracking-widest mb-1">Email Us</p>
                <p className="text-lg font-medium text-pe-text break-all">puneethnic01@gmail.com</p>
              </div>
            </motion.a>

            <div className="p-8 bg-pe-gold/5 rounded-3xl border border-pe-gold/10 mt-8">
              <p className="text-pe-gold text-sm font-serif italic text-center leading-relaxed">
                "Experience the art of bespoke tailoring. Visit us for a personalized consultation and let us craft your perfect wedding ensemble."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReachUs;
