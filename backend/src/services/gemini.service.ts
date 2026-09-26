import { config } from "../config/index.js";
import { logger } from "../utils/logger.js";
import { AiProviderError, AiTimeoutError } from "../utils/errors.js";

export interface GenerateTryOnParams {
  modelBuffer?: Buffer;
  modelMime?: string;
  jewelryBuffer: Buffer;
  jewelryMime: string;
  prompt: string;
  aspectRatio?: string;
}

export interface GeneratedImageOutput {
  buffer: Buffer;
  mimeType: string;
}

export interface ImageGenerationProvider {
  generateTryOn(params: GenerateTryOnParams): Promise<GeneratedImageOutput>;
}

export class GeminiImageProvider implements ImageGenerationProvider {
  private apiKey: string;
  private primaryModel: string;
  private candidateModels: string[];

  constructor() {
    this.apiKey = config.gemini.apiKey;
    this.primaryModel = config.gemini.imageModel || "gemini-3-pro-image";
    this.candidateModels = [
      this.primaryModel,
      "gemini-3-pro-image",
      "gemini-3.1-flash-image",
      "gemini-2.5-flash-image",
    ].filter((m, i, arr) => arr.indexOf(m) === i);
  }

  async generateTryOn(params: GenerateTryOnParams): Promise<GeneratedImageOutput> {
    if (!this.apiKey) {
      throw new AiProviderError(
        "Gemini API key is not configured on the server. Please set GEMINI_API_KEY in backend/.env"
      );
    }

    let lastError: unknown = null;

    // Try primary and fallback models with responseModalities: ["IMAGE"]
    for (const modelName of this.candidateModels) {
      try {
        logger.info(
          { modelName },
          `Dispatching virtual try-on multimodal generation to ${modelName}`
        );
        return await this.callGeminiModel(modelName, params, 75000);
      } catch (err: unknown) {
        lastError = err;
        logger.warn(
          { modelName, err: (err as Error).message },
          `Generation with model ${modelName} encountered an issue, trying next available image model...`
        );
      }
    }

    throw new AiProviderError(
      `Failed to generate try-on image: ${(lastError as Error)?.message || "Unknown error"}`
    );
  }

  private async callGeminiModel(
    modelName: string,
    params: GenerateTryOnParams,
    timeoutMs: number
  ): Promise<GeneratedImageOutput> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const parts: any[] = [{ text: params.prompt }];

      if (params.modelBuffer && params.modelMime) {
        parts.push({
          inline_data: {
            mime_type: params.modelMime,
            data: params.modelBuffer.toString("base64"),
          },
        });
      }

      parts.push({
        inline_data: {
          mime_type: params.jewelryMime,
          data: params.jewelryBuffer.toString("base64"),
        },
      });

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${this.apiKey}`;

      const requestBody = {
        contents: [
          {
            role: "user",
            parts,
          },
        ],
        generationConfig: {
          responseModalities: ["IMAGE", "TEXT"],
          temperature: 0.2,
          topK: 32,
          topP: 0.9,
        },
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API HTTP ${response.status}: ${errorText}`);
      }

      const data = (await response.json()) as any;
      const candidate = data?.candidates?.[0];
      const responseParts = candidate?.content?.parts;

      if (responseParts && Array.isArray(responseParts)) {
        for (const part of responseParts) {
          const inline = part.inline_data || part.inlineData;
          if (inline?.data) {
            const buffer = Buffer.from(inline.data, "base64");
            const mimeType = inline.mime_type || inline.mimeType || "image/png";
            return { buffer, mimeType };
          }
        }
      }

      throw new Error(
        `Gemini response did not contain an inline image payload: ${JSON.stringify(data).substring(0, 300)}`
      );
    } catch (err: unknown) {
      if ((err as Error)?.name === "AbortError") {
        throw new AiTimeoutError(`Gemini generation request timed out after ${timeoutMs / 1000}s`);
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }
}

export const geminiImageService = new GeminiImageProvider();
