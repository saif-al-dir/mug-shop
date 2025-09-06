import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './AdminProductForm.module.css';

const API_URL = process.env.REACT_APP_API_URL || '';

const emptyProduct = {
  title: '',
  image: '',
  additionalImages: '',
  price: '',
  description: '',
};

const AdminProductForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [product, setProduct] = useState(emptyProduct);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const res = await axios.get(`${API_URL}/api/products/${id}`);
          // Convert additionalImages array to comma-separated string for input
          setProduct({
            ...res.data,
            additionalImages: res.data.additionalImages?.join(', ') || '',
            price: res.data.price.toString(),
          });
          setLoading(false);
        } catch (err) {
          setError('Failed to load product');
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (!product.title || !product.image || !product.price) {
      setError('Title, Image, and Price are required');
      return;
    }

    // Prepare data for API
    const payload = {
      ...product,
      price: parseFloat(product.price),
      additionalImages: product.additionalImages
        ? product.additionalImages.split(',').map((img) => img.trim())
        : [],
    };

    try {
      if (isEdit) {
        await axios.put(`${API_URL}/api/products/${id}`, payload);
      } else {
        await axios.post(`${API_URL}/api/products`, payload);
      }
      navigate('/admin/products');
    } catch (err) {
      setError('Failed to save product');
    }
  };

  if (loading) return <div className={styles.container}>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1>{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          Title*:
          <input
            type="text"
            name="title"
            value={product.title}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Main Image URL*:
          <input
            type="text"
            name="image"
            value={product.image}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Additional Images URLs (comma separated):
          <input
            type="text"
            name="additionalImages"
            value={product.additionalImages}
            onChange={handleChange}
            placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
          />
        </label>
        <label>
          Price*:
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            rows="4"
          />
        </label>
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.buttons}>
          <button type="submit" className={styles.saveButton}>
            Save
          </button>
          <Link to="/admin/products" className={styles.cancelButton}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;