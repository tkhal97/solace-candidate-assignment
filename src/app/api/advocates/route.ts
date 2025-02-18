// src/app/api/advocates/route.ts

import db from "@/db";
import { advocates } from "@/db/schema";
import { NextRequest } from "next/server";

type Advocate = {
  specialties: string[];
  city: string;
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const data = (await db.select().from(advocates)) as Advocate[];
    const specialty = searchParams.get("specialty");
    const city = searchParams.get("city");

    // using the database

    let filteredData = data;

    if (specialty) {
      filteredData = filteredData.filter((advocate) =>
        advocate.specialties.includes(specialty)
      );
    }

    if (city) {
      filteredData = filteredData.filter((advocate) => advocate.city === city);
    }

    const total = filteredData.length;
    const paginatedData = filteredData.slice(
      (page - 1) * pageSize,
      page * pageSize
    );

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
