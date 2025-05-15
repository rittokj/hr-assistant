import { primaryColor } from '@/constants/Colors';
import * as React from 'react';
import Svg, { SvgProps, Path, Circle } from 'react-native-svg';

const Plus = (props: SvgProps) => {
	const { size = 31, color = '#000' } = props;
	return (
		<Svg
			width={size}
			height={size}
			fill='none'
			{...props}>
			{/* <Path
        d="M10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10C19 14.9706 14.9706 19 10 19Z"
        stroke={color}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M9 13L6 10M6 10L9 7M6 10L14 10"
        stroke={color}
        stroke-linecap="round"
        stroke-linejoin="round"
      /> */}
			<Circle
				cx='15.5'
				cy='15.5'
				r='15'
				transform='matrix(-1 0 0 1 31 0)'
				stroke={primaryColor}
			/>
			<Path
				d='M10 16H22'
				stroke={primaryColor}
				stroke-linecap='round'
				stroke-linejoin='round'
			/>
			<Path
				d='M16 22L16 10'
				stroke={primaryColor}
				stroke-linecap='round'
				stroke-linejoin='round'
			/>
		</Svg>
	);
};
export default Plus;
