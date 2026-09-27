import { Box } from "@mui/material";
import HeroCarousel from "../home-components/slider-home";
import CalendarioHome from "../home-components/calendar-home";
import NoticiasHome from "../home-components/news-section";
import BannerReserva from "../home-components/reserve-visit-section";
export const Home = () => {
  return (
    <Box>
      <HeroCarousel />
      <CalendarioHome />
      <BannerReserva />
      <NoticiasHome />
    </Box>
  );
};
