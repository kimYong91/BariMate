import React, { memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  SettingOutlined,
  HeartOutlined,
  UserOutlined,
} from '@ant-design/icons';

interface NavItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const navItems: NavItem[] = [
  {
    key: 'home',
    label: 'Home',
    icon: <HomeOutlined />,
    path: '/',
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: <SettingOutlined />,
    path: '/settings',
  },
  {
    key: 'likes',
    label: 'Likes',
    icon: <HeartOutlined />,
    path: '/likes',
  },
  {
    key: 'profile',
    label: 'Profile',
    icon: <UserOutlined />,
    path: '/profile',
  },
];

const styles = {
  container: {
    position: 'fixed' as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: '60px',
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e8e8e8',
    display: 'flex',
    justifyContent: 'space-around' as const,
    alignItems: 'center' as const,
    zIndex: 1000,
    boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)',
  },
  navItem: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    padding: '8px 4px',
    minHeight: '44px',
    borderRadius: '8px',
  },
  navItemHover: {
    backgroundColor: '#f5f5f5',
  },
  navIcon: {
    fontSize: '20px',
    marginBottom: '2px',
    color: '#8c8c8c',
    transition: 'color 0.2s ease',
  },
  navIconActive: {
    color: '#1890ff',
  },
  navLabel: {
    fontSize: '10px',
    color: '#8c8c8c',
    fontWeight: 400,
    transition: 'color 0.2s ease',
  },
  navLabelActive: {
    color: '#1890ff',
    fontWeight: 500,
  },
};

const BottomNavBar: React.FC = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  const getCurrentKey = () => {
    const currentPath = location.pathname;
    const currentItem = navItems.find(item => item.path === currentPath);
    return currentItem?.key || 'home';
  };

  const currentKey = getCurrentKey();

  return (
    <div style={styles.container}>
      {navItems.map((item) => {
        const isActive = currentKey === item.key;
        
        return (
          <div
            key={item.key}
            style={{
              ...styles.navItem,
              ...(isActive ? { color: '#1890ff' } : {}),
            }}
            onClick={() => handleNavClick(item.path)}
            onMouseEnter={(e) => {
              if (!isActive) {
                (e.target as HTMLElement).style.backgroundColor = '#f5f5f5';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                (e.target as HTMLElement).style.backgroundColor = 'transparent';
              }
            }}
          >
            <div 
              style={{
                ...styles.navIcon,
                ...(isActive ? styles.navIconActive : {}),
              }}
            >
              {item.icon}
            </div>
            <div 
              style={{
                ...styles.navLabel,
                ...(isActive ? styles.navLabelActive : {}),
              }}
            >
              {item.label}
            </div>
          </div>
        );
      })}
    </div>
  );
});

BottomNavBar.displayName = 'BottomNavBar';

export default BottomNavBar; 