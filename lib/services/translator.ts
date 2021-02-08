import translate from 'translate';

const { GOOGLE_TOKEN } = process.env;

translate.engine = 'google';
translate.key = GOOGLE_TOKEN;

export class Translator {
  static async translateText(data: translateTextInput): Promise<string> {
    const { text, to, from, detectSourceLanguage } = data;
    const translated = await translate(text, { to, from, detectSourceLanguage });
    return translated;
  }
}

export type translateTextInput = {
  text: string;
  to: string;
  from?: string;
  detectSourceLanguage?: boolean;
};
