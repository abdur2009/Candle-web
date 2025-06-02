import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart } from 'lucide-react';
import { CartContext } from '../../contexts/CartContext';
import axios from 'axios';
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

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock > 0) {
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
    }
  };

  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setAddingToWishlist(true);
      const token = localStorage.getItem('token');
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

  return (
    <div className="card group h-full flex flex-col">
      <Link to={`/products/${product._id}`} className="block h-full">
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
              {product.category}
            </span>
            {product.stock <= 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                Out of Stock
              </span>
            )}
          </div>
        </div>
        
        <div className="p-4 flex-grow">
          <h3 className="text-lg font-medium mb-1">{product.name}</h3>
          <p className="text-primary-600 font-bold mb-3">Rs. {product.price.toLocaleString()}</p>
          
          <div className="flex gap-2">
            {product.stock > 0 ? (
              <button
                onClick={handleAddToCart}
                className="flex-grow btn btn-primary flex items-center justify-center"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Add to Cart
              </button>
            ) : (
              <button
                onClick={handleAddToWishlist}
                disabled={addingToWishlist || isInWishlist}
                className="flex-grow btn btn-secondary flex items-center justify-center"
              >
                <Heart className={`h-4 w-4 mr-2 ${isInWishlist ? 'fill-current' : ''}`} />
                {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
              </button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;