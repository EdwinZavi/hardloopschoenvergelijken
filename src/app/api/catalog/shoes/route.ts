import { NextResponse } from "next/server";
import { getCatalogShoes } from "@/lib/catalog/repository";

export async function GET() {
  const result = await getCatalogShoes();
  const shoes = result.data.map((shoe) => ({
    id: shoe.id,
    slug: shoe.slug,
    brand: shoe.brand,
    model: shoe.model,
    version: shoe.version,
    fullName: shoe.fullName,
    releaseYear: shoe.releaseYear,
    shoeType: shoe.shoeType,
    surfaceType: shoe.surfaceType,
    supportType: shoe.supportType,
    cushioningLevel: shoe.cushioningLevel,
    responsivenessLevel: shoe.responsivenessLevel,
    fitProfile: shoe.fitProfile,
    widthLabel: shoe.widthLabel,
    priceFrom: shoe.priceFrom,
    retailerCount: shoe.retailerCount,
    dataStatus: shoe.dataStatus,
    scoreStatus: shoe.scoreStatus,
    imageStatus: shoe.imageStatus ?? (shoe.imageUrl ? "verified" : "missing")
  }));

  return NextResponse.json({
    items: shoes,
    count: shoes.length,
    source: result.source,
    fallbackReason: result.fallbackReason,
    generatedAt: new Date().toISOString()
  });
}
