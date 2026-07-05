import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiX, FiUpload } from 'react-icons/fi';
import { fetchProductById, updateProduct } from '@/api/products';
import { uploadImage } from '@/api/upload';
import Loader from '@/components/Loader';
import Message from '@/components/Message';

const AdminProductEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [image, setImage] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [onSale, setOnSale] = useState(false);
  const [salePrice, setSalePrice] = useState(0);

  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!id) return;
    fetchProductById(id)
      .then((p) => {
        setName(p.name);
        setPrice(p.price);
        setBrand(p.brand);
        setCategory(p.category);
        setCountInStock(p.countInStock);
        setImage(p.image);
        setImages(p.images || []);
        setDescription(p.description);
        setIsFeatured(p.isFeatured);
        setOnSale(p.onSale);
        setSalePrice(p.salePrice ?? 0);
      })
      .catch(() => setError('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleMainImageUpload = async (file: File) => {
    setUploadingMain(true);
    try {
      const url = await uploadImage(file);
      setImage(url);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Image upload failed');
    } finally {
      setUploadingMain(false);
    }
  };

  const handleGalleryUpload = async (files: FileList) => {
    setUploadingGallery(true);
    try {
      const urls = await Promise.all(Array.from(files).map(uploadImage));
      setImages((prev) => [...prev, ...urls]);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Image upload failed');
    } finally {
      setUploadingGallery(false);
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (onSale && salePrice >= price) {
      setError('Sale price must be lower than the regular price');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await updateProduct(id, {
        name,
        price,
        brand,
        category,
        countInStock,
        image,
        images,
        description,
        isFeatured,
        onSale,
        salePrice: onSale ? salePrice : undefined,
      });
      toast.success('Product updated');
      navigate('/admin/products');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Could not save product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader full />;

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold mb-6">Edit product</h2>
      {error && <div className="mb-5"><Message variant="error">{error}</Message></div>}

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full border border-ink/15 rounded-lg px-3.5 py-2.5 outline-none focus:border-brand-400" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Price ($)</label>
            <input type="number" step="0.01" min={0} value={price || ''} onChange={(e) => setPrice(e.target.value === '' ? 0 : Number(e.target.value))} required className="w-full border border-ink/15 rounded-lg px-3.5 py-2.5 outline-none focus:border-brand-400" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Stock count</label>
            <input type="number" min={0} value={countInStock || ''} onChange={(e) => setCountInStock(e.target.value === '' ? 0 : Number(e.target.value))} required className="w-full border border-ink/15 rounded-lg px-3.5 py-2.5 outline-none focus:border-brand-400" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Brand</label>
            <input value={brand} onChange={(e) => setBrand(e.target.value)} required className="w-full border border-ink/15 rounded-lg px-3.5 py-2.5 outline-none focus:border-brand-400" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Category</label>
            <input value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full border border-ink/15 rounded-lg px-3.5 py-2.5 outline-none focus:border-brand-400" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Main image</label>
          <div className="flex items-center gap-3">
            <input value={image} onChange={(e) => setImage(e.target.value)} required placeholder="Image URL or upload below" className="flex-1 border border-ink/15 rounded-lg px-3.5 py-2.5 outline-none focus:border-brand-400" />
            <label className="shrink-0 inline-flex items-center gap-2 border border-ink/15 rounded-lg px-3.5 py-2.5 text-sm font-medium cursor-pointer hover:bg-ink/5 transition-colors">
              <FiUpload className="w-4 h-4" />
              {uploadingMain ? 'Uploading...' : 'Upload'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingMain}
                onChange={(e) => e.target.files?.[0] && handleMainImageUpload(e.target.files[0])}
              />
            </label>
          </div>
          {image && <img src={image} alt="Preview" className="w-24 h-24 rounded-lg object-cover mt-2 bg-brand-50" />}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Gallery images</label>
          <div className="flex flex-wrap gap-3 mb-2">
            {images.map((img, i) => (
              <div key={i} className="relative">
                <img src={img} alt="" className="w-16 h-16 rounded-lg object-cover bg-brand-50" />
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                  aria-label="Remove image"
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-ink text-white flex items-center justify-center"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          <label className="inline-flex items-center gap-2 border border-ink/15 rounded-lg px-3.5 py-2.5 text-sm font-medium cursor-pointer hover:bg-ink/5 transition-colors">
            <FiUpload className="w-4 h-4" />
            {uploadingGallery ? 'Uploading...' : 'Add gallery images'}
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              disabled={uploadingGallery}
              onChange={(e) => e.target.files && e.target.files.length > 0 && handleGalleryUpload(e.target.files)}
            />
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className="w-full border border-ink/15 rounded-lg px-3.5 py-2.5 outline-none focus:border-brand-400 resize-none" />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="accent-brand-500" />
          Featured on homepage
        </label>

        <div className="border border-ink/10 rounded-xl p-4">
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" checked={onSale} onChange={(e) => setOnSale(e.target.checked)} className="accent-red-500" />
            On sale
          </label>
          {onSale && (
            <div className="mt-3">
              <label className="block text-sm font-medium mb-1.5">Sale price ($)</label>
              <input
                type="number"
                step="0.01"
                min={0}
                max={price - 0.01}
                value={salePrice || ''}
                onChange={(e) => setSalePrice(e.target.value === '' ? 0 : Number(e.target.value))}
                required
                className="w-full border border-ink/15 rounded-lg px-3.5 py-2.5 outline-none focus:border-brand-400"
              />
              <p className="text-xs text-ink/40 mt-1.5">Must be lower than the regular price (${price.toFixed(2)}).</p>
            </div>
          )}
        </div>

        <button disabled={saving} className="bg-ink text-white px-6 py-2.5 rounded-full font-medium hover:bg-brand-600 transition-colors disabled:opacity-50">
          {saving ? 'Saving...' : 'Save product'}
        </button>
      </form>
    </div>
  );
};

export default AdminProductEditPage;
