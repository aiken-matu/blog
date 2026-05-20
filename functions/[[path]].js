export async function onRequest(context) {
  try {
    const response = await context.env.ASSETS.fetch(context.request);
    return response;
  } catch (e) {
    return new Response(
      'ASSETS Error: ' + e.constructor.name + ': ' + e.message,
      { status: 503, headers: { 'Content-Type': 'text/plain' } }
    );
  }
}
