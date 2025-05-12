import React, { useState,useEffect } from 'react';
import { Dropdown, Sidebar } from 'flowbite-react';
import { FaUser, FaHome, FaDatabase, FaGifts } from "react-icons/fa";
import { usePage } from '@inertiajs/react'; 
import { Link } from '@inertiajs/react';
import { BiTask } from "react-icons/bi";
import { SiGoogleclassroom } from "react-icons/si";
import { AiOutlineTransaction } from "react-icons/ai";
import { FaClipboardCheck } from "react-icons/fa";
import { FaQrcode } from 'react-icons/fa6';
function Layout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { url } = usePage();
  const { auth } = usePage().props;
  const user = auth?.user;
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const subdomain = new URL(window.location.href).hostname.split('.')[0].toUpperCase();
  useEffect(() => {
    const target =   document.querySelector("#sidebar > div > nav > div");
    document.querySelector("#sidebar > div > nav > div > div > ul").classList.remove('border-t');

    if (target) {
      target.classList.remove('bg-gray-50');
    }

  }, []);

  const ActiveCollapse = ({ children, icon, label }) => {
    const hasActiveChild = React.Children.toArray(children).some(child =>
      url === child.props.href
    );

    const enhancedChildren = React.Children.map(children, child => {
      if (!React.isValidElement(child)) return child;
      return React.cloneElement(child, {
        className: `${child.props.className} text-start pl-12 text-white`.trim(),
      });
    });

    return (
      <Sidebar.Collapse
        icon={icon}
        label={label}
        open={hasActiveChild}
        className={`text-start gap-3 mb-2 hover:bg-hover ${hasActiveChild ? 'outline outline-2 outline-hover' : ''}`}
      >
        {enhancedChildren}
      </Sidebar.Collapse>
    );
  };

  const ActiveLink = ({ href, children, className = '', ...props }) => {
    const activeClass = url === href ? 'outline outline-2 outline-hover' : '';

    return (
      <Sidebar.Item
        as={Link}
        href={href}
        className={`hover:bg-hover mb-2 ${activeClass} ${className} text-white`}
        {...props}
      >
        {children}
      </Sidebar.Item>
    );
  };

  return (
    <div className="flex h-screen bg-primary">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full h-16 border-b border-secondary bg-primary text-white">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="inline-flex items-center p-2 text-sm text-white rounded-lg"
                onClick={toggleSidebar}
                aria-controls="sidebar"
                aria-expanded={isSidebarOpen}
              >
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>
              <Link href="/" className="flex items-center space-x-2">
                <img src="/assets/images/logo.png" alt="Logo" className="h-12 w-auto py-2" />
                <h1 className='font-semibold'>SMA 2 Muhammadiyah Bandar Lampung</h1>
              </Link>
            </div>
            <div className="flex items-center">
              <Dropdown
                label={<img className="w-8 h-8 rounded-full" src="/assets/images/profile.png" alt="User" />}
                arrowIcon={false}
                className="bg-primary text-white"
                inline
              >
                <Dropdown.Header>
                  <span className="block text-sm text-white">{user.username}</span>
                </Dropdown.Header>
                <Dropdown.Item className='text-white hover:bg-hover' as={Link} href='/logout'>Sign out</Dropdown.Item>
              </Dropdown>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`fixed top-0 left-0 z-40 w-72 h-full pt-20 border-r bg-primary text-white border-secondary transition-transform ${isSidebarOpen ? '' : '-translate-x-full'}`}
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-primary">
          <Sidebar className="relative bg-primary">
            <Sidebar.Items className='bg-primary'>
              <Sidebar.ItemGroup className='bg-primary'>
                <ActiveLink href="/dashboard" icon={() => <FaHome fontSize="1.4em" />}>
                  Dashboard
                </ActiveLink>
                {user.role=="superadmin"&&(
                <ActiveCollapse icon={() => <FaDatabase fontSize="1.4em" />} label="Master Data">
                  <ActiveLink href="/users" icon={() => <FaUser fontSize="1.4em" />}>
                    User
                  </ActiveLink>
                  <ActiveLink href="/classes" icon={() => <SiGoogleclassroom fontSize="1.4em" />}>
                    Classes
                  </ActiveLink>
                  <ActiveLink href="/subject" icon={() => <BiTask fontSize="1.4em" />}>
                    Subject
                  </ActiveLink>
                </ActiveCollapse>
                )}
                {user.role=="user"&&(
                <ActiveLink href="/scan" icon={() => <FaQrcode fontSize="1.4em" />}>
                  Scan
                </ActiveLink>
                )}
                {(user.role=="superadmin" || user.role=="admin") &&(
                <ActiveLink href="/attendance" icon={() => <FaClipboardCheck fontSize="1.4em" />}>
                  Attendance
                </ActiveLink>
                )}
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </Sidebar>
        </div>
      </aside>

      {/* Main content */}
      <div className={`flex-1 mt-16 w-full ${isSidebarOpen ? 'sm:ml-72' : ''}`}>
        {children}
      </div>
    </div>
  );
}

export default Layout;
