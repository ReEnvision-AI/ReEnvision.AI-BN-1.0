import * as webllm from "@mlc-ai/web-llm";

const MODEL: string = 'Llama-3.1-8B-Instruct-q4f32_1-MLC';

let engine: webllm.WebWorkerMLCEngine;

let isModelLoaded: boolean = false;

export type Role = 'system' | 'user' | 'assistant';

export type ChatMessage = {
    role: Role;
    content: string;
}

export type ChatRequest = {
    messages: ChatMessage[];
    temperature?: number;
    max_tokens?: number;
}

export type LoadingCallbackFunction = (progress: number, text: string) => void;

const LLMService = {
    async loadModel(loadingCallback?: LoadingCallbackFunction): Promise<void>{
        console.log("LLMService:loadModel()")
        if (isModelLoaded) {
            return;
        }

        engine = await webllm.CreateWebWorkerMLCEngine(
            new Worker(new URL("./llmworker.ts", import.meta.url), {type: "module"}),
            MODEL,
            {initProgressCallback: (report: webllm.InitProgressReport) => {
                if (loadingCallback) {
                    loadingCallback(report.progress, report.text);
                }
            }}
        )

        isModelLoaded = true;
    },

    interrupt(): void {
        if(!isModelLoaded) {
            return;
        }

        engine.interruptGenerate();
    },

    async unloadModel(): Promise<void> {
        if(!isModelLoaded) {
            return;
        }

        await engine.unload();
        isModelLoaded = false;
    },

    streamChat(request: ChatRequest) {
        return null;
    }
}

export default LLMService;