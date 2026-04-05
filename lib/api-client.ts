import { supabase } from './supabase';
import { Product, Category } from './data';
import { cache } from 'react';

// Production API Client with Extreme Performance Caching
export const getActiveProducts = cache(async (
  filters?: { category?: string; query?: string; limit?: number }
) => {
  let query = supabase
    .from('products')
    .select('*, categories(*)')
    .eq('status', 'active');

  if (filters?.category && filters.category !== 'all') {
    query = query.eq('category_id', filters.category);
  }

  if (filters?.query) {
    // Using full text search index from migration
    query = query.textSearch('fts', filters.query);
  }

  const { data, error } = await query
    .order('is_featured', { ascending: false })
    .limit(filters?.limit || 100);

  if (error) {
    console.error('API_ERROR:', error);
    return [];
  }

  return data as unknown as Product[];
});

export const getFeaturedCategories = cache(async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) return [];
  return data as unknown as Category[];
});

// Implementation of high-concurrency safe order stock check
export const checkStockAvailability = async (items: { id: string; qty: number }[]) => {
  const { data, error } = await supabase
    .rpc('check_inventory_availability', { item_requests: items });
  
  if (error) throw new Error('Inventory check failed');
  return data;
};

// Next.js High Performance revalidation logic
export const REVALIDATE_TIME = 3600; // 1 hour for product data cache
