const rateLimit = {};
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS = 5;

const MAX_RETRIES = 4;
const TIMEOUT_MS = 7000;
const LAMBDA_TIMEOUT = 9000;
const RETRY_DELAY = 800;

export const handler = async (event) => {
  const startTime = Date.now();
  const url = "https://raw.githubusercontent.com/null090090/-/main/%E3%83%87%E3%83%BC%E3%82%BF%E3%83%99%E3%83%BC%E3%82%B9/data.json";

  const ip = event.headers["x-forwarded-for"] || event.requestContext?.identity?.sourceIp || "unknown";
  const now = Date.now();

  if (!rateLimit[ip]) {
    rateLimit[ip] = { requests: 1, lastRequest: now };
  } else {
    const timeSinceLastRequest = now - rateLimit[ip].lastRequest;
    if (timeSinceLastRequest > RATE_LIMIT_WINDOW) {
      rateLimit[ip].requests = 1;
      rateLimit[ip].lastRequest = now;
    } else {
      rateLimit[ip].requests++;
    }
  }

  if (rateLimit[ip].requests > MAX_REQUESTS) {
    return {
      statusCode: 429,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ error: "Rate limit exceeded" })
    };
  }

  if (Date.now() - startTime > LAMBDA_TIMEOUT) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Process timeout exceeded" })
    };
  }

  try {
    const response = await fetch(url, { timeout: TIMEOUT_MS });

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: `Gagal mengambil data. Status: ${response.status}` })
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Gagal mengambil data", detail: error.message })
    };
  }
};
