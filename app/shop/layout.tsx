import AdminNav from '@/components/AdminNav';

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <AdminNav />
      {children}
    </div>
  );
}