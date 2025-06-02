import React from 'react';

interface ShippingFormProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const ShippingForm: React.FC<ShippingFormProps> = ({ formData, onChange }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-4">Shipping Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={onChange}
            className="input"
            required
          />
        </div>
        
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-1">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={onChange}
            className="input"
            required
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            className="input"
            required
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={onChange}
            className="input"
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="address" className="block text-sm font-medium text-neutral-700 mb-1">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={onChange}
            className="input"
            required
          />
        </div>
        
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-1">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={onChange}
            className="input"
            required
          />
        </div>
        
        <div>
          <label htmlFor="postalCode" className="block text-sm font-medium text-neutral-700 mb-1">
            Postal Code
          </label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={onChange}
            className="input"
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="country" className="block text-sm font-medium text-neutral-700 mb-1">
            Country
          </label>
          <input
            type="text"
            id="country"
            name="country"
            value="Pakistan"
            className="input bg-neutral-50"
            disabled
          />
        </div>
      </div>
    </div>
  );
};

export default ShippingForm;