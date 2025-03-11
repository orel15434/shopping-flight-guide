
export const agents = [
  {
    id: "cssbuy",
    name: "CSS Buy",
    methods: [
      {
        id: "eub",
        name: "E-UB",
        basePrice: 0, // המחיר הבסיסי מחושב לפי משקל
        icon: "📦",
        // מחירון חדש: המחיר משתנה לפי מדרגות משקל מדויקות
        calculatePrice: (weightKg: number) => {
          // המרה לגרמים
          const grams = Math.round(weightKg * 1000);
          
          // נתמוך במשקלים עד 5 ק"ג
          if (grams <= 0) return 0;
          if (grams > 5000) return 500; // הגבלה עליונה

          // מחירון מדויק - נתונים נלקחו מהאתר הרשמי ועודכנו ב-01/2023
          if (grams <= 50) return 9.41;
          if (grams <= 100) return 9.98;
          if (grams <= 150) return 10.54;
          if (grams <= 200) return 11.10;
          if (grams <= 250) return 11.67;
          if (grams <= 300) return 12.23;
          if (grams <= 350) return 12.79;
          if (grams <= 400) return 13.36;
          if (grams <= 450) return 13.92;
          if (grams <= 500) return 14.48;
          if (grams <= 550) return 15.05;
          if (grams <= 600) return 15.61;
          if (grams <= 650) return 16.17;
          if (grams <= 700) return 16.74;
          if (grams <= 750) return 17.30;
          if (grams <= 800) return 17.86;
          if (grams <= 850) return 18.43;
          if (grams <= 900) return 18.99;
          if (grams <= 950) return 19.55;
          if (grams <= 1000) return 20.12;
          if (grams <= 1050) return 20.68;
          if (grams <= 1100) return 21.25;
          if (grams <= 1150) return 21.81;
          if (grams <= 1200) return 22.37;
          if (grams <= 1250) return 22.94;
          if (grams <= 1300) return 23.50;
          if (grams <= 1350) return 24.06;
          if (grams <= 1400) return 24.63;
          if (grams <= 1450) return 25.19;
          if (grams <= 1500) return 25.75;
          if (grams <= 1550) return 26.32;
          if (grams <= 1600) return 26.88;
          if (grams <= 1650) return 27.44;
          if (grams <= 1700) return 28.01;
          if (grams <= 1750) return 28.57;
          if (grams <= 1800) return 29.13;
          if (grams <= 1850) return 29.70;
          if (grams <= 1900) return 30.26;
          if (grams <= 1950) return 30.82;
          if (grams <= 2000) return 31.39;
          
          // מעל 2 ק"ג
          if (grams > 2000 && grams <= 5000) {
            // עבור כל 50 גרם מעל 2 ק"ג, מוסיפים 0.56$
            const additionalWeight = grams - 2000;
            const additionalBlocks = Math.ceil(additionalWeight / 50);
            return 31.39 + (additionalBlocks * 0.56);
          }
          
          return 500; // ערך ברירת מחדל למקרה של חריגה
        }
      },
      {
        id: "sal",
        name: "SAL",
        basePrice: 17.49,
        pricePerKg: 8.26,
        icon: "🚚"
      },
      {
        id: "hz-sal",
        name: "HZ-SAL",
        basePrice: 12.95,
        pricePerKg: 6.74,
        icon: "🚛"
      },
      {
        id: "hz-ems",
        name: "HZ-EMS",
        basePrice: 22.44,
        pricePerKg: 9.20,
        icon: "✈️"
      },
      {
        id: "dhl",
        name: "DHL",
        basePrice: 25.25,
        pricePerKg: 5.85,
        icon: "🚀"
      },
      {
        id: "jnet",
        name: "JNet",
        basePrice: 16.00,
        pricePerKg: 10.00,
        icon: "📯"
      }
    ]
  },
  {
    id: "sugargoo",
    name: "Sugar Goo",
    methods: [
      {
        id: "eub",
        name: "E-UB",
        basePrice: 19.85,
        pricePerKg: 3.5,
        icon: "📦"
      },
      {
        id: "eu-tariffless",
        name: "EU Tariffless",
        basePrice: 22.44,
        pricePerKg: 4.1,
        icon: "🇪🇺"
      },
      {
        id: "us-tariffless",
        name: "US Tariffless",
        basePrice: 25.81,
        pricePerKg: 4.8,
        icon: "🇺🇸"
      },
      {
        id: "ems",
        name: "EMS",
        basePrice: 38.42,
        pricePerKg: 6.24,
        icon: "✈️"
      },
      {
        id: "dhl",
        name: "DHL",
        basePrice: 30.65,
        pricePerKg: 5.85,
        icon: "🚀"
      }
    ]
  },
  {
    id: "pandabuy",
    name: "Panda Buy",
    methods: [
      {
        id: "gd-eub",
        name: "GD-EUB",
        basePrice: 20.64,
        pricePerKg: 3.96,
        icon: "📦"
      },
      {
        id: "gd-ems",
        name: "GD-EMS",
        basePrice: 35.89,
        pricePerKg: 7.18,
        icon: "✈️"
      },
      {
        id: "kr-ems",
        name: "KR-EMS",
        basePrice: 36.05,
        pricePerKg: 7.21,
        icon: "🇰🇷"
      },
      {
        id: "dhl",
        name: "DHL",
        basePrice: 28.53,
        pricePerKg: 6.09,
        icon: "🚀"
      },
      {
        id: "hz-fedex",
        name: "HZ-FedEx",
        basePrice: 35.43,
        pricePerKg: 6.25,
        icon: "🚚"
      }
    ]
  },
  {
    id: "kakobuy",
    name: "Kako Buy",
    methods: [
      {
        id: "eub",
        name: "E-UB",
        basePrice: 0, // המחיר הבסיסי מחושב לפי משקל
        icon: "📦",
        // מחירון חדש: המחיר משתנה לפי משקל מדויק בגרמים
        calculatePrice: (weightKg: number) => {
          // המרה לגרמים ועיגול למספר שלם
          const grams = Math.round(weightKg * 1000);
          
          // נתמוך במשקלים עד 5 ק"ג
          if (grams <= 0) return 0;
          if (grams > 5000) return 500; // הגבלה עליונה

          // מחירון חדש לפי גרמים מדויקים עבור KAKOBUY
          if (grams < 500) return 11.17;
          if (grams == 500) return 11.17;
          if (grams == 501) return 11.18;
          if (grams == 502) return 11.20;
          if (grams == 503) return 11.21;
          if (grams == 504) return 11.22;
          if (grams == 505) return 11.23;
          if (grams == 506) return 11.25;
          if (grams == 507) return 11.26;
          if (grams == 508) return 11.27;
          if (grams == 509) return 11.29;
          if (grams == 510) return 11.30;
          if (grams == 511) return 11.31;
          if (grams == 512) return 11.33;
          if (grams == 513) return 11.34;
          if (grams == 514) return 11.35;
          if (grams == 515) return 11.37;
          if (grams == 516) return 11.38;
          if (grams == 517) return 11.39;
          if (grams == 518) return 11.40;
          if (grams == 519) return 11.42;
          if (grams == 520) return 11.43;
          if (grams == 521) return 11.44;
          if (grams == 522) return 11.46;
          if (grams == 523) return 11.47;
          if (grams == 524) return 11.48;
          if (grams == 525) return 11.50;
          if (grams == 526) return 11.51;
          if (grams == 527) return 11.52;
          if (grams == 528) return 11.53;
          if (grams == 529) return 11.55;
          if (grams == 530) return 11.56;
          if (grams == 531) return 11.57;
          if (grams == 532) return 11.59;
          if (grams == 533) return 11.60;
          if (grams == 534) return 11.61;
          if (grams == 535) return 11.62;
          if (grams == 536) return 11.64;
          if (grams == 537) return 11.65;
          if (grams == 538) return 11.66;
          if (grams == 539) return 11.68;
          if (grams == 540) return 11.69;
          if (grams == 541) return 11.70;
          if (grams == 542) return 11.72;
          if (grams == 543) return 11.73;
          if (grams == 544) return 11.74;
          if (grams == 545) return 11.75;
          if (grams == 546) return 11.77;
          if (grams == 547) return 11.78;
          if (grams == 548) return 11.79;
          if (grams == 549) return 11.81;
          if (grams == 550) return 11.82;
          
          // יצירת מנגנון מחירון דינמי לפי נוסחה, במקום רשימה ארוכה של תנאים
          // המחיר עולה בכ-0.01-0.02$ לכל גרם נוסף
          if (grams > 550 && grams <= 3000) {
            const baseValue = 11.82; // מחיר ל-550 גרם
            const additionalGrams = grams - 550;
            return baseValue + (additionalGrams * 0.0155); // עליה של כ-0.0155$ לגרם נוסף
          }
          
          // מעל 3ק"ג
          if (grams > 3000 && grams <= 5000) {
            const baseValueAt3000 = 43.67; // מחיר ל-3000 גרם
            const additionalGrams = grams - 3000;
            return baseValueAt3000 + (additionalGrams * 0.0168); // עליה של כ-0.0168$ לגרם נוסף
          }
          
          return 500; // ערך ברירת מחדל למקרה של חריגה
        }
      },
      {
        id: "bram",
        name: "BRAM",
        basePrice: 22.68,
        pricePerKg: 4.34,
        icon: "📦"
      },
      {
        id: "ems",
        name: "EMS",
        basePrice: 28.35,
        pricePerKg: 6.49,
        icon: "✈️"
      },
      {
        id: "sal",
        name: "SAL",
        basePrice: 18.39,
        pricePerKg: 8.76,
        icon: "🚚"
      },
      {
        id: "dhl",
        name: "DHL",
        basePrice: 26.64,
        pricePerKg: 5.92,
        icon: "🚀"
      }
    ]
  },
  {
    id: "wegobuy",
    name: "WeGo Buy",
    methods: [
      {
        id: "gd-eub",
        name: "GD-EUB",
        basePrice: 22.25,
        pricePerKg: 4.45,
        icon: "📦"
      },
      {
        id: "gd-ems",
        name: "GD-EMS",
        basePrice: 38.42,
        pricePerKg: 7.68,
        icon: "✈️"
      },
      {
        id: "gd-e-ems",
        name: "GD-E-EMS",
        basePrice: 36.86,
        pricePerKg: 7.37,
        icon: "✈️"
      },
      {
        id: "hz-ems",
        name: "HZ-EMS",
        basePrice: 39.2,
        pricePerKg: 7.84,
        icon: "🚚"
      },
      {
        id: "kr-ems",
        name: "KR-EMS",
        basePrice: 37.64,
        pricePerKg: 7.53,
        icon: "🇰🇷"
      }
    ]
  }
];
