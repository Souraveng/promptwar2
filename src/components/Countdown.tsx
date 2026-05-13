'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function Countdown({ targetDate: customTargetDate }: { targetDate?: string }) {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Default target date: June 1, 2026
    const finalTarget = customTargetDate ? new Date(customTargetDate).getTime() : new Date('2026-06-01T07:00:00Z').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = finalTarget - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [customTargetDate]);

  const units = [
    { label: t('days'), value: timeLeft.days },
    { label: t('hours'), value: timeLeft.hours },
    { label: t('minutes'), value: timeLeft.minutes },
    { label: t('seconds'), value: timeLeft.seconds },
  ];

  return (
    <div className="flex gap-4 md:gap-8 mt-8">
      {units.map((unit) => (
        <div key={unit.label} className="text-center">
          <div className="text-[36px] md:text-[48px] font-bold text-on-primary-container leading-none tabular-nums">
            {unit.value.toString().padStart(2, '0')}
          </div>
          <div className="text-[12px] md:text-[14px] font-semibold uppercase tracking-wider text-on-primary-container/70 mt-2">
            {unit.label}
          </div>
        </div>
      ))}
    </div>
  );
}
