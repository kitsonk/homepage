import { type ConnInfo, GA4Report, isDocument } from "@kitsonk/ga4";
import type { APIContext } from "astro";

// Sessions are keyed on the connection object, so the same remote address must
// always get the same conn object back.
const conns = new Map<string, ConnInfo>();

function getConn(context: APIContext): ConnInfo {
  let hostname: string;
  try {
    hostname = context.clientAddress;
  } catch {
    hostname = "0.0.0.0";
  }
  let conn = conns.get(hostname);
  if (!conn) {
    conn = { remoteAddr: { transport: "tcp", hostname, port: 0 } };
    conns.set(hostname, conn);
  }
  return conn;
}

export const onRequest = async (context: APIContext, next: () => Promise<Response>) => {
  const request = context.request;
  const response = await next();
  queueMicrotask(async () => {
    if (!isDocument(request, response)) {
      return;
    }
    const report = new GA4Report({ request, response, conn: getConn(context) });
    await report.send();
  });
  return response;
};
