export type UserRole = "admin" | "requester";

export const USER_ROLE_STORAGE_KEY = "userRole";

export function getStoredUserRole(): UserRole | null {
  if (typeof window === "undefined") {
    return null;
  }

  const role = window.localStorage.getItem(USER_ROLE_STORAGE_KEY);
  if (role === "admin" || role === "requester") {
    return role;
  }

  return null;
}

export function setStoredUserRole(role: UserRole) {
  window.localStorage.setItem(USER_ROLE_STORAGE_KEY, role);
}

export function getUserRoleLabel(role: UserRole | null): string {
  if (role === "requester") {
    return "Requester";
  }
  return "Admin";
}
