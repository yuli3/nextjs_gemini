"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image'
import Script from 'next/script';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

const languages = [
  { label: "English", value: "en", src: "https://flagcdn.com/h60/us.png" },
  { label: "Spanish", value: "es", src: "https://flagcdn.com/h60/es.png" },
  { label: "French", value: "fr", src: "https://flagcdn.com/h60/fr.png" },
  { label: "German", value: "de", src: "https://flagcdn.com/h60/de.png" },
  { label: "Italian", value: "it", src: "https://flagcdn.com/h60/it.png" },
  { label: "Korean", value: "ko", src: "https://flagcdn.com/h60/kr.png" },
];

const includedLanguages = languages.map(lang => lang.value).join(",");

function googleTranslateElementInit() {
  new (window as any).google.translate.TranslateElement({
    pageLanguage: "auto",
    includedLanguages
  }, "google_translate_element");
}

export default function GoogleTranslatePage() {
  const [langCookie, setLangCookie] = useState("/en/en");

  useEffect(() => {
    window.googleTranslateElementInit = googleTranslateElementInit;
  }, []);

  const onLangChange = (value: string) => {
    const lang = "/en/" + value;
    setLangCookie(lang);
    const element = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (element) {
      element.value = value;
      element.dispatchEvent(new Event("change"));
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Google Translate Example</h1>
      <div id="google_translate_element" style={{ visibility: "hidden", width: "1px", height: "1px" }}></div>
      <LanguageSelector onChange={onLangChange} value={langCookie} />
      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Sample Text</h2>
        <p>This is a sample text that will be translated when you change the language.</p>
        <p>Hello, world! Welcome to our website.</p>
        <p>Please select a language from the dropdown above to see the translation in action.</p>
        <p>Is it illegal?</p>
      </div>
    </main>
  );
}

function LanguageSelector({ onChange, value }: { onChange: (value: string) => void, value: string }) {
  const langCookie = value.split("/")[2];
  return (
    <div className="w-[200px]">
      <Select onValueChange={onChange} value={langCookie}>
        <SelectTrigger>
          <SelectValue placeholder="Select Language" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.value} value={lang.value}>
              <div className="flex items-center">
                <Image src={lang.src} alt={lang.label} width={24} height={16} className="w-6 h-4 mr-2" />
                {lang.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}