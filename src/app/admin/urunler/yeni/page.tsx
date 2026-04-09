import ProductForm from "../ProductForm";

export default function NewProduct() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Yeni Ürün</h1>
        <p className="text-sm text-gray-500 mt-0.5">Yeni bir ürün ekleyin</p>
      </div>
      <ProductForm />
    </div>
  );
}
