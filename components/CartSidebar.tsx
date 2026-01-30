import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trash2, CreditCard, ShoppingCart, X, Plus, Minus, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { OrderItem, AddOn } from '../types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const { cart, products, removeFromCart, updateCartQuantity, updateCartItemAddOns, clearCart, deliveryType } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null);
  const [showAddOnsModal, setShowAddOnsModal] = useState(false);
  const navigate = useNavigate();

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = deliveryType === 'delivery' ? 150 : 0; // Rs. 150 delivery charge
  const grandTotal = subtotal + deliveryCharge;

  // Get product details for images and descriptions
  const getProductDetails = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    onClose();
    navigate('/checkout');
  };

  const handleViewAddOns = (item: OrderItem) => {
    setSelectedItem(item);
    setShowAddOnsModal(true);
  };

  const handleRemoveAddOn = (addOnId: string) => {
    if (!selectedItem) return;
    const updatedAddOns = selectedItem.addOns?.filter(a => a.id !== addOnId) || [];
    updateCartItemAddOns(selectedItem.productId, updatedAddOns);
    
    // Update local state
    const updatedItem = { ...selectedItem, addOns: updatedAddOns.length > 0 ? updatedAddOns : undefined };
    setSelectedItem(updatedItem);
    
    // Close modal if no add-ons left
    if (updatedAddOns.length === 0) {
      setTimeout(() => {
        handleCloseAddOnsModal();
      }, 300);
    }
  };

  const handleCloseAddOnsModal = () => {
    setShowAddOnsModal(false);
    setSelectedItem(null);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - Transparent for click to close */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Cart Sidebar - 30% width from right */}
      <div className="fixed right-0 top-0 h-screen w-full md:w-[30%] bg-white dark:bg-zinc-900 shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="shrink-0 bg-gradient-to-r from-orange-50/50 to-zinc-50/50 dark:from-zinc-800/50 dark:to-zinc-900/50">
          <div className="flex items-center justify-between p-3 md:p-4 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-serif font-black">Your Cart</h2>
                <p className="text-xs text-zinc-500">{cart.length} {cart.length === 1 ? 'item' : 'items'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <>
                  <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    aria-label={isCollapsed ? "Expand cart" : "Collapse cart"}
                  >
                    {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={clearCart}
                    className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
                    aria-label="Clear all items"
                    title="Clear all items"
                  >
                    <Trash2 className="w-5 h-5 text-zinc-400 group-hover:text-red-500 transition-colors" />
                  </button>
                </>
              )}
              <button 
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {!isCollapsed && (
          <>
            {/* Cart Items - Scrollable */}
            <div className="flex-1 overflow-y-auto p-2 md:p-3 scrollbar-hide min-h-0 max-h-full">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 md:p-8">
                      <div className="w-20 h-20 md:w-24 md:h-24 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 md:mb-6">
                        <ShoppingCart className="w-10 h-10 md:w-12 md:h-12 text-zinc-400" />
                      </div>
                      <p className="text-zinc-500 mb-4 md:mb-6 text-base md:text-lg font-medium">Your cart is empty</p>
                      <button 
                        onClick={onClose}
                        className="px-6 md:px-8 py-2 md:py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-orange-600/20 active:scale-95 text-sm md:text-base"
                      >
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {cart.map(item => {
                        const product = getProductDetails(item.productId);
                        const productName = item.name.split(' (')[0];
                        const itemDescription = product?.description || 'Delicious food item';
                        
                        return (
                          <div key={item.productId} className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="flex gap-2 p-2">
                              {/* Product Image */}
                              <div className="w-14 h-14 rounded-lg overflow-hidden bg-zinc-200 dark:bg-zinc-700 shrink-0">
                                {product?.image ? (
                                  <img 
                                    src={product.image} 
                                    alt={productName}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <ShoppingCart className="w-6 h-6 text-zinc-400" />
                                  </div>
                                )}
                              </div>

                              {/* Product Details */}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm mb-0.5 break-words line-clamp-1">{productName}</h4>
                                <p className="text-[10px] text-zinc-500 mb-1 line-clamp-1">{itemDescription}</p>
                                
                                {/* Add-ons */}
                                {item.addOns && item.addOns.length > 0 && (
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <p className="text-[10px] text-orange-600 dark:text-orange-400 line-clamp-1 flex-1">
                                      + {item.addOns.length} {item.addOns.length === 1 ? 'add-on' : 'add-ons'}
                                    </p>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleViewAddOns(item);
                                      }}
                                      className="p-1 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded transition-colors shrink-0"
                                      aria-label="View add-ons"
                                      title="View add-ons"
                                    >
                                      <Eye className="w-3 h-3" />
                                    </button>
                                  </div>
                                )}

                                {/* Price and Quantity Controls */}
                                <div className="flex items-center justify-between mt-1.5">
                                  <div className="flex items-center gap-1 bg-white dark:bg-zinc-900 rounded-md px-1 py-0.5 border border-zinc-200 dark:border-zinc-700">
                                    <button
                                      onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                                      className="w-5 h-5 flex items-center justify-center rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                      aria-label="Decrease quantity"
                                    >
                                      <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="w-6 text-center font-bold text-xs">{item.quantity}</span>
                                    <button
                                      onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                                      className="w-5 h-5 flex items-center justify-center rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                      aria-label="Increase quantity"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </button>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    <div className="text-right">
                                      <p className="font-bold text-orange-600 text-sm">
                                        Rs. {(item.price * item.quantity).toFixed(2)}
                                      </p>
                                    </div>
                                    <button 
                                      onClick={() => removeFromCart(item.productId)}
                                      className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors shrink-0"
                                      aria-label="Remove item"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
            </div>

            {/* Order Summary - Fixed at bottom */}
            {cart.length > 0 && (
              <div className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0">
                {/* Summary */}
                <div className="px-3 py-2 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-600 dark:text-zinc-400">Subtotal</span>
                    <span className="font-semibold text-xs">Rs. {subtotal.toFixed(2)}</span>
                  </div>
                  {deliveryType === 'delivery' && (
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-600 dark:text-zinc-400">Delivery Charges</span>
                      <span className="font-semibold text-xs">Rs. {deliveryCharge.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="pt-1 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                    <span className="text-sm font-bold">Grand Total</span>
                    <span className="text-base font-black text-orange-600">Rs. {grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <div className="px-3 pb-2">
                  <button
                    onClick={handleCheckout}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-lg font-bold transition-all shadow-lg shadow-orange-600/30 hover:shadow-xl hover:shadow-orange-600/40 active:scale-95 text-xs"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Collapsed View */}
        {isCollapsed && cart.length > 0 && (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4 mx-auto">
                <ShoppingCart className="w-8 h-8 text-orange-600" />
              </div>
              <p className="text-lg font-bold mb-1">{cart.length} {cart.length === 1 ? 'item' : 'items'}</p>
              <p className="text-2xl font-black text-orange-600">Rs. {grandTotal.toFixed(2)}</p>
            </div>
          </div>
        )}
      </div>

      {/* Add-ons View Modal */}
      {showAddOnsModal && selectedItem && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300"
          onClick={handleCloseAddOnsModal}
        >
          <div 
            className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col transform transition-all animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <h3 className="text-lg font-black text-zinc-900 dark:text-white">Add-ons</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {selectedItem.name.split(' (')[0]}
                </p>
              </div>
              <button
                onClick={handleCloseAddOnsModal}
                className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                <X className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
              </button>
            </div>

            {/* Add-ons List */}
            <div className="flex-1 overflow-y-auto p-4 max-h-[60vh]">
              {selectedItem.addOns && selectedItem.addOns.length > 0 ? (
                <div className="space-y-2">
                  {selectedItem.addOns.map(addOn => (
                    <div
                      key={addOn.id}
                      className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm text-zinc-900 dark:text-white">{addOn.name}</p>
                        <p className="text-xs text-orange-600 dark:text-orange-400 mt-0.5">
                          +Rs. {addOn.price.toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveAddOn(addOn.id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        aria-label="Remove add-on"
                        title="Remove add-on"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-zinc-500 dark:text-zinc-400">No add-ons selected</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/30">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Total Add-ons</span>
                <span className="text-lg font-black text-orange-600">
                  Rs. {selectedItem.addOns?.reduce((sum, a) => sum + a.price, 0).toFixed(2) || '0.00'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartSidebar;

