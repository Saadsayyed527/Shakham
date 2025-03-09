"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { logout } from '../slices/userSlice'

import { useSelector, useDispatch } from "react-redux";

import { Menu, Users, MessageSquare, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RootState } from "@/store"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

interface Route {
  name: string;
  href: string;
  icon: JSX.Element;
  active: boolean;
  badge?: number;
}

export default function NetworkNavbar(): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };
 // Get user from Redux store
  const user = useSelector((state: RootState) => state.auth.user)
  


  const routes: Route[] = [
    {
      name: "Network",
      href: "/network",
      icon: <Users className="h-5 w-5" />,
      active: window.location.pathname === "/network",
    },
    {
      name: "Messages",
      href: "/network/chat",
      icon: <MessageSquare className="h-5 w-5" />,
      active: window.location.pathname.startsWith("/network/chat"),
      badge: 3,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">Evolve</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium mx-6">
            <Link to="/courses" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Courses
            </Link>
            <Link to="/network" className="transition-colors hover:text-foreground/80 text-primary">
              Network
            </Link>

          </nav>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="mr-2 px-0 text-base md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link to="/" className="flex items-center" onClick={() => setIsOpen(false)}>
              <span className="font-bold text-xl">Evolve</span>
            </Link>
            <div className="my-4">
              <h2 className="text-lg font-semibold tracking-tight">Navigation</h2>
              <div className="grid gap-1 pt-2">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    to={route.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${route.active ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                  >
                    {route.icon}
                    {route.name}
                    {route.badge && (
                      <Badge className="ml-auto" variant="secondary">
                        {route.badge}
                      </Badge>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none hidden md:flex items-center">
            {routes.map((route) => (
              <Link key={route.href} to={route.href} className="relative">
                <Button variant={route.active ? "default" : "ghost"} className="h-9 w-9 mr-1" size="icon">
                  {route.icon}
                  <span className="sr-only">{route.name}</span>
                </Button>
                {route.badge && (
                  <Badge className="absolute -mt-8 ml-5" variant="secondary">
                    {route.badge}
                  </Badge>
                )}
              </Link>
            ))}
            <Button variant="ghost" className="h-9 w-9" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
          {!user 
           ? (
            <DropdownMenuContent>
                <DropdownMenuLabel className="text-sm font-medium text-muted-foreground">
                  Log in
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/login" className="text-sm font-medium text-foreground hover:text-primary">
                    Login
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/register" className="text-sm font-medium text-foreground hover:text-primary">
                  Register
                  </Link>
                </DropdownMenuItem>
                </DropdownMenuContent>
            )
            : (
                
                <DropdownMenuContent>
                    <DropdownMenuLabel className="text-sm font-medium text-muted-foreground">
                        {user.username}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
            )}
            
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
