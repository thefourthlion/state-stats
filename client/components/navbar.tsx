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
import { link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";
import { initFirebase } from "@/firebase";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const app = initFirebase();
  const auth = getAuth(app);
  const [user, loading] = useAuthState(auth);
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

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/"> 
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {[
            { label: "Map", href: "/" },
            { label: "State Data", href: "/pages/statedata" },
            { label: "Compare States", href: "/pages/comparestates" },
            { label: "Moving Calculator", href: "/pages/movingcalculator" },
          ].map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
 
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {[
            { label: "Map", href: "/" },
            { label: "State Data", href: "/pages/statedata" },
            { label: "Compare States", href: "/pages/comparestates" },
            { label: "Moving Calculator", href: "/pages/movingcalculator" },

            {
              label: user ? "Logout" : "Login",
              href: "#",
              onClick: handleAuthAction,
            },
          ].map((item, index) => (
            <NavbarMenuItem key={`${item.label}-${index}`}>
              {item.onClick ? (
                <Link
                  color={"foreground"}
                  href={item.href}
                  size="lg"
                  onClick={item.onClick}
                >
                  {item.label}
                </Link>
              ) : (
                <Link color={"foreground"} href={item.href} size="lg">
                  {item.label}
                </Link>
              )}
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
