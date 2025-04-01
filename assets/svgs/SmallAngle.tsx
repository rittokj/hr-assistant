import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const SmallAngle = (props: SvgProps) => {
  const { width = 12, height = 7, color = "#000" } = props;
  return (
    <Svg width={width} height={height} fill="none" {...props}>
      <Path
        d="M11 1L6 6L1 1"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};
export default SmallAngle;
