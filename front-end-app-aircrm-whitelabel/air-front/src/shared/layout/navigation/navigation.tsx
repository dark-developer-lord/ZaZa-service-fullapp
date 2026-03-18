import { useState, useEffect } from 'react';
// MUI
import { Box, Stack, Dialog, DialogActions, DialogTitle, DialogContent, Button, Typography } from '@mui/material'
import { styled, Theme, CSSObject } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import ArrowBack from '@mui/icons-material/ArrowBack'
import ArrowForward from '@mui/icons-material/ArrowForward'
import SettingsIcon from '@mui/icons-material/Settings'
import PersonIcon from '@mui/icons-material/Person'
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import StorefrontIcon from '@mui/icons-material/Storefront'
import BadgeIcon from '@mui/icons-material/Badge'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
// --------
import { NavGroupType, NavType } from './nav-type'
import { useNavList } from './use-nav-list'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SupportIcon from '@icons/support.svg?react'
import TelegramIcon from '@mui/icons-material/Telegram';  // Telegram Icon
// import WhatsAppIcon from '@mui/icons-material/WhatsApp';  // WhatsApp Icon
import { useNavigate } from 'react-router-dom';
import { RouterPaths } from '@shared/lib';
import { MenuItem } from './menu-item';
import { useGetLoginSource } from '@shared/auth';

interface Props {
  items: NavGroupType[]
}

/** Dispatched whenever hint preference changes so the label updates instantly */
const HINT_EVENT = 'hint-changed'

const readHint = () => localStorage.getItem('hint')

