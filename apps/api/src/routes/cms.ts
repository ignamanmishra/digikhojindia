/**
 * DIGIKHOJINDIA CMS & PUBLISHING ENDPOINTS
 * Blog posts, Tutorials, Videos, and Dynamic Software Portfolio
 * Owner: Naman Mishra
 */

import { Hono } from 'hono';
import { globalStore } from '../db';
import { blogPostSchema, videoSchema } from '@digikhojindia/validation';
import { authMiddleware, type Env, type Variables } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import type { BlogPost, VideoItem } from '@digikhojindia/types';

export const cmsRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

// 1. PUBLIC READ ENDPOINTS (For Public SEO Website)
// Get All Published Blog Posts
cmsRoutes.get('/posts', async (c) => {
  const category = c.req.query('category');
  let list = Array.from(globalStore.blogPosts.values()).filter((p) => p.is_published);

  if (category) {
    list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  return c.json({ success: true, posts: list, total: list.length });
});

// Get Single Blog Post by Slug
cmsRoutes.get('/posts/:slug', async (c) => {
  const slug = c.req.param('slug');
  const post = globalStore.blogPosts.get(slug);

  if (!post || !post.is_published) {
    return c.json({ success: false, error: 'Article not found' }, 404);
  }

  return c.json({ success: true, post });
});

// Get Published Videos
cmsRoutes.get('/videos', async (c) => {
  const list = Array.from(globalStore.videos.values()).filter((v) => v.is_published);
  return c.json({ success: true, videos: list, total: list.length });
});

// Get Software Portfolio Catalog (All sample products marked as sample/demo)
cmsRoutes.get('/software', async (c) => {
  const category = c.req.query('category');
  let list = Array.from(globalStore.softwareProducts.values()).filter((p) => p.is_public);

  if (category) {
    list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  return c.json({ success: true, products: list, total: list.length });
});

// 2. PROTECTED CMS WRITE ENDPOINTS (Admin only)
cmsRoutes.post('/posts', authMiddleware, requirePermission('cms:write'), async (c) => {
  try {
    const body = await c.req.json();
    const parsed = blogPostSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ success: false, error: parsed.error.errors[0].message }, 400);
    }

    const data = parsed.data;
    const newPost: BlogPost = {
      id: `post-${Date.now()}`,
      title: data.title,
      slug: data.slug,
      short_description: data.short_description,
      content: data.content,
      featured_image: data.featured_image || null,
      category: data.category,
      tags: data.tags || [],
      author_name: data.author_name,
      is_published: data.is_published || false,
      published_at: data.is_published ? new Date().toISOString() : null,
      seo_title: data.seo_title || null,
      meta_description: data.meta_description || null,
      canonical_url: data.canonical_url || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    globalStore.blogPosts.set(data.slug, newPost);

    return c.json({ success: true, message: 'Article saved successfully', post: newPost }, 201);
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// Add Video
cmsRoutes.post('/videos', authMiddleware, requirePermission('cms:write'), async (c) => {
  try {
    const body = await c.req.json();
    const parsed = videoSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ success: false, error: parsed.error.errors[0].message }, 400);
    }

    const data = parsed.data;
    const newVideo: VideoItem = {
      id: `vid-${Date.now()}`,
      title: data.title,
      slug: data.slug,
      description: data.description,
      youtube_video_id: data.youtube_video_id,
      category: data.category,
      is_published: data.is_published,
      created_at: new Date().toISOString(),
    };

    globalStore.videos.set(data.slug, newVideo);

    return c.json({ success: true, message: 'Video tutorial saved', video: newVideo }, 201);
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});
