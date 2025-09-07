import React from 'react';
import styles from '../components/Hero.module.css';

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1>Welcome to MugStore</h1>
        <p>Your favorite place for unique mugs and gifts.</p>
      </div>
    </section>
  );
};

export default Hero;