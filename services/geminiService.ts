
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const MODEL_NAME = 'gemini-3-flash-preview';

export async function generateEverydayExamples(topic: string) {
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: `The goal is to help a scientist write a social media hook about "${topic}". 
    List 5 concrete, everyday examples of "${topic}" in action that a non-expert would encounter in daily life. 
    Avoid technical jargon. Examples should be relatable and simple.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          examples: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of 5 relatable everyday examples"
          }
        },
        required: ["examples"]
      }
    }
  });
  return JSON.parse(response.text).examples;
}

export async function generateCommonExperiences(example: string) {
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: `Given the everyday example: "${example}", describe 5 common relatable experiences or feelings people have when encountering it. 
    Focus on the "human" side—emotions, frustrations, or universal moments.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          experiences: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of 5 relatable human experiences"
          }
        },
        required: ["experiences"]
      }
    }
  });
  return JSON.parse(response.text).experiences;
}

export async function generatePersonalAnecdotes(experience: string) {
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: `Given this experience: "${experience}", write 3 very short personal anecdotes (1-2 sentences) in the first person ("I...") about it. 
    Make them feel authentic and informal, like a tweet.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          anecdotes: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of 3 personal anecdotes"
          }
        },
        required: ["anecdotes"]
      }
    }
  });
  return JSON.parse(response.text).anecdotes;
}

export async function makeAnecdoteSpecific(anecdote: string) {
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: `Make this short anecdote more specific and vivid by adding sensory details, a time, or a place, while keeping it in the first person. 
    Anecdote: "${anecdote}"
    Output should be one vivid paragraph (2-3 sentences max).`,
  });
  return response.text;
}

export async function generateSampleHook(topic: string, anecdote: string) {
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: `Write a Tweetorial "hook" (the first tweet of a thread) about the technical topic "${topic}" starting with the following specific anecdote: "${anecdote}".
    
    Rules for the hook:
    1. Jargon-Free: Use absolutely no technical jargon.
    2. Relatable: The opening should feel like a personal story.
    3. Sparks Curiosity: It must end with an intriguing question that makes the reader want to click "read more" to learn how the science relates to the story.
    4. Format: A single tweet (under 280 characters).`,
  });
  return response.text;
}
