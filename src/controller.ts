/* eslint-disable @typescript-eslint/naming-convention */
const { Configuration, OpenAIApi } = require('openai');
import * as vscode from 'vscode';

let lastCode = '';

async function getExplanation(code: string) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const stop = '###\n';
  const question = 'What does the JavaScript code above do?';
  const prompt = code + stop + question;

  const response = await openai.createCompletion({
    model: 'text-curie-001',
    prompt,
    temperature: 0,
    max_tokens: 255,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
    stop,
  });
  const { statusText, data } = response;
  const { text } = response.data.choices[0];

  if (text === undefined || statusText !== 'OK') {
    return 'Error';
  }
  return text;
}

async function getBetterExplanation() {
  const code = lastCode;
  console.log(code);

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const stop = '###\n';
  const question = 'What does the JavaScript code above compute?';
  const prompt = code + stop + question;

  const response = await openai.createCompletion({
    model: 'text-davinci-001',
    prompt,
    temperature: 0.2,
    max_tokens: 255,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
    stop,
  });
  const { statusText, data } = response;
  const { text } = response.data.choices[0];

  if (text === undefined || statusText !== 'OK') {
    return 'Error';
  }
  return text;
}

function getExplanationTest(code: string) {
  return 'Here some text';
}

async function explainSelection(again: boolean = false): Promise<string> {
  // Get the active text editor
  const editor = vscode.window.activeTextEditor;

  if (!editor) return '';

  const document = editor.document;
  const selection = editor.selection;

  const code = document.getText(selection);
  lastCode = code;
  let result = await getExplanation(code);
  return result;
}

export {
  getExplanation,
  getExplanationTest,
  explainSelection,
  getBetterExplanation,
};
