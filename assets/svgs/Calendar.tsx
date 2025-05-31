import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const Calendar = (props: SvgProps) => {
	const { size = 11, color = '#000' } = props;
	return (
		<Svg
			width={size}
			height={size}
			fill='none'
			{...props}>
			<Path
				d='M3.5 1V3M9.5 10H1.5C1.36739 10 1.24021 9.94732 1.14645 9.85355C1.05268 9.75979 1 9.63261 1 9.5V4.5H10V9.5C10 9.63261 9.94732 9.75979 9.85355 9.85355C9.75979 9.94732 9.63261 10 9.5 10ZM10 2.5C10 2.36739 9.94732 2.24021 9.85355 2.14645C9.75979 2.05268 9.63261 2 9.5 2H1.5C1.36739 2 1.24021 2.05268 1.14645 2.14645C1.05268 2.24021 1 2.36739 1 2.5V4.5H10V2.5ZM7.5 1V3V1Z'
				stroke={color}
				stroke-width='0.5'
				stroke-linecap='round'
				stroke-linejoin='round'
			/>
		</Svg>
	);
};
export default Calendar;
