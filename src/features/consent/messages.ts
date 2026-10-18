import type { Language, Messages } from "@/i18n/languages";

type ConsentKey =
  | "title"
  | "aiTitle"
  | "aiText"
  | "dataTitle"
  | "dataText"
  | "legalTitle"
  | "legalText"
  | "checkbox"
  | "privacyLink"
  | "continue"
  | "changeLanguage"
  | "languageLabel"
  | "back"
  | "legalPageNote"
  | "withdraw"
  | "withdrawn";

export const consentMessages: Messages<ConsentKey> = {
  ar: {
    title: "قبل أن تبدأ",
    aiTitle: "نستخدم الذكاء الاصطناعي",
    aiText:
      "يستخدم BriefKlar الذكاء الاصطناعي (Claude من شركة Anthropic) لقراءة رسالتك وشرحها. قد يخطئ الذكاء الاصطناعي، لذلك تحقّق دائمًا من التواريخ والمبالغ في الرسالة الأصلية.",
    dataTitle: "رسالتك خاصة",
    dataText:
      "قد تحتوي رسالتك على بيانات حساسة (الصحة، المساعدات الاجتماعية، الإقامة). تُرسَل الرسالة مشفّرةً إلى خادمنا وإلى مزوّد الذكاء الاصطناعي للمعالجة فقط، ولا تُحفَظ، ولا تُستخدَم لتدريب الذكاء الاصطناعي.",
    legalTitle: "ليست استشارة قانونية",
    legalText: "يشرح BriefKlar الرسائل، لكنه لا يقدّم استشارة قانونية.",
    checkbox: "أوافق على معالجة رسالتي لهذا الغرض (المادة 9، الفقرة 2، البند أ من اللائحة العامة لحماية البيانات GDPR).",
    privacyLink: "سياسة الخصوصية (باللغة الألمانية)",
    continue: "متابعة",
    changeLanguage: "تغيير اللغة",
    languageLabel: "اللغة",
    back: "العودة إلى BriefKlar",
    legalPageNote:
      "هذه الصفحة باللغة الألمانية لأن القانون يطلب ذلك. باختصار: لا نحفظ رسالتك، ويمكنك سحب موافقتك في أي وقت.",
    withdraw: "سحب موافقتي",
    withdrawn: "تم سحب موافقتك.",
  },
  uk: {
    title: "Перш ніж почати",
    aiTitle: "Ми використовуємо штучний інтелект",
    aiText:
      "BriefKlar використовує штучний інтелект (Claude від компанії Anthropic), щоб прочитати й пояснити ваш лист. Штучний інтелект може помилятися — завжди перевіряйте дати та суми в оригінальному листі.",
    dataTitle: "Ваш лист — приватний",
    dataText:
      "Ваш лист може містити чутливі дані (здоров'я, соціальні виплати, статус перебування). Він надсилається в зашифрованому вигляді на наш сервер і постачальнику штучного інтелекту лише для обробки, не зберігається і не використовується для навчання штучного інтелекту.",
    legalTitle: "Це не юридична консультація",
    legalText: "BriefKlar пояснює листи, але не надає юридичних консультацій.",
    checkbox: "Я погоджуюся, що мій лист буде оброблено з цією метою (ст. 9 ч. 2 п. a GDPR).",
    privacyLink: "Політика конфіденційності (німецькою)",
    continue: "Далі",
    changeLanguage: "Змінити мову",
    languageLabel: "Мова",
    back: "Назад до BriefKlar",
    legalPageNote:
      "Ця сторінка німецькою мовою, бо цього вимагає закон. Коротко: ми не зберігаємо ваш лист, і ви можете будь-коли відкликати свою згоду.",
    withdraw: "Відкликати згоду",
    withdrawn: "Вашу згоду відкликано.",
  },
  tr: {
    title: "Başlamadan önce",
    aiTitle: "Yapay zekâ kullanıyoruz",
    aiText:
      "BriefKlar, mektubunuzu okumak ve açıklamak için yapay zekâ (Anthropic firmasının Claude modeli) kullanır. Yapay zekâ hata yapabilir — tarihleri ve tutarları her zaman asıl mektuptan kontrol edin.",
    dataTitle: "Mektubunuz size özeldir",
    dataText:
      "Mektubunuz hassas bilgiler içerebilir (sağlık, sosyal yardımlar, oturum durumu). Mektubunuz yalnızca işlenmesi için şifreli olarak sunucumuza ve yapay zekâ sağlayıcısına gönderilir, saklanmaz ve yapay zekâyı eğitmek için kullanılmaz.",
    legalTitle: "Hukuki danışmanlık değildir",
    legalText: "BriefKlar mektupları açıklar — hukuki danışmanlık vermez.",
    checkbox: "Mektubumun bu amaçla işlenmesini kabul ediyorum (GDPR Madde 9 (2)(a)).",
    privacyLink: "Gizlilik politikası (Almanca)",
    continue: "Devam",
    changeLanguage: "Dili değiştir",
    languageLabel: "Dil",
    back: "BriefKlar'a dön",
    legalPageNote:
      "Bu sayfa yasal zorunluluk nedeniyle Almancadır. Kısaca: mektubunuzu saklamıyoruz ve onayınızı istediğiniz zaman geri alabilirsiniz.",
    withdraw: "Onayımı geri al",
    withdrawn: "Onayınız geri alındı.",
  },
  en: {
    title: "Before you start",
    aiTitle: "We use artificial intelligence",
    aiText:
      "BriefKlar uses artificial intelligence (Claude by Anthropic) to read and explain your letter. The AI can make mistakes — always check dates and amounts in the original letter.",
    dataTitle: "Your letter stays private",
    dataText:
      "Your letter can contain sensitive data (health, benefits, residence status). It is sent encrypted to our server and to the AI provider for processing only, is not stored and is not used to train AI.",
    legalTitle: "No legal advice",
    legalText: "BriefKlar explains letters — it does not give legal advice.",
    checkbox: "I agree that my letter is processed for this purpose (Art. 9 (2)(a) GDPR).",
    privacyLink: "Privacy policy (in German)",
    continue: "Continue",
    changeLanguage: "Change language",
    languageLabel: "Language",
    back: "Back to BriefKlar",
    legalPageNote:
      "This page is in German because the law requires it. In short: we do not store your letter, and you can withdraw your consent at any time.",
    withdraw: "Withdraw my consent",
    withdrawn: "Your consent has been withdrawn.",
  },
  de: {
    title: "Bevor Sie anfangen",
    aiTitle: "Wir benutzen Künstliche Intelligenz",
    aiText:
      "BriefKlar benutzt Künstliche Intelligenz. Die Künstliche Intelligenz heißt Claude. Sie ist von der Firma Anthropic. Sie liest Ihren Brief. Und sie erklärt Ihnen den Brief. Die Künstliche Intelligenz kann Fehler machen. Prüfen Sie darum immer im echten Brief: das Datum und den Geld-Betrag.",
    dataTitle: "Ihr Brief ist privat",
    dataText:
      "In Ihrem Brief können private Dinge stehen. Zum Beispiel über Ihre Gesundheit, über Geld vom Amt oder über Ihren Aufenthalt. Wir schicken Ihren Brief verschlüsselt an unseren Server und an die Firma von der Künstlichen Intelligenz. Nur damit der Brief erklärt wird. Wir speichern Ihren Brief nicht. Niemand benutzt Ihren Brief, um Künstliche Intelligenz zu trainieren.",
    legalTitle: "Keine Rechts-Beratung",
    legalText: "BriefKlar erklärt Briefe. BriefKlar macht keine Rechts-Beratung.",
    checkbox:
      "Ich bin einverstanden: Mein Brief wird für diesen Zweck verarbeitet. (Artikel 9 Absatz 2 Buchstabe a Datenschutz-Grundverordnung)",
    privacyLink: "Datenschutz-Erklärung lesen",
    continue: "Weiter",
    changeLanguage: "Sprache ändern",
    languageLabel: "Sprache",
    back: "Zurück zu BriefKlar",
    legalPageNote:
      "Dieser Text ist in schwerer Sprache. Das muss so sein. Kurz gesagt: Wir speichern Ihren Brief nicht. Sie können Ihr Einverständnis jederzeit zurücknehmen.",
    withdraw: "Einverständnis zurücknehmen",
    withdrawn: "Ihr Einverständnis ist zurückgenommen.",
  },
};

/** Shown on the language picker, before any language is known: one line per language. */
export const PICKER_PROMPTS: { language: Language; text: string }[] = [
  { language: "de", text: "Bitte wählen Sie Ihre Sprache." },
  { language: "ar", text: "اختر لغتك من فضلك." },
  { language: "uk", text: "Будь ласка, оберіть мову." },
  { language: "tr", text: "Lütfen dilinizi seçin." },
  { language: "en", text: "Please choose your language." },
];
