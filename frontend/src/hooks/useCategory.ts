"use client";

import { useCallback, useState } from "react";
import * as categoryService from "@/services/categoryService";
import { Category } from "@/types/category";

export function useCategory() {
  const [category, setCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCategory = useCallback(async (name: string) => {
    setLoading(true);
    setError(null);

    try {
      const createdCategory = await categoryService.createCategory(name);

      setCategories((prev) => [...prev, createdCategory]);
      return createdCategory;
    } catch (err: any) {
      setError(err.message || "Failed to create category");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCategory = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const fetchedCategory = await categoryService.getCategory(id);
      setCategory(fetchedCategory);
      return fetchedCategory;
    } catch (err: any) {
      setError(err.message || "Failed to fetch category");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const listCategories = useCallback(
    async (requestedPage = page, query = search) => {
      setLoading(true);
      setError(null);

      try {
        const {
          page,
          limit: fetchedLimit,
          total,
          totalPages,
          categories,
        } = await categoryService.listCategories(requestedPage, limit, query);

        setCategories(categories);
        setPage(page);
        setLimit(fetchedLimit);
        setTotal(total);
        setTotalPages(totalPages);
        setSearch(query);

        return categories;
      } catch (err: any) {
        setError(err.message || "Failed to fetch categories");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [limit, page, search]
  );

  const updateCategory = useCallback(async (data: Category) => {
    setLoading(true);
    setError(null);

    try {
      const updatedCategory = await categoryService.updateCategory(data);

      setCategory(updatedCategory);
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === updatedCategory.id ? updatedCategory : cat
        )
      );

      return updatedCategory;
    } catch (err: any) {
      setError(err.message || "Failed to update category");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCategory = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      await categoryService.deleteCategory(id);

      setCategory(null);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete category");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    category,
    categories,
    page,
    limit,
    total,
    totalPages,
    search,
    loading,
    error,
    createCategory,
    getCategory,
    listCategories,
    updateCategory,
    deleteCategory,
  };
}
