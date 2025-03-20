import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { path, secret } = req.query as { path: string; secret: string };

    if (secret !== process.env.MY_SECRET_TOKEN) {
      return res.status(401).json({ message: "Invalid token" });
    }

    if (!path) {
      return res.status(400).json({ message: "invalid path" });
    }

    try {
      await res.revalidate(path);
      return res.json({ revalidated: true });
    } catch (err) {
      return res.status(500).send("Error revalidating");
    }
  }
}
