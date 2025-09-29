import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useLocation, useNavigate } from 'react-router-dom';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import TableViewIcon from '@mui/icons-material/TableView';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FolderIcon from '@mui/icons-material/Folder';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import MonitorIcon from '@mui/icons-material/Monitor';
import GavelIcon from '@mui/icons-material/Gavel';
import InsightsIcon from '@mui/icons-material/Insights';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SettingsIcon from '@mui/icons-material/Settings';
import BarChartIcon from '@mui/icons-material/BarChart';
import StorefrontIcon from '@mui/icons-material/Storefront';
import InfoIcon from '@mui/icons-material/Info';
import StorageIcon from '@mui/icons-material/Storage';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SupportAgentIcon from '@mui/icons-material/HelpOutline';

const drawerWidth = 320;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `60px`,
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  })
);

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open
      ? {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        }
      : {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        }),
  })
);

// ------------------ Navigation ------------------
const navigation = [
  {
    title: "Data Marketplace",
    icon: <StorefrontIcon />,
    items: [
      { title: "Dashboard", path: "/marketplace/dashboard", icon: <DashboardIcon /> },
      { title: "Browse Data Products", path: "/marketplace/data-products", icon: <SearchIcon /> },
      { title: "Cart", path: "/marketplace/cart", icon: <ShoppingCartIcon /> },
      { title: "Order Status", path: "/marketplace/order-status", icon: <AssignmentIcon /> },
    ],
  },
  {
    title: "Data Management",
    icon: <FolderIcon />,
    items: [
      { title: "My Subscriptions", path: "/data-management/my-subscriptions", icon: <FolderIcon /> },
      { title: "Validation Reports", path: "/data-management/validation", icon: <FactCheckIcon /> },
      { title: "Monitoring", path: "/data-management/monitoring", icon: <MonitorIcon /> },
      { title: "Data Contracts", path: "/data-management/contracts", icon: <GavelIcon /> },
      { title: "Observability", path: "/data-management/observability", icon: <InsightsIcon /> },
    ],
  },
  {
    title: "User Management",
    icon: <AccountCircleIcon />,
    items: [
      { title: "Your Account", path: "/user/account", icon: <AccountCircleIcon /> },
      { title: "Wishlist", path: "/user/wishlist", icon: <FavoriteIcon /> },
      { title: "Become a Data Producer", path: "/user/become-producer", icon: <CloudUploadIcon /> },
    ],
  },
  {
    title: "Data Producer",
    icon: <ManageAccountsIcon />,
    items: [
      { title: "Producer Console", path: "/producer/console", icon: <SettingsIcon /> },
      { title: "Data Product Studio", path: "/producer/data-product-studio", icon: <StorageIcon /> },
      { title: "Consumer Requests", path: "/producer/consumer-requests", icon: <AssignmentIcon /> },
      { title: "Usage Metrics", path: "/producer/product-usage", icon: <InsightsIcon /> },
    ],
  },
  {
    title: "Admin",
    icon: <AdminPanelSettingsIcon />,
    items: [
      { title: "Admin Console", path: "/admin/console", icon: <SettingsIcon /> },
      { title: "Marketplace Management", path: "/admin/marketplace-management", icon: <StorageIcon /> },
      { title: "Producer Management", path: "/admin/producer-management", icon: <ManageAccountsIcon /> },
      { title: "Marketplace Analytics", path: "/admin/marketplace-analytics", icon: <BarChartIcon /> },
    ],
  },
];

// Bottom items
const bottomNavigation = [
  { title: "Support", icon: <SupportAgentIcon />, path: "/support" },
  { title: "Notifications", icon: <NotificationsIcon />, path: "/notifications" },
  { title: "About DataKart", icon: <InfoIcon />, path: "/about" },
  { title: "Sign Out", icon: <LogoutIcon />, path: "/signout" },
];

// ------------------ Navbar ------------------
export default function Navbar({ content }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = React.useState(true);
  const [expanded, setExpanded] = React.useState({});
  const [tempExpanded, setTempExpanded] = React.useState({});

  React.useEffect(() => {
    const newExpanded = {};
    const checkActive = (items) => {
      items.forEach(item => {
        if (item.items) {
          if (item.items.some(sub => sub.path === location.pathname)) {
            newExpanded[item.title] = true;
          }
          checkActive(item.items);
        }
      });
    };
    checkActive(navigation);
    setExpanded(newExpanded);
    if (open) setTempExpanded(newExpanded);
  }, [location.pathname, open]);

  const handleDrawerToggle = () => {
    if (open) {
      setTempExpanded({});
      setOpen(false);
    } else {
      setTempExpanded(expanded);
      setOpen(true);
    }
  };

  const handleToggle = (key) => {
    const newExpanded = { ...tempExpanded, [key]: !tempExpanded[key] };
    setTempExpanded(newExpanded);
    setExpanded(newExpanded);
  };

  const renderNavItems = (items, level = 0) => {
    return items.map((item) => {
      const isActive = item.path === location.pathname;
      return (
        <React.Fragment key={item.title}>
          <ListItemButton
            sx={{ pl: 2 + level * 4, bgcolor: isActive ? 'rgba(0,0,0,0.08)' : 'inherit' }}
            onClick={() => item.items ? handleToggle(item.title) : navigate(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.title} />
            {item.items ? (tempExpanded[item.title] ? <ExpandLess /> : <ExpandMore />) : null}
          </ListItemButton>
          {item.items && (
            <Collapse in={tempExpanded[item.title]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderNavItems(item.items, level + 1)}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ marginRight: 5 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Data Marketplace
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader />
        <List>
          {navigation.map((section) => (
            <React.Fragment key={section.title}>
              <ListItemButton onClick={() => handleToggle(section.title)}>
                <ListItemIcon>{section.icon}</ListItemIcon>
                <ListItemText primary={section.title} />
                {section.items ? (tempExpanded[section.title] ? <ExpandLess /> : <ExpandMore />) : null}
              </ListItemButton>
              {section.items && (
                <Collapse in={tempExpanded[section.title]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {renderNavItems(section.items, 1)}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>

        <Divider sx={{ marginTop: 2 }} />

        <List>
          {bottomNavigation.map((item) => (
            <ListItemButton key={item.title} onClick={() => navigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {content}
      </Box>
    </Box>
  );
}
