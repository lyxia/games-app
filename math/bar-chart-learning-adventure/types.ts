export enum WeatherType {
  Sunny = 'Sunny',
  Cloudy = 'Cloudy',
  Rainy = 'Rainy',
  Thunder = 'Thunder'
}

export interface WeatherData {
  type: WeatherType;
  count: number;
}

export enum Stage {
  Counting = 1,
  Scale = 2,
  Comparison = 3,
  Review = 4
}