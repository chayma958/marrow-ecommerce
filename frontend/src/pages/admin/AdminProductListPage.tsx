import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { fetchProducts, createProduct, deleteProduct } from '@/api/products';
import { Product } from '@/types';
import Loader from '@/components/Loader';
import Message from '@/components/Message';

const AdminProductListPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    fetchProducts({ pageSize: 100 })
      .then((data) => setProducts(data.products))
      .catch(() => setError('Could not load products'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCreate = async () => {
    const product = await createProduct({});
    toast.success('Draft product created');
    navigate(`/admin/products/${product._id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this product?')) return;
    await deleteProduct(id);
    toast.success('Product deleted');
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Products ({products.length})</h2>
        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 bg-ink text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-brand-600 transition-colors"
        >
          <FiPlus className="w-4 h-4" /> New product
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : (
        <div className="overflow-x-auto bg-white border border-ink/8 rounded-2xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink/40 text-xs uppercase tracking-wider border-b border-ink/8">
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-ink/8 last:border-0">
                  <td className="p-4 flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-brand-50" />
                    <Link to={`/products/${p.slug}`} className="font-medium hover:text-brand-600 line-clamp-1">{p.name}</Link>
                  </td>
                  <td className="p-4 text-ink/60">{p.category}</td>
                  <td className="p-4">
                    {p.onSale && p.salePrice != null && p.salePrice < p.price ? (
                      <span>
                        <span className="text-red-500 font-medium">${p.salePrice.toFixed(2)}</span>{' '}
                        <span className="text-ink/35 line-through text-xs">${p.price.toFixed(2)}</span>
                      </span>
                    ) : (
                      `$${p.price.toFixed(2)}`
                    )}
                  </td>
                  <td className="p-4">{p.countInStock}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Link to={`/admin/products/${p._id}/edit`} className="text-brand-600 hover:text-brand-700">
                        <FiEdit2 className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:text-red-600">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProductListPage;
