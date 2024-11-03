'use client'

import { Avatar } from '@/components/avatar'
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@/components/dropdown'
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from '@/components/navbar'
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from '@/components/sidebar'
import { SidebarLayout } from '@/components/sidebar-layout'
import {
  ArrowRightStartOnRectangleIcon,
  BeakerIcon,
  ChartBarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cog6ToothIcon,
  Cog8ToothIcon,
  HomeIcon,
  LightBulbIcon,
  PlusIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  SparklesIcon,
  Square2StackIcon,
  TicketIcon,
  UserCircleIcon,
} from '@heroicons/react/20/solid'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

function AccountDropdownMenu({ anchor, onSignOut, onProfileChange }) {
  const handleSignOutClick = () => {
    onSignOut()
    const selectedProfile = prompt('Please select a profile: admin or user')
    if (selectedProfile === 'admin' || selectedProfile === 'user') {
      onProfileChange(selectedProfile)
      localStorage.setItem('profile', selectedProfile)
    }
  }

  const handleProfileChange = () => {
    const selectedProfile = prompt('Please select a profile: admin or user')
    if (selectedProfile === 'admin' || selectedProfile === 'user') {
      onProfileChange(selectedProfile)
    }
  }

  return (
    <DropdownMenu className="min-w-64" anchor={anchor}>
      <DropdownItem href="#">
        <UserCircleIcon />
        <DropdownLabel>My account</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem href="#">
        <ShieldCheckIcon />
        <DropdownLabel>Privacy policy</DropdownLabel>
      </DropdownItem>
      <DropdownItem href="#">
        <LightBulbIcon />
        <DropdownLabel>Share feedback</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem onClick={handleProfileChange}>
        <DropdownLabel>Change Profile</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem onClick={handleSignOutClick}>
        <ArrowRightStartOnRectangleIcon />
        <DropdownLabel>Sign out</DropdownLabel>
      </DropdownItem>
    </DropdownMenu>
  )
}

export function ApplicationLayout({ events, children }) {
  const [profile, setProfile] = useState(null)
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = () => {
    localStorage.removeItem('profile')
    setProfile(null)
  }

  const handleProfileChange = (newProfile) => {
    setProfile(newProfile)
    localStorage.setItem('profile', newProfile)
    router.push('/form')
  }

  useEffect(() => {
    const savedProfile = localStorage.getItem('profile')
    if (!savedProfile) {
      const selectedProfile = prompt('Please select a profile: admin or user')
      if (selectedProfile === 'admin' || selectedProfile === 'user') {
        setProfile(selectedProfile)
        localStorage.setItem('profile', selectedProfile)
      }
    } else {
      setProfile(savedProfile)
    }
  }, [])

  return (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSpacer />
          <NavbarSection>
            <Dropdown>
              <DropdownButton as={NavbarItem}>
                <Avatar src="/users/erica.jpg" square />
              </DropdownButton>
              <AccountDropdownMenu
                anchor="bottom end"
                onSignOut={handleSignOut}
                onProfileChange={handleProfileChange}
              />
            </Dropdown>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <Dropdown>
              <DropdownButton as={SidebarItem}>
                <Avatar slot="icon" initials="AB" className="bg-purple-500 text-white" />
                <SidebarLabel>Addenbrooke's Hospital</SidebarLabel>
                <ChevronDownIcon />
              </DropdownButton>
              <DropdownMenu className="min-w-80 lg:min-w-64" anchor="bottom start">
                <DropdownItem href="/settings">
                  <Cog8ToothIcon />
                  <DropdownLabel>Settings</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem href="#">
                  <Avatar slot="icon" initials="AB" className="bg-purple-500 text-white" />
                  <DropdownLabel>Addenbrooke's Hospital</DropdownLabel>
                </DropdownItem>
                <DropdownItem href="#">
                  <Avatar slot="icon" initials="RL" className="bg-purple-500 text-white" />
                  <DropdownLabel>Royal London Hospital</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem href="#">
                  <PlusIcon />
                  <DropdownLabel>New team&hellip;</DropdownLabel>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </SidebarHeader>

          <SidebarBody>
            <SidebarSection>
              {profile === 'admin' && (
                <>
                  <SidebarItem href="/" current={pathname === '/'}>
                    <HomeIcon />
                    <SidebarLabel>Home</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem href="/events" current={pathname.startsWith('/events')}>
                    <Square2StackIcon />
                    <SidebarLabel>Medications Under Analysis</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem href="/orders" current={pathname.startsWith('/orders')}>
                    <TicketIcon />
                    <SidebarLabel>Cases</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem href="/settings" current={pathname.startsWith('/settings')}>
                    <Cog6ToothIcon />
                    <SidebarLabel>Settings</SidebarLabel>
                  </SidebarItem>
                </>
              )}
              <SidebarItem href="/form" current={pathname.startsWith('/form')}>
                <BeakerIcon />
                <SidebarLabel>Form</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/results" current={pathname.startsWith('/results')}>
                <ChartBarIcon />
                <SidebarLabel>Results</SidebarLabel>
              </SidebarItem>
            </SidebarSection>

            {profile === 'admin' && (
              <SidebarSection className="max-lg:hidden">
                <SidebarHeading>Medications Under Analysis</SidebarHeading>
                {events.map((event) => (
                  <SidebarItem key={event.id} href={event.url}>
                    {event.name}
                  </SidebarItem>
                ))}
              </SidebarSection>
            )}

            <SidebarSpacer />

            <SidebarSection>
              <SidebarItem href="#">
                <QuestionMarkCircleIcon />
                <SidebarLabel>Support</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="#">
                <SparklesIcon />
                <SidebarLabel>Changelog</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>

          <SidebarFooter className="max-lg:hidden">
            <Dropdown>
              <DropdownButton as={SidebarItem}>
                <span className="flex min-w-0 items-center gap-3">
                  <Avatar src="/users/erica.jpg" className="size-10" square alt="" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">Erica</span>
                    <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                      erica@example.com
                    </span>
                  </span>
                </span>
                <ChevronUpIcon />
              </DropdownButton>
              <AccountDropdownMenu anchor="top start" onSignOut={handleSignOut} onProfileChange={handleProfileChange} />
            </Dropdown>
          </SidebarFooter>
        </Sidebar>
      }
    >
      {children}
    </SidebarLayout>
  )
}
