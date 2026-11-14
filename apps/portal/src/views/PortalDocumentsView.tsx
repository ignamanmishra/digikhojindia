import React, { useState } from 'react';
import { FileDown, FileText, Shield, HardDrive, BookOpen, CheckCircle, Upload, Eye } from 'lucide-react';
import { formatDate } from '@digikhojindia/shared';

interface DocumentItem {
  id: string;
  title: string;
  category: 'Contract' | 'Manual' | 'Security' | 'Certificate';
  version: string;
  file_size: string;
  updated_at: string;
  description: string;
}

export const PortalDocumentsView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const documents: DocumentItem[] = [
    {
      id: 'DOC-SLA-2026',
      title: 'Master Service Level Agreement (SLA) & AMC Contract',
      category: 'Contract',
      version: 'v2.4',
      file_size: '1.4 MB',
      updated_at: new Date().toISOString(),
      description: 'Official signed SLA agreement outlining 99.9% uptime commitments, P1/P2/P3 escalation matrix, and Lifetime Free AMC terms.',
    },
    {
      id: 'DOC-HMIS-USER-GUIDE',
      title: 'Hospital Management Information System (HMIS) User Manual',
      category: 'Manual',
      version: 'v3.1',
      file_size: '4.8 MB',
      updated_at: new Date().toISOString(),
      description: 'Complete end-user documentation for OPD, IPD, Billing, Laboratory Information System (LIS), and Pharmacy dispensing.',
    },
    {
      id: 'DOC-SEC-AUDIT',
      title: 'Cloudflare Zero-Trust Security & Data Protection Compliance',
      category: 'Security',
      version: 'v1.2',
      file_size: '890 KB',
      updated_at: new Date().toISOString(),
      description: 'Technical report on tenant data isolation, encrypted backups, Argon2id/PBKDF2 authentication, and TLS 1.3 compliance.',
    },
    {
      id: 'DOC-AMC-CERT',
      title: 'Annual Maintenance Contract Certificate (Lifetime Free Eligible)',
      category: 'Certificate',
      version: 'v2026',
      file_size: '620 KB',
      updated_at: new Date().toISOString(),
      description: 'Certified verification of active maintenance coverage for HMIS core software and database monitoring routines.',
    },
    {
      id: 'DOC-SOP-BACKUP',
      title: 'Disaster Recovery and Local Database Sync SOP',
      category: 'Security',
      version: 'v2.0',
      file_size: '1.1 MB',
      updated_at: new Date().toISOString(),
      description: 'Standard Operating Procedure for automatic nightly exports, offline synchronization, and emergency recovery drills.',
    },
  ];

  const filteredDocs = activeCategory === 'all'
    ? documents
    : documents.filter((d) => d.category.toLowerCase() === activeCategory.toLowerCase());

  const handleDownload = (doc: DocumentItem) => {
    setDownloadSuccess(`Downloaded "${doc.title}" successfully.`);
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header and Upload banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white">Authorized Customer Documents</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Access certified copies of your Service Agreements, Lifetime AMC commitments, operational guides, and compliance documentation.
          </p>
        </div>
        <button
          onClick={() => alert('Document upload portal: Please select your signed document or compliance certificate to submit to Digikhojindia.')}
          className="px-4 py-2 rounded-xl bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/20 text-xs font-semibold flex items-center gap-2 transition-all shrink-0"
        >
          <Upload size={15} /> Upload Signed Document
        </button>
      </div>

      {downloadSuccess && (
        <div className="bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
          <CheckCircle size={15} className="text-emerald-400" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs">
        {['all', 'Contract', 'Manual', 'Security', 'Certificate'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all capitalize ${
              activeCategory === cat
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {cat === 'all' ? 'All Documents' : cat}
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                  {doc.id}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  {doc.category} • {doc.version}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mt-3 leading-snug">{doc.title}</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{doc.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">Size: {doc.file_size}</span>
              <button
                onClick={() => handleDownload(doc)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <FileDown size={14} /> Download Document
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
