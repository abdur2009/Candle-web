import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
import { toast } from 'react-toastify';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    try {
      // In a real implementation, you would send data to your backend
      // const response = await axios.post('/api/contact', formData);
      
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success('Your message has been sent successfully!');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      toast.error('There was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-neutral-900 text-white py-24">
        <div className="absolute inset-0 opacity-40">
          <img
            src="https://images.pexels.com/photos/3270223/pexels-photo-3270223.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Contact Us"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container-custom mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Contact Us</h1>
          <p className="text-xl max-w-2xl mx-auto">
            We'd love to hear from you! Reach out with any questions or feedback.
          </p>
        </div>
      </div>

      {/* Contact Information and Form */}
      <div className="py-16">
        <div className="container-custom mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-serif font-bold mb-6">Get In Touch</h2>
              <p className="text-neutral-700 mb-8">
                Whether you have a question about our products, need help with an order, or want to collaborate, we're here to help!
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-primary-100 p-3 rounded-full mr-4">
                    <MapPin className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Our Location</h3>
                    <p className="text-neutral-700">123 Candle Street, Flameville, FL 12345</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary-100 p-3 rounded-full mr-4">
                    <Mail className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Email Us</h3>
                    <a href="mailto:info@candlehaven.com" className="text-primary-600 hover:underline">
                      info@candlehaven.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary-100 p-3 rounded-full mr-4">
                    <Phone className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Call Us</h3>
                    <a href="tel:+1234567890" className="text-primary-600 hover:underline">
                      (123) 456-7890
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary-100 p-3 rounded-full mr-4">
                    <MessageSquare className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Business Hours</h3>
                    <p className="text-neutral-700">Monday - Friday: 9AM - 5PM</p>
                    <p className="text-neutral-700">Saturday: 10AM - 3PM</p>
                    <p className="text-neutral-700">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-neutral-50 rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-serif font-bold mb-6">Send Us a Message</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="input"
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                        <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="py-8">
        <div className="container-custom mx-auto">
          <div className="bg-neutral-100 p-4 rounded-lg">
            {/* In a real implementation, you would include a Google Map or other map component here */}
            <div className="bg-neutral-300 h-96 rounded-lg flex items-center justify-center">
              <p className="text-neutral-700">Map would be displayed here</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-white">
        <div className="container-custom mx-auto">
          <h2 className="text-3xl font-serif font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <p className="text-center text-neutral-700 mb-12 max-w-3xl mx-auto">
            Find quick answers to common questions about our products and services.
          </p>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-neutral-50 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-medium mb-2">How long do your candles burn?</h3>
              <p className="text-neutral-700">
                Our candles have an average burn time of 45-50 hours for our 8oz candles and 70-80 hours for our 12oz candles. Burn times can vary based on how the candle is burned and environmental factors.
              </p>
            </div>
            
            <div className="bg-neutral-50 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-medium mb-2">Are your candles made with natural ingredients?</h3>
              <p className="text-neutral-700">
                Yes! We use 100% natural soy wax, cotton wicks, and premium fragrance oils that are free from harmful chemicals and phthalates.
              </p>
            </div>
            
            <div className="bg-neutral-50 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-medium mb-2">How do I care for my candle?</h3>
              <p className="text-neutral-700">
                For the first burn, allow the wax to melt across the entire surface (about 2-3 hours). Always trim the wick to 1/4 inch before lighting, and never burn for more than 4 hours at a time. Keep away from drafts and never leave unattended.
              </p>
            </div>
            
            <div className="bg-neutral-50 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-medium mb-2">Do you offer international shipping?</h3>
              <p className="text-neutral-700">
                Currently, we ship within the US only. We're working on expanding our shipping options and hope to offer international shipping in the future.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;