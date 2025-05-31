import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const Bell = (props: SvgProps) => {
  const { size = 20, color = "#000" } = props;
  return (
    <Svg
      width={size}
      height={size}
      fill='none'
      {...props}>
      <Path
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M12 15H6v1a3 3 0 1 0 6 0v-1ZM2 15h14a1 1 0 0 0 1-1v-.586a1 1 0 0 0-.293-.707l-.51-.51a.67.67 0 0 1-.197-.475V8A7 7 0 1 0 2 8v3.722a.67.67 0 0 1-.196.474l-.511.511a1 1 0 0 0-.293.707V14a1 1 0 0 0 1 1Z'
      />
    </Svg>
  );
};
export default Bell;
