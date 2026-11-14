import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api';
import type { BlogPost, VideoItem } from '@digikhojindia/types';
import { FileText, Video, Plus } from 'lucide-react';

export const CmsView: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'videos'>('posts');
  const [loading, setLoading] = useState(true);

  // New Post Modal
  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    slug: '',
    short_description: '',
    content: '<p>Article content goes here...</p>',
    category: 'Technology News',
    author_name: 'Naman Mishra',
    is_published: true,
  });

  const fetchData = () => {
    setLoading(true);
    Promise.all([apiRequest('/cms/posts'), apiRequest('/cms/videos')])
      .then(([pRes, vRes]) => {
        setPosts(pRes.posts || []);
        setVideos(vRes.videos || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/cms/posts', {
        method: 'POST',
        body: JSON.stringify(newPost),
      });
      setShowModal(false);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Website CMS & Publishing</h2>
          <p className="text-xs text-slate-500">Manage technical blog articles, product videos, and tutorials</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-3 py-1 rounded text-xs font-semibold ${
                activeTab === 'posts' ? 'bg-white shadow text-slate-900' : 'text-slate-600'
              }`}
            >
              Articles ({posts.length})
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-3 py-1 rounded text-xs font-semibold ${
                activeTab === 'videos' ? 'bg-white shadow text-slate-900' : 'text-slate-600'
              }`}
            >
              Videos ({videos.length})
            </button>
          </div>
          {activeTab === 'posts' && (
            <button
              onClick={() => setShowModal(true)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow flex items-center gap-1"
            >
              <Plus size={14} />
              <span>New Article</span>
            </button>
          )}
        </div>
      </div>

      {activeTab === 'posts' ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase">
              <tr>
                <th className="p-3.5 border-b border-slate-200">Article Title</th>
                <th className="p-3.5 border-b border-slate-200">Category</th>
                <th className="p-3.5 border-b border-slate-200">Author</th>
                <th className="p-3.5 border-b border-slate-200">Status</th>
                <th className="p-3.5 border-b border-slate-200">Published Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {posts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50">
                  <td className="p-3.5">
                    <p className="font-semibold text-slate-900">{p.title}</p>
                    <p className="text-[11px] text-slate-400 font-mono">/blog/{p.slug}</p>
                  </td>
                  <td className="p-3.5 text-slate-600">{p.category}</td>
                  <td className="p-3.5 text-slate-700 font-medium">{p.author_name}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Published
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-500">{p.published_at || 'Just now'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((v) => (
            <div key={v.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
              <span className="text-[10px] font-bold text-blue-600 uppercase">{v.category}</span>
              <h3 className="text-sm font-bold text-slate-900">{v.title}</h3>
              <p className="text-xs text-slate-500">{v.description}</p>
              <div className="pt-2 text-xs font-mono text-slate-400">YouTube ID: {v.youtube_video_id}</div>
            </div>
          ))}
        </div>
      )}

      {/* NEW ARTICLE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Publish Technical Article</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleCreatePost} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  value={newPost.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    setNewPost({ ...newPost, title, slug });
                  }}
                  placeholder="e.g. Optimizing Laboratory HL7 Interfaces in Modern HMIS"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={newPost.slug}
                    onChange={(e) => setNewPost({ ...newPost, slug: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  >
                    <option value="Hospital IT">Hospital IT</option>
                    <option value="Automation">Automation</option>
                    <option value="Technology News">Technology News</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Short Description *</label>
                <textarea
                  rows={2}
                  required
                  value={newPost.short_description}
                  onChange={(e) => setNewPost({ ...newPost, short_description: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Article Content (HTML/Markdown) *</label>
                <textarea
                  rows={4}
                  required
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold shadow"
                >
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

