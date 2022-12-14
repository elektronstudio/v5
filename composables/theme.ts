import { useCssVar } from "@vueuse/core";
import { useStorage } from "@vueuse/core";

const vars = [
  [useCssVar("--bg"), ["rgb(0, 0, 0)", "rgb(255, 255, 255)"]],
  [useCssVar("--fg"), ["rgb(255, 255, 255)", "rgb(0, 0, 0)"]],
  // [useCssVar("--gray-50"), ["250 250 250", "23 23 23"]],
  // [useCssVar("--gray-100"), ["245 245 245", "38 38 38"]],
  // [useCssVar("--gray-200"), ["229 229 229", "64 64 64"]],
  // [useCssVar("--gray-300"), ["212 212 212", "82 82 82"]],
  // [useCssVar("--gray-400"), ["163 163 163", "115 115 115"]],
  // [useCssVar("--gray-500"), ["115 115 115", "163 163 163"]],
  // [useCssVar("--gray-600"), ["82 82 82", "212 212 212"]],
  // [useCssVar("--gray-700"), ["64 64 64", "229 229 229"]],
  // [useCssVar("--gray-800"), ["38 38 38", "245 245 245"]],
  // [useCssVar("--gray-900"), ["23 23 23", "250 250 250"]],
];

export const useTheme = () => {
  const theme = useStorage<number>("theme", 0);

  const changeTheme = () => {
    theme.value = 1 - theme.value;
    vars.forEach((v) => {
      //@ts-ignore
      v[0].value = v[1][theme.value];
    });
  };

  return { theme, changeTheme };
};
