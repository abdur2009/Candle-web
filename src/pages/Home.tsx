import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FeaturedSlider from '../components/home/FeaturedSlider';
import ProductGrid from '../components/products/ProductGrid';
import { ShoppingBag, Gift, Clock, Truck } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  description?: string;
}

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Array<{ _id: string; name: string; image: string; description: string }>>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<Product[]>('http://localhost:5000/api/products');
        const allProducts = response.data;
        setProducts(allProducts);
        
        // Set featured products (first 3 products)
        setFeaturedProducts(allProducts.slice(0, 3).map(p => ({
          _id: p._id,
          name: p.name,
          image: p.image,
          description: p.description || `Experience the wonderful scent of ${p.name}`
        })));
        
        // Extract unique categories
        const uniqueCategories = ['All', ...new Set(allProducts.map(p => p.category))] as string[];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products by category
  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Banner with Slider */}
      <FeaturedSlider products={featuredProducts} />
      
      {/* Features Section */}
      <div className="bg-neutral-100 py-12 w-full">
        <div className="container-custom">
          <div className="px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Feature cards content */}
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="bg-primary-100 p-3 rounded-full mb-4">
                  <ShoppingBag className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="font-medium text-lg mb-2">Handcrafted Quality</h3>
                <p className="text-neutral-600">Each candle is made by hand with premium ingredients and attention to detail.</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="bg-primary-100 p-3 rounded-full mb-4">
                  <Gift className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="font-medium text-lg mb-2">Perfect Gifts</h3>
                <p className="text-neutral-600">Our beautifully packaged candles make the perfect gift for any occasion.</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="bg-primary-100 p-3 rounded-full mb-4">
                  <Clock className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="font-medium text-lg mb-2">Long Burning</h3>
                <p className="text-neutral-600">Enjoy up to 50 hours of burn time with our long-lasting candles.</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="bg-primary-100 p-3 rounded-full mb-4">
                  <Truck className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="font-medium text-lg mb-2">Fast Shipping</h3>
                <p className="text-neutral-600">Quick and secure shipping to get your candles to you safely.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Section */}
      <div className="py-12 bg-white w-full">
        <div className="container-custom">
          <div className="px-4">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-serif font-bold mb-4">Our Collection</h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                Discover our selection of handcrafted candles, made with premium ingredients and designed to transform your space.
              </p>
            </div>
            
            {/* Category Filter */}
            <div className="mb-8 flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full transition-all ${
                    selectedCategory === category
                      ? 'bg-primary-500 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            
            {/* Product Grid */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
              </div>
            ) : (
              <ProductGrid products={filteredProducts} />
            )}
          </div>
        </div>
      </div>
      
      {/* Testimonial Section */}
      <div className="py-12 bg-neutral-50 w-full">
        <div className="container-custom">
          <div className="px-4">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-serif font-bold mb-4">What Our Customers Say</h2>
              <div className="w-24 h-1 bg-primary-500 mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center text-primary-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="text-neutral-700 mb-4">
                  "These candles are amazing! The scents are so authentic and fill the entire room. I've become a loyal customer."
                </p>
                <p className="font-medium">- Sarah T.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center text-primary-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="text-neutral-700 mb-4">
                  "I bought these as gifts for my friends and they all loved them! The packaging is beautiful and the candles smell divine."
                </p>
                <p className="font-medium">- Michael R.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center text-primary-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="text-neutral-700 mb-4">
                  "The burn time on these candles is impressive. I've had mine for weeks and it's still going strong. Worth every penny!"
                </p>
                <p className="font-medium">- Emily L.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Newsletter Section */}
      <div className="py-12 bg-primary-500 text-white w-full">
        <div className="container-custom">
          <div className="px-4 text-center">
            <h2 className="text-3xl font-serif font-bold mb-4">Join Our Newsletter</h2>
            <p className="mb-6 max-w-2xl mx-auto">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            
            <form className="max-w-md mx-auto flex">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-2 rounded-l-md focus:outline-none text-neutral-800"
              />
              <button
                type="submit"
                className="bg-secondary-500 hover:bg-secondary-600 px-4 py-2 rounded-r-md transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;