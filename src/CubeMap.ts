import { parseHDR } from "./parseHDR";

export class CubeMap {
  equirectangularTexture: GPUTexture | undefined;

  async init(device: GPUDevice, imageURI: string) {
    const hdr = await parseHDR(imageURI);

    this.equirectangularTexture = device.createTexture({
      size: { width: hdr.width, height: hdr.height },
      format: "rgba16float",
      usage:
        GPUTextureUsage.RENDER_ATTACHMENT |
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_DST,
    });

    device.queue.writeTexture(
      { texture: this.equirectangularTexture },
      hdr.data.buffer,
      { bytesPerRow: 8 * hdr.width },
      { width: hdr.width, height: hdr.height }
    );
  }
}
