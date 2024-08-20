import React from "react";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, styled, useTheme } from "@mui/material";
import Link from "next/link";

type NavGroup = {
  [x: string]: any;
  id?: string;
  navlabel?: boolean;
  subheader?: string;
  title?: string;
  icon?: any;
  href?: any;
  disabled?: boolean;
  external?: boolean;
  onClick?: React.MouseEvent<HTMLButtonElement, MouseEvent>;
};

interface ItemType {
  item: NavGroup;
  pathDirect: string;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  isCollapsed: boolean;
  hideMenu?: any;
  level?: number | any;
}

const NavItem = ({ item, level, pathDirect, onClick, isCollapsed }: ItemType) => {
  const Icon = item.icon;

  const theme = useTheme();

  const ListItemStyled = styled(ListItem)(() => ({
    padding: 0,
    ".MuiButtonBase-root": {
      whiteSpace: "nowrap",
      marginBottom: "2px",
      padding: "8px 10px",
      borderRadius: "8px",
      backgroundColor: level > 1 ? "transparent !important" : "inherit",
      color: theme.palette.text.secondary,
      paddingLeft: "10px",
      "&:hover": {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.primary.main,
      },
      "&.Mui-selected": {
        color: "white",
        backgroundColor: theme.palette.primary.main,
        "&:hover": {
          backgroundColor: theme.palette.primary.main,
          color: "white",
        },
      },
    },
  }));
  return (
    <List component="div" disablePadding key={item.id}>
      <ListItemStyled>
        <ListItemButton
          component={Link}
          href={item.href}
          disabled={item.disabled}
          selected={pathDirect === item.href}
          target={item.external ? "_blank" : ""}
          onClick={onClick}
          sx={{
            justifyContent: isCollapsed ? "center" : "flex-start",
            paddingLeft: isCollapsed ? 5 : 3,
          }}
        >
          <ListItemIcon sx={{
            minWidth: "36px",
            p: "3px 0",
            color: "inherit",
          }}>
            <Icon stroke={1.5} size="1.5rem" />
          </ListItemIcon>
          {!isCollapsed && <ListItemText>
            <>{item.title}</>
          </ListItemText>}
        </ListItemButton>
      </ListItemStyled>
    </List>
  );
};

export default NavItem;
