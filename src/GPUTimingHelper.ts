import { RollingAverage } from "./RollingAverage";

export class GPUTimingHelper {
  private readonly _canTimestamp: boolean;

  private readonly querySet: GPUQuerySet | undefined;
  private readonly resolveBuffer: GPUBuffer | undefined;
  private readonly resultBuffer: GPUBuffer | undefined;

  private readonly gpuTimeMS = new RollingAverage();

  newResultCallback: ((gpuTimeMS: number) => void) | undefined = undefined;

  constructor(device: GPUDevice, renderPassDescriptor: unknown) {
    this._canTimestamp = device.features.has("timestamp-query");

    if (!this._canTimestamp) {
      return;
    }

    this.querySet = device.createQuerySet({
      type: "timestamp",
      count: 2,
    });
    this.resolveBuffer = device.createBuffer({
      size: this.querySet.count * 8,
      usage: GPUBufferUsage.QUERY_RESOLVE | GPUBufferUsage.COPY_SRC,
    });
    this.resultBuffer = device.createBuffer({
      size: this.resolveBuffer.size,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });

    // @ts-ignore
    renderPassDescriptor.timestampWrites = {
      querySet: this.querySet,
      beginningOfPassWriteIndex: 0,
      endOfPassWriteIndex: 1,
    };
  }

  storeTime(commandEncoder: GPUCommandEncoder) {
    if (!this._canTimestamp) {
      return;
    }

    commandEncoder.resolveQuerySet(
      this.querySet!,
      0,
      this.querySet!.count,
      this.resolveBuffer!,
      0
    );
    if (this.resultBuffer!.mapState === "unmapped") {
      commandEncoder.copyBufferToBuffer(
        this.resolveBuffer!,
        0,
        this.resultBuffer!,
        0,
        this.resultBuffer!.size
      );
    }
  }

  recordTime() {
    if (!this._canTimestamp) {
      return;
    }

    if (this._canTimestamp && this.resultBuffer!.mapState === "unmapped") {
      this.resultBuffer!.mapAsync(GPUMapMode.READ).then(() => {
        const times = new BigInt64Array(this.resultBuffer!.getMappedRange());
        const resultMS = Number(times[1] - times[0]) / (1000 * 1000);
        this.gpuTimeMS.addSample(resultMS);
        this.resultBuffer!.unmap();
        if (this.newResultCallback) {
          this.newResultCallback(resultMS);
        }
      });
    }
  }

  canTimestamp() {
    return this._canTimestamp;
  }

  averageMS() {
    return this.gpuTimeMS.average();
  }
}
