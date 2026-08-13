import { Client } from "@notionhq/client";

export default async function handler(req, res) {
  const notion = new Client({
    auth: process.env.NOTION_KEY
  });

  const pageId = process.env.NOTION_PAGE_ID;

  try {
    const blocks = await notion.blocks.children.list({
      block_id: pageId
    });

    let html = "";

    blocks.results.forEach(block => {
      if (block.type === "heading_1")
        html += `<h1>${block.heading_1.rich_text[0].plain_text}</h1>`;
      if (block.type === "heading_2")
        html += `<h2>${block.heading_2.rich_text[0].plain_text}</h2>`;
      if (block.type === "heading_3")
        html += `<h3>${block.heading_3.rich_text[0].plain_text}</h3>`;
      if (block.type === "paragraph")
        html += `<p>${block.paragraph.rich_text.map(t => t.plain_text).join("")}</p>`;
      if (block.type === "image")
        html += `<img src="${block.image.file.url}" style="max-width:100%;border-radius:10px;margin:20px 0;">`;
      if (block.type === "divider")
        html += `<hr>`;
    });

    res.status(200).send(html);

  } catch (error) {
    res.status(500).json({ error: "Errore nel proxy Notion" });
  }
}
