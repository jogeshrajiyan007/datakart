import * as React from 'react';
import { styled, useTheme, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InputBase from '@mui/material/InputBase';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import { useLocation, useNavigate } from 'react-router-dom';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
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

import datakartLogo from '../assets/datakartLogo.svg';

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
    backgroundColor: '#001f54',
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

// ------------------ Search ------------------
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': { backgroundColor: alpha(theme.palette.common.white, 0.25) },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: { marginLeft: theme.spacing(3), width: 'auto' },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '12ch',
    '&:focus': { width: '20ch' },
  },
}));

// ------------------ Navigation ------------------
const navigation = [
  {
    title: 'Data Marketplace',
    icon: <StorefrontIcon />,
    items: [
      { title: 'Dashboard', path: '/marketplace/dashboard', icon: <DashboardIcon /> },
      { title: 'Browse Data Products', path: '/marketplace/data-products', icon: <SearchIcon /> },
      { title: 'Cart', path: '/marketplace/cart', icon: <ShoppingCartIcon /> },
      { title: 'Order Status', path: '/marketplace/order-status', icon: <AssignmentIcon /> },
    ],
  },
  {
    title: 'Data Management',
    icon: <FolderIcon />,
    items: [
      { title: 'My Subscriptions', path: '/data-management/my-subscriptions', icon: <FolderIcon /> },
      { title: 'Validation Reports', path: '/data-management/validation', icon: <FactCheckIcon /> },
      { title: 'Monitoring', path: '/data-management/monitoring', icon: <MonitorIcon /> },
      { title: 'Data Contracts', path: '/data-management/contracts', icon: <GavelIcon /> },
      { title: 'Observability', path: '/data-management/observability', icon: <InsightsIcon /> },
    ],
  },
  {
    title: 'User Management',
    icon: <AccountCircleIcon />,
    items: [
      { title: 'Your Account', path: '/user/account', icon: <AccountCircleIcon /> },
      { title: 'Wishlist', path: '/user/wishlist', icon: <FavoriteIcon /> },
      { title: 'Become a Data Producer', path: '/user/become-producer', icon: <CloudUploadIcon /> },
    ],
  },
  {
    title: 'Data Producer',
    icon: <ManageAccountsIcon />,
    items: [
      { title: 'Producer Console', path: '/producer/console', icon: <SettingsIcon /> },
      { title: 'Data Product Studio', path: '/producer/data-product-studio', icon: <StorageIcon /> },
      { title: 'Consumer Requests', path: '/producer/consumer-requests', icon: <AssignmentIcon /> },
      { title: 'Usage Metrics', path: '/producer/product-usage', icon: <InsightsIcon /> },
    ],
  },
  {
    title: 'Admin',
    icon: <AdminPanelSettingsIcon />,
    items: [
      { title: 'Admin Console', path: '/admin/console', icon: <SettingsIcon /> },
      { title: 'Marketplace Management', path: '/admin/marketplace-management', icon: <StorageIcon /> },
      { title: 'Producer Management', path: '/admin/producer-management', icon: <ManageAccountsIcon /> },
      { title: 'Marketplace Analytics', path: '/admin/marketplace-analytics', icon: <BarChartIcon /> },
    ],
  },
];

// Bottom items
const bottomNavigation = [
  { title: 'Support', icon: <SupportAgentIcon />, path: '/support' },
  { title: 'Notifications', icon: <NotificationsIcon />, path: '/notifications' },
  { title: 'About DataKart', icon: <InfoIcon />, path: '/about' },
  { title: 'Sign Out', icon: <LogoutIcon />, path: '/signout' },
];

export default function Navbar({ content }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState({});
  const [tempExpanded, setTempExpanded] = React.useState({});
  const [anchorEl, setAnchorEl] = React.useState(null);
  const accountMenuOpen = Boolean(anchorEl);

  React.useEffect(() => {
    const newExpanded = {};
    const checkActive = (items) => {
      items.forEach((item) => {
        if (item.items) {
          if (item.items.some((sub) => sub.path === location.pathname)) {
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
      setTempExpanded({}); // collapse all submenus
      setOpen(false);
    } else {
      setTempExpanded(expanded); // restore active menus
      setOpen(true);
    }
  };

  const handleToggle = (key) => {
    const newExpanded = { ...tempExpanded, [key]: !tempExpanded[key] };
    setTempExpanded(newExpanded);
    setExpanded(newExpanded);
  };

  const handleAccountClick = (event) => setAnchorEl(event.currentTarget);
  const handleAccountClose = () => setAnchorEl(null);

  const renderNavItems = (items, level = 0) =>
    items.map((item) => {
      const isActive = item.path === location.pathname;
      const iconButton = (
        <ListItemButton
          sx={{ pl: 2 + level * 4, bgcolor: isActive ? 'rgba(0,0,0,0.08)' : 'inherit' }}
          onClick={() => {
            if (!open) setOpen(true); // auto-expand drawer when icon clicked
            item.items ? handleToggle(item.title) : navigate(item.path);
          }}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.title} />
          {item.items ? (tempExpanded[item.title] ? <ExpandLess /> : <ExpandMore />) : null}
        </ListItemButton>
      );

      return (
        <React.Fragment key={item.title}>
          {open ? (
            iconButton
          ) : (
            <Tooltip title={item.title} placement="right">
              {iconButton}
            </Tooltip>
          )}
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

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton color="inherit" aria-label="toggle drawer" onClick={handleDrawerToggle} edge="start" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Box component="img" src={datakartLogo} alt="DataKart Logo" sx={{ width: 135, height: 50, mr: 4 }} />

          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <Search sx={{ width: { xs: '100%', sm: '400px', md: '500px' } }}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} sx={{ width: '100%' }} />
            </Search>
          </Box>

          <IconButton color="inherit" sx={{ mr: 2 }} onClick={() => navigate('/marketplace/cart')}>
            <Badge badgeContent={0} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          <IconButton color="inherit" sx={{ mr: 2 }}>
            <Badge badgeContent={0} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <IconButton color="inherit" onClick={handleAccountClick}>
            <AccountCircleIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={accountMenuOpen} onClose={handleAccountClose}>
            <MenuItem onClick={() => { navigate('/user/account'); handleAccountClose(); }}>Your Profile</MenuItem>
            <MenuItem onClick={() => { navigate('/signout'); handleAccountClose(); }}>Sign Out</MenuItem>
            <MenuItem onClick={() => { navigate('/support'); handleAccountClose(); }}>Contact Admin</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader />
        <List>
          {navigation.map((section) => (
            <React.Fragment key={section.title}>
              {open ? (
                <ListItemButton onClick={() => handleToggle(section.title)}>
                  <ListItemIcon>{section.icon}</ListItemIcon>
                  <ListItemText primary={section.title} />
                  {section.items ? (tempExpanded[section.title] ? <ExpandLess /> : <ExpandMore />) : null}
                </ListItemButton>
              ) : (
                <Tooltip title={section.title} placement="right">
                  <ListItemButton
                    onClick={() => {
                      if (!open) setOpen(true);
                      handleToggle(section.title);
                    }}
                  >
                    <ListItemIcon>{section.icon}</ListItemIcon>
                  </ListItemButton>
                </Tooltip>
              )}
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

        <Divider sx={{ mt: 2 }} />

        <List>
          {bottomNavigation.map((item) => (
            <Tooltip key={item.title} title={item.title} placement="right">
              <ListItemButton onClick={() => navigate(item.path)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                {open && <ListItemText primary={item.title} />}
              </ListItemButton>
            </Tooltip>
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
