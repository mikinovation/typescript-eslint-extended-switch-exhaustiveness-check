// Good example: Switch with proper satisfies never in default case
type Color = 'red' | 'green' | 'blue';

function getColorCode(color: Color): string {
  switch (color) {
    case 'red':
      return '#FF0000';
    case 'green':
      return '#00FF00';
    case 'blue':
      return '#0000FF';
    default:
      throw new Error(`Unexpected color: ${color satisfies never}`);
  }
}