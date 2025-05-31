import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const Profile = (props: SvgProps) => {
  const { size = 20, color = "#000" } = props;
  return (
    <Svg
      width={size}
      height={size}
      fill='none'
      {...props}>
      <Path
        d='M10 19C14.9706 19 19 14.9706 19 10C19 5.02944 14.9706 1 10 1C5.02944 1 1 5.02944 1 10C1 14.9706 5.02944 19 10 19Z'
        stroke={color}
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <Path
        d='M15.2165 17.3323C13.9348 15.9008 12.0725 15 9.99984 15C7.92718 15 6.06492 15.9008 4.7832 17.3323'
        stroke={color}
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <Path
        d='M10 12C11.6569 12 13 10.6569 13 9C13 7.34315 11.6569 6 10 6C8.34315 6 7 7.34315 7 9C7 10.6569 8.34315 12 10 12Z'
        stroke={color}
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </Svg>
  );
};
export default Profile;
