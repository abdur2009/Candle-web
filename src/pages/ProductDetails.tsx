import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Star, ChevronRight, Minus, Plus, Heart } from 'lucide-react';
import axios from 'axios';
import { CartContext } from '../contexts/CartContext';
import { toast } from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  images?: string[];
  category: string;
  description?: string;
  stock: number;
  rating?: number;
  reviewCount?: number;
  details?: string[];
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);

  // Fetch product and check wishlist status
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productRes, wishlistRes] = await Promise.all([
          axios.get<Product>(`http://localhost:5000/api/products/${id}`),
          axios.get('http://localhost:5000/api/wishlist', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
        ]);
        
        setProduct(productRes.data);
        // Check if product is in wishlist
        const wishlistItems = wishlistRes.data;
        setIsInWishlist(wishlistItems.some((item: any) => item._id === id));
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response?.status !== 401) { // Ignore unauthorized errors for wishlist
          setProduct(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 0)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (product && product.stock > 0) {
      if (quantity > product.stock) {
        toast.error(`Only ${product.stock} items available`);
        return;
      }
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image || (product.images?.[0] ?? ''),
        quantity,
      });
    }
  };

  const handleAddToWishlist = async () => {
    if (!product) return;
    
    try {
      setAddingToWishlist(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to add items to wishlist');
        return;
      }
      
      await axios.post('http://localhost:5000/api/wishlist', 
        { productId: product._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsInWishlist(true);
      toast.success('Added to wishlist');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist');
    } finally {
      setAddingToWishlist(false);
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
            <div className="text-2xl font-bold text-neutral-900 mb-6">Rs. {product.price.toLocaleString()}</div>
            <p className="text-neutral-700 mb-6">{product.description}</p>

            {/* Stock Status */}
            <div className="mb-4">
              <p className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
              </p>
            </div>

            {/* Quantity + Add to Cart/Wishlist */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <label htmlFor="quantity" className="block text-sm font-medium text-neutral-700 mb-1">Quantity</label>
                    <div className="flex items-center border border-neutral-300 rounded-md">
                      <button 
                        type="button" 
                        onClick={() => handleQuantityChange(quantity - 1)} 
                        disabled={quantity <= 1} 
                        className="px-3 py-2 text-neutral-600 hover:text-primary-500 disabled:opacity-50"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={product.stock}
                        value={quantity}
                        onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                        className="w-12 text-center border-none focus:ring-0"
                      />
                      <button 
                        type="button" 
                        onClick={() => handleQuantityChange(quantity + 1)} 
                        disabled={quantity >= product.stock}
                        className="px-3 py-2 text-neutral-600 hover:text-primary-500 disabled:opacity-50"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <button
                      onClick={handleAddToCart}
                      className="btn btn-primary w-full flex items-center justify-center"
                    >
                      <ShoppingBag className="h-5 w-5 mr-2" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleAddToWishlist}
                  disabled={addingToWishlist || isInWishlist}
                  className="btn btn-secondary w-full flex items-center justify-center"
                >
                  <Heart className={`h-5 w-5 mr-2 ${isInWishlist ? 'fill-current' : ''}`} />
                  {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                </button>
              )}
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
