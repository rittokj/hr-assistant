import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const AngleRight = (props: SvgProps) => {
  const { width = 8, height = 14, color = "#000" } = props;
  return (
    <Svg
      width={width}
      height={height}
      fill='none'
      {...props}>
      <Path
        d='M1 1L7 7L0.999999 13'
        stroke={color}
        stroke-width='1.5'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </Svg>
  );
};
export default AngleRight;
