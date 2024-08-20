import React from "react";
import Menuitems from "./MenuItems";
import { usePathname } from "next/navigation";
import { Box, List, ListItemIcon, ListItemText } from "@mui/material";
import NavItem from "./NavItem";
import NavGroup from "./NavGroup/NavGroup";

const SidebarItems = ({ toggleMobileSidebar, isCollapsed }: any) => {
  const pathname = usePathname();
  const pathDirect = pathname;

  return (
    <Box sx={{ px: isCollapsed ? 1 : 2, marginTop: 0 }}>
      <List sx={{ pt: 0 }} className="sidebarNav" component="div">
        {Menuitems.map((item) => {
          if (item.subheader) {
            return !isCollapsed ? (
              <NavGroup item={item} key={item.subheader} />
            ) : null;
          } else {
            return (
              <NavItem
                item={item}
                key={item.id}
                pathDirect={pathDirect}
                onClick={toggleMobileSidebar}
                isCollapsed={isCollapsed}
              />
            );
          }
        })}
      </List>
    </Box>
  );
};

export default SidebarItems;
