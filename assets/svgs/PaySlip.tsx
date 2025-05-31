import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const PaySlip = (props: SvgProps) => {
  const { size = 20, color = "#000" } = props;
  return (
    <Svg
      width={size}
      height={size}
      fill='none'
      {...props}>
      <Path
        d='M14 19H2C1.44772 19 1 18.5523 1 18L1 2C1 1.44772 1.44772 1 2 1L9.56309 1C9.84165 1 10.1076 1.11619 10.2968 1.32059L14.7338 6.11246C14.9049 6.29731 15 6.53995 15 6.79187L15 18C15 18.5523 14.5523 19 14 19Z'
        stroke={color}
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <Path
        d='M15 7L10 7C9.44772 7 9 6.55228 9 6L9 1'
        stroke={color}
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </Svg>
  );
};
export default PaySlip;
