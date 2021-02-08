export function formatTranslates(translates: TranslatesInfo[]): string {
  let result = '';

  for (const { language, translate } of translates) {
    result += `<b> ${language} </b> : \n`;
    result += `${translate} \n\n`;
  }

  return result;
}

export type TranslatesInfo = {
  language: string;
  translate: string;
};
