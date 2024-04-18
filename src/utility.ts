import { mat4, vec3, vec2 } from "gl-matrix";

export const DegToRad = Math.PI / 180;

export type BufferBundle = {
  buffer: GPUBuffer;
  bindGroups: GPUBindGroup[];
};

export type Bounds = {
  size: [number, number, number];
  center: [number, number, number];
  rotation: mat4;
};

export async function getDevice(): Promise<{
  gpu: GPU;
  device: GPUDevice;
  optionalFeatures: { canTimestamp: boolean };
}> {
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

  const requiredFeatures: GPUFeatureName[] = [];

  const canTimestamp = adapter.features.has("timestamp-query");
  if (canTimestamp) {
    requiredFeatures.push("timestamp-query");
  }

  const device = await adapter.requestDevice({
    requiredFeatures,
  });
  if (!device) {
    console.log("browser does not support WebGPU");
    alert("browser does not support WebGPU");
    throw new Error("browser does not support WebGPU");
  }

  const optionalFeatures = {
    canTimestamp,
  };

  return { gpu, device, optionalFeatures };
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
  indices: Uint32Array;
  normals: Float32Array | undefined;
  uvs: Float32Array | undefined;
  textureURIs: string[];
  tangents: Float32Array | undefined;
  bitangents: Float32Array | undefined;
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
        // console.log(resultJson);
        resolve(resultJson);
      });
  });

  let mesh = resultJson.meshes[0];

  const vertices = Float32Array.from(mesh.vertices);
  const normals = Float32Array.from(mesh.normals);

  let uvs = undefined;
  if (mesh.texturecoords.length > 1) {
    console.log("mesh has multiple sets of texturecoords");
    console.log(mesh.texturecoords);
  }
  if (mesh.texturecoords.length > 0) {
    uvs = Float32Array.from(mesh.texturecoords[0]);
  }
  const indices = Uint32Array.from(mesh.faces.flat());

  let textures = resultJson.textures;
  let textureURIs: string[] = [];
  if (textures) {
    for (let i = 0; i < textures.length; i++) {
      const textureJson = textures[i];
      textureURIs.push(
        `data:image/${textureJson.formathint};base64,${textureJson.data}`
      );
    }
  }

  let tangents = undefined;
  if (mesh.tangents) {
    tangents = new Float32Array(mesh.tangents);
  }

  let bitangents = undefined;
  if (mesh.bitangents) {
    bitangents = new Float32Array(mesh.bitangents);
  }

  return {
    vertices,
    indices,
    normals,
    uvs,
    textureURIs,
    tangents,
    bitangents,
  };
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

export function calculateNormals(
  vertices: Float32Array,
  indices: Uint32Array
): Float32Array {
  if (indices.length % 3 !== 0) {
    throw new Error(
      `calculateNormals indices length ${indices.length} should be a multiple of 3`
    );
  }

  const edge1 = vec3.create();
  const edge2 = vec3.create();

  const v1 = vec3.create();
  const v2 = vec3.create();
  const v3 = vec3.create();

  const normal = vec3.create();

  const normals = new Float32Array(vertices.length);

  for (let i = 0; i < indices.length / 3; i++) {
    const v1i = indices[i * 3];
    vec3.set(
      v1,
      vertices[v1i * 3],
      vertices[v1i * 3 + 1],
      vertices[v1i * 3 + 2]
    );
    const v2i = indices[i * 3 + 1];
    vec3.set(
      v2,
      vertices[v2i * 3],
      vertices[v2i * 3 + 1],
      vertices[v2i * 3 + 2]
    );
    const v3i = indices[i * 3 + 2];
    vec3.set(
      v3,
      vertices[v3i * 3],
      vertices[v3i * 3 + 1],
      vertices[v3i * 3 + 2]
    );

    vec3.sub(edge1, v2, v1);
    vec3.sub(edge2, v3, v1);
    vec3.cross(normal, edge1, edge2);
    vec3.normalize(normal, normal);

    normals[v1i * 3] += normal[0];
    normals[v1i * 3 + 1] += normal[1];
    normals[v1i * 3 + 2] += normal[2];

    normals[v2i * 3] += normal[0];
    normals[v2i * 3 + 1] += normal[1];
    normals[v2i * 3 + 2] += normal[2];

    normals[v3i * 3] += normal[0];
    normals[v3i * 3 + 1] += normal[1];
    normals[v3i * 3 + 2] += normal[2];
  }

  for (let i = 0; i < normals.length / 3; i++) {
    const ni = i * 3;
    vec3.set(normal, normals[ni], normals[ni + 1], normals[ni + 2]);

    vec3.normalize(normal, normal);

    normals[ni] = normal[0];
    normals[ni + 1] = normal[1];
    normals[ni + 2] = normal[2];
  }

  return normals;
}

