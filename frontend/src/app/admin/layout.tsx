import Link from 'next/link';
import { cookies } from 'next/headers';
import AdminLogin from '../../components/AdminLogin';
import LogoutButton from '../../components/LogoutButton';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  
  if (!session) {
    return <AdminLogin />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f7f7f7', color: '#222222' }}>
      {/* Sidebar */}
      <aside style={{ width: '280px', background: '#ffffff', borderRight: '1px solid #ebebeb', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '2.5rem', color: '#ff385c', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
          Admin Center
        </h2>
        
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#717171', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Menu</div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <Link href="/admin" style={{ padding: '0.8rem 1rem', borderRadius: '8px', background: '#f7f7f7', color: '#222222', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            Registrations
          </Link>
        </nav>
        
        <LogoutButton />
      </aside>
      
      {/* Main Content */}
      <main style={{ flex: 1, padding: '3rem 4rem' }}>
        {children}
      </main>
    </div>
  );
}
