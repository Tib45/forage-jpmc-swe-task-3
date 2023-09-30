import { ServerRespond } from "./DataStreamer";

export interface Row {
  price_abc: number;
  price_def: number;
  ratio: number;
  upper_bound: number;
  lower_bound: number;
  trigger_alert: number | undefined;
  timestamp: Date;
}

export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]) {
    // Get API results:
    const abc = serverResponds[0];
    const def = serverResponds[1];

    // Bound values:
    const boundThr = 0.05;
    const upperBound = 1 + boundThr;
    const lowerBound = 1 - boundThr;

    // Compute prices, ratio, trigger alert and timestamp:
    const priceABC = (abc.top_ask.price + abc.top_bid.price) / 2;
    const priceDEF = (def.top_ask.price + def.top_bid.price) / 2;
    const ratio = priceABC / priceDEF;
    const triggerAlet =
      ratio > upperBound || ratio < lowerBound ? ratio : undefined;

    const timestamp =
      serverResponds[0].timestamp > serverResponds[1].timestamp
        ? serverResponds[0].timestamp
        : serverResponds[1].timestamp;

    return {
      price_abc: priceABC,
      price_def: priceDEF,
      ratio: ratio,
      timestamp: timestamp,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      trigger_alert: triggerAlet,
    };
  }
}
