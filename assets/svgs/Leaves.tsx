import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const Leaves = (props: SvgProps) => {
  const { size = 20, color = "#000" } = props;
  return (
    <Svg
      width={size}
      height={size}
      fill='none'
      {...props}>
      <Path
        d='M1 16C1 13.7909 3.68629 12 7 12C10.3137 12 13 13.7909 13 16'
        stroke={color}
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <Path
        d='M19 7L15 11L13 9'
        stroke={color}
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <Path
        d='M7 9C9.20914 9 11 7.20914 11 5C11 2.79086 9.20914 1 7 1C4.79086 1 3 2.79086 3 5C3 7.20914 4.79086 9 7 9Z'
        stroke={color}
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </Svg>
  );
};
export default Leaves;
