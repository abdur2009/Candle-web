import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FeaturedSlider from '../components/home/FeaturedSlider';
import ProductGrid from '../components/products/ProductGrid';
import { ShoppingBag, Gift, Clock, Truck } from 'lucide-react';

// Mock data for featured products (will be replaced with API data)
const MOCK_FEATURED_PRODUCTS = [
  {
    _id: '1',
    name: 'Lavender Dreams',
    image: 'https://images.pexels.com/photos/4498184/pexels-photo-4498184.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    description: 'Experience the calming scent of lavender with our premium hand-poured candle. Perfect for relaxation and stress relief.',
  },
  {
    _id: '2',
    name: 'Vanilla Bliss',
    image: 'https://images.pexels.com/photos/3270223/pexels-photo-3270223.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    description: 'A sweet and warm vanilla fragrance that creates a cozy atmosphere in any room.',
  },
  {
    _id: '3',
    name: 'Ocean Breeze',
    image: 'https://images.pexels.com/photos/7783699/pexels-photo-7783699.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    description: 'Bring the fresh scent of the ocean into your home with this invigorating candle.',
  },
];

// Mock data for products (will be replaced with API data)
const MOCK_PRODUCTS = [
  {
    _id: '1',
    name: 'Lavender Dreams',
    price: 24.99,
    image: 'https://images.pexels.com/photos/4498184/pexels-photo-4498184.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Relaxation',
  },
  {
    _id: '2',
    name: 'Vanilla Bliss',
    price: 19.99,
    image: 'https://images.pexels.com/photos/3270223/pexels-photo-3270223.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Cozy',
  },
  {
    _id: '3',
    name: 'Ocean Breeze',
    price: 22.99,
    image: 'https://images.pexels.com/photos/7783699/pexels-photo-7783699.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Fresh',
  },
  {
    _id: '4',
    name: 'Cinnamon Spice',
    price: 21.99,
    image: 'https://images.pexels.com/photos/11793440/pexels-photo-11793440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Seasonal',
  },
  {
    _id: '5',
    name: 'Rose Garden',
    price: 26.99,
    image: 'https://images.pexels.com/photos/9987224/pexels-photo-9987224.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Floral',
  },
  {
    _id: '6',
    name: 'Eucalyptus Mint',
    price: 23.99,
    image: 'https://images.pexels.com/photos/6869653/pexels-photo-6869653.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Refreshing',
  },
  {
    _id: '7',
    name: 'Amber & Sandalwood',
    price: 28.99,
    image: 'https://images.pexels.com/photos/4207799/pexels-photo-4207799.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Woody',
  },
  {
    _id: '8',
    name: 'Citrus Sunshine',
    price: 20.99,
    image: 'https://images.pexels.com/photos/6443303/pexels-photo-6443303.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Energizing',
  },
];

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState(MOCK_FEATURED_PRODUCTS);
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [categories, setCategories] = useState(['All', 'Relaxation', 'Cozy', 'Fresh', 'Seasonal', 'Floral', 'Refreshing', 'Woody', 'Energizing']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products from API (commented out for now, using mock data)
  useEffect(() => {
    // In a real implementation, this would fetch from the backend
    /* 
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
        
        // Extract unique categories
        const uniqueCategories = ['All', ...new Set(response.data.map(p => p.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
    */
    
    // Simulate API call with timeout
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  // Filter products by category
  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => product.category === selectedCategory);

  return (
    <div>
      {/* Hero Banner with Slider */}
      <FeaturedSlider products={featuredProducts} />
      
      {/* Features Section */}
      <div className="bg-neutral-100 py-12">
        <div className="container-custom mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      
      {/* Product Section */}
      <div className="py-12 bg-white">
        <div className="container-custom mx-auto">
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
      
      {/* Testimonial Section */}
      <div className="py-12 bg-neutral-50">
        <div className="container-custom mx-auto">
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
      
      {/* Newsletter Section */}
      <div className="py-12 bg-primary-500 text-white">
        <div className="container-custom mx-auto text-center">
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
  );
};

export default Home;