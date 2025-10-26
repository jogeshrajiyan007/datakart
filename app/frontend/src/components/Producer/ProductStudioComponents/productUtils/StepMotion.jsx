import React from 'react';
import { motion } from "framer-motion";

const StepMotion = ({ children }) => (
  <motion.div
    key={children?.key ?? "step"}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.35 }}
  >
    {children}
  </motion.div>
);

export default StepMotion;