import React from "react";
import ClientDetailPage from "./components/ClientDetailPage";

interface Props {
  params: Promise<{ id: string }>;
}

const ClientDetail = async ({ params }: Props) => {
  const { id } = await params;
  return <ClientDetailPage id={id} />;
};

export default ClientDetail;