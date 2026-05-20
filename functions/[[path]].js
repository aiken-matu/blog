export async function onRequest(context) {
  const envKeys = Object.keys(context.env).join(', ') || 'none';
  const hasAssets = !!context.env.ASSETS;

  if (!hasAssets) {
    return new Response(
      'ASSETS not bound. env keys: ' + envKeys,
      { status: 503, headers: { 'Content-Type': 'text/plain' } }
    );
  }

  try {
    return await context.env.ASSETS.fetch(context.request);
  } catch (e) {
    return new Response(
      'fetch error: ' + e.message,
      { status: 503, headers: { 'Content-Type': 'text/plain' } }
    );
  }
}
