import React, { useState } from 'react';
import { CreditCard, Wallet } from 'lucide-react';

interface PaymentMethodsProps {
  onSelectPaymentMethod: (method: string) => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ onSelectPaymentMethod }) => {
  const [selectedMethod, setSelectedMethod] = useState('creditCard');
  
  const handleMethodChange = (method: string) => {
    setSelectedMethod(method);
    onSelectPaymentMethod(method);
  };
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-4">Payment Method</h3>
      
      <div className="space-y-3">
        {/* Credit Card */}
        <div 
          className={`border rounded-lg p-4 cursor-pointer transition-all ${
            selectedMethod === 'creditCard'
              ? 'border-primary-500 bg-primary-50'
              : 'border-neutral-200 hover:border-primary-300'
          }`}
          onClick={() => handleMethodChange('creditCard')}
        >
          <div className="flex items-center">
            <div className="mr-3">
              <input
                type="radio"
                id="creditCard"
                checked={selectedMethod === 'creditCard'}
                onChange={() => handleMethodChange('creditCard')}
                className="h-4 w-4 text-primary-500 focus:ring-primary-500"
              />
            </div>
            <label htmlFor="creditCard" className="flex items-center cursor-pointer">
              <CreditCard className="h-5 w-5 mr-2 text-neutral-700" />
              <span>Credit/Debit Card</span>
            </label>
          </div>
          
          {selectedMethod === 'creditCard' && (
            <div className="mt-4 space-y-4 animate-fade-in">
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-neutral-700 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  className="input"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiry" className="block text-sm font-medium text-neutral-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    id="expiry"
                    placeholder="MM/YY"
                    className="input"
                  />
                </div>
                
                <div>
                  <label htmlFor="cvv" className="block text-sm font-medium text-neutral-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    placeholder="123"
                    className="input"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="nameOnCard" className="block text-sm font-medium text-neutral-700 mb-1">
                  Name on Card
                </label>
                <input
                  type="text"
                  id="nameOnCard"
                  placeholder="John Doe"
                  className="input"
                />
              </div>
            </div>
          )}
        </div>
        
        {/* JazzCash */}
        <div 
          className={`border rounded-lg p-4 cursor-pointer transition-all ${
            selectedMethod === 'jazzCash'
              ? 'border-primary-500 bg-primary-50'
              : 'border-neutral-200 hover:border-primary-300'
          }`}
          onClick={() => handleMethodChange('jazzCash')}
        >
          <div className="flex items-center">
            <div className="mr-3">
              <input
                type="radio"
                id="jazzCash"
                checked={selectedMethod === 'jazzCash'}
                onChange={() => handleMethodChange('jazzCash')}
                className="h-4 w-4 text-primary-500 focus:ring-primary-500"
              />
            </div>
            <label htmlFor="jazzCash" className="flex items-center cursor-pointer">
              <Wallet className="h-5 w-5 mr-2 text-neutral-700" />
              <span>JazzCash</span>
            </label>
          </div>
          
          {selectedMethod === 'jazzCash' && (
            <div className="mt-4 animate-fade-in">
              <div>
                <label htmlFor="jazzCashNumber" className="block text-sm font-medium text-neutral-700 mb-1">
                  JazzCash Mobile Number
                </label>
                <input
                  type="text"
                  id="jazzCashNumber"
                  placeholder="03XX XXXXXXX"
                  className="input"
                />
              </div>
            </div>
          )}
        </div>
        
        {/* EasyPaisa */}
        <div 
          className={`border rounded-lg p-4 cursor-pointer transition-all ${
            selectedMethod === 'easyPaisa'
              ? 'border-primary-500 bg-primary-50'
              : 'border-neutral-200 hover:border-primary-300'
          }`}
          onClick={() => handleMethodChange('easyPaisa')}
        >
          <div className="flex items-center">
            <div className="mr-3">
              <input
                type="radio"
                id="easyPaisa"
                checked={selectedMethod === 'easyPaisa'}
                onChange={() => handleMethodChange('easyPaisa')}
                className="h-4 w-4 text-primary-500 focus:ring-primary-500"
              />
            </div>
            <label htmlFor="easyPaisa" className="flex items-center cursor-pointer">
              <Wallet className="h-5 w-5 mr-2 text-neutral-700" />
              <span>EasyPaisa</span>
            </label>
          </div>
          
          {selectedMethod === 'easyPaisa' && (
            <div className="mt-4 animate-fade-in">
              <div>
                <label htmlFor="easyPaisaNumber" className="block text-sm font-medium text-neutral-700 mb-1">
                  EasyPaisa Mobile Number
                </label>
                <input
                  type="text"
                  id="easyPaisaNumber"
                  placeholder="03XX XXXXXXX"
                  className="input"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;