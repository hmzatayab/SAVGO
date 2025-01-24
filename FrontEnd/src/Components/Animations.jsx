import React from "react";
import { motion } from "framer-motion";

const AnimationWrapper = ({ children, initial, animate, exit, transition }) => {
  return (
    <motion.div
      initial={
        initial || {
          opacity: 0,
          scale: 0.8,
          rotate: -10,
          y: 50,
        } // Advanced initial state
      }
      animate={
        animate || {
          opacity: 1,
          scale: 1,
          rotate: 0,
          y: 0,
        } // Advanced animation state
      }
      exit={
        exit || {
          opacity: 0,
          scale: 0.8,
          rotate: 10,
          y: -50,
        } // Advanced exit state
      }
      transition={
        transition || {
          duration: 0.6, // Slightly longer duration for smoothness
          ease: [0.6, -0.05, 0.01, 0.99], // Advanced easing function
        }
      }
    >
      {children}
    </motion.div>
  );
};

export default AnimationWrapper;
