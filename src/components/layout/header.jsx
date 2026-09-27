import { useState } from "react";

import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";

import { Link } from "react-router-dom";

export function Header() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { label: "Museo", to: "/" },
    { label: "Exhibiciones", to: "/exhibiciones" },
    { label: "Recursos", to: "/recursosMuseo" },
    { label: "Noticias", to: "/noticias" },
    { label: "Agenda", to: "/agenda" },
  ];

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: "background.paper",
          color: "text.primary",
          borderBottom: "1px solid",
          borderColor: "grey.200",
        }}
      >
        <Toolbar
          sx={{
            px: { xs: 2, md: 7 },
            py: 1.5,
            minHeight: 90,
          }}
        >
          {/* LOGO */}
          <Box
            component="img"
            src="/logo-museo-Header.png"
            alt="Logo Museo"
            sx={{
              height: 69,
              width: "auto",
            }}
          />

          {/* ESPACIADOR */}
          <Box sx={{ flexGrow: 1 }} />

          {/* NAV DESKTOP */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
            }}
          >
            {navLinks.map((link) => (
              <Button
                key={link.to}
                component={Link}
                to={link.to}
                color="inherit"
                sx={{
                  fontWeight: 500,
                  textTransform: "none",
                }}
              >
                {link.label}
              </Button>
            ))}
          </Box>

          {/* MOBILE BUTTON */}
          <IconButton
            sx={{
              display: { xs: "flex", md: "none" },
            }}
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* MOBILE DRAWER */}
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 260 }}>
          <List>
            {navLinks.map((link) => (
              <ListItem key={link.to} disablePadding>
                <ListItemButton
                  component={Link}
                  to={link.to}
                  onClick={() => setOpen(false)}
                >
                  <ListItemText primary={link.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