export const Navigation = ({ items }: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const navList = useNavList(items)
  const [open, setOpen] = useState(true);
  const navigate = useNavigate()
  const loginSource = useGetLoginSource()

  // #1 — reactive hint: re-reads from localStorage on custom event
  const [hint, setHint] = useState(readHint)
  useEffect(() => {
    const handler = () => setHint(readHint())
    window.addEventListener(HINT_EVENT, handler)
    return () => window.removeEventListener(HINT_EVENT, handler)
  }, [])

  const toggle = () => {
    setOpen(!open)
  }

  const ChevronDrawerIcon = open ? ArrowBack : ArrowForward

  const menuList = navList.reduce((menuArr, navItem)=>  {
    menuArr.push(...navItem.children)
    return menuArr
  }, [] as NavType[])

  return (
    <Drawer
    open={open}
    variant="permanent"
    sx={{
      '& .MuiDrawer-paper': {
        padding: '8px',
      },
    }}
  >
    <Box
      onClick={() => {
        localStorage.setItem("hint", "show")
        navigate(RouterPaths.onboarding)
      }}
      sx={{ mt: '15px', cursor: "pointer" }}>
      <img
        src={
          open ?
          '/images/air-crm-logo.svg' :
          '/images/air-crm-logo-mini.svg'
        }
        alt='logo'
        width='100%'
        height={35}
      />
    </Box>

    {/* Panel role badge — visually distinguishes admin from vendor */}
    {loginSource === 'admin' ? (
      <Box
        sx={{
          mt: '10px',
          mb: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'flex-start' : 'center',
          gap: '6px',
          px: open ? '4px' : 0,
          py: '6px',
          borderRadius: '8px',
          bgcolor: '#1a0a00',
          border: '1px solid #C95B00',
          overflow: 'hidden',
        }}
      >
        <AdminPanelSettingsIcon sx={{ color: '#FF8F3F', fontSize: 18, flexShrink: 0 }} />
        {open && (
          <Typography
            noWrap
            sx={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#FF8F3F',
              letterSpacing: '0.3px',
              textTransform: 'uppercase',
            }}
          >
            Супер-Администратор
          </Typography>
        )}
      </Box>
    ) : loginSource === 'vendor' ? (
      <Box
        sx={{
          mt: '10px',
          mb: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'flex-start' : 'center',
          gap: '6px',
          px: open ? '4px' : 0,
          py: '6px',
          borderRadius: '8px',
          bgcolor: '#e6f4f4',
          border: '1px solid #005456',
          overflow: 'hidden',
        }}
      >
        <StorefrontIcon sx={{ color: '#005456', fontSize: 18, flexShrink: 0 }} />
        {open && (
          <Typography
            noWrap
            sx={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#005456',
              letterSpacing: '0.3px',
              textTransform: 'uppercase',
            }}
          >
            Панель продавца
          </Typography>
        )}
      </Box>
    ) : loginSource === 'vendor-employee' ? (
      <Box
        sx={{
          mt: '10px',
          mb: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'flex-start' : 'center',
          gap: '6px',
          px: open ? '4px' : 0,
          py: '6px',
          borderRadius: '8px',
          bgcolor: '#f0f0f5',
          border: '1px solid #6b6b8a',
          overflow: 'hidden',
        }}
      >
        <BadgeIcon sx={{ color: '#4a4a6a', fontSize: 18, flexShrink: 0 }} />
        {open && (
          <Typography
            noWrap
            sx={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#4a4a6a',
              letterSpacing: '0.3px',
              textTransform: 'uppercase',
            }}
          >
            Сотрудник магазина
          </Typography>
        )}
      </Box>
    ) : null}

    <Stack>
      {/* {navList.map((item) => (
        <NavGroup
          key={item.name}
          group={item}
          open={open}
          collapseMenu={() => setOpen(true)}
        />
      ))} */}
      <List>
        {menuList.map((child) => (
          <MenuItem
            key={child.name}
            item={child}
            open={open}
          />
        ))}
      </List>
    </Stack>
    <DrawerFooter
      sx={{
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'inherit',
      }}
    >
      <List>
        <ListItemButton
          sx={[
            !open && { px: 0, justifyContent: 'center' },
            { minHeight: 48 },
          ]}
          onClick={() => setModalOpen(true)}
        >
          <ListItemIcon sx={!open ? { justifyContent: 'center' } : undefined}>
            <SupportIcon />
          </ListItemIcon>
          {open && <ListItemText>Поддержка</ListItemText>}
        </ListItemButton>

         { (loginSource === 'vendor' || loginSource === 'saas') && <ListItemButton
            onClick={() => {
              const next = hint === 'hide' ? 'show' : 'hide'
              localStorage.setItem('hint', next)
              window.dispatchEvent(new CustomEvent(HINT_EVENT))
              navigate(next === 'hide' ? RouterPaths.posTerminal : RouterPaths.onboarding)
            }}
            sx={[
              !open && {
                px: 0,
                justifyContent: 'center',
              },
              {
                minHeight: 48,
              }
            ]}
          >
            <ListItemIcon
              sx={
                !open ? { justifyContent: 'center' } : undefined
              }
            >
              <HelpOutlineIcon/>
            </ListItemIcon>
              {open && <ListItemText>{hint === 'hide' ? 'Открыть подсказку' : 'Закрыть подсказку'}</ListItemText>}
          </ListItemButton>}
          {(loginSource === 'vendor' || loginSource === 'vendor-employee') && (
          <ListItemButton
            onClick={() => navigate(RouterPaths.panelSettings)}
            sx={[
              !open && { px: 0, justifyContent: 'center' },
              { minHeight: 48 },
            ]}
          >
            <ListItemIcon sx={!open ? { justifyContent: 'center' } : undefined}>
              <SettingsIcon />
            </ListItemIcon>
            {open && <ListItemText>Настройка панелей</ListItemText>}
          </ListItemButton>
          )}
          {(loginSource === 'vendor' || loginSource === 'saas' || loginSource === 'admin') && (
          <ListItemButton
            onClick={() => navigate(RouterPaths.metaSettings)}
            sx={[
              !open && { px: 0, justifyContent: 'center' },
              { minHeight: 48 },
            ]}
          >
            <ListItemIcon sx={!open ? { justifyContent: 'center' } : undefined}>
              <IntegrationInstructionsIcon />
            </ListItemIcon>
            {open && <ListItemText>Meta интеграции</ListItemText>}
          </ListItemButton>
          )}
          <ListItemButton
            onClick={() => navigate(RouterPaths.profileSettings)}
            sx={[
              !open && { px: 0, justifyContent: 'center' },
              { minHeight: 48 },
            ]}
          >
            <ListItemIcon sx={!open ? { justifyContent: 'center' } : undefined}>
              <PersonIcon />
            </ListItemIcon>
            {open && <ListItemText>Профиль</ListItemText>}
          </ListItemButton>
          <ListItemButton
            sx={[
              !open && {
                px: 0,
                justifyContent: 'center'
              },
              {
                minHeight: 48,
              }
            ]}
            onClick={toggle}
          >
            <ListItemIcon
              sx={
                !open ? { justifyContent: 'center' } : undefined
              }
            >
              <ChevronDrawerIcon />
            </ListItemIcon>
            {open && <ListItemText>Свернуть меню</ListItemText>}
          </ListItemButton>
      </List>
    </DrawerFooter>
    <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          Сообщить о проблеме
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<TelegramIcon />}
              onClick={() => window.open('https://t.me/airecosystems', '_blank')}
            >
              Telegram
            </Button>
            {/* <Button
              variant="contained"
              color="success"
              startIcon={<WhatsAppIcon />}
              onClick={() => window.open('https://wa.me/your-whatsapp-link', '_blank')}
            >
              WhatsApp
            </Button> */}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)} color="secondary">
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>
  </Drawer>
  )
}

const drawerWidth = 280;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  minWidth: 0,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  // width: `calc(${theme.spacing(7)} + 1px)`,
  width: '80px',
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  minWidth: 0
});


const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const DrawerFooter = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginRight: 0,
  marginTop: 'auto',
  ...theme.mixins.toolbar
}))