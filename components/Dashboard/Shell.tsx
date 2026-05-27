import DashboardSidebar from "./Sidebar";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dash-container">
      <div className="dash-shell">
        <DashboardSidebar />
        <main className="dash-content">{children}</main>
      </div>
    </div>
  );
}
