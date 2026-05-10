import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { getSettings, updateSettingsSection } from '../services/api';

const DEFAULT_COLLECTIONS = [
  { id: 'gift-boxes', name: 'Customised Gift Boxes', description: 'Curated custom gift boxes', image: '' },
  { id: 'caps', name: 'Customised Caps', description: 'Personalized caps for teams and brands', image: '' },
  { id: 'mugs', name: 'Mugs', description: 'Custom printed mugs and drinkware', image: '' },
  { id: 'bottles', name: 'Water Bottles', description: 'Branded reusable bottles', image: '' },
  { id: 'hoodies', name: 'Hoodies', description: 'Comfortable hoodies for all seasons', image: '' },
  { id: 'polo-shirts', name: 'Polo Shirts', description: 'Elegant polo shirts for professionals', image: '' },
  { id: 't-shirts', name: 'T-Shirts', description: 'Classic custom printed t-shirts', image: '' },
  { id: 'jerseys', name: 'Jerseys', description: 'Sports jerseys and performance wear', image: '' }
];

const slugifyId = (value) => value
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

export default function AdminCollections() {
  const [collections, setCollections] = useState(DEFAULT_COLLECTIONS);
  const [featuredCollectionId, setFeaturedCollectionId] = useState('t-shirt');
  const [editingCollection, setEditingCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const settings = await getSettings();
      const items = settings?.collections?.items || DEFAULT_COLLECTIONS;
      setCollections(items);
      setFeaturedCollectionId(settings?.collections?.featuredCollectionId || items[0]?.id || '');
    } catch (error) {
      setMessage('Failed to load collections.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartAdd = () => {
    setEditingCollection({ id: '', name: '', description: '', image: '' });
  };

  const handleEdit = (collection) => {
    setEditingCollection({ ...collection });
  };

  const handleCancelEdit = () => {
    setEditingCollection(null);
  };

  const handleSaveCollection = () => {
    if (!editingCollection.name.trim()) {
      setMessage('Collection name is required.');
      return;
    }

    const nextId = editingCollection.id.trim() || slugifyId(editingCollection.name);
    if (!nextId) {
      setMessage('Collection ID is required.');
      return;
    }

    const isDuplicate = collections.some((item) => item.id === nextId && item.id !== editingCollection.id);
    if (isDuplicate) {
      setMessage('Collection ID must be unique.');
      return;
    }

    const updated = editingCollection.id
      ? collections.map((item) => item.id === editingCollection.id
          ? { ...editingCollection, id: nextId }
          : item
        )
      : [...collections, { ...editingCollection, id: nextId }];

    setCollections(updated);
    if (!featuredCollectionId) {
      setFeaturedCollectionId(nextId);
    }
    setEditingCollection(null);
  };

  const handleDelete = (collectionId) => {
    if (!window.confirm('Delete this collection?')) return;
    const updated = collections.filter((item) => item.id !== collectionId);
    setCollections(updated);
    if (featuredCollectionId === collectionId) {
      setFeaturedCollectionId(updated[0]?.id || '');
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setMessage('');
      await updateSettingsSection('collections', {
        items: collections,
        featuredCollectionId
      });
      setMessage('✓ Collections saved successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`✗ Failed to save collections: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-charcoal">Collections Management</h1>
            <p className="text-gray-600 mt-2">Manage product categories and collections</p>
          </div>
          <button
            onClick={handleStartAdd}
            className="flex items-center justify-center gap-2 bg-charcoal text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-custom transition"
          >
            <Plus className="w-4 h-4" />
            Add Collection
          </button>
        </div>

        {message && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            {message}
          </div>
        )}

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            These collections are used as product categories. Updating IDs can affect existing products, so edit IDs carefully.
          </p>
        </div>

        {/* Edit / Add Form */}
        {editingCollection && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-charcoal">
                {editingCollection.id ? 'Edit Collection' : 'Add Collection'}
              </h2>
              <button
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-charcoal transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Name</label>
                <input
                  type="text"
                  value={editingCollection.name}
                  onChange={(e) => setEditingCollection(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">ID (slug)</label>
                <input
                  type="text"
                  value={editingCollection.id}
                  onChange={(e) => setEditingCollection(prev => ({ ...prev, id: e.target.value }))}
                  placeholder="auto-generated if left blank"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-charcoal mb-2">Description</label>
                <textarea
                  value={editingCollection.description}
                  onChange={(e) => setEditingCollection(prev => ({ ...prev, description: e.target.value }))}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-charcoal mb-2">Image URL</label>
                <input
                  type="url"
                  value={editingCollection.image || ''}
                  onChange={(e) => setEditingCollection(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="https://example.com/subcategory-image.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal"
                />
                <p className="text-xs text-gray-500 mt-1">This image is shown on the Shop sub-category card.</p>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSaveCollection}
                className="flex items-center gap-2 bg-charcoal text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-custom transition"
              >
                <Save className="w-4 h-4" />
                Save Collection
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-5 py-2 rounded-lg font-semibold border border-gray-300 text-charcoal hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Collections Grid */}
        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading collections...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal">{collection.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{collection.description}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4 text-xs text-gray-600">
                  <p>Category ID: <code className="text-charcoal font-mono">{collection.id}</code></p>
                </div>
                {collection.image && (
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-28 object-cover rounded-lg mb-4"
                  />
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(collection)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-2 rounded font-semibold hover:bg-blue-100 transition"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(collection.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2 rounded font-semibold hover:bg-red-100 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {/* Bulk Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-charcoal mb-4">Collection Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">Featured Collection</label>
              <select
                value={featuredCollectionId}
                onChange={(e) => setFeaturedCollectionId(e.target.value)}
                className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal"
              >
                {collections.map((collection) => (
                  <option key={collection.id} value={collection.id}>
                    {collection.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-600 mt-2">This collection will be displayed prominently on the home page</p>
            </div>

            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="bg-charcoal text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-custom transition disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
