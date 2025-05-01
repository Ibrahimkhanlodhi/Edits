"use client";
import { motion } from 'framer-motion';
import {
  Image as ImageIcon,
  Video,
  Wand2,
  Layers,
  Share2,
  Cloud
} from 'lucide-react';
import Link from 'next/link';

// Animation variants - simplified for minimalism
const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  }
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const hoverScale = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.02,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 15 
    }
  }
};

export default function Home() {
  return (
    <div className="page">
      <main className="main">
        <section className="hero-section">
          <motion.div 
            className="hero-content"
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
          >
            <motion.h1 variants={fadeIn} className="title">
              Edit media with <span className="accent">precision</span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="subtitle">
              Professional image and video editing simplified. Create stunning content with intuitive tools.
            </motion.p>
            
            <motion.div 
              className="ctas"
              variants={fadeIn}
            >
              <motion.div whileHover="hover" initial="rest" animate="rest" variants={hoverScale}>
                <Link href="/EditImage" className="primary">
                  Image Editor
                </Link>
              </motion.div>
              
              <motion.div whileHover="hover" initial="rest" animate="rest" variants={hoverScale}>
                <Link href="/EditVideo" className="secondary">
                  Video Editor
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        <section className="features-section">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            Features
          </motion.h2>
          
          <motion.div 
            className="features-grid"
            initial="hidden"
            whileInView="visible"
            variants={staggerChildren}
            viewport={{ once: true, margin: "-50px" }}
          >
            {[
              { icon: <ImageIcon />, title: "Image Editing", description: " Tools for perfect photos" },
              { icon: <Video />, title: "Video Editing", description: "Professional results with minimal effort" },
             
              
              
              { icon: <Cloud />, title: "Cloud Storage", description: "Access projects anywhere" }
            ].map((feature, index) => (
              <motion.div 
                className="feature-card"
                key={index}
                variants={fadeIn}
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 10px 30px -8px rgba(0, 0, 0, 0.1)"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <motion.div className="icon-wrapper">
                  {feature.icon}
                </motion.div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="cta-section">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={staggerChildren}
            viewport={{ once: true, margin: "-50px" }}
            className="cta-content"
          >
            <motion.h2 variants={fadeIn}>Start Creating</motion.h2>
            <motion.p variants={fadeIn}>
              Join creators who trust our platform for their editing needs.
            </motion.p>
            <motion.div 
              className="ctas"
              variants={fadeIn}
            >
              <motion.button 
                className="primary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                Free Trial
              </motion.button>
              
              <motion.button 
                className="secondary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                View Pricing
              </motion.button>
            </motion.div>
          </motion.div>
        </section>
      </main>
      
      <footer className="footer">
        <Link href="/terms">Terms</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/contact">Contact</Link>
      </footer>
    </div>
  );
}