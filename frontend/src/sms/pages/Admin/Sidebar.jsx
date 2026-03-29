import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { BsGraphUp, BsPeople, BsPerson, BsFileText, BsBook, BsGraphDown, BsCalendar, BsGear, BsChatDots, BsCalendarEvent, BsSearch, BsMoon, BsSun, BsList } from 'react-icons/bs';

import bg1 from '../../assets/bg1.png';

const SidebarContainer = styled.aside`
  position: sticky;
  top: 0;
  left: 0;
  width: ${({ isOpen }) => (isOpen ? '270px' : '90px')};
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--sidebar-bg);
  border-right: 1px solid var(--color-border-hr);
  box-shadow: 0 3px 15px var(--color-shadow);
  transition: width 0.4s ease, background 0.4s ease;
  z-index: 1000;
  color: var(--sidebar-text);
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 10px;
  position: relative;
`;

const Logo = styled.img`
  width: ${({ isOpen }) => (isOpen ? '42px' : '36px')};
  height: auto;
  transition: width 0.3s ease, opacity 0.3s ease;
  opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
`;

const SidebarToggleButton = styled.button`
  position: absolute;
  right: -18px;
  top: 40px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--color-border-hr);
  background: var(--sidebar-bg);
  color: var(--sidebar-text);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 1001;

  &:hover {
    background: var(--accent-primary);
    transform: scale(1.1);
  }
`;

const SidebarContent = styled.div`
  flex: 1;
  padding: 20px 18px;
  overflow-y: auto;
`;

const SearchForm = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};

  &:focus-within {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

const SearchIcon = styled.div`
  color: var(--sidebar-text);
  font-size: 18px;
  opacity: 0.7;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: #FFFFFF;
  font-size: 0.95rem;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const SidebarNav = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SidebarNavItem = styled.li`
  margin-bottom: 6px;
`;

const SidebarLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 12px 16px;
  border-radius: 14px;
  color: ${({ isActive }) => (isActive ? 'var(--accent-secondary)' : 'var(--sidebar-text)')};
  background: ${({ isActive }) => (isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent')};
  transition: background 0.3s ease, color 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--sidebar-text);
  }
`;

const SidebarIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;

const Label = styled.span`
  display: ${({ isOpen }) => (isOpen ? 'inline' : 'none')};
  opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
  transition: opacity 0.3s ease;
  color: var(--sidebar-text);
`;

const SidebarFooter = styled.div`
  padding: 20px 18px;
  border-top: 1px solid var(--color-border-hr);
`;

const ThemeButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-radius: 16px;
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: var(--color-hover-secondary);
  }
`;

const ThemeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ThemeText = styled.span`
  display: ${({ isOpen }) => (isOpen ? 'inline' : 'none')};
  opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
  transition: opacity 0.3s ease;
`;

const ThemeToggleTrack = styled.div`
  width: ${({ isOpen }) => (isOpen ? '46px' : '0')};
  height: 24px;
  border-radius: 999px;
  background: var(--color-border-hr);
  position: relative;
  transition: width 0.3s ease, opacity 0.3s ease;
  opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
`;

const ThemeToggleIndicator = styled.div`
  position: absolute;
  top: 3px;
  left: ${({ active }) => (active ? '24px' : '3px')};
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  transition: left 0.3s ease;
`;

const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const initialDark = savedTheme ? savedTheme === 'dark' : document.body.classList.contains('dark-theme');
    setDarkMode(initialDark);
    document.body.classList.toggle('dark-theme', initialDark);
  }, []);

  const toggleTheme = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    document.body.classList.toggle('dark-theme', nextMode);
    localStorage.setItem('theme', nextMode ? 'dark' : 'light');
  };

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <BsGraphUp /> },
    { path: '/admin/classes', label: 'Classes', icon: <BsPeople /> },
    { path: '/admin/students', label: 'Students', icon: <BsPeople /> },
    { path: '/admin/teachers', label: 'Teachers', icon: <BsPerson /> },
    { path: '/admin/teaching-assignments', label: 'Teaching Assignments', icon: <BsBook /> },
    { path: '/admin/assignments', label: 'Assignments', icon: <BsFileText /> },
    { path: '/admin/exams', label: 'Exams', icon: <BsBook /> },
    { path: '/admin/performance', label: 'Performance', icon: <BsGraphDown /> },
    { path: '/admin/attendance', label: 'Attendance', icon: <BsCalendar /> },
    { path: '/admin/library', label: 'Library', icon: <BsBook /> },
    { path: '/admin/communication', label: 'Announcement', icon: <BsChatDots /> },
    { path: '/admin/events', label: 'Events & Calendar', icon: <BsCalendarEvent /> },
    { path: '/admin/settings', label: 'Settings & Profile', icon: <BsGear /> },
  ];

  return (
    <SidebarContainer isOpen={isOpen}>
      <SidebarHeader>
        <Logo src={bg1} alt="Logo" isOpen={isOpen} />
        <SidebarToggleButton onClick={onToggle}>
          <BsList />
        </SidebarToggleButton>
      </SidebarHeader>

      <SidebarContent>
        <SearchForm>
          <SearchIcon>
            <BsSearch />
          </SearchIcon>
          <SearchInput placeholder="Search" isOpen={isOpen} />
        </SearchForm>

        <SidebarNav>
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <SidebarNavItem key={item.path}>
                <SidebarLink to={item.path} isActive={active}>
                  <SidebarIcon>{item.icon}</SidebarIcon>
                  <Label isOpen={isOpen}>{item.label}</Label>
                </SidebarLink>
              </SidebarNavItem>
            );
          })}
        </SidebarNav>
      </SidebarContent>

      <SidebarFooter>
        <ThemeButton isOpen={isOpen} onClick={toggleTheme}>
          <ThemeInfo>
            {darkMode ? <BsMoon /> : <BsSun />}
            <ThemeText isOpen={isOpen}>{darkMode ? 'Dark Mode' : 'Light Mode'}</ThemeText>
          </ThemeInfo>
          <ThemeToggleTrack isOpen={isOpen}>
            <ThemeToggleIndicator active={darkMode} />
          </ThemeToggleTrack>
        </ThemeButton>
      </SidebarFooter>
    </SidebarContainer>
  );
};

export default Sidebar;