import app from "../src/server/server";

export default function handler(req, res) {
  return app(req, res); // Let Express handle the request directly
}