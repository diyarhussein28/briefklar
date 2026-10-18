import type { Messages } from "@/i18n/languages";

export type DeadlineMessageKey =
  | "addToCalendar"
  | "saveReminder"
  | "saved"
  | "showDeadlines"
  | "remindersOn"
  | "saveError"
  | "calendarError"
  | "eventTitle"
  | "alarm7"
  | "alarm3"
  | "alarm1"
  | "from"
  | "reference"
  | "heading"
  | "upcoming"
  | "showAll"
  | "emptyTitle"
  | "emptyText"
  | "overdue"
  | "markDone"
  | "markOpen"
  | "delete"
  | "confirmDelete"
  | "doneSection"
  | "privacyNote"
  | "back";

/** `{title}` is replaced with the deadline title. */
export const deadlineMessages: Messages<DeadlineMessageKey> = {
  ar: {
    addToCalendar: "أضف إلى تقويم هاتفي",
    saveReminder: "احفظ التذكير في BriefKlar",
    saved: "تم الحفظ على هذا الهاتف فقط.",
    showDeadlines: "اعرض مواعيدي النهائية",
    remindersOn: "التذكير في:",
    saveError: "لم يتم الحفظ. حاول مرة أخرى من فضلك.",
    calendarError: "لم نتمكن من إضافة الموعد إلى التقويم. حاول مرة أخرى من فضلك.",
    eventTitle: "موعد نهائي: {title}",
    alarm7: "بقيت 7 أيام: {title}",
    alarm3: "بقيت 3 أيام: {title}",
    alarm1: "غدًا آخر يوم: {title}",
    from: "من",
    reference: "رقم المرجع",
    heading: "مواعيدي النهائية",
    upcoming: "مواعيدك النهائية القادمة",
    showAll: "اعرض كل المواعيد",
    emptyTitle: "لا توجد مواعيد محفوظة بعد",
    emptyText: "صوّر رسالة. إذا كان فيها موعد نهائي، يمكنك حفظه هنا.",
    overdue: "انتهى الموعد",
    markDone: "تم",
    markOpen: "لم يتم بعد",
    delete: "احذف",
    confirmDelete: "هل تريد حذف هذا الموعد؟",
    doneSection: "مواعيد منتهية",
    privacyNote: "محفوظ على هذا الهاتف فقط. لا يستطيع أحد غيرك رؤيته.",
    back: "العودة إلى البداية",
  },
  uk: {
    addToCalendar: "Додати в мій календар",
    saveReminder: "Зберегти нагадування в BriefKlar",
    saved: "Збережено лише на цьому телефоні.",
    showDeadlines: "Показати мої терміни",
    remindersOn: "Нагадування:",
    saveError: "Не вдалося зберегти. Спробуйте ще раз.",
    calendarError: "Не вдалося створити запис у календарі. Спробуйте ще раз.",
    eventTitle: "Термін: {title}",
    alarm7: "Залишилося 7 днів: {title}",
    alarm3: "Залишилося 3 дні: {title}",
    alarm1: "Завтра останній день: {title}",
    from: "Від",
    reference: "Номер справи",
    heading: "Мої терміни",
    upcoming: "Найближчі терміни",
    showAll: "Показати всі терміни",
    emptyTitle: "Збережених термінів ще немає",
    emptyText: "Сфотографуйте лист. Якщо в ньому є термін, ви можете зберегти його тут.",
    overdue: "Термін минув",
    markDone: "Виконано",
    markOpen: "Ще не виконано",
    delete: "Видалити",
    confirmDelete: "Видалити цей термін?",
    doneSection: "Виконано",
    privacyNote: "Збережено лише на цьому телефоні. Ніхто інший цього не бачить.",
    back: "Назад на початок",
  },
  tr: {
    addToCalendar: "Takvimime ekle",
    saveReminder: "Hatırlatmayı BriefKlar'a kaydet",
    saved: "Sadece bu telefona kaydedildi.",
    showDeadlines: "Son tarihlerimi göster",
    remindersOn: "Hatırlatma günleri:",
    saveError: "Kaydedilemedi. Lütfen tekrar deneyin.",
    calendarError: "Takvim kaydı oluşturulamadı. Lütfen tekrar deneyin.",
    eventTitle: "Son tarih: {title}",
    alarm7: "7 gün kaldı: {title}",
    alarm3: "3 gün kaldı: {title}",
    alarm1: "Yarın son gün: {title}",
    from: "Gönderen",
    reference: "Dosya numarası",
    heading: "Son tarihlerim",
    upcoming: "Yaklaşan son tarihler",
    showAll: "Tüm son tarihleri göster",
    emptyTitle: "Henüz kayıtlı son tarih yok",
    emptyText: "Bir mektubun fotoğrafını çekin. Mektupta son tarih varsa buraya kaydedebilirsiniz.",
    overdue: "Süre doldu",
    markDone: "Yapıldı",
    markOpen: "Henüz yapılmadı",
    delete: "Sil",
    confirmDelete: "Bu son tarih silinsin mi?",
    doneSection: "Yapılanlar",
    privacyNote: "Sadece bu telefonda kayıtlı. Başka kimse göremez.",
    back: "Başa dön",
  },
  en: {
    addToCalendar: "Add to my calendar",
    saveReminder: "Save reminder in BriefKlar",
    saved: "Saved on this phone only.",
    showDeadlines: "Show my deadlines",
    remindersOn: "Reminders on:",
    saveError: "Could not save. Please try again.",
    calendarError: "Could not create the calendar entry. Please try again.",
    eventTitle: "Deadline: {title}",
    alarm7: "7 days left: {title}",
    alarm3: "3 days left: {title}",
    alarm1: "Tomorrow is the last day: {title}",
    from: "From",
    reference: "Reference number",
    heading: "My deadlines",
    upcoming: "Your next deadlines",
    showAll: "Show all deadlines",
    emptyTitle: "No deadlines saved yet",
    emptyText: "Take a photo of a letter. If it has a deadline, you can save it here.",
    overdue: "Deadline passed",
    markDone: "Done",
    markOpen: "Not done yet",
    delete: "Delete",
    confirmDelete: "Delete this deadline?",
    doneSection: "Done",
    privacyNote: "Saved only on this phone. Nobody else can see it.",
    back: "Back to start",
  },
  de: {
    addToCalendar: "In meinen Kalender eintragen",
    saveReminder: "In BriefKlar merken",
    saved: "Gespeichert. Nur auf diesem Handy.",
    showDeadlines: "Meine Fristen ansehen",
    remindersOn: "Erinnerung am:",
    saveError: "Das hat nicht geklappt. Bitte noch einmal versuchen.",
    calendarError: "Der Kalender-Eintrag hat nicht geklappt. Bitte noch einmal versuchen.",
    eventTitle: "Frist: {title}",
    alarm7: "Noch 7 Tage: {title}",
    alarm3: "Noch 3 Tage: {title}",
    alarm1: "Morgen ist der letzte Tag: {title}",
    from: "Von",
    reference: "Nummer vom Brief",
    heading: "Meine Fristen",
    upcoming: "Ihre nächsten Fristen",
    showAll: "Alle Fristen ansehen",
    emptyTitle: "Noch keine Fristen gespeichert",
    emptyText: "Machen Sie ein Foto von einem Brief. Hat der Brief eine Frist? Dann können Sie die Frist hier speichern.",
    overdue: "Frist ist vorbei",
    markDone: "Erledigt",
    markOpen: "Noch nicht erledigt",
    delete: "Löschen",
    confirmDelete: "Wollen Sie diese Frist wirklich löschen?",
    doneSection: "Erledigt",
    privacyNote: "Nur auf diesem Handy gespeichert. Niemand sonst kann das sehen.",
    back: "Zurück zum Start",
  },
};
