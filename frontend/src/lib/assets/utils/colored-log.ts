const colors = {
  yellow: 33,
  red: 31,
  green: 32,
};

type Color = keyof typeof colors;

export function coloredLog(color: Color, value: string): void {
  console.log(`\x1b[${colors[color]}m${value}\x1b[0m`);
}