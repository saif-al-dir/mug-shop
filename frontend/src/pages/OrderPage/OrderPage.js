import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../../store/cartSlice';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './OrderPage.module.css';

const OrderPage = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (cartItems.length === 0) {
    return (
      <div className={styles.container}>
        <h2>Your cart is empty</h2>
        <Link to="/" className={styles.backLink}>
          &larr; Back to products
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Prepare order data
      const orderData = {
        customer: formData,
        items: cartItems.map(({ product, quantity, description }) => ({
          productId: product.id,
          quantity,
          description,
        })),
        totalPrice: cartItems.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        ),
        createdAt: new Date().toISOString(),
      };

      // Send order to backend
      await axios.post('/api/orders', orderData);

      dispatch(clearCart());
      navigate('/'); // Redirect to home or order confirmation page
    } catch (err) {
      setError('Failed to submit order. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Order Summary</h1>
      <div className={styles.summary}>
        {cartItems.map(({ product, quantity, description }) => (
          <div key={product.id} className={styles.summaryItem}>
            <div>
              <strong>{product.title}</strong> x {quantity}
            </div>
            <div>Description: {description || 'None'}</div>
            <div>Price: {(product.price * quantity).toFixed(2)} zł</div>
          </div>
        ))}
        <div className={styles.total}>
          Total: {cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2)} zł
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Contact Details</h2>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={submitting}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={submitting}
          />
        </label>
        <label>
          Phone:
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            disabled={submitting}
          />
        </label>
        <label>
          Address:
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            disabled={submitting}
          />
        </label>
        {error && <div className={styles.error}>{error}</div>}
        <button type="submit" disabled={submitting} className={styles.submitButton}>
          {submitting ? 'Submitting...' : 'Order'}
        </button>
      </form>
    </div>
  );
};

export default OrderPage;