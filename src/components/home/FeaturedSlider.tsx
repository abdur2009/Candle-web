import React from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { ArrowRight } from 'lucide-react';

interface FeaturedProduct {
  _id: string;
  name: string;
  image: string;
  description: string;
}

interface FeaturedSliderProps {
  products: FeaturedProduct[];
}

const FeaturedSlider: React.FC<FeaturedSliderProps> = ({ products }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
        },
      },
    ],
  };

  return (
    <div className="mb-12">
      <Slider {...settings}>
        {products.map((product) => (
          <div key={product._id} className="outline-none">
            <div className="relative h-[500px] bg-gradient-to-r from-neutral-900 to-neutral-800">
              <div className="absolute inset-0 opacity-60">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="container-custom mx-auto relative h-full flex items-center">
                <div className="max-w-lg text-white p-6 md:p-0">
                  <h2 className="text-4xl font-serif font-bold mb-4">{product.name}</h2>
                  <p className="mb-6 text-lg">{product.description}</p>
                  <Link
                    to={`/products/${product._id}`}
                    className="inline-flex items-center btn btn-primary"
                  >
                    Shop Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default FeaturedSlider;