import { useState } from 'react';
import { 
  Search, Plus, Filter, Package,
  DollarSign, Tag, Box, BarChart
} from 'lucide-react';

export function Products() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Enterprise License',
      category: 'Software',
      price: 999.99,
      sku: 'ENT-001',
      stock: 50,
      sales: 125
    },
    {
      id: 2,
      name: 'Cloud Storage (1TB)',
      category: 'Services',
      price: 199.99,
      sku: 'CLD-001',
      stock: 100,
      sales: 89
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="h-full flex">
      <div className="w-1/3 border-r border-gray-800">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white mb-6">Products</h1>
          
          <div className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400"
              title="Filter"
            >
              <Filter className="w-5 h-5" />
            </button>
            <button
              className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white"
              title="Add Product"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2">
            {products.map(product => (
              <button
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className={`
                  w-full p-4 rounded-lg text-left transition-colors
                  ${selectedProduct?.id === product.id
                    ? 'bg-blue-500/20 hover:bg-blue-500/30'
                    : 'hover:bg-gray-800'}
                `}
              >
                <div className="font-medium text-white mb-1">{product.name}</div>
                <div className="text-sm text-gray-400">${product.price}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 p-6">
        {selectedProduct ? (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {selectedProduct.name}
                </h2>
                <div className="text-gray-400">{selectedProduct.category}</div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
                  Edit Product
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-300">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <span>${selectedProduct.price}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Tag className="w-5 h-5 text-gray-400" />
                  <span>SKU: {selectedProduct.sku}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Box className="w-5 h-5 text-gray-400" />
                  <span>Stock: {selectedProduct.stock} units</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <BarChart className="w-5 h-5 text-gray-400" />
                  <span>Total Sales: {selectedProduct.sales} units</span>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="font-medium text-white mb-3">Performance</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-400">Monthly Sales</span>
                      <span className="text-sm text-green-400">+12%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 w-[65%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-400">Stock Level</span>
                      <span className="text-sm text-yellow-400">75%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 w-[75%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-medium text-white mb-3">Recent Orders</h3>
              <table className="w-full">
                <thead>
                  <tr className="text-sm text-gray-400">
                    <th className="text-left py-2">Order ID</th>
                    <th className="text-left py-2">Customer</th>
                    <th className="text-left py-2">Date</th>
                    <th className="text-right py-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-sm">
                    <td className="py-2 text-gray-300">#12345</td>
                    <td className="py-2 text-gray-300">Acme Corp</td>
                    <td className="py-2 text-gray-300">2023-10-15</td>
                    <td className="py-2 text-gray-300 text-right">$999.99</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            Select a product to view details
          </div>
        )}
      </div>
    </div>
  );
}