// app/admin/(admin)/layout.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Toaster } from 'sonner';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check for authentication cookie
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get('admin_auth')?.value === 'true';

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    redirect('/admin/login');
  }

  return (
    <div className="admin-layout">
      {/* Add Toaster component for notifications */}
      <Toaster position="top-right" />
      
      {/* Optional: Add admin navigation or header here */}
      <main>{children}</main>
    </div>
  );
}