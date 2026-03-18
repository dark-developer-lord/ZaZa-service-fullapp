import {
    Chip,
    List,
    ListItem,
    ListItemButton,
    useTheme,
    useMediaQuery,
    Typography
} from "@mui/material"
import { NavType } from "./nav-type"
import { Link, useLocation } from "react-router-dom"
// import { orderStatusLabels } from "@shared/lib"

interface Props {
    item: NavType
}

export const MenuNav = ({item}: Props) => {
      const { pathname, search } = useLocation()
      const theme = useTheme()
      const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))

      const url = pathname + search

    return (<>
        {
        !isMobile && (
            <List
                disablePadding
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    border: '1px solid #FFFFFF',
                    borderRadius: '10px',
                    bgcolor: '#FFFFFF',
                    width: 'auto',
                }}
            >
                {
                    item.children?.map((child)=> (
                        <ListItem
                            key={child.path}
                            disablePadding
                            sx={{
                                width: 'auto',
                                padding: '4px'
                            }}
                        >
                            <ListItemButton
                                component={Link}
                                to={child.path}
                                sx={{
                                bgcolor:
                                    url === child.path ? '#005456' : '#F5F7FA',
                                color:
                                    url === child.path ? '#FFFFFF' : '#231F20',
                                 }}
                            >
                                <Typography
                                    title={child.label}
                                    fontSize="13px"
                                >
                                    {child.label}
                                </Typography>
                                {child.chip !== undefined && (
                                    <Chip
                                        label={child.chip}
                                        size="small"
                                        sx={{ ml: '3px', bgcolor: '#FFFFFF' }}
                                        // color={(orderStatusLabels[child.name as never] as any)?.color}
                                    />
                                )}
                            </ListItemButton>
                        </ListItem>
                    ))
                }
       </List>
        )}
    </>)
}