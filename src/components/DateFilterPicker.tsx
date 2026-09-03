import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CalendarCheck, Calendar as CalendarIcon } from 'lucide-react';

export interface DateFilterValue {
  mode: 'mensal' | 'periodo';
  year: number;
  month: number; // 0-11
  monthName: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  displayText: string;
}

interface DateFilterPickerProps {
  value: DateFilterValue;
  onChange: (value: DateFilterValue) => void;
}

const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro'
];

const YEARS = [2023, 2024, 2025, 2026, 2027];
const WEEKDAYS = ['DO', 'SE', 'TE', 'QU', 'QU', 'SE', 'SA'];

export const DateFilterPicker: React.FC<DateFilterPickerProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Draft state inside modal
  const [tempMode, setTempMode] = useState<'mensal' | 'periodo'>(value.mode);
  const [tempYear, setTempYear] = useState<number>(value.year);
  const [tempMonth, setTempMonth] = useState<number>(value.month);

  // Date range draft
  const [startDateStr, setStartDateStr] = useState<string>(value.startDate || '2026-08-01');
  const [endDateStr, setEndDateStr] = useState<string>(value.endDate || '2026-08-31');
  
  // Sub-calendar state for Período picking
  const [calendarTarget, setCalendarTarget] = useState<'start' | 'end' | null>(null);
  const [calYear, setCalYear] = useState<number>(value.year);
  const [calMonth, setCalMonth] = useState<number>(value.month);

  // Sync draft state when opening
  useEffect(() => {
    if (isOpen) {
      setTempMode(value.mode);
      setTempYear(value.year);
      setTempMonth(value.month);
      setStartDateStr(value.startDate);
      setEndDateStr(value.endDate);
      setCalYear(value.year);
      setCalMonth(value.month);
      setCalendarTarget(null);
    }
  }, [isOpen, value]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleApply = () => {
    if (tempMode === 'mensal') {
      const monthName = MONTHS[tempMonth];
      const startD = `${tempYear}-${String(tempMonth + 1).padStart(2, '0')}-01`;
      const lastDay = new Date(tempYear, tempMonth + 1, 0).getDate();
      const endD = `${tempYear}-${String(tempMonth + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
      
      onChange({
        mode: 'mensal',
        year: tempYear,
        month: tempMonth,
        monthName,
        startDate: startD,
        endDate: endD,
        displayText: `${monthName} - ${tempYear}`
      });
    } else {
      const formatDisplay = (iso: string) => {
        if (!iso) return '';
        const [y, m, d] = iso.split('-');
        return `${d}/${m}/${y}`;
      };

      const displayText = startDateStr && endDateStr
        ? `${formatDisplay(startDateStr)} a ${formatDisplay(endDateStr)}`
        : startDateStr
        ? `A partir de ${formatDisplay(startDateStr)}`
        : 'Período personalizado';

      onChange({
        mode: 'periodo',
        year: tempYear,
        month: tempMonth,
        monthName: MONTHS[tempMonth],
        startDate: startDateStr,
        endDate: endDateStr,
        displayText
      });
    }
    setIsOpen(false);
  };

  // Format helpers
  const formatInputDate = (iso: string) => {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  };

  // Mini-calendar calculations
  const getCalendarDays = () => {
    const firstDayIndex = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const prevMonthDays = new Date(calYear, calMonth, 0).getDate();

    const days: { day: number; isCurrentMonth: boolean; dateIso: string }[] = [];

    // Prev month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      const prevM = calMonth === 0 ? 11 : calMonth - 1;
      const prevY = calMonth === 0 ? calYear - 1 : calYear;
      days.push({
        day: dayNum,
        isCurrentMonth: false,
        dateIso: `${prevY}-${String(prevM + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        dateIso: `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      });
    }

    // Next month padding (fill grid up to 35 or 42 cells)
    const remaining = 35 - days.length;
    const extra = remaining > 0 ? remaining : 42 - days.length;
    for (let i = 1; i <= (extra > 0 ? extra : 0); i++) {
      const nextM = calMonth === 11 ? 0 : calMonth + 1;
      const nextY = calMonth === 11 ? calYear + 1 : calYear;
      days.push({
        day: i,
        isCurrentMonth: false,
        dateIso: `${nextY}-${String(nextM + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      });
    }

    return days;
  };

  const handleSelectCalDate = (dateIso: string) => {
    if (calendarTarget === 'start') {
      setStartDateStr(dateIso);
      setCalendarTarget('end');
    } else if (calendarTarget === 'end') {
      setEndDateStr(dateIso);
      setCalendarTarget(null);
    } else {
      setStartDateStr(dateIso);
      setCalendarTarget(null);
    }
  };

  const nextCalMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear(prev => prev + 1);
    } else {
      setCalMonth(prev => prev + 1);
    }
  };

  const prevCalMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear(prev => prev - 1);
    } else {
      setCalMonth(prev => prev - 1);
    }
  };

  return (
    <div ref={containerRef} className="relative inline-block text-left select-none">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className={`h-9 px-3.5 bg-white border rounded-full text-xs font-semibold flex items-center gap-2.5 transition-all shadow-2xs hover:border-[#b6bdc7] cursor-pointer ${
          isOpen ? 'border-[#f47920] ring-2 ring-[#f47920]/20' : 'border-[#dfe4ea]'
        }`}
      >
        <span className="text-[#004e4c] font-bold text-[13px]">
          {value.displayText || 'Agosto - 2026'}
        </span>
        <div className="w-px h-4 bg-[#dfe4ea]"></div>
        <CalendarIcon className="w-4 h-4 text-[#8a93a0]" />
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* Arrow */}
          <div className="w-3.5 h-3.5 bg-white border-t border-l border-[#dfe4ea] rotate-45 ml-8 -mb-2 relative z-10"></div>

          <div className="bg-white border border-[#dfe4ea] rounded-[18px] p-5 shadow-2xl w-[320px] text-[#1f2733] relative">
            {/* Header with Mode Radios */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#f1f3f5]">
              {/* Mensal Mode */}
              <label
                onClick={() => setTempMode('mensal')}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <span className={`text-[12.5px] font-bold tracking-wider ${
                  tempMode === 'mensal' ? 'text-[#004e4c]' : 'text-[#8a93a0] group-hover:text-[#004e4c]'
                }`}>
                  MENSAL
                </span>
                <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                  tempMode === 'mensal' ? 'bg-[#00995d]' : 'bg-[#e2e8f0]'
                }`}>
                  {tempMode === 'mensal' && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                </div>
              </label>

              {/* Período Mode */}
              <label
                onClick={() => setTempMode('periodo')}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <span className={`text-[12.5px] font-bold tracking-wider ${
                  tempMode === 'periodo' ? 'text-[#004e4c]' : 'text-[#8a93a0] group-hover:text-[#004e4c]'
                }`}>
                  PERÍODO
                </span>
                <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                  tempMode === 'periodo' ? 'bg-[#00995d]' : 'bg-[#e2e8f0]'
                }`}>
                  {tempMode === 'periodo' && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                </div>
              </label>
            </div>

            {/* Mode Content: MENSAL */}
            {tempMode === 'mensal' && (
              <div className="grid grid-cols-[80px_1fr] gap-3 pt-3.5 pb-4 min-h-[160px]">
                {/* Years Column */}
                <div className="flex flex-col gap-1 pr-2 border-r border-[#f1f3f5]">
                  {YEARS.map(y => {
                    const isSelected = tempYear === y;
                    return (
                      <button
                        key={y}
                        type="button"
                        onClick={() => setTempYear(y)}
                        className={`text-xs py-1 px-2.5 rounded-full text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#cbd5e1] text-[#1e293b] font-bold shadow-2xs'
                            : 'text-[#64748b] hover:text-[#004e4c] hover:bg-[#f8fafc] font-medium'
                        }`}
                      >
                        {y}
                      </button>
                    );
                  })}
                </div>

                {/* Months Column */}
                <div className="flex flex-col gap-0.5 max-h-[160px] overflow-y-auto pr-1">
                  {MONTHS.map((m, idx) => {
                    const isSelected = tempMonth === idx;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setTempMonth(idx)}
                        className={`text-xs py-1 px-2.5 rounded-md text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'text-[#004e4c] font-bold bg-[#eef0f3]'
                            : 'text-[#475569] hover:text-[#004e4c] hover:bg-[#f8fafc]'
                        }`}
                      >
                        <span>{m}</span>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#f47920]"></span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Mode Content: PERÍODO */}
            {tempMode === 'periodo' && (
              <div className="pt-3.5 pb-4 space-y-2.5 relative">
                {/* Input Início */}
                <div className="relative">
                  <div
                    onClick={() => {
                      setCalendarTarget(calendarTarget === 'start' ? null : 'start');
                      if (startDateStr) {
                        const [y, m] = startDateStr.split('-');
                        setCalYear(parseInt(y));
                        setCalMonth(parseInt(m) - 1);
                      }
                    }}
                    className={`flex items-center justify-between h-9 px-3 bg-white border rounded-[8px] cursor-pointer transition-all ${
                      calendarTarget === 'start'
                        ? 'border-[#f47920] ring-1 ring-[#f47920]'
                        : 'border-[#dfe4ea] hover:border-[#b6bdc7]'
                    }`}
                  >
                    <span className={`text-xs ${startDateStr ? 'text-[#1e293b] font-medium' : 'text-[#94a3b8]'}`}>
                      {startDateStr ? formatInputDate(startDateStr) : 'Início'}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-px h-4 bg-[#dfe4ea]"></div>
                      <CalendarIcon className="w-3.5 h-3.5 text-[#8a93a0]" />
                    </div>
                  </div>
                </div>

                {/* Input Fim */}
                <div className="relative">
                  <div
                    onClick={() => {
                      setCalendarTarget(calendarTarget === 'end' ? null : 'end');
                      if (endDateStr) {
                        const [y, m] = endDateStr.split('-');
                        setCalYear(parseInt(y));
                        setCalMonth(parseInt(m) - 1);
                      }
                    }}
                    className={`flex items-center justify-between h-9 px-3 bg-white border rounded-[8px] cursor-pointer transition-all ${
                      calendarTarget === 'end'
                        ? 'border-[#f47920] ring-1 ring-[#f47920]'
                        : 'border-[#dfe4ea] hover:border-[#b6bdc7]'
                    }`}
                  >
                    <span className={`text-xs ${endDateStr ? 'text-[#1e293b] font-medium' : 'text-[#94a3b8]'}`}>
                      {endDateStr ? formatInputDate(endDateStr) : 'Fim'}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-px h-4 bg-[#dfe4ea]"></div>
                      <CalendarIcon className="w-3.5 h-3.5 text-[#8a93a0]" />
                    </div>
                  </div>
                </div>

                {/* Mini Calendar Popup */}
                {calendarTarget && (
                  <div className="absolute top-0 -right-2 transform translate-x-full bg-white border border-[#dfe4ea] rounded-[16px] p-3.5 shadow-2xl z-50 w-[240px]">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-[#f1f3f5]">
                      <button
                        type="button"
                        onClick={prevCalMonth}
                        className="p-1 text-[#64748b] hover:text-[#004e4c] cursor-pointer rounded hover:bg-[#f1f5f9]"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <div className="text-xs font-bold text-[#004e4c]">
                        {MONTHS[calMonth]} {calYear}
                      </div>
                      <button
                        type="button"
                        onClick={nextCalMonth}
                        className="p-1 text-[#64748b] hover:text-[#004e4c] cursor-pointer rounded hover:bg-[#f1f5f9]"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Weekday headers */}
                    <div className="grid grid-cols-7 gap-1 pt-2 text-center text-[10px] font-semibold text-[#8a93a0]">
                      {WEEKDAYS.map((w, i) => (
                        <div key={`${w}-${i}`}>{w}</div>
                      ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-1 pt-1 text-center text-xs">
                      {getCalendarDays().map((d, index) => {
                        const isSelected =
                          (calendarTarget === 'start' && startDateStr === d.dateIso) ||
                          (calendarTarget === 'end' && endDateStr === d.dateIso);

                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleSelectCalDate(d.dateIso)}
                            className={`h-6 w-6 mx-auto flex items-center justify-center text-[11px] rounded-[3px] transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-[#00995d] text-white font-bold'
                                : d.isCurrentMonth
                                ? 'text-[#1f2733] hover:bg-[#e2e8f0]'
                                : 'text-[#cbd5e1] hover:bg-[#f8fafc]'
                            }`}
                          >
                            {d.day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Apply Button */}
            <button
              type="button"
              onClick={handleApply}
              className="w-full mt-2 h-10 bg-[#00995d] hover:bg-[#00824f] text-white font-semibold text-xs rounded-full flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-[0.99]"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Aplicar filtros</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
