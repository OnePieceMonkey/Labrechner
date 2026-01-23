export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="container-wide py-8">{children}</div>;
}
