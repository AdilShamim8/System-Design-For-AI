import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Try multiple paths — works whether the website runs from the repo root
// or from the website/ subdirectory
function findChaptersDir(): string {
  const candidates = [
    // When running from website/ subdirectory
    path.join(process.cwd(), "..", "chapters"),
    // When running from repo root
    path.join(process.cwd(), "system-design-for-ai", "chapters"),
    // When running from repo root (alt)
    path.join(process.cwd(), "chapters"),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return candidates[0];
}

const CHAPTERS_DIR = findChaptersDir();

interface ChapterMeta {
  chapter_id: string;
  title: string;
  topic: string;
  track: string;
  bloom_stage: string[];
  est_read_minutes: number;
  prerequisites: string[];
  teaching_goal: string;
  status: string;
  slug: string;
  filepath: string;
}

function getAllChapters(): ChapterMeta[] {
  const chapters: ChapterMeta[] = [];
  const tracks = [
    "00-start-here",
    "01-ml-system-design",
    "02-genai-system-design",
    "03-agentic-system-design",
    "04-cross-cutting",
    "05-design-studio",
  ];

  for (const track of tracks) {
    const trackDir = path.join(CHAPTERS_DIR, track);
    if (!fs.existsSync(trackDir)) continue;
    const files = fs.readdirSync(trackDir).filter((f) => f.endsWith(".md"));
    for (const file of files) {
      const filepath = path.join(trackDir, file);
      const content = fs.readFileSync(filepath, "utf-8");
      try {
        const { data } = matter(content);
        chapters.push({
          chapter_id: data.chapter_id || "",
          title: data.title || "",
          topic: data.topic || "",
          track: data.track || "",
          bloom_stage: data.bloom_stage || [],
          est_read_minutes: data.est_read_minutes || 0,
          prerequisites: data.prerequisites || [],
          teaching_goal: data.teaching_goal || "",
          status: data.status || "draft",
          slug: file.replace(".md", ""),
          filepath: `${track}/${file}`,
        });
      } catch {
        // skip chapters with frontmatter parsing errors
      }
    }
  }

  return chapters.sort((a, b) => {
    const aParts = a.chapter_id.split(".");
    const bParts = b.chapter_id.split(".");
    if (aParts[0] !== bParts[0])
      return aParts[0].localeCompare(bParts[0]);
    return (parseInt(aParts[1]) || 0) - (parseInt(bParts[1]) || 0);
  });
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const chapterId = searchParams.get("id");

  if (chapterId) {
    const chapters = getAllChapters();
    const chapter = chapters.find((c) => c.chapter_id === chapterId);
    if (!chapter) {
      return NextResponse.json(
        { error: "Chapter not found" },
        { status: 404 }
      );
    }
    const filepath = path.join(CHAPTERS_DIR, chapter.filepath);
    const content = fs.readFileSync(filepath, "utf-8");
    const { data, content: body } = matter(content);
    return NextResponse.json({
      meta: chapter,
      frontmatter: data,
      content: body,
    });
  }

  const chapters = getAllChapters();
  return NextResponse.json({ chapters });
}
