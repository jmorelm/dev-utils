import { useState, useEffect } from "react";
import { useMediaQuery, Box, Drawer, IconButton } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import SidebarItems from "./SidebarItems";
import useWindowSize from "../hooks/useWindowSize";
import Logo from "../shared/logo/Logo";

interface ItemType {
  isMobileSidebarOpen: boolean;
  onSidebarClose: (event: React.MouseEvent<HTMLElement>) => void;
  isSidebarOpen: boolean;
}

const Sidebar = ({
  isMobileSidebarOpen,
  onSidebarClose,
  isSidebarOpen,
}: ItemType) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up("lg"));
  const { width } = useWindowSize();

  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Calcular si el sidebar debe colapsarse automáticamente según el tamaño de la pantalla
  useEffect(() => {
    if (width < 1200) {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
    }
  }, [width]);

  const sidebarWidth = isCollapsed ? "80px" : "270px"; // Ajusta el ancho según el estado colapsado

  return (
    <Box
      sx={{
        width: sidebarWidth,
        flexShrink: 0,
        position: lgUp ? "relative" : "absolute",
        height: "100vh",
        transition: "width 0.3s ease",
      }}
    >
      <Drawer
        anchor="left"
        open={lgUp ? true : isMobileSidebarOpen}
        onClose={onSidebarClose}
        variant={lgUp ? "permanent" : "temporary"}
        PaperProps={{
          sx: {
            width: sidebarWidth,
            boxSizing: "border-box",
            transition: "width 0.3s ease",
            boxShadow: (theme) => theme.shadows[8],
          },
        }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: isCollapsed ? "center" : "flex-start",
          }}
        >
          <Box
            sx={{
              width: isCollapsed ? "40px" : "150px",
              margin: "0 auto",
              transition: "width 0.3s ease",
            }}
          >
            <Logo small={isCollapsed} />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: isCollapsed ? "center" : "flex-end",
              width: "100%",
              padding: isCollapsed ? "10px" : "0px",
              paddingRight: "15px"
            }}
          >
            <IconButton onClick={handleCollapseToggle}>
              {isCollapsed ? <MenuIcon /> : <KeyboardDoubleArrowLeftIcon />}
            </IconButton>
          </Box>
          <Box flex={1} overflow="auto" sx={{ width: "100%" }}>
            <SidebarItems isCollapsed={isCollapsed} />
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Sidebar;