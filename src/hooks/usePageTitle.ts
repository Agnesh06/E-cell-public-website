import { useEffect } from "react";

export function usePageTitle(title: string) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title ? `${title} | PSG Tech E-Cell` : "PSG Tech E-Cell";
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
}
