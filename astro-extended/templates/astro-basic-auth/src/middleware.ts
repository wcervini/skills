import { defineMiddleware } from "astro:middleware";
import { validateSessionToken, deleteSessionTokenCookie } from "./lib/session";

const PROTECTED = [/^\/dashboard(\/.*)?$/];

export const onRequest = defineMiddleware(async (context, next) => {
  const token = context.cookies.get("session")?.value ?? null;
  if (!token) {
    context.locals.user = null;
    if (PROTECTED.some((re) => re.test(context.url.pathname))) {
      return context.redirect("/login");
    }
    return next();
  }

  const { session, user } = await validateSessionToken(token);
  if (!session) {
    deleteSessionTokenCookie(context);
    context.locals.user = null;
    if (PROTECTED.some((re) => re.test(context.url.pathname))) {
      return context.redirect("/login");
    }
    return next();
  }

  context.locals.user = user;
  context.locals.session = session;
  return next();
});
