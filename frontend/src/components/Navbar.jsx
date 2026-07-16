import { Activity, BarChart3, BookOpen, Camera, ClipboardList, Dumbbell, LogOut, Route, ShieldCheck, Target, TrendingUp, UserRound } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';
import { languages, useLanguage } from '../context/LanguageContext.jsx';

const Navbar = () => {
  const { logout, user } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const links = [
    { to: '/dashboard', label: t('navDashboard'), icon: BarChart3 },
    { to: '/measurements', label: t('navMeasurements'), icon: ClipboardList },
    { to: '/goals', label: t('navGoals'), icon: Target },
    { to: '/recommendations', label: t('navRecommendations'), icon: Activity },
    { to: '/analytics', label: t('navAnalytics') || 'Analytics', icon: TrendingUp },
    { to: '/workouts', label: t('navWorkouts') || 'Workouts', icon: Dumbbell },
    { to: '/photos', label: t('navPhotos') || 'Photos', icon: Camera },
    { to: '/onboarding', label: t('navOnboarding') || 'Start', icon: Route },
    { to: '/methodology', label: t('navMethodology') || 'Method', icon: BookOpen },
    { to: '/profile', label: t('navProfile'), icon: UserRound },
    ...(user?.role === 'admin' ? [{ to: '/admin', label: t('navAdmin') || 'Admin', icon: ShieldCheck }] : [])
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">BV</div>
        <div>
          <strong>Body Vision</strong>
          <span>{user?.name || t('appSubtitle')}</span>
        </div>
      </div>

      <div className="language-switcher" aria-label="Language switcher">
        {languages.map((item) => (
          <button
            className={language === item.code ? 'active' : ''}
            key={item.code}
            type="button"
            onClick={() => setLanguage(item.code)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <nav className="nav-list">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <button className="ghost-button sidebar-logout" type="button" onClick={handleLogout} title={t('logout')}>
        <LogOut size={18} />
        <span>{t('logout')}</span>
      </button>
    </aside>
  );
};

export default Navbar;
