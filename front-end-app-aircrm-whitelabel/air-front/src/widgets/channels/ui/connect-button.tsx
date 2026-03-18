import { useProfile } from "@shared/auth";
import { Channel } from "./channel";
import { Grid } from "@mui/material";

export const channelArr = [
  // {
  //   img: '/icons/facebook.png',
  //   title: 'Facebook Direct',
  //   subtitle: 'facebook',
  //   typeChannel: 'Facebook'
  // },
  {
    img: '/icons/instagram.webp',
    title: 'Instagram Direct',
    subtitle: 'instagram',
    typeChannel: 'Instagram'
  },
  {
    img: '/icons/whatsapp.png',
    title: 'WhatsApp Direct',
    subtitle: 'whatsapp',
    typeChannel: 'WhatsApp'
  },
  {
    img: '/icons/messenger.png',
    title: 'Messenger Direct',
    subtitle: 'messenger',
    typeChannel: 'Messenger'
  }
]

interface Props {
  platforms: typeof channelArr
}

export const ConnectButton = ({ platforms }: Props) => {
  const { profile } = useProfile();

  if (!profile) {
    return null;
  }

  return (
    <Grid container spacing={2}>
      {platforms.map((info) => (
        <Grid key={info.title} item xs={12} mobile={4}>
          <Channel
            img={info.img}
            title={info.title}
            subtitle={info.subtitle}
            typeChannel={info.typeChannel}
          />
        </Grid>
      ))}
    </Grid>
  )
};