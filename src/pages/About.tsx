import React from 'react';

const About: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-neutral-900 text-white py-24">
        <div className="absolute inset-0 opacity-40">
          <img
            src="https://images.pexels.com/photos/7783581/pexels-photo-7783581.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Candle making"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container-custom mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Our Story</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Handcrafting premium candles with love and passion since 2018
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-16">
        <div className="container-custom mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="text-3xl font-serif font-bold mb-6">How It All Began</h2>
              <p className="mb-4 text-neutral-700">
                Candle Haven started as a small home business in 2018. What began as a hobby and passion for creating beautiful, aromatic candles quickly grew into something more as friends and family started requesting our handcrafted creations.
              </p>
              <p className="mb-4 text-neutral-700">
                Our founder, Sarah, began experimenting with different waxes, fragrances, and techniques in her kitchen. After countless hours of research and testing, she perfected her recipes and started selling at local markets and craft fairs.
              </p>
              <p className="text-neutral-700">
                Today, we're still a home-based business that prides itself on quality, attention to detail, and exceptional customer service. Every candle is still handcrafted with the same love and care as when we first began.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img
                src="https://images.pexels.com/photos/4207788/pexels-photo-4207788.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Candle making process"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Our Values Section */}
      <div className="py-16 bg-neutral-50">
        <div className="container-custom mx-auto text-center">
          <h2 className="text-3xl font-serif font-bold mb-6">Our Values</h2>
          <p className="max-w-3xl mx-auto mb-12 text-neutral-700">
            At Candle Haven, we're committed to creating products that not only smell amazing but are also made with integrity and respect for the environment.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3">Quality Ingredients</h3>
              <p className="text-neutral-700">
                We use only the finest quality soy wax, cotton wicks, and premium fragrance oils to create candles that burn cleanly and evenly.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3">Eco-Friendly</h3>
              <p className="text-neutral-700">
                Our commitment to sustainability means we use recyclable packaging and environmentally friendly materials whenever possible.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3">Handcrafted with Love</h3>
              <p className="text-neutral-700">
                Every candle is hand-poured in small batches to ensure quality and attention to detail in each product we create.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Process Section */}
      <div className="py-16">
        <div className="container-custom mx-auto">
          <h2 className="text-3xl font-serif font-bold mb-6 text-center">Our Process</h2>
          <p className="max-w-3xl mx-auto mb-12 text-center text-neutral-700">
            Each candle goes through a careful creation process to ensure the highest quality product reaches your home.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="space-y-8">
                <div className="flex">
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-primary-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold">1</div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-medium mb-2">Ingredient Selection</h3>
                    <p className="text-neutral-700">
                      We carefully select premium soy wax, cotton wicks, and high-quality fragrance oils that are free from harmful chemicals.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-primary-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold">2</div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-medium mb-2">Fragrance Development</h3>
                    <p className="text-neutral-700">
                      Our unique scent blends are carefully crafted and tested to create perfectly balanced fragrances that fill your space.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-primary-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold">3</div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-medium mb-2">Hand Pouring</h3>
                    <p className="text-neutral-700">
                      Each candle is hand-poured in small batches to ensure quality control and attention to detail.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-primary-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold">4</div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-medium mb-2">Curing & Quality Check</h3>
                    <p className="text-neutral-700">
                      Our candles cure for at least 48 hours before being thoroughly inspected and beautifully packaged for shipping.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <img
                src="https://images.pexels.com/photos/6685273/pexels-photo-6685273.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Candle making process"
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-neutral-50">
        <div className="container-custom mx-auto text-center">
          <h2 className="text-3xl font-serif font-bold mb-6">Meet Our Team</h2>
          <p className="max-w-3xl mx-auto mb-12 text-neutral-700">
            Behind every beautiful candle is our dedicated team of artisans who pour their heart and soul into each creation.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <img
                src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Sarah - Founder"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-medium mb-1">Sarah Johnson</h3>
                <p className="text-primary-600 mb-3">Founder & Lead Artisan</p>
                <p className="text-neutral-700">
                  Sarah started Candle Haven in her kitchen and continues to oversee product development and quality control.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <img
                src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Michael - Production Manager"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-medium mb-1">Michael Thompson</h3>
                <p className="text-primary-600 mb-3">Production Manager</p>
                <p className="text-neutral-700">
                  Michael ensures that our production process runs smoothly and that every candle meets our high standards.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <img
                src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Emma - Fragrance Specialist"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-medium mb-1">Emma Rodriguez</h3>
                <p className="text-primary-600 mb-3">Fragrance Specialist</p>
                <p className="text-neutral-700">
                  Emma creates our unique scent blends and is constantly experimenting with new fragrance combinations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;