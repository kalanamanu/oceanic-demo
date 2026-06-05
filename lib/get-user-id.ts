export const getUserId = (): string | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem("user_data");
    if (!raw) return null;

    const user = JSON.parse(raw);
    return user?.id || null;
  } catch {
    return null;
  }
};