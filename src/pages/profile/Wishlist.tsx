import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, Heart } from 'lucide-react';
import axios from 'axios';
import { CartContext } from '../../contexts/CartContext';
import { toast } from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  description?: string;
}

const Wishlist: React.FC = () => {
  const { addToCart } = useContext(CartContext);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/wishlist', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setWishlist(response.data);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        toast.error('Failed to fetch wishlist');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const handleAddToCart = (product: Product) => {
    if (product.stock > 0) {
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
      toast.success('Added to cart');
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/wishlist/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setWishlist(wishlist.filter(item => item._id !== productId));
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="flex justify-center mb-4">
          <Heart className="h-16 w-16 text-neutral-400" />
        </div>
        <h3 className="text-xl font-medium mb-2">Your Wishlist is Empty</h3>
        <p className="text-neutral-600 mb-6">
          Browse our products and add your favorites to your wishlist.
        </p>
        <Link to="/" className="btn btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-serif font-bold mb-6">My Wishlist</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {wishlist.map((product) => (
          <div key={product._id} className="card">
            <Link to={`/products/${product._id}`} className="block relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              {product.stock <= 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="bg-red-600 text-white text-sm px-3 py-1 rounded-full">
                    Out of Stock
                  </span>
                </div>
              )}
            </Link>
            
            <div className="p-4">
              <Link to={`/products/${product._id}`} className="block">
                <h3 className="text-lg font-medium mb-1">{product.name}</h3>
                <p className="text-primary-600 font-bold mb-3">
                  ${product.price.toFixed(2)}
                </p>
              </Link>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="btn btn-primary flex-grow flex items-center justify-center"
                  disabled={product.stock <= 0}
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
                
                <button
                  onClick={() => handleRemoveFromWishlist(product._id)}
                  className="btn btn-outline p-2"
                  title="Remove from wishlist"
                >
                  <Trash2 className="h-5 w-5 text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;