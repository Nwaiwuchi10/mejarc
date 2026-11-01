import EditProduct from "@/src/VendorScreens/EditProduct/EditProduct";

interface PageProps {
    params: {
        id: string;
    };
}

export default async function EditProductPage({ params }: PageProps) {
    const { id } = await params;
    return <EditProduct id={id} />;
}
