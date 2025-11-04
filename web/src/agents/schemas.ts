import { z } from "zod";

export const BrandTokensSchema = z.object({
  name: z.string().optional(),
  colors: z.object({
    primary: z.string(),
    secondary: z.string().optional(),
    accent: z.string().optional(),
    neutral: z.string().optional(),
    success: z.string().optional(),
    warning: z.string().optional(),
    danger: z.string().optional(),
    background: z.string().optional(),
    foreground: z.string().optional(),
  }),
  radius: z
    .object({
      sm: z.string().optional(),
      md: z.string().optional(),
      lg: z.string().optional(),
      xl: z.string().optional(),
      full: z.string().optional(),
    })
    .optional(),
  shadow: z
    .object({
      sm: z.string().optional(),
      md: z.string().optional(),
      lg: z.string().optional(),
      xl: z.string().optional(),
    })
    .optional(),
  spacing: z
    .object({
      sm: z.string().optional(),
      md: z.string().optional(),
      lg: z.string().optional(),
      xl: z.string().optional(),
    })
    .optional(),
  font: z
    .object({
      heading: z.string().optional(),
      body: z.string().optional(),
      mono: z.string().optional(),
    })
    .optional(),
});

export const PageSectionSchema = z.object({
  kind: z.string(),
  props: z.record(z.any()).optional(),
});

export const PagePlanSchema = z.object({
  slug: z.string(),
  title: z.string(),
  sections: z.array(PageSectionSchema),
});

export const SitePlanSchema = z.object({
  pages: z.array(PagePlanSchema),
  brand: BrandTokensSchema,
  dataModels: z
    .array(
      z.object({
        name: z.string(),
        fields: z.array(
          z.object({
            name: z.string(),
            type: z.string(),
            required: z.boolean().optional(),
          })
        ),
      })
    )
    .optional(),
});

export const FileSpecSchema = z.object({
  path: z.string(),
  contents: z.string(),
  mode: z.enum(["text", "binary"]).optional(),
});

export const RepoSpecSchema = z.object({
  files: z.array(FileSpecSchema),
});

export const QualityCheckSchema = z.object({
  name: z.string(),
  status: z.enum(["pass", "fail", "warn"]),
  details: z.record(z.any()).optional(),
});
