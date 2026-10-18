import type { Messages } from "@/i18n/languages";
import type { HelpTopic } from "@/lib/letter";

export type HelpMessageKey =
  | "title"
  | "plzLabel"
  | "plzPlaceholder"
  | "plzInvalid"
  | "open"
  | "newTab"
  | "disclaimer"
  | `explain_${HelpTopic}`;

export const helpMessages: Messages<HelpMessageKey> = {
  ar: {
    title: "مساعدة مجانية بالقرب منك",
    plzLabel: "الرمز البريدي (PLZ)",
    plzPlaceholder: "مثال: 10115",
    plzInvalid: "اكتب 5 أرقام، مثال: 10115.",
    open: "ابحث عن مكتب",
    newTab: "يفتح في نافذة جديدة",
    disclaimer: "بريف كلار لا يقدّم استشارة قانونية. هذه المكاتب تستطيع فحص حالتك.",
    explain_beratungshilfe:
      "إذا كان دخلك قليلًا، يمكنك أن تحصل على استشارة من محامٍ مقابل 15 يورو فقط. اطلب «شهادة الاستشارة» (Beratungsschein) من المحكمة المحلية (Amtsgericht).",
    explain_migrationsberatung:
      "استشارة مجانية للمهاجرين حول الرسائل والدوائر الرسمية والإقامة والعمل. الشباب حتى عمر 27 سنة يذهبون إلى خدمة هجرة الشباب (Jugendmigrationsdienst).",
    explain_mieterverein:
      "جمعية المستأجرين تساعدك في مشاكل المؤجّر والإيجار وتكاليف السكن. تدفع اشتراكًا صغيرًا.",
    explain_verbraucherzentrale:
      "مركز حماية المستهلك يساعدك في العقود والفواتير وشركات تحصيل الديون والاحتيال. الاستشارة مجانية أو بسعر قليل.",
    explain_schuldnerberatung:
      "مساعدة مجانية إذا كانت عليك ديون أو لا تستطيع دفع الفواتير. يساعدونك في التواصل مع الدائنين.",
    explain_sozialberatung:
      "استشارة اجتماعية مجانية لكل الناس، مهما كان دينك. يساعدونك في الطلبات والمال والدوائر الرسمية.",
  },
  uk: {
    title: "Безкоштовна допомога поруч",
    plzLabel: "Ваш поштовий індекс (PLZ)",
    plzPlaceholder: "напр. 10115",
    plzInvalid: "Введіть 5 цифр, наприклад 10115.",
    open: "Знайти консультацію",
    newTab: "відкривається в новій вкладці",
    disclaimer: "BriefKlar не надає юридичних консультацій. Ці служби можуть перевірити вашу ситуацію.",
    explain_beratungshilfe:
      "Якщо у вас мало грошей, ви можете отримати консультацію адвоката лише за 15 €. Попросіть у місцевому суді (Amtsgericht) довідку «Beratungsschein».",
    explain_migrationsberatung:
      "Безкоштовні консультації для мігрантів: листи, установи, дозвіл на проживання, робота. Молодь до 27 років звертається до Jugendmigrationsdienst.",
    explain_mieterverein:
      "Спілка орендарів допомагає з проблемами з орендодавцем, орендною платою та комунальними платежами. Потрібно сплачувати невеликий членський внесок.",
    explain_verbraucherzentrale:
      "Центр захисту прав споживачів допомагає з договорами, рахунками, колекторами та шахрайством. Консультація безкоштовна або недорога.",
    explain_schuldnerberatung:
      "Безкоштовна допомога, якщо у вас борги або ви не можете оплатити рахунки. Вам допоможуть домовитися з кредиторами.",
    explain_sozialberatung:
      "Безкоштовна соціальна консультація для всіх, незалежно від релігії. Допомагають із заявами, грошима та установами.",
  },
  tr: {
    title: "Yakınımdaki ücretsiz yardım",
    plzLabel: "Posta kodunuz (PLZ)",
    plzPlaceholder: "örn. 10115",
    plzInvalid: "Lütfen 5 rakam girin, örneğin 10115.",
    open: "Danışma yeri bul",
    newTab: "yeni sekmede açılır",
    disclaimer: "BriefKlar hukuki danışmanlık vermez. Bu kurumlar durumunuzu inceleyebilir.",
    explain_beratungshilfe:
      "Geliriniz azsa, sadece 15 € karşılığında bir avukattan danışmanlık alabilirsiniz. Bulunduğunuz yerdeki sulh mahkemesinden (Amtsgericht) „Beratungsschein“ isteyin.",
    explain_migrationsberatung:
      "Göçmenler için mektuplar, resmi daireler, oturum ve iş konularında ücretsiz danışmanlık. 27 yaşına kadar gençler Jugendmigrationsdienst'e başvurur.",
    explain_mieterverein:
      "Kiracılar derneği ev sahibi, kira ve yan giderlerle ilgili sorunlarda yardım eder. Küçük bir üyelik ücreti ödersiniz.",
    explain_verbraucherzentrale:
      "Tüketici danışma merkezi sözleşmeler, faturalar, borç tahsilat şirketleri ve dolandırıcılık konularında yardım eder. Danışmanlık ücretsiz veya düşük ücretlidir.",
    explain_schuldnerberatung:
      "Borcunuz varsa veya faturalarınızı ödeyemiyorsanız ücretsiz yardım. Alacaklılarla konuşmanıza yardım ederler.",
    explain_sozialberatung:
      "Dini ne olursa olsun herkes için ücretsiz sosyal danışmanlık. Başvurular, para ve resmi dairelerle ilgili yardım ederler.",
  },
  en: {
    title: "Free help near me",
    plzLabel: "Your postcode (PLZ)",
    plzPlaceholder: "e.g. 10115",
    plzInvalid: "Please enter 5 digits, for example 10115.",
    open: "Find an office",
    newTab: "opens in a new tab",
    disclaimer: "BriefKlar does not give legal advice. These offices can check your case.",
    explain_beratungshilfe:
      "If you have little money, a lawyer can advise you for only 15 €. Ask your local court (Amtsgericht) for a “Beratungsschein”.",
    explain_migrationsberatung:
      "Free advice for immigrants about letters, offices, residence and work. Young people up to 27 go to the Jugendmigrationsdienst.",
    explain_mieterverein:
      "Tenant associations help with problems with your landlord, rent or utility costs. You pay a small membership fee.",
    explain_verbraucherzentrale:
      "Consumer advice centres help with contracts, bills, debt collectors and fraud. Advice is free or low-cost.",
    explain_schuldnerberatung:
      "Free help if you have debts or cannot pay your bills. They help you deal with the people you owe money to.",
    explain_sozialberatung:
      "Free social counselling for everyone, whatever your religion. They help with applications, money and offices.",
  },
  de: {
    title: "Kostenlose Hilfe in Ihrer Nähe",
    plzLabel: "Ihre Post-Leitzahl (PLZ)",
    plzPlaceholder: "zum Beispiel 10115",
    plzInvalid: "Bitte schreiben Sie 5 Zahlen. Zum Beispiel: 10115.",
    open: "Beratung finden",
    newTab: "öffnet sich in einem neuen Fenster",
    disclaimer: "BriefKlar gibt keine Rechts-Beratung. Diese Stellen können Ihren Fall prüfen.",
    explain_beratungshilfe:
      "Sie haben wenig Geld? Dann hilft Ihnen ein Anwalt für nur 15 €. Dafür brauchen Sie einen Beratungs-Schein. Den bekommen Sie beim Amts-Gericht.",
    explain_migrationsberatung:
      "Sie sind nach Deutschland gekommen? Hier bekommen Sie Hilfe bei Briefen, Ämtern und Arbeit. Das kostet nichts. Junge Menschen bis 27 Jahre gehen zum Jugend-Migrations-Dienst.",
    explain_mieterverein:
      "Der Mieter-Verein hilft bei Problemen mit der Wohnung. Zum Beispiel mit dem Vermieter oder der Miete. Sie werden Mitglied. Das kostet ein bisschen Geld.",
    explain_verbraucherzentrale:
      "Die Verbraucher-Zentrale hilft bei Verträgen, Rechnungen und Betrug. Die Beratung kostet nichts oder nur wenig Geld.",
    explain_schuldnerberatung:
      "Sie haben Schulden? Oder Sie können Rechnungen nicht bezahlen? Die Schuldner-Beratung hilft Ihnen. Das kostet nichts.",
    explain_sozialberatung:
      "Die Sozial-Beratung hilft allen Menschen. Ihre Religion ist egal. Sie hilft bei Anträgen, Geld und Ämtern. Das kostet nichts.",
  },
};
