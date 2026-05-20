export async function onRequest({ request, env }) {
  return env.ASSETS.fetch(request);
}
