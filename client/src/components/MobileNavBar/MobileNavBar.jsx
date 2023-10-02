import MobileNavItem from "../MobileNavItem";
import { Stack } from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";
import { NAV_ITEMS } from "../../data/options";

export default function MobileNav() {
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      p={4}
      display={{ md: "none" }}
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
}
