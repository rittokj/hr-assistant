import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const Close = (props: SvgProps) => {
  const { width = 11, height = 11, color = "#000" } = props;
  return (
    <Svg width={width} height={height} fill="none" {...props}>
      <Path
        d="M10 0.923065L5.32306 5.60001L10 10.2769"
        stroke={color}
        stroke-width="0.675558"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M0.399902 0.923035L5.07684 5.59998L0.399902 10.2769"
        stroke={color}
        stroke-width="0.675558"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};
export default Close;
