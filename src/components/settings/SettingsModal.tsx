'use client';

import React, { useState, useEffect } from 'react';
import { UserProfile, ProductProfile, ScoreWeights } from '@/types';
import { DEFAULT_SCORE_WEIGHTS, DEFAULT_PRODUCT_PROFILE } from '@/lib/scoring';
import {
  X,
  Sliders,
  Package,
  Key,
  CheckCircle2,
  Save,
  RotateCcw,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated: () => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  onProfileUpdated,
}: SettingsModalProps) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'product' | 'weights' | 'api'>('product');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [productForm, setProductForm] = useState<ProductProfile>(DEFAULT_PRODUCT_PROFILE);
  const [weightsForm, setWeightsForm] = useState<ScoreWeights>(DEFAULT_SCORE_WEIGHTS);
  const [horizonDays, setHorizonDays] = useState(45);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [mapsKeyInput, setMapsKeyInput] = useState('');
  const [mapsKeySaved, setMapsKeySaved] = useState(false);

  useEffect(() => {
    fetchProfile();
    if (typeof window !== 'undefined') {
      const storedKey = localStorage.getItem('google_maps_api_key') || '';
      setMapsKeyInput(storedKey);
    }
  }, []);

  function handleSaveMapsKey() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('google_maps_api_key', mapsKeyInput.trim());
      setMapsKeySaved(true);
      setTimeout(() => setMapsKeySaved(false), 2500);
      onProfileUpdated();
    }
  }

  async function fetchProfile() {
    try {
      const res = await fetch('/api/profile');
      const data = await res.json();
      if (data.profile) {
        setProfile(data.profile);
        setProductForm(data.profile.product_profile);
        setWeightsForm(data.profile.score_weights);
        setHorizonDays(data.profile.default_date_horizon_days || 45);
      }
    } catch (err) {
      console.error('Failed fetching profile:', err);
    }
  }

  const weightSum =
    Number(weightsForm.product_fit) +
    Number(weightsForm.audience_intent) +
    Number(weightsForm.location_context) +
    Number(weightsForm.event_relevance) +
    Number(weightsForm.economics) +
    Number(weightsForm.booking_readiness);

  async function handleSave() {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_profile: productForm,
          score_weights: weightsForm,
          default_date_horizon_days: horizonDays,
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        onProfileUpdated();
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (err) {
      console.error('Failed updating profile:', err);
    } finally {
      setIsSaving(false);
    }
  }

  function handleResetWeights() {
    setWeightsForm(DEFAULT_SCORE_WEIGHTS);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white border border-[#e2ece6] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-[#0f291e]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#e2ece6] bg-[#f8faf8]">
          <div>
            <h3 className="font-black text-[#0f291e] text-lg">TETR Workspace Settings & Criteria</h3>
            <p className="text-xs text-[#52796f]">
              Configure product profile, scoring weights, and API integrations
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#52796f] hover:text-[#0f291e] rounded-xl bg-white border border-[#e2ece6] transition shadow-xs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#e2ece6] bg-[#f8faf8] px-5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('product')}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'product'
                ? 'border-[#059669] text-[#059669]'
                : 'border-transparent text-[#52796f] hover:text-[#0f291e]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Product Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('weights')}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'weights'
                ? 'border-[#059669] text-[#059669]'
                : 'border-transparent text-[#52796f] hover:text-[#0f291e]'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Scoring Model ({weightSum}%)</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'api'
                ? 'border-[#059669] text-[#059669]'
                : 'border-transparent text-[#52796f] hover:text-[#0f291e]'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>API & Integrations</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* TAB 1: PRODUCT PROFILE */}
          {activeTab === 'product' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="text-[#0f291e] font-semibold block mb-1">Product Name / Brand</label>
                <input
                  type="text"
                  value={productForm.product_name}
                  onChange={(e) => setProductForm({ ...productForm, product_name: e.target.value })}
                  className="w-full bg-[#f8faf8] border border-[#e2ece6] rounded-xl p-2.5 text-[#0f291e] focus:outline-none focus:border-[#059669]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[#0f291e] font-semibold block mb-1">Category</label>
                  <input
                    type="text"
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-[#f8faf8] border border-[#e2ece6] rounded-xl p-2.5 text-[#0f291e] focus:outline-none focus:border-[#059669]"
                  />
                </div>
                <div>
                  <label className="text-[#0f291e] font-semibold block mb-1">Target Audience</label>
                  <input
                    type="text"
                    value={productForm.target_audience}
                    onChange={(e) => setProductForm({ ...productForm, target_audience: e.target.value })}
                    className="w-full bg-[#f8faf8] border border-[#e2ece6] rounded-xl p-2.5 text-[#0f291e] focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[#0f291e] font-semibold block mb-1">Min Item Price (₹)</label>
                  <input
                    type="number"
                    value={productForm.price_range_min}
                    onChange={(e) => setProductForm({ ...productForm, price_range_min: Number(e.target.value) })}
                    className="w-full bg-[#f8faf8] border border-[#e2ece6] rounded-xl p-2.5 text-[#0f291e] focus:outline-none focus:border-[#059669]"
                  />
                </div>
                <div>
                  <label className="text-[#0f291e] font-semibold block mb-1">Max Item Price (₹)</label>
                  <input
                    type="number"
                    value={productForm.price_range_max}
                    onChange={(e) => setProductForm({ ...productForm, price_range_max: Number(e.target.value) })}
                    className="w-full bg-[#f8faf8] border border-[#e2ece6] rounded-xl p-2.5 text-[#0f291e] focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[#0f291e] font-semibold block mb-1">Max Stall Budget (₹)</label>
                  <input
                    type="number"
                    value={productForm.max_budget_per_event}
                    onChange={(e) => setProductForm({ ...productForm, max_budget_per_event: Number(e.target.value) })}
                    className="w-full bg-[#f8faf8] border border-[#e2ece6] rounded-xl p-2.5 text-[#0f291e] focus:outline-none focus:border-[#059669]"
                  />
                </div>
                <div>
                  <label className="text-[#0f291e] font-semibold block mb-1">Default Horizon (Days)</label>
                  <input
                    type="number"
                    value={horizonDays}
                    onChange={(e) => setHorizonDays(Number(e.target.value))}
                    className="w-full bg-[#f8faf8] border border-[#e2ece6] rounded-xl p-2.5 text-[#0f291e] focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#0f291e] font-semibold block mb-1">Product Description</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-[#f8faf8] border border-[#e2ece6] rounded-xl p-2.5 text-[#0f291e] focus:outline-none focus:border-[#059669]"
                />
              </div>
            </div>
          )}

          {/* TAB 2: WEIGHTS */}
          {activeTab === 'weights' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#e2ece6]">
                <div>
                  <span className="font-bold text-[#0f291e]">Scoring Weights Allocation</span>
                  <span className={`text-xs ml-2 font-bold ${weightSum === 100 ? 'text-[#059669]' : 'text-amber-600'}`}>
                    Total: {weightSum}% (Target: 100%)
                  </span>
                </div>
                <button
                  onClick={handleResetWeights}
                  className="text-xs text-[#059669] hover:underline flex items-center gap-1 font-semibold"
                >
                  <RotateCcw className="w-3 h-3" /> Reset Defaults
                </button>
              </div>

              <div className="space-y-3">
                {[
                  { key: 'product_fit', label: '1. Product & Category Fit (Default 25%)', val: weightsForm.product_fit },
                  { key: 'audience_intent', label: '2. Audience & Spend Intent (Default 20%)', val: weightsForm.audience_intent },
                  { key: 'location_context', label: '3. Location & Logistics Context (Default 15%)', val: weightsForm.location_context },
                  { key: 'event_relevance', label: '4. Evidence & Organiser Quality (Default 15%)', val: weightsForm.event_relevance },
                  { key: 'economics', label: '5. Stall Economics & Budget Cap (Default 15%)', val: weightsForm.economics },
                  { key: 'booking_readiness', label: '6. Official Booking Channel (Default 10%)', val: weightsForm.booking_readiness },
                ].map(({ key, label, val }) => (
                  <div key={key} className="flex items-center justify-between gap-4 p-2.5 bg-[#f8faf8] rounded-xl border border-[#e2ece6]">
                    <span className="font-medium text-[#0f291e]">{label}</span>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={val}
                      onChange={(e) => setWeightsForm({ ...weightsForm, [key]: Number(e.target.value) })}
                      className="w-16 bg-white border border-[#e2ece6] rounded-lg p-1.5 text-center font-bold text-[#059669]"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: API & INTEGRATIONS */}
          {activeTab === 'api' && (
            <div className="space-y-4 text-xs">
              {/* Google Maps API Key Box */}
              <div className="p-4 rounded-xl bg-[#f8faf8] border border-[#dce8e1] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#ecfdf5] border border-[#a7f3d0] flex items-center justify-center text-[#059669]">
                      <Key className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-[#0f291e] text-sm">Google Maps JavaScript API Key</div>
                      <div className="text-[11px] text-[#527964]">Interactive Google Map tiles, satellite view, and geocoding</div>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    mapsKeyInput.trim().length > 5
                      ? 'bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    {mapsKeyInput.trim().length > 5 ? 'Key Active' : 'Key Not Set'}
                  </span>
                </div>

                <p className="text-[11.5px] text-[#3d5a4c] leading-relaxed">
                  Enter your Google Maps API key below to enable full Google Maps layers, traffic, and high-precision venue mapping across Delhi NCR.
                </p>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={mapsKeyInput}
                      onChange={(e) => setMapsKeyInput(e.target.value)}
                      placeholder="AIzaSy..."
                      className="flex-1 bg-white border border-[#d8e5dd] rounded-xl px-3 py-2 text-xs text-[#0f291e] font-mono focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
                    />
                    <button
                      onClick={handleSaveMapsKey}
                      className="px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white font-semibold rounded-xl text-xs transition shadow-sm whitespace-nowrap"
                    >
                      {mapsKeySaved ? 'Saved!' : 'Save Key'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#527964] pt-1">
                    <span>Stored locally in browser & <code className="bg-white px-1 py-0.5 rounded border border-[#d8e5dd]">.env.local</code></span>
                    <a
                      href="https://console.cloud.google.com/google/maps-apis/credentials"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#059669] hover:underline font-semibold"
                    >
                      Get Key on Google Cloud Console ↗
                    </a>
                  </div>
                </div>
              </div>

              {/* Status List */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#f8faf8] border border-[#e2ece6]">
                  <div>
                    <div className="font-semibold text-[#0f291e]">Google Maps Geocoding & Places</div>
                    <div className="text-[11px] text-[#527964]">Venue coordinate lookup for Delhi, Gurugram, Noida</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]">
                    Integrated
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#f8faf8] border border-[#e2ece6]">
                  <div>
                    <div className="font-semibold text-[#0f291e]">AI Search & LLM Discovery Service</div>
                    <div className="text-[11px] text-[#527964]">Crawling & source extraction for festive bazaars</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]">
                    Ready
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#f8faf8] border border-[#e2ece6]">
                  <div>
                    <div className="font-semibold text-[#0f291e]">Database & Seed Registry</div>
                    <div className="text-[11px] text-[#527964]">39 verified Delhi NCR events through Dec 23rd + 8 Organiser Mailers</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]">
                    Active File DB
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 border-t border-[#e2ece6] bg-[#f8faf8]">
          <div>
            {saveSuccess && (
              <span className="text-xs font-bold text-[#059669] flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Changes saved successfully!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-[#f0fdf4] text-[#0f291e] border border-[#e2ece6] text-xs font-semibold rounded-xl transition shadow-xs"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-5 py-2 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-xl text-xs shadow-md shadow-[#059669]/20 transition active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
