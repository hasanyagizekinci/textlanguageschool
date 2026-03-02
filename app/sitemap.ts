import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.textlanguageschool.net"

  return [
    {
      url: baseUrl,
      lastModified: new Date("2026-02-05"),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          "tr-TR": baseUrl,
        },
      },
    },
    {
      url: `${baseUrl}/hakkimda`,
      lastModified: new Date("2026-01-15"),
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          "tr-TR": `${baseUrl}/hakkimda`,
        },
      },
    },
    {
      url: `${baseUrl}/dersler`,
      lastModified: new Date("2026-02-01"),
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          "tr-TR": `${baseUrl}/dersler`,
        },
      },
    },
    {
      url: `${baseUrl}/demo-ders`,
      lastModified: new Date("2026-02-01"),
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          "tr-TR": `${baseUrl}/demo-ders`,
        },
      },
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date("2026-01-10"),
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: {
        languages: {
          "tr-TR": `${baseUrl}/blog`,
        },
      },
    },
    {
      url: `${baseUrl}/blog/kisiye-ozel-macera`,
      lastModified: new Date("2026-01-10"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/dil-ogrenme-pazari`,
      lastModified: new Date("2025-12-20"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/ogrenme-yolculugu`,
      lastModified: new Date("2025-12-18"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/4-3-2-teknigi`,
      lastModified: new Date("2025-12-15"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ]
}
