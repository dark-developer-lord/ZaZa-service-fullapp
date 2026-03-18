import { Box, Button, Divider, Typography } from "@mui/material"
import { useProfile } from "@shared/auth";
import { Board } from "@shared/ui"
import axios from "axios";

interface Props {
    img: string,
    title: string,
    subtitle: string,
    typeChannel: string
}

export const Channel = ({img, title, subtitle, typeChannel}: Props) => {
      const { profile } = useProfile();

      if(!profile){
        return null
      }

     const handleClick = async () => {
        try {
        // Use subtitle (whatsapp or instagram) as the platform parameter
        const platform = subtitle.toLowerCase()
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/v3/messengers/connect?store_id=${profile.id}&platform=${platform}`);

        const { auth_url } = response.data;

        if (auth_url) {
            window.location.href = auth_url;
        } else {
            console.error("auth_url not found in response:", response.data);
        }

        } catch (error) {
        console.error(`Error fetching ${typeChannel} connect URL:`, error);
        }
    };

    return (
        <Board>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              mb: '10px'
            }}
          >
            <img width={48} height={48} src={img} alt={subtitle} />
            <Box>
              <Typography
                variant="h4"
              >
                {title}
              </Typography>
              <span>
                {subtitle}
              </span>
            </Box>
          </Box>
          <Divider/>
          <Box sx={{m: '20px'}}>
            <Typography
              variant="h4"
              fontSize={'26px'}
              letterSpacing={'1px'}
              mb={'10px'}
            >
              Получайте сообщения из {typeChannel} Direct.
            </Typography>
            <Typography
              fontSize={'15px'}
              fontWeight={600}
              lineHeight={2}
            >
              Чтобы подключить, используйте публичную страницу {typeChannel}, где вы администратор, и связанный с ней бизнес-аккаунт {typeChannel}
            </Typography>
          </Box>
          <Button
            sx={{
                width: '100%',
                borderRadius: "15px",
                bgcolor: "#005456",
                color: "#fff",
                "&:hover": {
                  bgcolor: "#004040"
                }
            }}
            onClick={handleClick}
          >
            Подключить
          </Button>
        </Board>
    )
}