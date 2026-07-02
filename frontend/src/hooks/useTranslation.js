import { useLang } from '../context/LangContext';
import { t as translate } from '../i18n';

export const useTranslation = () => {
  const { locale, toggleLang, isAr } = useLang();
  return { t: (key) => translate(locale, key), locale, toggleLang, isAr };
};

export default useTranslation;
