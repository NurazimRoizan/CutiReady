import { AppLanguage } from '../types/index';

export interface Translations {
  header: {
    resetTitle: string;
    resetDesc: string;
    resetButton: string;
    resetConfirm: string;
    changeLanguage: string;
    guide: string;
    guideTitle: string;
    manglish: string;
    english: string;
    settingsTitle: string;
  };
  hero: {
    title1: string;
    title2: string;
    badge: string;
    description: string;
    ctaCombo: string;
    ctaGuideOpen: string;
    ctaGuideClose: string;
    eaNote: string;
    eaLink: string;
  };
  nav: {
    combo: string;
    myPlan: string;
    rules: string;
  };
  bridges: {
    alQuota: string;
    tabs: {
      all: string;
      highRoi: string;
      zeroAl: string;
      q1: string;
      q2: string;
      q3: string;
      q4: string;
    };
    hidePast: string;
    viewLegend: string;
    configHoliday: string;
    workingState: string;
    restDays: string;
    alBalance: string;
    maxAl: string;
    days: string;
    comboFound: string;
    noBridges: string;
    noBridgesSub: string;
    filterApplied: string;
    resetFilters: string;
  };
  plan: {
    title: string;
    alBalanceSuffix: string;
    actions: string;
    lockedCount: string;
    clearAll: string;
    clearConfirm: string;
    exportIcs: string;
    copyBoss: string;
    copied: string;
    lockedInCalendar: string;
    alDaysUsed: string;
    emptyHeader: string;
    emptyTitle: string;
    emptyDesc: string;
    emptyCta: string;
  };
  rules: {
    title: string;
    presetsTitle: string;
    preset11: string;
    preset11Desc: string;
    preset15: string;
    preset15Desc: string;
    presetAll: string;
    presetAllDesc: string;
    stateLabel: string;
    weekendLabel: string;
    satReplacement: string;
    satReplacementDesc: string;
    categoryFilter: {
      all: string;
      compulsory: string;
      federal: string;
      state: string;
    };
    observedHolidays: string;
  };
  cards: {
    locked: string;
    lockCta: string;
    unlockCta: string;
    freeCuti: string;
    highRoi: string;
    bestPick: string;
    daysOff: string;
    alNeeded: string;
    alSaved: string;
    longWeekend: string;
    comboHoliday: string;
  };
  stats: {
    totalDaysOff: string;
    alInvested: string;
    roiMultiplier: string;
    alBalance: string;
  };
  footer: {
    motto: string;
    law: string;
    tapTip: string;
  };
  modals: {
    close: string;
    howToUseTitle: string;
    legendTitle: string;
  };
}

