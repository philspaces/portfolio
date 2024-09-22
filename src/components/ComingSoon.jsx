import { motion } from "framer-motion";
import React from "react";
import { SectionWrapper } from "../hoc";
import { textVariant } from "../utils/motion";
import { styles } from "../utils/styles.js";
import CountDownTimer from "./CountDownTimer/CountDownTimer.jsx";

const ComingSoon = () => {
  return (
    <div className="text-center md:text-left md:px-20 lg:px-40">
      <motion.div variants={textVariant()}>
        <h2 className={`${styles.sectionText}`}>
          Countdown to the Celebration
        </h2>
      </motion.div>
      <div className="py-28">
        <CountDownTimer />
      </div>
    </div>
  );
};

export default SectionWrapper(ComingSoon, "coming-soon");
