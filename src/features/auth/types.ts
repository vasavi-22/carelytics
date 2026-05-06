export type AuthStatus = "loading" | "authenticated" | "unauthenticated" | "error";

export type SignInResult = {
  ok: true;
} | {
  ok: false;
  message: string;
};

