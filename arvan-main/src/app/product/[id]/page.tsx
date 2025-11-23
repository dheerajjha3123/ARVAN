"use client";
import { useParams } from "next/navigation";
import ProductDetails from "../../../components/Sections/ProductDetails";
export default function ProductDetail({}) {
  const { id } = useParams();
  const productId = Array.isArray(id) ? id[0] : id || "";

  return <ProductDetails productId={productId} />;
}
