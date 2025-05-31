import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const Attendance = (props: SvgProps) => {
  const { size = 20, color = "#000" } = props;
  return (
    <Svg
      width={size}
      height={size}
      fill='none'
      {...props}>
      <Path
        d='M1 7H17'
        stroke={color}
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <Path
        d='M16 3H2C1.44772 3 1 3.44772 1 4V18C1 18.5523 1.44772 19 2 19H16C16.5523 19 17 18.5523 17 18V4C17 3.44772 16.5523 3 16 3Z'
        stroke={color}
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <Path
        d='M13 1V3'
        stroke={color}
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <Path
        d='M5 1V3'
        stroke={color}
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </Svg>
  );
};
export default Attendance;
