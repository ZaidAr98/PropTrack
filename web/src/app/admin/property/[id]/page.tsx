import React from "react";
import DetailPropertyPage from "../components/DetailPropertyPage";

interface Props {
  params: Promise<{ id: string }>;
}

const PropertyDetail = async ({ params }: Props) => {
  const { id } = await params;
  return <DetailPropertyPage id={id} />;
};

export default PropertyDetail;