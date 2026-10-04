import { Google } from "arctic";

const redirectURI =
  import.meta.env.PROD
    ? "https://example.com/login/google/callback"
    : "http://localhost:4321/login/google/callback";

export const google = new Google(
  import.meta.env.GOOGLE_CLIENT_ID,
  import.meta.env.GOOGLE_CLIENT_SECRET,
  redirectURI
);
