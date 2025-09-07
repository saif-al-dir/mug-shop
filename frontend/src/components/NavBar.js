import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './NavBar.module.css';

const NavBar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <NavLink to="/" className={styles.logoLink}>
          MyStore
        </NavLink>
      </div>
      <ul className={styles.navLinks}>
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? styles.active : ''}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/cart" className={({ isActive }) => isActive ? styles.active : ''}>
            Cart
          </NavLink>
        </li>
        <li>
          <NavLink to="/order" className={({ isActive }) => isActive ? styles.active : ''}>
            Order
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/products" className={({ isActive }) => isActive ? styles.active : ''}>
            Admin
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;