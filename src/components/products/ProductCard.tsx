import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { CartContext } from '../../contexts/CartContext';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
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
          <div className="absolute top-2 right-2">
            <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
              {product.category}
            </span>
          </div>
        </div>
        
        <div className="p-4 flex-grow">
          <h3 className="text-lg font-medium mb-1">{product.name}</h3>
          <p className="text-primary-600 font-bold mb-3">${product.price.toFixed(2)}</p>
          
          <button
            onClick={handleAddToCart}
            className="w-full btn btn-primary flex items-center justify-center"
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Add to Cart
          </button>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;