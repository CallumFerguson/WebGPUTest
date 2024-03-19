import { mat4, vec3 } from "gl-matrix";

export type BufferBundle = {
  buffer: GPUBuffer;
  bindGroups: GPUBindGroup[];
};

export type Bounds = {
  size: [number, number, number];
  center: [number, number, number];
  rotation: mat4;
};

export async function getDevice(): Promise<{ gpu: GPU; device: GPUDevice }> {
  const gpu = navigator.gpu;
  if (!gpu) {
    console.log("browser does not support WebGPU");
    alert("browser does not support WebGPU");
    throw new Error("browser does not support WebGPU");
  }
  const adapter = await gpu?.requestAdapter({
    powerPreference: "high-performance",
  });
  if (!adapter) {
    console.log("browser does not support WebGPU");
    alert("browser does not support WebGPU");
    throw new Error("browser does not support WebGPU");
  }
  const device = await adapter.requestDevice();
  if (!device) {
    console.log("browser does not support WebGPU");
    alert("browser does not support WebGPU");
    throw new Error("browser does not support WebGPU");
  }

  return { gpu, device };
}

export function createBuffer(
  device: GPUDevice,
  data: any, // TypedArray or ArrayBuffer
  usage: GPUBufferUsageFlags
) {
  const buffer = device.createBuffer({
    size: data.byteLength,
    usage,
    mappedAtCreation: true,
  });

  const mappedRange = buffer.getMappedRange();

  if (data instanceof ArrayBuffer) {
    const view = new Uint8Array(mappedRange);
    view.set(new Uint8Array(data));
  } else {
    const dst = new data.constructor(mappedRange);
    dst.set(data);
  }

  buffer.unmap();
  return buffer;
}

export async function loadModel(fileName: string): Promise<{
  vertices: Float32Array;
  normals: Float32Array;
  uvs: Float32Array;
  textureURI: string;
  indices: Uint32Array;
}> {
  // @ts-ignore
  const ajs: any = await assimpjs();

  // fetch the files to import
  let files = [fileName];

  const resultJson: any = await new Promise((resolve, reject) => {
    Promise.all(files.map((file) => fetch(file)))
      .then((responses) => {
        return Promise.all(responses.map((res) => res.arrayBuffer()));
      })
      .then((arrayBuffers) => {
        // create new file list object, and add the files
        let fileList = new ajs.FileList();
        for (let i = 0; i < files.length; i++) {
          fileList.AddFile(files[i], new Uint8Array(arrayBuffers[i]));
        }

        // convert file list to assimp json
        let result = ajs.ConvertFileList(fileList, "assjson");

        // check if the conversion succeeded
        if (!result.IsSuccess() || result.FileCount() == 0) {
          console.log(result.GetErrorCode());
          reject(result.GetErrorCode());
          return;
        }

        // get the result file, and convert to string
        let resultFile = result.GetFile(0);
        let jsonContent = new TextDecoder().decode(resultFile.GetContent());

        // parse the result json
        let resultJson = JSON.parse(jsonContent);
        resolve(resultJson);
      });
  });

  let mesh = resultJson.meshes[0];

  const vertices = Float32Array.from(mesh.vertices);
  const normals = Float32Array.from(mesh.normals);
  if (mesh.texturecoords.length < 1) {
    console.log("texture missing texurecoords");
  }
  if (mesh.texturecoords.length > 1) {
    console.log("texture has multiple sets of texturecoords");
    console.log(mesh.texturecoords);
  }
  const uvs = Float32Array.from(mesh.texturecoords[0]);
  const indices = Uint32Array.from(mesh.faces.flat());

  let textureURI;
  if (resultJson.textures && resultJson.textures.length > 0) {
    const textureJson = resultJson.textures[0];
    textureURI = `data:image/${textureJson.formathint};base64,${textureJson.data}`;
  } else {
    textureURI = "";
  }

  return { vertices, normals, uvs, textureURI, indices };
}

export function randomDirection(randomVec3: vec3, magnitude: number = 1): vec3 {
  const theta = Math.random() * 2 * Math.PI;
  const phi = Math.random() * Math.PI;

  const x = Math.sin(phi) * Math.cos(theta);
  const y = Math.sin(phi) * Math.sin(theta);
  const z = Math.cos(phi);

  randomVec3[0] = x;
  randomVec3[1] = y;
  randomVec3[2] = z;

  vec3.normalize(randomVec3, randomVec3);
  vec3.scale(randomVec3, randomVec3, magnitude);

  return randomVec3;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// from: https://webgpufundamentals.org/webgpu/lessons/webgpu-environment-maps.html
export const cubeVertexData = new Float32Array([
  //  position   |  normals
  //-------------+----------------------
  // front face      positive z
  -1, 1, 1, 0, 0, 1, -1, -1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, -1, 1, 0, 0, 1,
  // right face      positive x
  1, 1, -1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, -1, -1, 1, 0, 0, 1, -1, 1, 1, 0, 0,
  // back face       negative z
  1, 1, -1, 0, 0, -1, 1, -1, -1, 0, 0, -1, -1, 1, -1, 0, 0, -1, -1, -1, -1, 0,
  0, -1,
  // left face        negative x
  -1, 1, 1, -1, 0, 0, -1, 1, -1, -1, 0, 0, -1, -1, 1, -1, 0, 0, -1, -1, -1, -1,
  0, 0,
  // bottom face      negative y
  1, -1, 1, 0, -1, 0, -1, -1, 1, 0, -1, 0, 1, -1, -1, 0, -1, 0, -1, -1, -1, 0,
  -1, 0,
  // top face         positive y
  -1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, -1, 1, -1, 0, 1, 0, 1, 1, -1, 0, 1, 0,
]);

export const cubeIndices = new Uint16Array([
  0,
  1,
  2,
  2,
  1,
  3, // front
  4,
  5,
  6,
  6,
  5,
  7, // right
  8,
  9,
  10,
  10,
  9,
  11, // back
  12,
  13,
  14,
  14,
  13,
  15, // left
  16,
  17,
  18,
  18,
  17,
  19, // bottom
  20,
  21,
  22,
  22,
  21,
  23, // top
]);
