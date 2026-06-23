import Link from 'next/link';
import { cookies } from 'next/headers';
import AdminLogin from '../../components/AdminLogin';
import LogoutButton from '../../components/LogoutButton';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  
  if (!session || session.value !== 'authenticated') {
    return <AdminLogin />;
  }

  // Links for the admin sidebar
  const links = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="9"></rect>
          <rect x="14" y="3" width="7" height="5"></rect>
          <rect x="14" y="12" width="7" height="9"></rect>
          <rect x="3" y="16" width="7" height="5"></rect>
        </svg>
      )
    },
    {
      name: 'Registrations',
      path: '/admin/registrations',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      )
    },
    {
      name: 'Form Levels',
      path: '/admin/forms',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="3" y1="9" x2="21" y2="9"></line>
          <line x1="9" y1="21" x2="9" y2="9"></line>
        </svg>
      )
    },
    {
      name: 'Students List',
      path: '/admin/students',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'var(--font-primary)' }}>
      {/* Sidebar */}
      <aside style={{ 
        width: '280px', 
        background: '#1e1b4b', // Premium deep dark indigo matches heading brand color
        color: '#f8fafc', 
        padding: '2rem 1.5rem', 
        display: 'flex', 
        flexDirection: 'column',
        boxShadow: '4px 0 20px rgba(0,0,0,0.05)'
      }}>
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem', paddingLeft: '0.5rem' }}>
          <div style={{ 
            background: 'var(--color-accent-orange)', 
            width: '38px', 
            height: '38px', 
            borderRadius: '10px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#1e1b4b',
            fontWeight: 800,
            fontSize: '1.2rem'
          }}>
            O
          </div>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, letterSpacing: '0.5px', color: '#ffffff' }}>Orchid SpellBee</h2>
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Admin Center</span>
          </div>
        </div>
        
        {/* Navigation Menu */}
        <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.75rem', paddingLeft: '0.75rem' }}>
          Navigation
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
          {links.map((link) => {
            return (
              <Link 
                key={link.path} 
                href={link.path} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  padding: '0.8rem 1rem', 
                  borderRadius: '10px', 
                  color: 'rgba(255,255,255,0.75)', 
                  textDecoration: 'none', 
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease-in-out'
                }}
                className="admin-sidebar-link"
              >
                {link.icon}
                {link.name}
              </Link>
            );
          })}
        </nav>
        
        {/* Logout Button Footer */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', marginTop: 'auto' }}>
          <LogoutButton />
        </div>
      </aside>
      
      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '3rem 4rem', overflowY: 'auto', maxHeight: '100vh' }}>
        {children}
      </main>
    </div>
  );
}