export const translations: Record<AppLanguage, Translations> = {
  manglish: {
    header: {
      resetTitle: 'Reset',
      resetDesc: 'Kembalikan semua tetapan ke asal',
      resetButton: 'Reset Semua',
      resetConfirm: 'Betul ke nak reset semua setting balik asal bossku?',
      changeLanguage: 'Tukar Bahasa',
      guide: 'PANDUAN',
      guideTitle: 'Cara guna & panduan cuti',
      manglish: 'Manglish (Default)',
      english: 'English',
      settingsTitle: 'Tetapan',
    },
    hero: {
      title1: 'The Ultimate Leave Hack',
      title2: 'Untuk Pekerja Malaysia',
      badge: 'Kerja Kuat, Cuti Lagi Kuat!',
      description:
        'Burn sikit Annual Leave (AL), tapau 40+ hari cuti panjang! Formula matematik 100% tepat ikut Akta Kerja 1955, public holiday, dan Cuti Ganti. Boss senyum, HR approve, anda healing!',
      ctaCombo: 'JOM TENGOK COMBO CUTI 2026 ↓',
      ctaGuideOpen: 'CARA HACK CUTI NI MACAM MANA? ↗',
      ctaGuideClose: 'TUTUP GUIDE ONBOARDING ↑',
      eaNote: '100% Patuh Akta Kerja 1955 (Seksyen 60D)',
      eaLink: '(Tengok cara guna)',
    },
    nav: {
      combo: 'Combo Cuti',
      myPlan: 'My Cuti',
      rules: 'Holiday',
    },
    bridges: {
      alQuota: 'Kuota AL Anda',
      tabs: {
        all: 'SEMUA',
        highRoi: 'HIGH ROI',
        zeroAl: 'FREE CUTI (0 AL)',
        q1: 'Q1',
        q2: 'Q2',
        q3: 'Q3',
        q4: 'Q4',
      },
      hidePast: 'Sembunyi Cuti Lepas',
      viewLegend: 'Tengok Legend Warna',
      configHoliday: 'Ubah Senarai Cuti',
      workingState: 'Negeri Bertugas',
      restDays: 'Hari Rehat Mingguan',
      alBalance: 'Baki AL Setahun',
      maxAl: 'Maks AL Per Bridge',
      days: 'hari',
      comboFound: 'COMBO CUTI DIJUMPAI',
      noBridges: 'Aduh, takde combo cuti yang padan!',
      noBridgesSub: 'Cuba longgarkan penapis kuota AL atau semak konfigurasi cuti negeri.',
      filterApplied: 'Penapis Aktif',
      resetFilters: 'Reset Penapis',
    },
    plan: {
      title: 'Dossier Cuti Saya',
      alBalanceSuffix: 'AL BALANCE',
      actions: 'Tindakan Plan',
      lockedCount: 'cuti dah lock',
      clearAll: 'Reset Semua',
      clearConfirm:
        'Betul ke nak reset semua tarikh cuti yang dah lock tu? Nanti kena pilih balik tau!',
      exportIcs: 'EXPORT .ICS',
      copyBoss: 'COPY AYAT BOSS',
      copied: 'DAH COPY!',
      lockedInCalendar: 'Cuti Dah Lock Dalam Kalendar',
      alDaysUsed: 'HARI AL DIGUNAKAN',
      emptyHeader: 'ADUH, BELUM PLAN CUTI LAGI KE?',
      emptyTitle: 'Dossier Cuti Korang Kosong Lagi Ni!',
      emptyDesc:
        'Boss tengok mesti ingat korang rajin sangat OT tak balik rumah. Jom explore long weekend 2026 dan tekan "+ LOCK CUTI". Cuti berterusan, balance AL, dengan ayat WhatsApp boss auto-generate kat sini terus!',
      emptyCta: 'JOM CARI CUTI 2026!',
    },
    rules: {
      title: 'Konfigurasi Cuti & Akta',
      presetsTitle: 'Preset Cuti Cepat (EA 1955)',
      preset11: 'EA 1955 (11H)',
      preset11Desc: 'Minima akta: 5 wajib + 6 pilihan majikan',
      preset15: 'Korp (15H)',
      preset15Desc: 'Standard biasa syarikat swasta Malaysia',
      presetAll: 'Semua Gazet',
      presetAllDesc: 'Boss belanja semua cuti persekutuan & negeri!',
      stateLabel: 'Negeri Tempat Bekerja',
      weekendLabel: 'Corak Hari Rehat Mingguan',
      satReplacement: 'Cuti Ganti Hari Sabtu (Syarikat 5 Hari Kerja)',
      satReplacementDesc: 'Jika cuti umum jatuh Sabtu, syarikat bagi ganti cuti Isnin',
      categoryFilter: {
        all: 'SEMUA',
        compulsory: 'WAJIB (EA 1955)',
        federal: 'PERSEKUTUAN',
        state: 'NEGERI',
      },
      observedHolidays: 'Senarai Cuti Umum Diamati',
    },
    cards: {
      locked: 'DAH LOCK',
      lockCta: '+ LOCK CUTI',
      unlockCta: 'BUANG DARI PLAN',
      freeCuti: 'FREE CUTI (0 AL)',
      highRoi: 'ROI TINGGI',
      bestPick: 'CADANGAN TERBAIK',
      daysOff: 'HARI OFF',
      alNeeded: 'HARI AL',
      alSaved: 'Jimat AL',
      longWeekend: 'CUTI PANJANG',
      comboHoliday: 'Combo Cuti',
    },
    stats: {
      totalDaysOff: 'Jumlah Hari Cuti',
      alInvested: 'AL Dilabur',
      roiMultiplier: 'Multiplier ROI',
      alBalance: 'Baki AL',
    },
    footer: {
      motto: 'CUTIREADY MALAYSIA • REHAT RESPONSIBLY • JANGAN SAMPAI BURN AL',
      law: '100% matematik ikut Akta Kerja 1955 (Seksyen 60D). Boss senyum, HR approved, korang healing dengan tenang!',
      tapTip: 'Tap mana-mana tile hari untuk toggle cuti pilihan korang',
    },
    modals: {
      close: 'TUTUP',
      howToUseTitle: 'PANDUAN HACK CUTI 2026',
      legendTitle: 'LEGEND WARNA KALENDAR',
    },
  },
  en: {
    header: {
      resetTitle: 'Reset',
      resetDesc: 'Restore all settings to defaults',
      resetButton: 'Reset All',
      resetConfirm: 'Are you sure you want to reset all settings to defaults?',
      changeLanguage: 'Change Language',
      guide: 'GUIDE',
      guideTitle: 'How to use & leave guide',
      manglish: 'Manglish (Default)',
      english: 'English',
      settingsTitle: 'Settings',
    },
    hero: {
      title1: 'The Ultimate Leave Hack',
      title2: 'For Malaysian Workers',
      badge: 'Work Smart, Holiday Harder!',
      description:
        'Invest minimal Annual Leave (AL), unlock 40+ days of long weekends! 100% mathematically optimized for Employment Act 1955, public holidays, and replacement leaves. Boss smiles, HR approves, and you recharge!',
      ctaCombo: 'EXPLORE 2026 LEAVE COMBOS ↓',
      ctaGuideOpen: 'HOW DOES THIS LEAVE HACK WORK? ↗',
      ctaGuideClose: 'CLOSE ONBOARDING GUIDE ↑',
      eaNote: '100% Compliant with Employment Act 1955 (Section 60D)',
      eaLink: '(View how to use)',
    },
    nav: {
      combo: 'Leave Combos',
      myPlan: 'My Plan',
      rules: 'Holidays',
    },
    bridges: {
      alQuota: 'Your AL Quota',
      tabs: {
        all: 'ALL',
        highRoi: 'HIGH ROI',
        zeroAl: 'ZERO AL (FREE)',
        q1: 'Q1',
        q2: 'Q2',
        q3: 'Q3',
        q4: 'Q4',
      },
      hidePast: 'Hide Past Holidays',
      viewLegend: 'Color Legend',
      configHoliday: 'Configure Holidays',
      workingState: 'Working State',
      restDays: 'Weekly Rest Days',
      alBalance: 'Annual AL Balance',
      maxAl: 'Max AL per Bridge',
      days: 'days',
      comboFound: 'LEAVE COMBOS FOUND',
      noBridges: 'No matching leave combos found!',
      noBridgesSub: 'Try relaxing your AL quota filters or check state holiday settings.',
      filterApplied: 'Filters Applied',
      resetFilters: 'Reset Filters',
    },
    plan: {
      title: 'My Leave Dossier',
      alBalanceSuffix: 'AL BALANCE',
      actions: 'Plan Actions',
      lockedCount: 'leaves locked',
      clearAll: 'Clear All',
      clearConfirm:
        'Are you sure you want to clear all your locked leave dates? You will need to select them again!',
      exportIcs: 'EXPORT .ICS',
      copyBoss: 'COPY FOR BOSS/HR',
      copied: 'COPIED!',
      lockedInCalendar: 'Locked Holidays in Calendar',
      alDaysUsed: 'AL DAYS USED',
      emptyHeader: "HAVEN'T PLANNED YOUR LEAVE YET?",
      emptyTitle: 'Your Leave Dossier is Empty!',
      emptyDesc:
        'Your boss might think you love OT too much to take a break! Explore 2026 long weekends and tap "+ LOCK LEAVE". Consecutive days off, remaining AL balance, and ready-to-send messages for your boss auto-generate right here!',
      emptyCta: 'EXPLORE 2026 COMBOS!',
    },
    rules: {
      title: 'Holiday & Act Configuration',
      presetsTitle: 'Quick Holiday Presets (EA 1955)',
      preset11: 'EA 1955 (11D)',
      preset11Desc: 'Statutory minimum: 5 mandatory + 6 employer choice',
      preset15: 'Corporate (15D)',
      preset15Desc: 'Standard corporate practice across Malaysian companies',
      presetAll: 'All Gazetted',
      presetAllDesc: 'Company observes all federal and state public holidays!',
      stateLabel: 'Workplace State',
      weekendLabel: 'Weekly Rest Day Pattern',
      satReplacement: 'Saturday Replacement Leave (5-Day Work Week)',
      satReplacementDesc: 'If public holiday falls on Saturday, company gives Monday off',
      categoryFilter: {
        all: 'ALL',
        compulsory: 'MANDATORY (EA 1955)',
        federal: 'FEDERAL',
        state: 'STATE',
      },
      observedHolidays: 'Observed Public Holidays List',
    },
    cards: {
      locked: 'LOCKED',
      lockCta: '+ LOCK LEAVE',
      unlockCta: 'REMOVE FROM PLAN',
      freeCuti: 'FREE LEAVE (0 AL)',
      highRoi: 'HIGH ROI',
      bestPick: 'BEST PICK',
      daysOff: 'DAYS OFF',
      alNeeded: 'AL DAYS',
      alSaved: 'AL Saved',
      longWeekend: 'LONG WEEKEND',
      comboHoliday: 'Leave Combo',
    },
    stats: {
      totalDaysOff: 'Total Days Off',
      alInvested: 'AL Invested',
      roiMultiplier: 'ROI Multiplier',
      alBalance: 'Remaining AL',
    },
    footer: {
      motto: "CUTIREADY MALAYSIA • REST RESPONSIBLY • DON'T LET YOUR AL BURN",
      law: '100% mathematically aligned with Employment Act 1955 (Section 60D). Boss approves, HR signs off, and you recharge with peace of mind!',
      tapTip: 'Tap any day tile to toggle your planned leaves',
    },
    modals: {
      close: 'CLOSE',
      howToUseTitle: '2026 LEAVE HACKING GUIDE',
      legendTitle: 'CALENDAR COLOR LEGEND',
    },
  },
};

export function getTranslations(lang: AppLanguage): Translations {
  return translations[lang] || translations.manglish;
}
