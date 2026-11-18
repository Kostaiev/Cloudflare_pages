function jsonResponse(
  body,
  {
    status = 200,
    requestId,
    headers = {},
  } = {},
) {
  const responseHeaders =
    new Headers(headers);

  responseHeaders.set(
    "content-type",
    "application/json; charset=utf-8",
  );

  responseHeaders.set(
    "cache-control",
    "no-store",
  );

  responseHeaders.set(
    "x-content-type-options",
    "nosniff",
  );

  responseHeaders.set(
    "referrer-policy",
    "strict-origin-when-cross-origin",
  );

  if (requestId) {
    responseHeaders.set(
      "x-request-id",
      requestId,
    );
  }

  return new Response(
    JSON.stringify(body),
    {
      status,
      headers: responseHeaders,
    },
  );
}

export async function onRequest(
  context,
) {
  const {
    request,
    env,
  } = context;

  const requestId =
    request.headers.get("cf-ray") ??
    crypto.randomUUID();

  if (request.method !== "GET") {
    return jsonResponse(
      {
        error: {
          code: "METHOD_NOT_ALLOWED",
          message:
            "This endpoint supports GET only",
        },
      },
      {
        status: 405,
        requestId,
        headers: {
          allow: "GET",
        },
      },
    );
  }

  const url = new URL(request.url);

  const body = {
    status: "ok",

    application: env.APP_NAME,
    environment: env.APP_ENV,
    release: env.RELEASE,

    deploymentUrl: url.origin,

    timestamp:
      new Date().toISOString(),

    requestId,

    cloudflare: {
      colo:
        request.cf?.colo ?? "local",

      country:
        request.cf?.country ?? "local",

      httpProtocol:
        request.cf?.httpProtocol ?? null,
    },
  };

  console.log(
    JSON.stringify({
      level: "info",
      event: "pages.status.request",
      requestId,
      environment: env.APP_ENV,
      colo: body.cloudflare.colo,
      timestamp: body.timestamp,
    }),
  );

  return jsonResponse(
    body,
    {
      requestId,
    },
  );
}
