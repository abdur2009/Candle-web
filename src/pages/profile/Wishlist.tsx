import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { CartContext } from '../../contexts/CartContext';

// Mock data for wishlist (will be replaced with API data)
const MOCK_WISHLIST = [
  {
    _id: '1',
    name: 'Lavender Dreams',
    price: 24.99,
    image: 'https://images.pexels.com/photos/4498184/pexels-photo-4498184.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    inStock: true
  },
  {
    _id: '5',
    name: 'Rose Garden',
    price: 26.99,
    image: 'https://images.pexels.com/photos/9987224/pexels-photo-9987224.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    inStock: true
  },
  {
    _id: '7',
    name: 'Amber & Sandalwood',
    price: 28.99,
    image: 'https://images.pexels.com/photos/4207799/pexels-photo-4207799.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    inStock: false
  }
];

const Wishlist: React.FC = () => {
  const [wishlist, setWishlist] = useState(MOCK_WISHLIST);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  
  // Fetch wishlist from API
  useEffect(() => {
    // In a real implementation, you would fetch from the backend
    /* 
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/wishlist');
        setWishlist(response.data);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
    */
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);
  
  const handleRemoveFromWishlist = (productId: string) => {
    // In a real implementation, you would also update the backend
    setWishlist(wishlist.filter(item => item._id !== productId));
  };
  
  const handleAddToCart = (product: any) => {
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
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
          Start adding your favorite candles to your wishlist.
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
              {!product.inStock && (
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
                  disabled={!product.inStock}
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Add to Cart
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