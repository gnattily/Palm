/**
 * Converts red green and blue color values into a hexidecimal format
 * @param {byte} red The r value (0-255)
 * @param {byte} green The g value (0-255)
 * @param {byte} blue The b value (0-255)
 * @returns A hexidecimal representing the color
 */
function rgbToHex(red, green, blue) {
	// Ensure the RGB values are within the valid range (0 to 255)
	if (red < 0 || red > 255 || green < 0 || green > 255 || blue < 0 || blue > 255) {
		throw new Error('Invalid RGB values');
	}

	// Convert each RGB component to a two-digit hexadecimal string
	const hexRed = red.toString(16).padStart(2, '0');
	const hexGreen = green.toString(16).padStart(2, '0');
	const hexBlue = blue.toString(16).padStart(2, '0');

	// Concatenate the individual hexadecimal components
	const hexValue = `${hexRed}${hexGreen}${hexBlue}`;

	return parseInt(hexValue, 16);
}

/**
 * Converts a hexidecimal into an array of RGB values
 * @param {hexidecimal} hex The hex value to decode
 * @returns RGB values in an array
 */
function hexToRgb(hex) {
	const red = (hex >> 16) & 0xff;
	const green = (hex >> 8) & 0xff;
	const blue = hex & 0xff;

	return [red, green, blue];
}

/**
 * Interpolates a value based on given points and ratios.
 *
 * @param {number[]} points - The array of values.
 * @param {number[]} ratios - The array of ratios corresponding to the values.
 * @param {number} targetRatio - The target ratio for interpolation.
 * @returns {number} - The interpolated value.
 * @throws {Error} - If the number of points and ratios is not the same.
 */
function interpolateValue(points, ratios, targetRatio) {
	if (points.length !== ratios.length) {
		throw new Error('Number of points and ratios should be the same.');
	}

	const numPoints = points.length;

	// Find the indices of the two nearest points surrounding the target ratio
	let startIndex, endIndex;
	for (let i = 0; i < numPoints - 1; i++) {
		if (ratios[i] <= targetRatio && ratios[i + 1] >= targetRatio) {
			startIndex = i;
			endIndex = i + 1;
			break;
		}
	}

	// If the target ratio is outside the defined range, return the closest point value
	if (startIndex === undefined || endIndex === undefined) {
		if (targetRatio < ratios[0]) {
			return points[0];
		} else if (targetRatio > ratios[numPoints - 1]) {
			return points[numPoints - 1];
		}
	}

	// Perform linear interpolation between the two nearest points
	const startValue = points[startIndex];
	const endValue = points[endIndex];

	const startRatio = ratios[startIndex]; // 0.5
	const endRatio = ratios[endIndex]; // 1
	const t = (targetRatio - startRatio) / (endRatio - startRatio);

	return startValue + (endValue - startValue) * t;
}

function interpolateColor(colors, ratios, targetRatio) {
	const rgbColors = [];

	colors.forEach(color => {
		rgbColors.push(hexToRgb(color));
	});

	const r = [];
	const g = [];
	const b = [];

	rgbColors.forEach(color => {
		r.push(color[0]);
		g.push(color[1]);
		b.push(color[2]);
	});

	return [
		Math.round(interpolateValue(r, ratios, targetRatio)),
		Math.round(interpolateValue(g, ratios, targetRatio)),
		Math.round(interpolateValue(b, ratios, targetRatio)),
	];
}

module.exports = interpolateColor;
module.exports.rgbToHex = rgbToHex;