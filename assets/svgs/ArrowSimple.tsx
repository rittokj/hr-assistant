import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const ArrowSimple = (props: SvgProps) => {
  const { color = "#000" } = props;
  return (
    <Svg
      width='17'
      height='12'
      fill='none'
      {...props}>
      <Path
        d='M1 6L16 6'
        stroke={color}
        stroke-width='1.5'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <Path
        d='M11 1L16 6L11 11'
        stroke={color}
        stroke-width='1.5'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </Svg>
  );
};
export default ArrowSimple;
