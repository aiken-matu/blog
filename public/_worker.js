export default {
  async fetch(request, env) {
    if (!env.ASSETS) {
      return new Response(
        'ASSETS not bound. env keys: ' + Object.keys(env).join(', '),
        { status: 503, headers: { 'Content-Type': 'text/plain' } }
      );
    }
    try {
      const response = await env.ASSETS.fetch(request);
      if (response.status >= 500) {
        return new Response(
          'ASSETS returned status: ' + response.status + '\nURL: ' + request.url,
          { status: 503, headers: { 'Content-Type': 'text/plain' } }
        );
      }
      return response;
    } catch (e) {
      return new Response(
        'ASSETS Error: ' + e.constructor.name + ': ' + e.message,
        { status: 503, headers: { 'Content-Type': 'text/plain' } }
      );
    }
  }
};
