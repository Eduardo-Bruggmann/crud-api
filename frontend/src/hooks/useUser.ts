"use client";

import { useCallback, useState } from "react";
import { User, UpdateUserDTO } from "@/types/user";
import * as userService from "@/services/userService";
import { useAuth } from "@/hooks/useAuth";

export function useUser() {
  const { setUser: setAuthUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [publicUsers, setPublicUsers] = useState<User[]>([]);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUser = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const fetchedUser = await userService.getUser();
      setUser(fetchedUser);
      setAuthUser(fetchedUser);
      return fetchedUser;
    } catch (err: any) {
      setError(err.message || "Failed to fetch user");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const listPublicUsers = useCallback(
    async (requestedPage = 1, query = "") => {
      setLoading(true);
      setError(null);

      try {
        const {
          page,
          limit: responseLimit,
          total,
          totalPages,
          users,
        } = await userService.listPublicUsers(requestedPage, limit, query);

        setPublicUsers(users);
        setPage(page);
        setLimit(responseLimit);
        setTotal(total);
        setTotalPages(totalPages);
        setSearch(query);

        return users;
      } catch (err: any) {
        setError(err.message || "Failed to fetch public users");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [limit]
  );

  const updateUser = useCallback(async (data: UpdateUserDTO | FormData) => {
    setLoading(true);
    setError(null);

    try {
      const updatedUser = await userService.updateUser(data);
      setUser(updatedUser);
      return updatedUser;
    } catch (err: any) {
      setError(err.message || "Failed to update user");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await userService.deleteUser();
      setUser(null);
      setAuthUser(null);
    } catch (err: any) {
      setError(err.message || "Failed to delete user");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    publicUsers,
    page,
    limit,
    total,
    totalPages,
    search,
    loading,
    error,
    getUser,
    listPublicUsers,
    updateUser,
    deleteUser,
  };
}
