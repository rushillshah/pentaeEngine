import { NextResponse } from "next/server";
import { ProductService } from "@/server/services/ProductService";

export async function GET() {
  try {
    const products = await ProductService.getAll();
    return NextResponse.json(products);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
