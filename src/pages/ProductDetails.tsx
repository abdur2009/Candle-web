import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Star, ChevronRight, Minus, Plus } from 'lucide-react';
import axios from 'axios';
import { CartContext } from '../contexts/CartContext';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Fetch product from backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image || (product.images?.[0] ?? ''),
        quantity,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-custom mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="mb-6">Sorry, we couldn't find the product you're looking for.</p>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="bg-neutral-50 py-3">
        <div className="container-custom mx-auto">
          <div className="flex items-center text-sm text-neutral-600">
            <Link to="/" className="hover:text-primary-500 transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link to="/" className="hover:text-primary-500 transition-colors">Shop</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-neutral-800 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container-custom mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="mb-4 rounded-lg overflow-hidden bg-neutral-100">
              <img src={product.images?.[selectedImage] || product.image} alt={product.name} className="w-full h-auto object-cover" />
            </div>
            {product.images?.length > 1 && (
              <div className="grid grid-cols-3 gap-2">
                {product.images.map((image: string, index: number) => (
                  <div
                    key={index}
                    className={`cursor-pointer rounded-md overflow-hidden border-2 ${selectedImage === index ? 'border-primary-500' : 'border-transparent'}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={image} alt={`${product.name} view ${index + 1}`} className="w-full h-24 object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-2">
              <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                {product.category}
              </span>
            </div>
            <h1 className="text-3xl font-serif font-bold mb-2">{product.name}</h1>
            <div className="flex items-center mb-4">
              <div className="flex text-primary-500">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`h-5 w-5 ${index < Math.floor(product.rating || 0) ? 'fill-current' : 'stroke-current fill-transparent'}`}
                  />
                ))}
              </div>
              {product.rating && (
                <span className="ml-2 text-neutral-600">
                  {product.rating} ({product.reviewCount || 0} reviews)
                </span>
              )}
            </div>
            <div className="text-2xl font-bold text-neutral-900 mb-6">${product.price.toFixed(2)}</div>
            <p className="text-neutral-700 mb-6">{product.description}</p>

            {/* Quantity + Add to Cart */}
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <label htmlFor="quantity" className="block text-sm font-medium text-neutral-700 mb-1">Quantity</label>
                  <div className="flex items-center border border-neutral-300 rounded-md">
                    <button type="button" onClick={() => handleQuantityChange(quantity - 1)} disabled={quantity <= 1} className="px-3 py-2 text-neutral-600 hover:text-primary-500">
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      className="w-12 text-center border-none focus:ring-0"
                    />
                    <button type="button" onClick={() => handleQuantityChange(quantity + 1)} className="px-3 py-2 text-neutral-600 hover:text-primary-500">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="flex-grow">
                  <button
                    onClick={handleAddToCart}
                    className="btn btn-primary w-full flex items-center justify-center"
                    disabled={product.stock <= 0}
                  >
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
              <p className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </p>
            </div>

            {/* Details */}
            {product.details?.length > 0 && (
              <div className="border-t border-neutral-200 pt-6">
                <h3 className="text-lg font-medium mb-3">Product Details</h3>
                <ul className="space-y-2 text-neutral-700">
                  {product.details.map((detail: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-primary-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
