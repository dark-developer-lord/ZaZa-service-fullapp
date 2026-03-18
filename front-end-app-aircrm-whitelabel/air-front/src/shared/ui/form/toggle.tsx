import { styled, Switch, SwitchProps } from '@mui/material'

/**
 * Custom Toggle Component based on Figma design
 * - Size: 50x20 with corner radius 5
 * - Off state: #9A9DA3 with inner shadow
 * - On state: #0E9F6E
 * - Inner square: 16x16 with corner radius 5, white, margin-y:2 margin-l:2
 */
export const Toggle = styled((props: SwitchProps) => (
  <Switch
    focusVisibleClassName=".Mui-focusVisible"
    disableRipple
    {...props}
  />
))(({ theme }) => ({
  width: 50,
  height: 20,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(30px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#0E9F6E',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#0E9F6E',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.grey[100],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.5,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 16,
    height: 16,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  '& .MuiSwitch-track': {
    borderRadius: 5,
    backgroundColor: '#9A9DA3',
    opacity: 1,
    boxShadow: 'inset 0px 0px 2px rgba(0, 0, 0, 0.25)',
    transition: theme.transitions.create(['background-color'], {
      duration: 300,
    }),
  },
}))

