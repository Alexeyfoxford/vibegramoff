/**
 * VibeGram Cloudflare Worker + D1
 * ----------------------------
 * Deploy:
 * 1) wrangler d1 create vibegram
 * 2) wrangler d1 execute vibegram --file=./public/vibegram-schema.sql
 * 3) wrangler deploy
 *
 * Binds in wrangler.toml:
 * [[d1_databases]]
 * binding = "DB"
 * database_name = "vibegram"
 * database_id = "xxxx"
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });

    try {
      // Simple REST: POST /query {sql, params, token}
      if (url.pathname === '/query' && request.method === 'POST') {
        const { sql, params = [] } = await request.json();
        // In production: verify Authorization bearer token!
        const stmt = env.DB.prepare(sql).bind(...params);
        const isSelect = /^\s*select/i.test(sql);
        const result = isSelect ? await stmt.all() : await stmt.run();
        return Response.json({ ok: true, result }, { headers: cors });
      }

      // /auth {username, password_hash}
      if (url.pathname === '/auth' && request.method === 'POST') {
        const { username, password_hash } = await request.json();
        const user = await env.DB.prepare('SELECT * FROM users WHERE username = ? AND password_hash = ?')
          .bind(username, password_hash).first();
        return Response.json({ ok: !!user, user }, { headers: cors });
      }

      return Response.json({ ok: true, name: 'VibeGram D1 API', version: '1.0' }, { headers: cors });
    } catch (e) {
      return Response.json({ ok: false, error: String(e) }, { status: 500, headers: cors });
    }
  }
}
