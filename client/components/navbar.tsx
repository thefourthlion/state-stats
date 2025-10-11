"use client";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import NextLink from "next/link";
import clsx from "clsx";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { ThemeSwitch } from "@/components/theme-switch";
import { initFirebase } from "@/firebase";

export const Navbar = () => {
  const app = initFirebase();
  const auth = getAuth(app);
  const [user] = useAuthState(auth);
  const router = useRouter();

  const handleAuthAction = async () => {
    if (user) {
      // If user is logged in, sign them out
      await auth.signOut();
      router.push("/"); // Redirect to home after logout
    } else {
      // If no user, redirect to login page
      router.push("/pages/login");
    }
  };

  const navItems = [
    { label: "State Data", href: "/pages/statedata" },
    { label: "Compare States", href: "/pages/comparestates" },
    { label: "Moving Calculator", href: "/pages/movingcalculator" },
    { label: "Map", href: "/pages/map" },
  ];

  return (
    <NextUINavbar
      className="border-b border-default-200 dark:border-default-100 bg-background/70 backdrop-blur-md"
      classNames={{
        wrapper: "px-4 sm:px-6",
      }}
      maxWidth="xl"
      position="sticky"
    >
      {/* Left side - Brand & Navigation */}
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink
            className="flex justify-start items-center gap-2 group"
            href="/"
          >
            <div className="text-2xl font-black bg-gradient-primary bg-clip-text text-transparent group-hover:scale-105 transition-transform">
              StateAnalytica
            </div>
          </NextLink>
        </NavbarBrand>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex gap-1 justify-start ml-6">
          {navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  "px-3 py-2 rounded-lg text-sm font-semibold transition-all",
                  "text-default-600 dark:text-default-400",
                  "hover:text-pastel-teal hover:bg-pastel-teal/10",
                  "data-[active=true]:text-pastel-teal data-[active=true]:bg-pastel-teal/10",
                )}
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      {/* Right side - Theme Switch & Auth */}
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-3 items-center">
          <ThemeSwitch />
          {user ? (
            <Button
              className="font-semibold"
              onPress={handleAuthAction}
              size="sm"
              variant="flat"
            >
              Logout
            </Button>
          ) : (
            <Button
              className="bg-gradient-primary text-white font-semibold hover:opacity-90"
              onPress={handleAuthAction}
              size="sm"
            >
              Login
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>

      {/* Mobile - Theme Switch & Menu Toggle */}
      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle className="text-pastel-teal" />
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu className="pt-6 bg-background/95 backdrop-blur-lg">
        <div className="mx-4 mt-2 flex flex-col gap-3">
          {navItems.map((item, index) => (
            <NavbarMenuItem key={`${item.label}-${index}`}>
              <Link
                className="w-full text-lg font-semibold py-2 text-default-600 dark:text-default-400 hover:text-pastel-teal transition-colors"
                href={item.href}
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}

          {/* Mobile Auth Button */}
          <NavbarMenuItem>
            <Button
              className={clsx(
                "w-full font-semibold mt-4",
                user
                  ? "bg-default-100 dark:bg-default-50/10"
                  : "bg-gradient-primary text-white",
              )}
              onPress={handleAuthAction}
              size="lg"
            >
              {user ? "Logout" : "Login"}
            </Button>
          </NavbarMenuItem>
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
