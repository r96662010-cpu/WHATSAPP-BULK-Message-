import React, { useState } from 'react';
import { BroadcastTemplate, BroadcastButton } from '../../types';
import {
  TEMPLATE_CATEGORIES,
  AVAILABLE_VARIABLES,
} from '../../data/whatsappTemplates';
import {
  Layers,
  Search,
  Plus,
  Check,
  Copy,
  Trash2,
  Sparkles,
  ExternalLink,
  Phone,
  MessageSquare,
  BookmarkPlus,
  Tag,
  Download,
  Upload,
} from 'lucide-react';

interface TemplateManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: BroadcastTemplate[];
  selectedTemplateId: string;
  onSelectTemplate: (template: BroadcastTemplate) => void;
  onSaveNewTemplate: (template: BroadcastTemplate) => void;
  onDeleteTemplate?: (id: string) => void;
}

export const TemplateManagerModal: React.FC<TemplateManagerModalProps> = ({
  isOpen,
  onClose,
  templates,
  selectedTemplateId,
  onSelectTemplate,
  onSaveNewTemplate,
  onDeleteTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Template Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<string>('Custom');
  const [newDescription, setNewDescription] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newButtons, setNewButtons] = useState<BroadcastButton[]>([
    { id: 'btn-1', type: 'url', text: '🔗 View Offer (URL)', value: 'https://shrishyam.edu' },
    { id: 'btn-2', type: 'quick_reply', text: '💬 Interested, Tell Me More' },
  ]);

  if (!isOpen) return null;

  // Filter templates
  const filteredTemplates = templates.filter((tmpl) => {
    const matchesCategory =
      selectedCategory === 'All' || tmpl.category === selectedCategory;
    const matchesSearch =
      tmpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tmpl.tags && tmpl.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  // Handle variable insert into new template body
  const handleInsertVariable = (tag: string) => {
    setNewBody((prev) => `${prev} ${tag}`);
  };

  // Add new button in form
  const handleAddButton = () => {
    if (newButtons.length >= 3) return;
    setNewButtons((prev) => [
      ...prev,
      {
        id: `btn-${Date.now()}`,
        type: 'quick_reply',
        text: '👉 Click Here',
      },
    ]);
  };

  // Remove button
  const handleRemoveButton = (id: string) => {
    setNewButtons((prev) => prev.filter((b) => b.id !== id));
  };

  // Update button field
  const handleUpdateButton = (id: string, updates: Partial<BroadcastButton>) => {
    setNewButtons((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  // Save new template
  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) return;

    // Detect variables used in body
    const detectedVars: string[] = [];
    AVAILABLE_VARIABLES.forEach((v) => {
      if (newBody.includes(v.tag) && !detectedVars.includes(v.tag)) {
        detectedVars.push(v.tag);
      }
    });

    const newTemplate: BroadcastTemplate = {
      id: `tmpl-custom-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      description: newDescription.trim() || 'Custom created broadcast template',
      body: newBody.trim(),
      buttons: newButtons,
      variables: detectedVars.length > 0 ? detectedVars : ['{{name}}'],
      tags: ['Custom', newCategory],
    };

    onSaveNewTemplate(newTemplate);
    onSelectTemplate(newTemplate);
    setIsCreatingNew(false);
    setNewTitle('');
    setNewBody('');
    setNewDescription('');
  };

  // Copy template body
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Export templates as JSON
  const handleExportTemplates = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(templates, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'whatsapp_templates_pack.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                WhatsApp Broadcast Templates Library
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono">
                  {templates.length} Templates Available
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                High-converting copy, interactive CTAs, anti-ban structures, and custom variable tags.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportTemplates}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
              title="Export all templates as JSON"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={() => setIsCreatingNew(!isCreatingNew)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition"
            >
              <Plus className="w-4 h-4" />
              <span>{isCreatingNew ? 'Browse Templates' : 'Create Template'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content Body */}
        {isCreatingNew ? (
          /* Create New Template Form */
          <form onSubmit={handleSaveSubmit} className="p-6 overflow-y-auto space-y-5">
            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BookmarkPlus className="w-5 h-5 text-indigo-400" />
                <div>
                  <h4 className="text-xs font-bold text-white">Create Custom High-Converting Broadcast Template</h4>
                  <p className="text-[11px] text-slate-400">
                    Define copy with interactive dynamic placeholders and up to 3 WhatsApp action buttons.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                Auto-saved in Workspace
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Template Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 🎯 Black Friday VIP Automation Pass"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Category *
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Masterclass">Masterclass & Training</option>
                  <option value="Recruitment">Recruitment & Staffing</option>
                  <option value="Special Announcement">Special Announcement / Offers</option>
                  <option value="Event">Webinar & Events</option>
                  <option value="FollowUp">Follow-up & Customer Care</option>
                  <option value="Billing">Invoicing & Renewals</option>
                  <option value="Media">YouTube & Media</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Short Description
              </label>
              <input
                type="text"
                placeholder="e.g. Targeted at cold founders offering 1-on-1 strategy audit with Calendly link"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Dynamic Placeholders Toolbar */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Message Body & Formatting *
                </label>
                <span className="text-[11px] text-slate-400">
                  Tip: Use <code className="text-emerald-400">*bold*</code>, <code className="text-emerald-400">_italic_</code>, <code className="text-emerald-400">~strike~</code>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 mb-2 p-2 bg-slate-950/80 rounded-xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Insert Variable:</span>
                {AVAILABLE_VARIABLES.map((v) => (
                  <button
                    key={v.tag}
                    type="button"
                    onClick={() => handleInsertVariable(v.tag)}
                    className="px-2 py-0.5 rounded bg-indigo-900/40 hover:bg-indigo-800/60 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono transition"
                  >
                    + {v.tag}
                  </button>
                ))}
              </div>

              <textarea
                required
                rows={7}
                placeholder={`Hi {{name}},\n\nExciting news for {{company}}! We are releasing...`}
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 font-sans leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Attached Interactive Buttons */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-300">
                  Interactive WhatsApp Buttons ({newButtons.length} / 3)
                </label>
                {newButtons.length < 3 && (
                  <button
                    type="button"
                    onClick={handleAddButton}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Button</span>
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {newButtons.map((btn, index) => (
                  <div
                    key={btn.id}
                    className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center gap-2"
                  >
                    <span className="text-[10px] font-mono px-2 py-1 bg-slate-800 text-slate-300 rounded">
                      #{index + 1}
                    </span>
                    <select
                      value={btn.type}
                      onChange={(e) =>
                        handleUpdateButton(btn.id, {
                          type: e.target.value as 'url' | 'call' | 'quick_reply',
                        })
                      }
                      className="px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    >
                      <option value="url">URL Link</option>
                      <option value="call">Phone Call</option>
                      <option value="quick_reply">Quick Reply</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Button Label (e.g. 🔗 Enroll Now)"
                      value={btn.text}
                      onChange={(e) => handleUpdateButton(btn.id, { text: e.target.value })}
                      className="flex-1 px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    />

                    {btn.type !== 'quick_reply' && (
                      <input
                        type="text"
                        placeholder={btn.type === 'url' ? 'https://...' : '+91...'}
                        value={btn.value || ''}
                        onChange={(e) => handleUpdateButton(btn.id, { value: e.target.value })}
                        className="flex-1 px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono"
                      />
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemoveButton(btn.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition"
                      title="Remove button"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/25 transition"
              >
                Save & Use Template
              </button>
            </div>
          </form>
        ) : (
          /* Browse Existing Templates */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Filter and Search Bar */}
            <div className="p-4 border-b border-slate-800 bg-slate-950/40 space-y-3">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search templates by title, keyword, or tag..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {TEMPLATE_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Templates Grid */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTemplates.map((tmpl) => {
                const isSelected = selectedTemplateId === tmpl.id;
                return (
                  <div
                    key={tmpl.id}
                    className={`p-4 rounded-2xl border transition flex flex-col justify-between group ${
                      isSelected
                        ? 'bg-indigo-950/20 border-indigo-500 ring-1 ring-indigo-500'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-500/15 text-indigo-300">
                            {tmpl.category}
                          </span>
                          {tmpl.tags &&
                            tmpl.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="px-1.5 py-0.5 rounded text-[9px] bg-slate-800 text-slate-400"
                              >
                                #{tag}
                              </span>
                            ))}
                        </div>

                        {isSelected && (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                            <Check className="w-3.5 h-3.5" /> Active
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-white mb-1 group-hover:text-indigo-300 transition">
                        {tmpl.title}
                      </h3>

                      {tmpl.description && (
                        <p className="text-[11px] text-slate-400 mb-2.5 line-clamp-2">
                          {tmpl.description}
                        </p>
                      )}

                      {/* Body Preview */}
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed font-sans max-h-32 overflow-y-auto whitespace-pre-line mb-3">
                        {tmpl.body}
                      </div>

                      {/* Buttons preview */}
                      {tmpl.buttons && tmpl.buttons.length > 0 && (
                        <div className="space-y-1 mb-3">
                          {tmpl.buttons.map((btn) => (
                            <div
                              key={btn.id}
                              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-medium text-cyan-400 flex items-center justify-between"
                            >
                              <span>{btn.text}</span>
                              <span className="text-slate-500 text-[9px] capitalize">
                                {btn.type.replace('_', ' ')}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopy(tmpl.body, tmpl.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 transition"
                          title="Copy message body"
                        >
                          {copiedId === tmpl.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-400" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>

                        {onDeleteTemplate && tmpl.id.startsWith('tmpl-custom') && (
                          <button
                            type="button"
                            onClick={() => onDeleteTemplate(tmpl.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition"
                            title="Delete template"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onSelectTemplate(tmpl);
                          onClose();
                        }}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{isSelected ? 'Currently Applied' : 'Use This Template'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
