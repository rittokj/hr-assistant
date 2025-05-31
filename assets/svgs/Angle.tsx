import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const Angle = (props: SvgProps) => {
  const { width = 9, height = 16, color = "#000" } = props;
  return (
    <Svg
      width={width}
      height={height}
      fill='none'
      {...props}>
      <Path
        d='M1 1L8 8L1 15'
        stroke={color}
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </Svg>
  );
};
export default Angle;
