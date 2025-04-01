import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const CircleAngleDown = (props: SvgProps) => {
  const { color = "#000" } = props;
  return (
    <Svg width="16" height="16" fill="none" {...props}>
      <Path
        d="M0.999999 8C0.999999 11.866 4.134 15 8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 0.999999 4.13401 0.999999 8Z"
        stroke={color}
        stroke-width="0.777778"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M5.66658 7.22222L7.99992 9.55555L10.3333 7.22222"
        stroke={color}
        stroke-width="0.777778"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};
export default CircleAngleDown;
