
import React from 'react';
import AdminLayout from './AdminLayout';
import { Eye } from 'lucide-react';

function AdminHomeSettings(props) {

  // State declarations (add more as needed for your logic)
  const [loading, setLoading] = React.useState(false);
  const [previewMode, setPreviewMode] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("hero");
  const [heroData, setHeroData] = React.useState({
    tagline: "",
    title: "",
    subtitle: "",
    buttonText: "",
    backgroundImage: ""
  });
  const [uploading, setUploading] = React.useState({
    hero: false,
    welcome: false,
    customApparel: false,
    designServices: false,
    shopCustomApparel: false,
    shopDesignServices: false
  });

  const [shopDesignServicesData, setShopDesignServicesData] = React.useState({
    title: "",
    description: "",
    buttonText: "",
    image: ""
  });

  const [shopCustomApparelData, setShopCustomApparelData] = React.useState({
    title: "",
    description: "",
    buttonText: "",
    image: ""
  });

  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [confirmationData, setConfirmationData] = React.useState({
    title: "",
    message: "",
    type: ""
  });

  // Add other missing state variables as needed for your logic

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-charcoal"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-serif text-charcoal">Home Page Settings</h1>
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Eye className="w-5 h-5" />
            {previewMode ? 'Edit Mode' : 'Preview'}
          </button>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes('Error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
            {message}
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
              <button
                onClick={() => { setActiveTab('hero'); setPreviewMode(false); }}
                className={`w-full text-left px-6 py-4 font-semibold transition ${
                  activeTab === 'hero'
                    ? 'bg-charcoal text-white'
                    : 'text-charcoal hover:bg-gray-50'
                }`}
              >
                Hero Section
              </button>
              <button
                onClick={() => { setActiveTab('welcome'); setPreviewMode(false); }}
                className={`w-full text-left px-6 py-4 font-semibold transition border-t border-gray-200 ${
                  activeTab === 'welcome'
                    ? 'bg-charcoal text-white'
                    : 'text-charcoal hover:bg-gray-50'
                }`}
              >
                Welcome Section
              </button>
              <button
                onClick={() => { setActiveTab('customApparel'); setPreviewMode(false); }}
                className={`w-full text-left px-6 py-4 font-semibold transition border-t border-gray-200 ${
                  activeTab === 'customApparel'
                    ? 'bg-charcoal text-white'
                    : 'text-charcoal hover:bg-gray-50'
                }`}
              >
                Custom Apparel
              </button>
              <button
                onClick={() => { setActiveTab('designServices'); setPreviewMode(false); }}
                className={`w-full text-left px-6 py-4 font-semibold transition border-t border-gray-200 ${
                  activeTab === 'designServices'
                    ? 'bg-charcoal text-white'
                    : 'text-charcoal hover:bg-gray-50'
                }`}
              >
                Design Services
              </button>
              <button
                onClick={() => { setActiveTab('shopCustomApparel'); setPreviewMode(false); }}
                className={`w-full text-left px-6 py-4 font-semibold transition border-t border-gray-200 ${
                  activeTab === 'shopCustomApparel'
                    ? 'bg-charcoal text-white'
                    : 'text-charcoal hover:bg-gray-50'
                }`}
              >
                Shop - Custom Apparel
              </button>
              <button
                onClick={() => { setActiveTab('shopDesignServices'); setPreviewMode(false); }}
                className={`w-full text-left px-6 py-4 font-semibold transition border-t border-gray-200 ${
                  activeTab === 'shopDesignServices'
                    ? 'bg-charcoal text-white'
                    : 'text-charcoal hover:bg-gray-50'
                }`}
              >
                Shop - Design Services
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Hero Tab */}
            {activeTab === 'hero' && (
              <div className="bg-white rounded-lg p-8 border border-gray-200">
                <h2 className="text-2xl font-serif text-charcoal mb-6">Hero Section</h2>

                {!previewMode ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Tagline
                      </label>
                      <input
                        type="text"
                        value={heroData.tagline}
                        onChange={(e) => handleHeroChange('tagline', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-charcoal"
                        placeholder="e.g., Est. 2020"
                      />
                      <p className="text-xs text-gray-500 mt-1">Appears as small text above title</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Main Title
                      </label>
                      <input
                        type="text"
                        value={heroData.title}
                        onChange={(e) => handleHeroChange('title', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-charcoal"
                        placeholder="e.g., Custom Apparel That Represents Your Brand"
                      />
                      <p className="text-xs text-gray-500 mt-1">Main headline (large text)</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Subtitle
                      </label>
                      <textarea
                        value={heroData.subtitle}
                        onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-charcoal"
                        placeholder="e.g., High-quality printing for t-shirts, hoodies, jerseys & corporate merch..."
                      />
                      <p className="text-xs text-gray-500 mt-1">Description under the title</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Button Text
                      </label>
                      <input
                        type="text"
                        value={heroData.buttonText}
                        onChange={(e) => handleHeroChange('buttonText', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-charcoal"
                        placeholder="e.g., Start Designing Now"
                      />
                      <p className="text-xs text-gray-500 mt-1">Call-to-action button text</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Background Image URL
                      </label>
                      <input
                        type="url"
                        value={heroData.backgroundImage}
                        onChange={(e) => handleHeroChange('backgroundImage', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-charcoal"
                        placeholder="https://example.com/image.jpg"
                      />
                      <p className="text-xs text-gray-500 mt-1">Full URL to background image</p>

                      <div className="mt-4">
                        <p className="text-sm font-semibold text-charcoal mb-2">Or Upload Image</p>
                        <label className="flex items-center gap-2 bg-blue-50 border-2 border-blue-300 rounded-lg px-4 py-3 cursor-pointer hover:bg-blue-100 transition">
                          <Upload className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium text-blue-700">
                            {uploading.hero ? 'Uploading...' : 'Choose Image File'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleHeroImageUpload}
                            disabled={uploading.hero}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {heroData.backgroundImage && (
                        <div className="mt-4">
                          <p className="text-xs text-gray-600 mb-2">Preview:</p>
                          <img
                            src={getAbsoluteImageUrl(heroData.backgroundImage)}
                            alt="Background preview"
                            className="w-full h-40 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23ccc%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2214%22 fill=%22%23666%22 text-anchor=%22middle%22 dy=%22.3em%22%3EImage not found%3C/text%3E%3C/svg%3E';
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSaveHero}
                        disabled={saving.hero}
                        className="flex items-center gap-2 bg-charcoal text-white px-6 py-2 rounded-lg hover:bg-gray-custom transition disabled:opacity-50"
                      >
                        <Save className="w-5 h-5" />
                        {saving.hero ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={handleResetHero}
                        className="flex items-center gap-2 border-2 border-gray-300 text-charcoal px-6 py-2 rounded-lg hover:bg-gray-50 transition"
                      >
                        <RotateCcw className="w-5 h-5" />
                        Reset to Defaults
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative h-96 rounded-lg overflow-hidden border-2 border-charcoal">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${getAbsoluteImageUrl(heroData.backgroundImage)})` }}
                    >
                      <div className="absolute inset-0 bg-black/20"></div>
                    </div>
                    <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
                      <p className="text-white text-lg md:text-xl mb-4 tracking-widest uppercase">
                        {heroData.tagline}
                      </p>
                      <h1 className="text-3xl md:text-5xl font-serif text-white mb-6 max-w-2xl">
                        {heroData.title}
                      </h1>
                      <p className="text-white text-base md:text-lg mb-8 max-w-xl">
                        {heroData.subtitle}
                      </p>
                      <button
                        type="button"
                        className="bg-charcoal text-white px-8 py-3.5 text-lg font-bold shadow-lg rounded-sm"
                      >
                        {heroData.buttonText}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Welcome Tab */}
            {activeTab === 'welcome' && (
              <div className="bg-white rounded-lg p-8 border border-gray-200">
                <h2 className="text-2xl font-serif text-charcoal mb-6">Welcome Section</h2>

                {!previewMode ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Section Title
                      </label>
                      <input
                        type="text"
                        value={welcomeData.title}
                        onChange={(e) => handleWelcomeChange('title', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-charcoal"
                        placeholder="e.g., Welcome to arwas_world"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Description
                      </label>
                      <textarea
                        value={welcomeData.description}
                        onChange={(e) => handleWelcomeChange('description', e.target.value)}
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-charcoal"
                        placeholder="Welcome section description..."
                      />
                      <p className="text-xs text-gray-500 mt-1">Supports emoji and formatting</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Button Text
                      </label>
                      <input
                        type="text"
                        value={welcomeData.buttonText}
                        onChange={(e) => handleWelcomeChange('buttonText', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-charcoal"
                        placeholder="e.g., Shop Custom Apparel"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Featured Image URL
                      </label>
                      <input
                        type="url"
                        value={welcomeData.featuredImage}
                        onChange={(e) => handleWelcomeChange('featuredImage', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-charcoal"
                        placeholder="https://example.com/image.jpg"
                      />
                      <p className="text-xs text-gray-500 mt-1">Optional featured image below the welcome text</p>

                      <div className="mt-4">
                        <p className="text-sm font-semibold text-charcoal mb-2">Or Upload Image</p>
                        <label className="flex items-center gap-2 bg-blue-50 border-2 border-blue-300 rounded-lg px-4 py-3 cursor-pointer hover:bg-blue-100 transition">
                          <Upload className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium text-blue-700">
                            {uploading.welcome ? 'Uploading...' : 'Choose Image File'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleWelcomeImageUpload}
                            disabled={uploading.welcome}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {welcomeData.featuredImage && (
                        <div className="mt-4">
                          <p className="text-xs text-gray-600 mb-2">Preview:</p>
                          <img
                            src={getAbsoluteImageUrl(welcomeData.featuredImage)}
                            alt="Featured preview"
                            className="w-full h-40 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23ccc%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2214%22 fill=%22%23666%22 text-anchor=%22middle%22 dy=%22.3em%22%3EImage not found%3C/text%3E%3C/svg%3E';
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSaveWelcome}
                        disabled={saving.welcome}
                        className="flex items-center gap-2 bg-charcoal text-white px-6 py-2 rounded-lg hover:bg-gray-custom transition disabled:opacity-50"
                      >
                        <Save className="w-5 h-5" />
                        {saving.welcome ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={handleResetWelcome}
                        className="flex items-center gap-2 border-2 border-gray-300 text-charcoal px-6 py-2 rounded-lg hover:bg-gray-50 transition"
                      >
                        <RotateCcw className="w-5 h-5" />
                        Reset to Defaults
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-off-white p-12 rounded-lg text-center">
                    <h2 className="text-4xl font-serif text-charcoal mb-6">
                      {welcomeData.title}
                    </h2>
                    <p className="text-lg text-gray-custom mb-8 leading-relaxed max-w-2xl mx-auto">
                      {welcomeData.description}
                    </p>
                    <button
                      type="button"
                      className="inline-block border-2 border-charcoal bg-transparent text-charcoal px-8 py-3 font-semibold rounded-sm"
                    >
                      {welcomeData.buttonText}
                    </button>
                    {welcomeData.featuredImage && (
                      <div className="mt-12">
                        <img
                          src={getAbsoluteImageUrl(welcomeData.featuredImage)}
                          alt="Featured"
                          className="w-full h-96 object-cover rounded-lg shadow-lg"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Custom Apparel Tab */}
            {activeTab === 'customApparel' && (
              <div className="bg-white rounded-lg p-8 border border-gray-200">
                <h2 className="text-2xl font-serif text-charcoal mb-6">Custom Apparel Collection</h2>

                {!previewMode ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Collection Title
                      </label>
                      <input
                        type="text"
                        value={customApparelData.title}
                        onChange={(e) => handleCustomApparelChange('title', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-charcoal"
                        placeholder="e.g., Custom Printed Apparel"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Description
                      </label>
                      <textarea
                        value={customApparelData.description}
                        onChange={(e) => handleCustomApparelChange('description', e.target.value)}
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-charcoal"
                        placeholder="Collection description..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Button Text
                      </label>
                      <input
                        type="text"
                        value={customApparelData.buttonText}
                        onChange={(e) => handleCustomApparelChange('buttonText', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-charcoal"
                        placeholder="e.g., Shop Collection"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Collection Image URL
                      </label>
                      <input
                        type="url"
                        value={customApparelData.image}
                        onChange={(e) => handleCustomApparelChange('image', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-charcoal"
                        placeholder="https://example.com/image.jpg"
                      />
                      <p className="text-xs text-gray-500 mt-1">Full URL or upload an image</p>

                      <div className="mt-4">
                        <p className="text-sm font-semibold text-charcoal mb-2">Or Upload Image</p>
                        <label className="flex items-center gap-2 bg-blue-50 border-2 border-blue-300 rounded-lg px-4 py-3 cursor-pointer hover:bg-blue-100 transition">
                          <Upload className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium text-blue-700">
                            {uploading.customApparel ? 'Uploading...' : 'Choose Image File'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCustomApparelImageUpload}
                            disabled={uploading.customApparel}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {customApparelData.image && (
                        <div className="mt-4">
                          <p className="text-xs text-gray-600 mb-2">Preview:</p>
                          <img
                            src={getAbsoluteImageUrl(customApparelData.image)}
                            alt="Collection preview"
                            className="w-full h-40 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23ccc%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2214%22 fill=%22%23666%22 text-anchor=%22middle%22 dy=%22.3em%22%3EImage not found%3C/text%3E%3C/svg%3E';
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSaveCustomApparel}
                        disabled={saving.customApparel}
                        className="flex items-center gap-2 bg-charcoal text-white px-6 py-2 rounded-lg hover:bg-gray-custom transition disabled:opacity-50"
                      >
                        <Save className="w-5 h-5" />
                        {saving.customApparel ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={handleResetCustomApparel}
                        className="flex items-center gap-2 border-2 border-gray-300 text-charcoal px-6 py-2 rounded-lg hover:bg-gray-50 transition"
                      >
                        <RotateCcw className="w-5 h-5" />
                        Reset to Defaults
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="bg-white">
                      <div className="grid md:grid-cols-2 gap-12 items-center py-6">
                        <div>
                          <p className="text-gray-custom text-sm tracking-widest uppercase mb-4">
                            New Collection
                          </p>
                          <h2 className="text-4xl md:text-5xl font-serif text-charcoal mb-4">
                            {customApparelData.title}
                          </h2>
                          <p className="text-gray-custom text-lg leading-relaxed mb-8">
                            {customApparelData.description}
                          </p>
                          <button className="border-2 border-charcoal text-charcoal px-8 py-3 font-semibold hover:bg-charcoal hover:text-white transition">
                            {customApparelData.buttonText}
                          </button>
                        </div>
                        {customApparelData.image && (
                          <div>
                            <img
                              src={getAbsoluteImageUrl(customApparelData.image)}
                              alt={customApparelData.title}
                              className="w-full h-96 object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Design Services Tab */}
            {activeTab === 'designServices' && (
              <div className="bg-white rounded-lg p-8 border border-gray-200">
                <h2 className="text-2xl font-serif text-charcoal mb-6">Design & Printing Services Collection</h2>

                {!previewMode ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Collection Title
                      </label>
                      <input
                        type="text"
                        value={designServicesData.title}
                        onChange={(e) => handleDesignServicesChange('title', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-charcoal"
                        placeholder="e.g., Design & Printing Services"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Description
                      </label>
                      <textarea
                        value={designServicesData.description}
                        onChange={(e) => handleDesignServicesChange('description', e.target.value)}
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-charcoal"
                        placeholder="Services description..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Button Text
                      </label>
                      <input
                        type="text"
                        value={designServicesData.buttonText}
                        onChange={(e) => handleDesignServicesChange('buttonText', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-charcoal"
                        placeholder="e.g., Our Services"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Services Image URL
                      </label>
                      <input
                        type="url"
                        value={designServicesData.image}
                        onChange={(e) => handleDesignServicesChange('image', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-charcoal"
                        placeholder="https://example.com/image.jpg"
                      />
                      <p className="text-xs text-gray-500 mt-1">Full URL or upload an image</p>

                      <div className="mt-4">
                        <p className="text-sm font-semibold text-charcoal mb-2">Or Upload Image</p>
                        <label className="flex items-center gap-2 bg-blue-50 border-2 border-blue-300 rounded-lg px-4 py-3 cursor-pointer hover:bg-blue-100 transition">
                          <Upload className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium text-blue-700">
                            {uploading.designServices ? 'Uploading...' : 'Choose Image File'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleDesignServicesImageUpload}
                            disabled={uploading.designServices}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {designServicesData.image && (
                        <div className="mt-4">
                          <p className="text-xs text-gray-600 mb-2">Preview:</p>
                          <img
                            src={getAbsoluteImageUrl(designServicesData.image)}
                            alt="Services preview"
                            className="w-full h-40 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23ccc%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2214%22 fill=%22%23666%22 text-anchor=%22middle%22 dy=%22.3em%22%3EImage not found%3C/text%3E%3C/svg%3E';
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSaveDesignServices}
                        disabled={saving.designServices}
                        className="flex items-center gap-2 bg-charcoal text-white px-6 py-2 rounded-lg hover:bg-gray-custom transition disabled:opacity-50"
                      >
                        <Save className="w-5 h-5" />
                        {saving.designServices ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={handleResetDesignServices}
                        className="flex items-center gap-2 border-2 border-gray-300 text-charcoal px-6 py-2 rounded-lg hover:bg-gray-50 transition"
                      >
                        <RotateCcw className="w-5 h-5" />
                        Reset to Defaults
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="bg-white">
                      <div className="grid md:grid-cols-2 gap-12 items-center py-6 md:grid-cols-2 md:order-2">
                        {designServicesData.image && (
                          <div className="md:order-2">
                            <img
                              src={getAbsoluteImageUrl(designServicesData.image)}
                              alt={designServicesData.title}
                              className="w-full h-96 object-cover"
                            />
                          </div>
                        )}
                        <div className={designServicesData.image ? 'md:order-1' : ''}>
                          <p className="text-gray-custom text-sm tracking-widest uppercase mb-4">
                            New Collection
                          </p>
                          <h2 className="text-4xl md:text-5xl font-serif text-charcoal mb-4">
                            {designServicesData.title}
                          </h2>
                          <p className="text-gray-custom text-lg leading-relaxed mb-8">
                            {designServicesData.description}
                          </p>
                          <button className="border-2 border-charcoal text-charcoal px-8 py-3 font-semibold hover:bg-charcoal hover:text-white transition">
                            {designServicesData.buttonText}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Shop Custom Apparel Tab */}
            {activeTab === 'shopCustomApparel' && (
              <div className="bg-white rounded-lg p-8 border border-gray-200">
                <h2 className="text-2xl font-serif text-charcoal mb-6">Shop - Custom Apparel Collection</h2>

                {!previewMode ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Collection Title
                      </label>
                      <input
                        type="text"
                        value={shopCustomApparelData.title}
                        onChange={(e) => handleShopCustomApparelChange('title', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-charcoal"
                        placeholder="e.g., Custom Apparel"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Description
                      </label>
                      <textarea
                        value={shopCustomApparelData.description}
                        onChange={(e) => handleShopCustomApparelChange('description', e.target.value)}
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-charcoal"
                        placeholder="Collection description..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Button Text
                      </label>
                      <input
                        type="text"
                        value={shopCustomApparelData.buttonText}
                        onChange={(e) => handleShopCustomApparelChange('buttonText', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-charcoal"
                        placeholder="e.g., Shop Collection"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Collection Image URL
                      </label>
                      <input
                        type="url"
                        value={shopCustomApparelData.image}
                        onChange={(e) => handleShopCustomApparelChange('image', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-charcoal"
                        placeholder="https://example.com/image.jpg"
                      />
                      <p className="text-xs text-gray-500 mt-1">Full URL or upload an image</p>

                      <div className="mt-4">
                        <p className="text-sm font-semibold text-charcoal mb-2">Or Upload Image</p>
                        <label className="flex items-center gap-2 bg-blue-50 border-2 border-blue-300 rounded-lg px-4 py-3 cursor-pointer hover:bg-blue-100 transition">
                          <Upload className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium text-blue-700">
                            {uploading.shopCustomApparel ? 'Uploading...' : 'Choose Image File'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleShopCustomApparelImageUpload}
                            disabled={uploading.shopCustomApparel}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {shopCustomApparelData.image && (
                        <div className="mt-4">
                          <p className="text-xs text-gray-600 mb-2">Preview:</p>
                          <img
                            src={getAbsoluteImageUrl(shopCustomApparelData.image)}
                            alt="Collection preview"
                            className="w-full h-40 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23ccc%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2214%22 fill=%22%23666%22 text-anchor=%22middle%22 dy=%22.3em%22%3EImage not found%3C/text%3E%3C/svg%3E';
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSaveShopCustomApparel}
                        disabled={saving.shopCustomApparel}
                        className="flex items-center gap-2 bg-charcoal text-white px-6 py-2 rounded-lg hover:bg-gray-custom transition disabled:opacity-50"
                      >
                        <Save className="w-5 h-5" />
                        {saving.shopCustomApparel ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={handleResetShopCustomApparel}
                        className="flex items-center gap-2 border-2 border-gray-300 text-charcoal px-6 py-2 rounded-lg hover:bg-gray-50 transition"
                      >
                        <RotateCcw className="w-5 h-5" />
                        Reset to Defaults
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="bg-white">
                      <div className="grid md:grid-cols-2 gap-12 items-center py-6">
                        <div>
                          <p className="text-gray-custom text-sm tracking-widest uppercase mb-4">
                            New Collection
                          </p>
                          <h2 className="text-4xl md:text-5xl font-serif text-charcoal mb-4">
                            {shopCustomApparelData.title}
                          </h2>
                          <p className="text-gray-custom text-lg leading-relaxed mb-8">
                            {shopCustomApparelData.description}
                          </p>
                          <button className="border-2 border-charcoal text-charcoal px-8 py-3 font-semibold hover:bg-charcoal hover:text-white transition">
                            {shopCustomApparelData.buttonText}
                          </button>
                        </div>
                        {shopCustomApparelData.image && (
                          <div>
                            <img
                              src={getAbsoluteImageUrl(shopCustomApparelData.image)}
                              alt={shopCustomApparelData.title}
                              className="w-full h-96 object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Shop Design Services Tab */}
            {activeTab === 'shopDesignServices' && (
              <div className="bg-white rounded-lg p-8 border border-gray-200">
                <h2 className="text-2xl font-serif text-charcoal mb-6">Shop - Design & Printing Services Collection</h2>

                {!previewMode ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Collection Title
                      </label>
                      <input
                        type="text"
                        value={shopDesignServicesData.title}
                        onChange={(e) => handleShopDesignServicesChange('title', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-charcoal"
                        placeholder="e.g., Design & Printing Services"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Description
                      </label>
                      <textarea
                        value={shopDesignServicesData.description}
                        onChange={(e) => handleShopDesignServicesChange('description', e.target.value)}
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-charcoal"
                        placeholder="Services description..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Button Text
                      </label>
                      <input
                        type="text"
                        value={shopDesignServicesData.buttonText}
                        onChange={(e) => handleShopDesignServicesChange('buttonText', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-charcoal"
                        placeholder="e.g., Our Services"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Services Image URL
                      </label>
                      <input
                        type="url"
                        value={shopDesignServicesData.image}
                        onChange={(e) => handleShopDesignServicesChange('image', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-charcoal"
                        placeholder="https://example.com/image.jpg"
                      />
                      <p className="text-xs text-gray-500 mt-1">Full URL or upload an image</p>

                      <div className="mt-4">
                        <p className="text-sm font-semibold text-charcoal mb-2">Or Upload Image</p>
                        <label className="flex items-center gap-2 bg-blue-50 border-2 border-blue-300 rounded-lg px-4 py-3 cursor-pointer hover:bg-blue-100 transition">
                          <Upload className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium text-blue-700">
                            {uploading.shopDesignServices ? 'Uploading...' : 'Choose Image File'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleShopDesignServicesImageUpload}
                            disabled={uploading.shopDesignServices}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {shopDesignServicesData.image && (
                        <div className="mt-4">
                          <p className="text-xs text-gray-600 mb-2">Preview:</p>
                          <img
                            src={getAbsoluteImageUrl(shopDesignServicesData.image)}
                            alt="Services preview"
                            className="w-full h-40 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23ccc%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2214%22 fill=%22%23666%22 text-anchor=%22middle%22 dy=%22.3em%22%3EImage not found%3C/text%3E%3C/svg%3E';
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSaveShopDesignServices}
                        disabled={saving.shopDesignServices}
                        className="flex items-center gap-2 bg-charcoal text-white px-6 py-2 rounded-lg hover:bg-gray-custom transition disabled:opacity-50"
                      >
                        <Save className="w-5 h-5" />
                        {saving.shopDesignServices ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={handleResetShopDesignServices}
                        className="flex items-center gap-2 border-2 border-gray-300 text-charcoal px-6 py-2 rounded-lg hover:bg-gray-50 transition"
                      >
                        <RotateCcw className="w-5 h-5" />
                        Reset to Defaults
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="bg-white">
                      <div className="grid md:grid-cols-2 gap-12 items-center py-6 md:grid-cols-2 md:order-2">
                        {shopDesignServicesData.image && (
                          <div className="md:order-2">
                            <img
                              src={getAbsoluteImageUrl(shopDesignServicesData.image)}
                              alt={shopDesignServicesData.title}
                              className="w-full h-96 object-cover"
                            />
                          </div>
                        )}
                        <div className={shopDesignServicesData.image ? 'md:order-1' : ''}>
                          <p className="text-gray-custom text-sm tracking-widest uppercase mb-4">
                            New Collection
                          </p>
                          <h2 className="text-4xl md:text-5xl font-serif text-charcoal mb-4">
                            {shopDesignServicesData.title}
                          </h2>
                          <p className="text-gray-custom text-lg leading-relaxed mb-8">
                            {shopDesignServicesData.description}
                          </p>
                          <button className="border-2 border-charcoal text-charcoal px-8 py-3 font-semibold hover:bg-charcoal hover:text-white transition">
                            {shopDesignServicesData.buttonText}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        title={confirmationData.title}
        message={confirmationData.message}
        type={confirmationData.type}
        onClose={() => setShowConfirmation(false)}
      />
    </AdminLayout>

  );
}

export default AdminHomeSettings;
