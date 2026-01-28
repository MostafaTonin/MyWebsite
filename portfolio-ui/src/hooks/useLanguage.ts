import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function useLanguage() {
    const { i18n } = useTranslation();

    useEffect(() => {
        const isAr = i18n.language.startsWith('ar');
        const dir = isAr ? 'rtl' : 'ltr';
        document.documentElement.dir = dir;
        document.documentElement.lang = i18n.language;

        // Font switching logic
        if (isAr) {
            document.documentElement.classList.add('font-arabic');
            document.documentElement.classList.remove('font-sans');
        } else {
            document.documentElement.classList.add('font-sans');
            document.documentElement.classList.remove('font-arabic');
        }

    }, [i18n.language]);

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return { language: i18n.language, changeLanguage, i18n };
}
