'use client';

import React, { useState, useEffect } from 'react';
import { UserProfile, ProductProfile, ScoreWeights } from '@/types';
import { DEFAULT_SCORE_WEIGHTS, DEFAULT_PRODUCT_PROFILE } from '@/lib/scoring';
import {
  X,
  Sliders,
  Package,
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Save,
  HelpCircle,
  Sparkles,
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

  useEffect(() => {
    fetchProfile();
  }, []);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/80">
          <div>
            <h3 className="font-bold text-white text-lg">Workspace Settings & Criteria</h3>
            <p className="text-xs text-slate-400">
              Configure product profile, scoring weights, and API integrations
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('product')}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'product'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Product Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('weights')}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'weights'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Scoring Model ({weightSum}%)</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'api'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
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
              <div className="bg-amber-950/30 border border-amber-900/50 p-3 rounded-lg text-amber-300/90 leading-relaxed">
                <strong>Product-Agnostic Engine:</strong> The AI scores all Delhi NCR opportunities
                against this profile. Change it to candles, jewelry, apparel, bakery, pottery, or any
                custom product category at any time.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Product Name / Line</label>
                  <input
                    type="text"
                    value={productForm.product_name}
                    onChange={(e) => setProductForm({ ...productForm, product_name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Category</label>
                  <input
                    type="text"
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Product Description</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Min Price (₹)</label>
                  <input
                    type="number"
                    value={productForm.price_range_min}
                    onChange={(e) =>
                      setProductForm({ ...productForm, price_range_min: Number(e.target.value) })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Max Price (₹)</label>
                  <input
                    type="number"
                    value={productForm.price_range_max}
                    onChange={(e) =>
                      setProductForm({ ...productForm, price_range_max: Number(e.target.value) })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Max Event Budget (₹)</label>
                  <input
                    type="number"
                    value={productForm.max_budget_per_event}
                    onChange={(e) =>
                      setProductForm({ ...productForm, max_budget_per_event: Number(e.target.value) })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Target Customer Profile</label>
                <input
                  type="text"
                  value={productForm.target_audience}
                  onChange={(e) => setProductForm({ ...productForm, target_audience: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Stall Footprint</label>
                  <input
                    type="text"
                    value={productForm.stall_footprint}
                    onChange={(e) => setProductForm({ ...productForm, stall_footprint: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Staffing (Headcount)</label>
                  <input
                    type="number"
                    value={productForm.staffing_count}
                    onChange={(e) =>
                      setProductForm({ ...productForm, staffing_count: Number(e.target.value) })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Transport Mode</label>
                  <input
                    type="text"
                    value={productForm.transport_mode}
                    onChange={(e) => setProductForm({ ...productForm, transport_mode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SCORING WEIGHTS */}
          {activeTab === 'weights' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div>
                  <span className="font-bold text-slate-200 block">Total Weights Sum: {weightSum}%</span>
                  <span className="text-slate-400 text-[11px]">Weights must total 100% for standard normalization.</span>
                </div>
                <div className="flex items-center gap-2">
                  {weightSum === 100 ? (
                    <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-800">
                      Balanced (100%)
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded bg-amber-950 text-amber-400 font-bold border border-amber-800">
                      Total is {weightSum}% (Will scale to 100%)
                    </span>
                  )}
                  <button
                    onClick={handleResetWeights}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                </div>
              </div>

              {/* Sliders */}
              <div className="space-y-3 pt-1">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-slate-200">Product / Category Fit: {weightsForm.product_fit}%</span>
                    <span className="text-slate-400">Default: 25%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={weightsForm.product_fit}
                    onChange={(e) => setWeightsForm({ ...weightsForm, product_fit: Number(e.target.value) })}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-slate-200">Audience & Purchase Intent: {weightsForm.audience_intent}%</span>
                    <span className="text-slate-400">Default: 20%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={weightsForm.audience_intent}
                    onChange={(e) => setWeightsForm({ ...weightsForm, audience_intent: Number(e.target.value) })}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-slate-200">Location & Context Fit: {weightsForm.location_context}%</span>
                    <span className="text-slate-400">Default: 15%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    value={weightsForm.location_context}
                    onChange={(e) => setWeightsForm({ ...weightsForm, location_context: Number(e.target.value) })}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-slate-200">Event Relevance & Evidence: {weightsForm.event_relevance}%</span>
                    <span className="text-slate-400">Default: 15%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    value={weightsForm.event_relevance}
                    onChange={(e) => setWeightsForm({ ...weightsForm, event_relevance: Number(e.target.value) })}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-slate-200">Economics (Stall Fee vs Budget): {weightsForm.economics}%</span>
                    <span className="text-slate-400">Default: 15%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    value={weightsForm.economics}
                    onChange={(e) => setWeightsForm({ ...weightsForm, economics: Number(e.target.value) })}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-slate-200">Booking Readiness (Vendor Link/Form): {weightsForm.booking_readiness}%</span>
                    <span className="text-slate-400">Default: 10%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    value={weightsForm.booking_readiness}
                    onChange={(e) => setWeightsForm({ ...weightsForm, booking_readiness: Number(e.target.value) })}
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: API & INTEGRATIONS STATUS */}
          {activeTab === 'api' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Integration Status & Credentials</h4>

                {/* Google Maps JS API */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <div>
                    <div className="font-semibold text-slate-200">Google Maps JavaScript API</div>
                    <div className="text-[11px] text-slate-400">
                      Env: <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-amber-950 text-amber-400 border border-amber-900">
                    Running in Leaflet / OSM Fallback Mode
                  </span>
                </div>

                {/* Search Provider */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <div>
                    <div className="font-semibold text-slate-200">Web Discovery Search Provider</div>
                    <div className="text-[11px] text-slate-400">
                      Env: <code>TAVILY_API_KEY</code> or <code>SERPER_API_KEY</code>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-900">
                    Curated Delhi NCR Index Active
                  </span>
                </div>

                {/* Gemini API */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <div>
                    <div className="font-semibold text-slate-200">Gemini LLM Provider</div>
                    <div className="text-[11px] text-slate-400">
                      Env: <code>GEMINI_API_KEY</code>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-900">
                    Structured Intelligence Active
                  </span>
                </div>

                {/* Database */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <div>
                    <div className="font-semibold text-slate-200">Storage & Database</div>
                    <div className="text-[11px] text-slate-400">
                      Postgres / Supabase or persistent local JSON storage
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-900">
                    Active (Persistent File DB)
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-[11px] leading-relaxed">
                <strong className="text-slate-300 block mb-1">To connect live external production keys:</strong>
                Create or edit <code>.env.local</code> in the project root with your keys. See <code>.env.example</code> for the full list of supported environment variables.
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-800 bg-slate-950/80">
          <div>
            {saveSuccess && (
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Changes saved & events re-scored!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs shadow transition active:scale-95"
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
