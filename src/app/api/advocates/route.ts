// src/app/api/advocates/route.ts

import { advocateData } from "@/db/seed/advocates";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const specialty = searchParams.get("specialty");
    const city = searchParams.get("city");

    // Uncomment this line to use a database
    // const data = await db.select().from(advocates);

    let data = advocateData;

    if (specialty) {
      data = data.filter((advocate) =>
        advocate.specialties.includes(specialty)
      );
    }

    if (city) {
      data = data.filter((advocate) => advocate.city === city);
    }

    const total = data.length;
    const paginatedData = data.slice((page - 1) * pageSize, page * pageSize);

    return Response.json({
      data: paginatedData,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching advocates:", error);
    return Response.json(
      { error: "Failed to fetch advocates" },
      { status: 500 }
    );
  }
}
