
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Package, Plus, Trash2, Eye, EyeOff, CheckCircle, Clock, XCircle, PlusCircle, LayoutGrid, Tag } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { 
    isAdmin, orders, products, categories, 
    updateOrderStatus, addProduct, removeProduct, 
    toggleProductVisibility, addCategory, removeCategory 
  } = useApp();
  
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'categories'>('orders');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: 0, category: '', image: '' });
  const [newCatName, setNewCatName] = useState('');

  if (!isAdmin) return <Navigate to="/admin/login" />;

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct(newProduct);
    setShowAddProduct(false);
    setNewProduct({ name: '', description: '', price: 0, category: '', image: '' });
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    addCategory(newCatName);
    setNewCatName('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-serif font-black mb-2">Management Hub</h1>
          <p className="text-slate-500 dark:text-zinc-400">Manage orders, products and categories in real-time.</p>
        </div>
        
        <div className="flex bg-white dark:bg-zinc-900 p-1.5 rounded-2xl border border-slate-200 dark:border-zinc-800">
          {[
            { id: 'orders', label: 'Orders', icon: Package },
            { id: 'products', label: 'Inventory', icon: LayoutGrid },
            { id: 'categories', label: 'Categories', icon: Tag }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id 
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' 
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-slate-100 dark:border-zinc-800">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Pending Orders</p>
              <h3 className="text-3xl font-black">{orders.filter(o => o.status === 'pending').length}</h3>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-slate-100 dark:border-zinc-800">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Completed Today</p>
              <h3 className="text-3xl font-black">{orders.filter(o => o.status === 'completed').length}</h3>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-slate-100 dark:border-zinc-800">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Total Revenue</p>
              <h3 className="text-3xl font-black text-primary-500">${orders.reduce((sum, o) => o.status === 'completed' ? sum + o.total : sum, 0).toFixed(2)}</h3>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-zinc-800">
                  <th className="px-8 py-5 text-sm font-black uppercase tracking-wider text-slate-400">Order ID</th>
                  <th className="px-8 py-5 text-sm font-black uppercase tracking-wider text-slate-400">Customer</th>
                  <th className="px-8 py-5 text-sm font-black uppercase tracking-wider text-slate-400">Delivery</th>
                  <th className="px-8 py-5 text-sm font-black uppercase tracking-wider text-slate-400">Total</th>
                  <th className="px-8 py-5 text-sm font-black uppercase tracking-wider text-slate-400">Status</th>
                  <th className="px-8 py-5 text-sm font-black uppercase tracking-wider text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-zinc-800">
                {orders.length === 0 ? (
                  <tr><td colSpan={6} className="px-8 py-20 text-center text-slate-500">No orders placed yet.</td></tr>
                ) : (
                  orders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="px-8 py-6 font-bold font-mono text-sm">{order.id}</td>
                      <td className="px-8 py-6">
                        <div className="font-bold">{order.customerName}</div>
                        <div className="text-xs text-slate-500">{order.customerPhone}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm font-bold capitalize">{order.deliveryType}</div>
                        {order.deliveryType === 'delivery' && order.customerAddress && (
                          <div className="text-xs text-slate-500 mt-1">{order.customerAddress}</div>
                        )}
                      </td>
                      <td className="px-8 py-6 font-black text-primary-500">${order.total.toFixed(2)}</td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          order.status === 'completed' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' :
                          'bg-amber-100 text-amber-600 dark:bg-amber-900/30'
                        }`}>
                          {order.status === 'pending' && <Clock className="w-3 h-3" />}
                          {order.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                          {order.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                          {order.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          {order.status === 'pending' && (
                            <>
                              <button onClick={() => updateOrderStatus(order.id, 'completed')} className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"><CheckCircle className="w-4 h-4" /></button>
                              <button onClick={() => updateOrderStatus(order.id, 'cancelled')} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"><XCircle className="w-4 h-4" /></button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-serif font-bold">Manage Inventory</h3>
            <button 
              onClick={() => setShowAddProduct(true)}
              className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/20"
            >
              <PlusCircle className="w-5 h-5" />
              New Product
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {products.map(product => (
              <div key={product.id} className="flex gap-6 bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-slate-100 dark:border-zinc-800 group">
                <div className="w-32 h-32 rounded-2xl overflow-hidden shrink-0">
                  <img src={product.image} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between">
                      <h4 className="font-bold text-lg">{product.name}</h4>
                      <span className="text-primary-500 font-black">${product.price.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-1 mb-2">{product.description}</p>
                    <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-zinc-800 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {product.category}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => toggleProductVisibility(product.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        product.isHidden 
                        ? 'bg-slate-100 text-slate-600 dark:bg-zinc-800' 
                        : 'bg-primary-50 text-primary-600 dark:bg-primary-900/20'
                      }`}
                    >
                      {product.isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      {product.isHidden ? 'Hidden' : 'Visible'}
                    </button>
                    <button 
                      onClick={() => removeProduct(product.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 dark:bg-red-900/20 rounded-xl text-xs font-bold transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="max-w-2xl">
          <h3 className="text-2xl font-serif font-bold mb-8">Product Categories</h3>
          
          <form onSubmit={handleAddCategory} className="flex gap-4 mb-10">
            <input 
              required
              type="text"
              placeholder="Enter category name..."
              value={newCatName}
              onChange={e => setNewCatName(e.target.value)}
              className="flex-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary-500 outline-none"
            />
            <button className="px-8 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-bold">Add</button>
          </form>

          <div className="space-y-3">
            {categories.map(cat => (
              <div key={cat.id} className="flex items-center justify-between bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800">
                <span className="font-bold text-lg">{cat.name}</span>
                <button 
                  onClick={() => removeCategory(cat.id)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-3xl font-serif font-black mb-8">Add New Product</h3>
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold mb-2">Product Name</label>
                <input required type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl py-4 px-6 outline-none" placeholder="Royal Feast Burger" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold mb-2">Description</label>
                <textarea required rows={3} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl py-4 px-6 outline-none resize-none" placeholder="Brief description of the dish..." />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Price ($)</label>
                <input required type="number" step="0.01" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})} className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl py-4 px-6 outline-none" placeholder="12.99" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Category</label>
                <select required value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl py-4 px-6 outline-none appearance-none">
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold mb-2">Image URL (Unsplash or direct link)</label>
                <input required type="text" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl py-4 px-6 outline-none" placeholder="https://images.unsplash.com/..." />
              </div>
              
              <div className="md:col-span-2 flex gap-4 mt-4">
                <button type="button" onClick={() => setShowAddProduct(false)} className="flex-1 py-4 border border-slate-200 dark:border-zinc-800 rounded-2xl font-bold">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-primary-500 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/20">Create Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
