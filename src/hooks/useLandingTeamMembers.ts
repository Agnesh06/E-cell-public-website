import { useState, useEffect, useCallback } from "react";
import { TeamMember, defaultTeamMembers } from "@/components/team/TeamSection";

interface ApiMember {
  id?: string;
  name?: string;
  role?: string;
  position?: string;
  image?: string;
  photo?: string;
  vertical?: string;
  yearAndClass?: string;
}

/**
 * Custom hook to dynamically fetch landing page team members from Google Sheets backend API.
 * Follows the csea/src/components/MemberFinder/useSheetMembers.js pattern.
 */
export function useLandingTeamMembers() {
  const [members, setMembers] = useState<TeamMember[]>(defaultTeamMembers);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Skip network request if mock mode is explicitly turned on
    if (import.meta.env.VITE_USE_MOCK_API === "true") {
      setMembers(defaultTeamMembers);
      setLoading(false);
      return;
    }

    try {
      const rawBase =
        import.meta.env.VITE_API_BASE_URL ||
        import.meta.env.VITE_API_URL ||
        "http://127.0.0.1:5000/api";

      const base = rawBase.replace(/\/+$/, "");
      // Support base URLs that end with /api or root
      const endpoint = base.endsWith("/api") ? `${base}/members` : `${base}/api/members`;

      const res = await fetch(endpoint);
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = await res.json();
      if (Array.isArray(data.members) && data.members.length > 0) {
        const mapped: TeamMember[] = data.members.map((m: ApiMember) => ({
          name: m.name || "",
          role: m.role || m.position || "",
          image: m.image || m.photo || "",
        }));
        setMembers(mapped);
      } else {
        setMembers(defaultTeamMembers);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load members";
      // Graceful fallback to default members so the landing carousel continues to look great
      console.warn("[useLandingTeamMembers] Backend unavailable:", msg);
      setError(msg);
      setMembers(defaultTeamMembers);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { members, loading, error, refetch: load };
}
