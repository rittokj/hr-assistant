import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const ArrowRight = (props: SvgProps) => {
  const { size = 20, color = "#000" } = props;
  return (
    <Svg width={size} height={size} fill="none" {...props}>
      <Path
        d="M10 19C14.9706 19 19 14.9706 19 10C19 5.02944 14.9706 1 10 1C5.02944 1 1 5.02944 1 10C1 14.9706 5.02944 19 10 19Z"
        stroke={color}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M11 13L14 10M14 10L11 7M14 10L6 10"
        stroke={color}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};
export default ArrowRight;
