import { useDisplay } from "vuetify";

export const useMobile = () => {
  const { mobile } = useDisplay();
  return mobile; // true for mobile, false for desktop
};