export function calculateTangents(
  vertices: Float32Array,
  indices: Uint32Array,
  uvs: Float32Array
): {
  tangents: Float32Array;
  bitangents: Float32Array;
} {
  if (indices.length % 3 !== 0) {
    throw new Error(
      `calculateTangents indices length ${indices.length} should be a multiple of 3`
    );
  }

  const edge1 = vec3.create();
  const edge2 = vec3.create();
  const deltaUV1 = vec2.create();
  const deltaUV2 = vec2.create();

  const v1 = vec3.create();
  const v2 = vec3.create();
  const v3 = vec3.create();

  const uv1 = vec2.create();
  const uv2 = vec2.create();
  const uv3 = vec2.create();

  const tangent = vec3.create();
  const bitangent = vec3.create();

  const tangents = new Float32Array(vertices.length);
  const bitangents = new Float32Array(vertices.length);

  for (let i = 0; i < indices.length / 3; i++) {
    const v1i = indices[i * 3];
    vec3.set(
      v1,
      vertices[v1i * 3],
      vertices[v1i * 3 + 1],
      vertices[v1i * 3 + 2]
    );
    const v2i = indices[i * 3 + 1];
    vec3.set(
      v2,
      vertices[v2i * 3],
      vertices[v2i * 3 + 1],
      vertices[v2i * 3 + 2]
    );
    const v3i = indices[i * 3 + 2];
    vec3.set(
      v3,
      vertices[v3i * 3],
      vertices[v3i * 3 + 1],
      vertices[v3i * 3 + 2]
    );

    vec3.sub(edge1, v2, v1);
    vec3.sub(edge2, v3, v1);

    vec2.set(uv1, uvs[v1i * 2], uvs[v1i * 2 + 1]);
    vec2.set(uv2, uvs[v2i * 2], uvs[v2i * 2 + 1]);
    vec2.set(uv3, uvs[v3i * 2], uvs[v3i * 2 + 1]);

    vec2.sub(deltaUV1, uv2, uv1);
    vec2.sub(deltaUV2, uv3, uv1);

    const f = 1 / (deltaUV1[0] * deltaUV2[1] - deltaUV2[0] * deltaUV1[1]);

    vec3.set(
      tangent,
      f * (deltaUV2[1] * edge1[0] - deltaUV1[1] * edge2[0]),
      f * (deltaUV2[1] * edge1[1] - deltaUV1[1] * edge2[1]),
      f * (deltaUV2[1] * edge1[2] - deltaUV1[1] * edge2[2])
    );

    vec3.set(
      bitangent,
      f * (-deltaUV2[0] * edge1[0] + deltaUV1[0] * edge2[0]),
      f * (-deltaUV2[0] * edge1[1] + deltaUV1[0] * edge2[1]),
      f * (-deltaUV2[0] * edge1[2] + deltaUV1[0] * edge2[2])
    );

    tangents[v1i * 3] += tangent[0];
    tangents[v1i * 3 + 1] += tangent[1];
    tangents[v1i * 3 + 2] += tangent[2];

    tangents[v2i * 3] += tangent[0];
    tangents[v2i * 3 + 1] += tangent[1];
    tangents[v2i * 3 + 2] += tangent[2];

    tangents[v3i * 3] += tangent[0];
    tangents[v3i * 3 + 1] += tangent[1];
    tangents[v3i * 3 + 2] += tangent[2];

    bitangents[v1i * 3] += bitangent[0];
    bitangents[v1i * 3 + 1] += bitangent[1];
    bitangents[v1i * 3 + 2] += bitangent[2];

    bitangents[v2i * 3] += bitangent[0];
    bitangents[v2i * 3 + 1] += bitangent[1];
    bitangents[v2i * 3 + 2] += bitangent[2];

    bitangents[v3i * 3] += bitangent[0];
    bitangents[v3i * 3 + 1] += bitangent[1];
    bitangents[v3i * 3 + 2] += bitangent[2];
  }

  for (let i = 0; i < vertices.length / 3; i++) {
    const vi = i * 3;
    vec3.set(tangent, tangents[vi], tangents[vi + 1], tangents[vi + 2]);

    vec3.normalize(tangent, tangent);

    tangents[vi] = tangent[0];
    tangents[vi + 1] = tangent[1];
    tangents[vi + 2] = tangent[2];

    vec3.set(bitangent, bitangents[vi], bitangents[vi + 1], bitangents[vi + 2]);

    vec3.normalize(bitangent, bitangent);

    bitangents[vi] = bitangent[0];
    bitangents[vi + 1] = bitangent[1];
    bitangents[vi + 2] = bitangent[2];
  }

  return { tangents, bitangents };
}
