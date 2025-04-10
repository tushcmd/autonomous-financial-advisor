import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class", "dark"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./src/app/globals.css",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // Define spacing values used for padding and margin in v4
      spacing: {
        0: "0px",
        1: "0.25rem",
        2: "0.5rem",
        3: "0.75rem",
        4: "1rem",
        5: "1.25rem",
        6: "1.5rem",
        8: "2rem",
        10: "2.5rem",
        12: "3rem",
        16: "4rem",
        20: "5rem",
        24: "6rem",
        32: "8rem",
        40: "10rem",
        48: "12rem",
        56: "14rem",
        64: "16rem",
        72: "18rem",
        80: "20rem",
        96: "24rem",
      },
      // Define max-width values in v4
      maxWidth: {
        // Container sizes
        "3xs": "16rem", // 256px
        "2xs": "18rem", // 288px
        xs: "20rem", // 320px
        sm: "24rem", // 384px
        md: "28rem", // 448px
        lg: "32rem", // 512px
        xl: "36rem", // 576px
        "2xl": "42rem", // 672px
        "3xl": "48rem", // 768px
        "4xl": "56rem", // 896px
        "5xl": "64rem", // 1024px
        "6xl": "72rem", // 1152px
        "7xl": "80rem", // 1280px
      },
      // Define color themes with CSS variables
      colors: {
        // Base colors
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",

        // Semantic colors
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        secondary: "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",
        destructive: "var(--destructive)",
        "destructive-foreground": "var(--destructive-foreground)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        popover: "var(--popover)",
        "popover-foreground": "var(--popover-foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",

        // Chart colors
        "chart-1": "var(--chart-1)",
        "chart-2": "var(--chart-2)",
        "chart-3": "var(--chart-3)",
        "chart-4": "var(--chart-4)",
        "chart-5": "var(--chart-5)",

        // Sidebar colors
        sidebar: "var(--sidebar)",
        "sidebar-foreground": "var(--sidebar-foreground)",
        "sidebar-primary": "var(--sidebar-primary)",
        "sidebar-primary-foreground": "var(--sidebar-primary-foreground)",
        "sidebar-accent": "var(--sidebar-accent)",
        "sidebar-accent-foreground": "var(--sidebar-accent-foreground)",
        "sidebar-border": "var(--sidebar-border)",
        "sidebar-ring": "var(--sidebar-ring)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
} satisfies Config;

export default config;
// import type { Config } from "tailwindcss";

// const config = {
//   darkMode: ["class", "dark"],
//   content: [
//     "./pages/**/*.{ts,tsx}",
//     "./components/**/*.{ts,tsx}",
//     "./app/**/*.{ts,tsx}",
//     "./src/**/*.{ts,tsx}",
//     "./src/app/globals.css",
//   ],
//   prefix: "",
//   theme: {
//     container: {
//       center: true,
//       padding: "2rem",
//       screens: {
//         "2xl": "1400px",
//       },
//     },
//     extend: {
//       // Define max-width values in v4
//       maxWidth: {
//         // Container sizes
//         "3xs": "16rem", // 256px
//         "2xs": "18rem", // 288px
//         xs: "20rem", // 320px
//         sm: "24rem", // 384px
//         md: "28rem", // 448px
//         lg: "32rem", // 512px
//         xl: "36rem", // 576px
//         "2xl": "42rem", // 672px
//         "3xl": "48rem", // 768px
//         "4xl": "56rem", // 896px
//         "5xl": "64rem", // 1024px
//         "6xl": "72rem", // 1152px
//         "7xl": "80rem", // 1280px
//       },
//       // Define color themes with CSS variables
//       colors: {
//         // Base colors
//         background: "var(--background)",
//         foreground: "var(--foreground)",
//         border: "var(--border)",
//         input: "var(--input)",
//         ring: "var(--ring)",

//         // Semantic colors
//         primary: "var(--primary)",
//         "primary-foreground": "var(--primary-foreground)",
//         secondary: "var(--secondary)",
//         "secondary-foreground": "var(--secondary-foreground)",
//         destructive: "var(--destructive)",
//         "destructive-foreground": "var(--destructive-foreground)",
//         muted: "var(--muted)",
//         "muted-foreground": "var(--muted-foreground)",
//         accent: "var(--accent)",
//         "accent-foreground": "var(--accent-foreground)",
//         popover: "var(--popover)",
//         "popover-foreground": "var(--popover-foreground)",
//         card: "var(--card)",
//         "card-foreground": "var(--card-foreground)",

//         // Chart colors
//         "chart-1": "var(--chart-1)",
//         "chart-2": "var(--chart-2)",
//         "chart-3": "var(--chart-3)",
//         "chart-4": "var(--chart-4)",
//         "chart-5": "var(--chart-5)",

//         // Sidebar colors
//         sidebar: "var(--sidebar)",
//         "sidebar-foreground": "var(--sidebar-foreground)",
//         "sidebar-primary": "var(--sidebar-primary)",
//         "sidebar-primary-foreground": "var(--sidebar-primary-foreground)",
//         "sidebar-accent": "var(--sidebar-accent)",
//         "sidebar-accent-foreground": "var(--sidebar-accent-foreground)",
//         "sidebar-border": "var(--sidebar-border)",
//         "sidebar-ring": "var(--sidebar-ring)",
//       },
//       borderRadius: {
//         lg: "var(--radius)",
//         md: "calc(var(--radius) - 2px)",
//         sm: "calc(var(--radius) - 4px)",
//       },
//       keyframes: {
//         "accordion-down": {
//           from: { height: "0" },
//           to: { height: "var(--radix-accordion-content-height)" },
//         },
//         "accordion-up": {
//           from: { height: "var(--radix-accordion-content-height)" },
//           to: { height: "0" },
//         },
//       },
//       animation: {
//         "accordion-down": "accordion-down 0.2s ease-out",
//         "accordion-up": "accordion-up 0.2s ease-out",
//       },
//     },
//   },
// } satisfies Config;

// export default config;
