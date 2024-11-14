import * as webllm from '@mlc-ai/web-llm';
import llmAppConfig from './llmAppConfig';


const default_max_tokens = 1024;
const default_temp = 0.8;
let modelLoaded: boolean = false;

export enum Role {
  system = "system",
  user = "user",
  assistant = "assistant"

}

export interface ChatRequest {
  messages: ChatMessage[]
  max_tokens?: number
  temperature?: number
}

export interface ChatMessage {
  role: Role
  content: string
}

const worker = new Worker(new URL('./llmServiceWorker.ts', import.meta.url), {
  type: 'module'
})

const initProgressCallback = (report: webllm.InitProgressReport) => {
  console.log(report);
}

const DEFAULT_MODEL = "Llama-3.2-3B-Instruct-q4f16_1-MLC";
const LOW_RESOURCE_MODEL = "Phi-3.5-mini-instruct-q4f16_1-MLC-1k";


let engine: webllm.MLCEngineInterface | undefined = undefined;
const config: webllm.AppConfig = llmAppConfig;

function getEngine() {
  if (!engine) {
    engine = new webllm.WebWorkerMLCEngine(
      worker,
      { appConfig: config},
    );
  }

  return engine;
}
    

export async function chat(request?: ChatRequest, streaming?: boolean) {
  let engine = getEngine();
  await loadModel();
}

async function loadModel() {
  const androidMaxStorageBufferBindingSize = 1 << 27; // 128MB
  const mobileVendors = new Set<string>(["qualcomm", "arm"]);
  let maxStorageBufferBindingSize: number;
  let restrictModel: boolean = false;
  let gpuVendor: string;
  let engine: webllm.MLCEngineInterface = getEngine();
  try {
    [maxStorageBufferBindingSize, gpuVendor] = await Promise.all([
      engine.getMaxStorageBufferBindingSize(),
      engine.getGPUVendor(),
    ])
  } catch (err) {
    console.error(err);
    return;
  }

  if ( (gpuVendor.length != 0 && mobileVendors.has(gpuVendor)) || maxStorageBufferBindingSize <= androidMaxStorageBufferBindingSize) {
    console.log("Your device seems to have limited resources, so we are using a low resource model");
    restrictModel = true;
  }

  console.log("maxStorageBufferBindingSize:", `${maxStorageBufferBindingSize} bytes`);
  console.log('gpuVendor:', gpuVendor);

  let model = restrictModel? LOW_RESOURCE_MODEL : DEFAULT_MODEL;
  console.log('selected model:', model);

  engine.setInitProgressCallback(initProgressCallback);
  await engine.reload(model);
}