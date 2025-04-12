"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Image as ImageIcon,
  Video,
  Wand2,
  Layers,
  Share2,
  Cloud
} from 'lucide-react';
import './styles/home.scss';
import Link from 'next/link';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const hoverScale = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 10 
    }
  }
};

export default function Home() {
  const [isVideoHovered, setIsVideoHovered] = useState(false);
  
  return (
    <main>
      <section className="hero-section">
        <motion.div 
          className="hero-background"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        />
        
        <motion.div 
          className="hero-content"
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
        >
          <motion.h1 variants={fadeIn}>
            Transform Your Media with 
            <span className="gradient-text"> AI-Powered Editing</span>
          </motion.h1>
          
          <motion.p variants={fadeIn}>
            Professional image and video editing made simple. Create stunning content
            in minutes with our intuitive tools and AI assistance.
          </motion.p>
          
          <motion.div 
            className="cta-buttons"
            variants={fadeIn}
          >
            <motion.div whileHover="hover" initial="rest" animate="rest" variants={hoverScale}>
              <Link href="/EditImage" className="button primary">
                Image Editor
              </Link>
            </motion.div>
            
            <motion.div whileHover="hover" initial="rest" animate="rest" variants={hoverScale}>
                <Link href="/EditVideo" className="button primary">
                Video Editor
              </Link>
              
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <section className="features-section">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          Powerful Features
        </motion.h2>
        
        <motion.div 
          className="features-grid"
          initial="hidden"
          whileInView="visible"
          variants={staggerChildren}
          viewport={{ once: true, margin: "-100px" }}
        >
          {[
            { icon: <ImageIcon />, title: "Smart Image Editing", description: "Advanced AI-powered tools for perfect photos. Auto-enhance, remove backgrounds, and apply professional effects with one click." },
            { icon: <Video />, title: "Video Magic", description: "Edit videos like a pro. Automatic color correction, transitions, and effects make your videos stand out." },
            { icon: <Wand2 />, title: "AI Enhancement", description: "Let AI do the heavy lifting. Enhance quality, remove noise, and optimize your content automatically." },
            { icon: <Layers />, title: "Layer Control", description: "Professional layer management for complex editing. Perfect for creating sophisticated compositions." },
            { icon: <Share2 />, title: "Easy Sharing", description: "Share your creations instantly. Export in any format and share directly to social media." },
            { icon: <Cloud />, title: "Cloud Storage", description: "Access your projects anywhere. Automatic cloud backup keeps your work safe and accessible." }
          ].map((feature, index) => (
            <motion.div 
              className="feature-card"
              key={index}
              variants={fadeIn}
              whileHover={{ 
                y: -10,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
              }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <motion.div 
                className="icon-wrapper"
                whileHover={{ 
                  rotate: 5,
                  scale: 1.1,
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
              >
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
          viewport={{ once: true, margin: "-100px" }}
          className="cta-content"
        >
          <motion.h2 variants={fadeIn}>Start Creating Today</motion.h2>
          <motion.p variants={fadeIn}>
            Join thousands of creators who trust our platform for their image and
            video editing needs. Try it free for 14 days.
          </motion.p>
          <motion.div 
            className="cta-buttons"
            variants={fadeIn}
          >
            <motion.button 
              className="button primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              Start Free Trial
            </motion.button>
            
            <motion.button 
              className="button secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              View Pricing
            </motion.button>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="floating-objects"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          viewport={{ once: true }}
        >
          {[1, 2, 3, 4, 5].map((_, i) => (
            <motion.div 
              key={i}
              className={`floating-object object-${i+1}`}
              animate={{ 
                y: [0, Math.random() * 20 - 10],
                rotate: [0, Math.random() * 10 - 5]
              }}
              transition={{ 
                repeat: Infinity,
                repeatType: "reverse",
                duration: 3 + Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      </section>
    </main>
  );
}