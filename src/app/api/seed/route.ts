// src/app/api/seed/route.ts
import db from "@/db";
import { advocates, advocateSchema } from "@/db/schema";
import { advocateData } from "@/db/seed/advocates";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    // For custom seed data
    // const body = await request.json();
    // const validated = advocateSchema.array().parse(body);

    // Using predefined data, but still validating it
    const validated = advocateSchema.array().parse(advocateData);

    const records = await db.insert(advocates).values(validated).returning();
    return Response.json({ advocates: records });
  } catch (error) {
    console.error("Error seeding database:", error);
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: "Invalid data format", details: error.format() },
        { status: 400 }
      );
    }
    return Response.json({ error: "Failed to seed database" }, { status: 500 });
  }
}
