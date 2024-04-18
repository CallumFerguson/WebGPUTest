export class RollingAverage {
  private samples: number[] = [];
  private readonly numSamples: number;
  private total: number = 0;
  private _average: number = 0;

  constructor(numSamples = 100) {
    if (numSamples < 1) {
      throw new Error("numSamples should be larger than 0");
    }
    this.numSamples = numSamples;
  }

  addSample(sample: number) {
    this.samples.push(sample);
    this.total += sample;
    if (this.samples.length > this.numSamples) {
      const oldestSample = this.samples.shift()!;
      this.total -= oldestSample;
    }
    this._average = this.total / this.samples.length;
  }

  average() {
    return this._average;
  }
}
