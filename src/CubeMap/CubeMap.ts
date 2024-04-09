import { parseHDR } from "../parseHDR";
import {
  cubeMapTextureToIrradianceTexture,
  equirectangularTextureToCubeMap,
} from "./cubeMapUtility";

export class CubeMap {
  equirectangularTexture: GPUTexture | undefined = undefined;
  cubeMapTexture: GPUTexture | undefined = undefined;
  irradianceCubeMapTexture: GPUTexture | undefined = undefined;

  async init(device: GPUDevice, imageURI: string) {
    const hdr = await parseHDR(imageURI);

    const equirectangularTexture = device.createTexture({
      size: { width: hdr.width, height: hdr.height },
      format: "rgba16float",
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
    });
    this.equirectangularTexture = equirectangularTexture;

    device.queue.writeTexture(
      { texture: equirectangularTexture },
      hdr.data.buffer,
      { bytesPerRow: 8 * hdr.width },
      { width: hdr.width, height: hdr.height }
    );

    this.cubeMapTexture = await equirectangularTextureToCubeMap(
      device,
      equirectangularTexture
    );

    this.irradianceCubeMapTexture = await cubeMapTextureToIrradianceTexture(
      device,
      this.cubeMapTexture
    );
  }
}
