// src/app/api/advocates/route.ts
import db from "@/db";
import { advocates } from "@/db/schema";
import { NextRequest } from "next/server";
import { Advocate, AdvocatesCache } from "@/types/advocate";

let advocatesCache: AdvocatesCache | null = null;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const specialty = searchParams.get("specialty");
    const city = searchParams.get("city");

    // Try to get data from database
    const data = (await db.select().from(advocates)) as Advocate[];

    // if successful - update cache
    const currentTime = Date.now();
    advocatesCache = {
      data,
      timestamp: currentTime,
    };

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

    const pagination = {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };

    // update cache with pagination info
    advocatesCache.pagination = pagination;

    return Response.json({
      data: paginatedData,
      pagination,
      status: "live",
    });
  } catch (error) {
    console.error("Error fetching advocates:", error);

    // if cache exists - use it
    if (advocatesCache && advocatesCache.data.length > 0) {
      const { data, timestamp, pagination } = advocatesCache;
      const searchParams = request.nextUrl.searchParams;
      const specialty = searchParams.get("specialty");
      const city = searchParams.get("city");

      //apply same filters to cached data
      let filteredData = data;
      if (specialty) {
        filteredData = filteredData.filter((advocate) =>
          advocate.specialties.includes(specialty)
        );
      }
      if (city) {
        filteredData = filteredData.filter(
          (advocate) => advocate.city === city
        );
      }

      const page = parseInt(searchParams.get("page") || "1");
      const pageSize = parseInt(searchParams.get("pageSize") || "10");
      const total = filteredData.length;
      const paginatedData = filteredData.slice(
        (page - 1) * pageSize,
        page * pageSize
      );

      // calculate time since last update
      const now = Date.now();
      const timeSinceUpdate = now - timestamp;
      const minutes = Math.floor(timeSinceUpdate / 60000);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      let lastUpdated: string;
      if (days > 0) {
        lastUpdated = `${days} ${days === 1 ? "day" : "days"}`;
      } else if (hours > 0) {
        lastUpdated = `${hours} ${hours === 1 ? "hour" : "hours"}`;
      } else {
        lastUpdated = `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
      }

      return Response.json({
        data: paginatedData,
        pagination: {
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize),
        },
        status: "cached",
        lastUpdated,
      });
    }

    // no cache available
    return Response.json(
      { error: "Failed to fetch advocates", status: "error" },
      { status: 500 }
    );
  }
}
