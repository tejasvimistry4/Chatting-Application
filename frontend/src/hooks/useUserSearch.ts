import { useEffect, useState } from "react";

import { searchUsers } from "..//services/user.service";

import { User } from "../types/auth";

import { useDebounce } from "../hooks/useDebounce";

export const useUserSearch = (search: string) => {
  const [users, setUsers] = useState<User[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const debouncedSearch = useDebounce(search.trim(), 400);

  useEffect(() => {
    let cancelled = false;

    const executeSearch = async () => {
      if (debouncedSearch.length < 2) {
        setUsers([]);
        setError("");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await searchUsers(debouncedSearch);

        if (!cancelled) {
          setUsers(response.data.items);
        }
      } catch {
        if (!cancelled) {
          setError("Unable to search users.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    executeSearch();

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch]);

  return {
    users,
    loading,
    error,
  };
};
