import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const Home = (props: SvgProps) => {
  const { size = 20, color = "#000" } = props;
  return (
    <Svg width={size} height={size} fill="none" {...props}>
      <Path
        d="M16.6585 7.37242L9.6585 1.24742C9.28148 0.917526 8.71852 0.917525 8.3415 1.24742L1.3415 7.37242C1.12448 7.56231 1 7.83664 1 8.125V16.6712C1 17.2235 1.44772 17.6712 2 17.6712H16C16.5523 17.6712 17 17.2235 17 16.6712V8.125C17 7.83664 16.8755 7.56231 16.6585 7.37242Z"
        stroke={color}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};
export default Home;
