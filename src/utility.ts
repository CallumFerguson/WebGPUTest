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

  const textureJson = resultJson.textures[0];
  const textureURI = `data:image/${textureJson.formathint};base64,${textureJson.data}`;

  return { vertices, normals, uvs, textureURI, indices };
}
