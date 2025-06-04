import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Menu, X, User, LogOut, Award } from 'lucide-react';
import { Button } from './ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { ThemeToggle } from './ThemeToggle';

type NavItem = {
  path: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => Promise<void>;
};

type AuthItem = NavItem;

export function Navbar() {
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const navItems: NavItem[] = [
    { path: '/', label: 'Home' },
    { path: '/journeys', label: 'My Journeys' },
    { path: '/achievements', label: 'Achievements', icon: <Award className="w-4 h-4" /> },
  ];
  
  const authItems: AuthItem[] = user ? [
    { path: '/profile', label: 'Profile', icon: <User className="w-4 h-4 mr-2" /> },
    { 
      path: '#', 
      label: 'Sign Out', 
      icon: <LogOut className="w-4 h-4 mr-2" />,
      onClick: async () => {
        await signOut();
        setIsMenuOpen(false);
      }
    },
  ] : [
    { path: '/login', label: 'Sign In' },
    { path: '/signup', label: 'Sign Up' },
  ];
  
  return (
    <nav className="bg-bg-card-light dark:bg-bg-card-dark shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <MapPin className="w-8 h-8 text-primary-500 dark:text-primary-400" />
              <span className="ml-2 text-xl font-bold text-text-primary dark:text-white">Questline</span>
            </Link>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === item.path
                      ? 'border-primary-500 text-text-primary dark:text-white'
                      : 'border-transparent text-text-secondary dark:text-gray-300 hover:text-text-primary dark:hover:text-white hover:border-gray-300'
                  }`}
                >
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <ThemeToggle />
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/new-journey">
                  <Button variant="primary" size="sm">
                    New Journey
                  </Button>
                </Link>
                
                <div className="relative">
                  <button
                    type="button"
                    className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
                    onClick={toggleMenu}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
                      {user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                    </div>
                  </button>
                  
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-bg-card-light dark:bg-bg-card-dark ring-1 ring-black ring-opacity-5 z-10">
                      {authItems.map((item, index) => (
                        <React.Fragment key={index}>
                          {item.onClick ? (
                            <button
                              onClick={item.onClick}
                              className="block w-full text-left px-4 py-2 text-sm text-text-primary dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                            >
                              {item.icon}
                              {item.label}
                            </button>
                          ) : (
                            <Link
                              to={item.path}
                              className="block px-4 py-2 text-sm text-text-primary dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {item.icon}
                              {item.label}
                            </Link>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex items-center sm:hidden space-x-4">
            <ThemeToggle />
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-text-secondary dark:text-gray-200 hover:text-text-primary dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  location.pathname === item.path
                    ? 'border-primary-500 text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-gray-700'
                    : 'border-transparent text-text-secondary dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="flex items-center">
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.label}
                </span>
              </Link>
            ))}
            
            {user && (
              <Link
                to="/new-journey"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-text-secondary dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300"
                onClick={() => setIsMenuOpen(false)}
              >
                New Journey
              </Link>
            )}
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-600">
            {user && (
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white">
                    {user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-text-primary dark:text-white">{user.name || 'User'}</div>
                  <div className="text-sm font-medium text-text-secondary dark:text-gray-300">{user.email}</div>
                </div>
              </div>
            )}
            
            <div className="mt-3 space-y-1">
              {authItems.map((item, index) => (
                <React.Fragment key={index}>
                  {item.onClick ? (
                    <button
                      onClick={item.onClick}
                      className="block w-full text-left px-4 py-2 text-base font-medium text-text-secondary dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ) : (
                    <Link
                      to={item.path}
                      className="block px-4 py-2 text-base font-medium text-text-secondary dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}