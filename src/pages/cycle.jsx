import {
  BarChart3,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  Droplet,
  HeartPulse,
  Home,
  Lock,
  Plus,
  UserRound,
} from "lucide-react";
import "./cycle.css";

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const calendarRows = [
  [{ day: 31, muted: true }, { day: 1 }, { day: 2 }, { day: 3 }, { day: 4 }, { day: 5 }, { day: 6 }],
  [
    { day: 7 },
    { day: 8 },
    { day: 9 },
    { day: 10, predicted: true, selected: true },
    { day: 11, predicted: true },
    { day: 12, predicted: true },
    { day: 13, predicted: true },
  ],
  [{ day: 14, period: true }, { day: 15 }, { day: 16 }, { day: 17 }, { day: 18, fertile: true }, { day: 19 }, { day: 20 }],
  [{ day: 21 }, { day: 22 }, { day: 23 }, { day: 24 }, { day: 25 }, { day: 26 }, { day: 27 }],
  [{ day: 28 }, { day: 29 }, { day: 30 }, { day: 1, muted: true }, { day: 2, muted: true }, { day: 3, muted: true }, { day: 4, muted: true }],
];

const summaryCards = [
  { label: "Period Length", value: "5 Days", note: "Last: 5 Days", tone: "pink", icon: Droplet },
  { label: "Cycle Length", value: "28 Days", note: "Last: 28 Days", tone: "purple", icon: CalendarDays },
  { label: "Avg. Cycle", value: "28 Days", note: "Last 3 cycles", tone: "orange", icon: CalendarDays },
  { label: "Next Period", value: "Jul 8", note: "In 27 Days", tone: "teal", icon: HeartPulse },
];

const records = [
  { range: "Jun 10 - Jun 14, 2026", days: "5 Days", cycle: "28 Days" },
  { range: "May 13 - May 17, 2026", days: "5 Days", cycle: "27 Days" },
  { range: "Apr 16 - Apr 20, 2026", days: "5 Days", cycle: "30 Days" },
  { range: "Mar 18 - Mar 22, 2026", days: "5 Days", cycle: "29 Days" },
  { range: "Feb 17 - Feb 21, 2026", days: "5 Days", cycle: "29 Days" },
];

const navItems = [
  { label: "Home", icon: Home },
  { label: "Calendar", icon: CalendarDays },
  { label: "Records", icon: CalendarDays, active: true },
  { label: "Insights", icon: BarChart3 },
  { label: "Profile", icon: UserRound },
];

// const CyclePage = () => (
//   <main className="cycle-page">
//     <header className="cycle-header">
//       <button className="cycle-header__button" type="button" aria-label="Go back">
//         <ChevronLeft size={27} strokeWidth={2.6} />
//       </button>
//       <div className="cycle-header__title">
//         <h1>Period Cycle Records</h1>
//         <p>Track, understand &amp; care for yourself</p>
//       </div>
//       <button className="cycle-header__button" type="button" aria-label="Open insights">
//         <BarChart3 size={25} strokeWidth={2.35} />
//       </button>
//     </header>

//     <section className="calendar-card" aria-label="June 2026 period calendar">
//       <div className="calendar-card__month">
//         <button type="button" aria-label="Previous month">
//           <ChevronLeft size={23} strokeWidth={3} />
//         </button>
//         <h2>June 2026</h2>
//         <button type="button" aria-label="Next month">
//           <ChevronRight size={23} strokeWidth={3} />
//         </button>
//       </div>

//       <div className="calendar-card__weekdays">
//         {WEEK_DAYS.map((day) => (
//           <span key={day}>{day}</span>
//         ))}
//       </div>

//       <div className="calendar-card__dates">
//         {calendarRows.flat().map((date, index) => (
//           <span
//             key={`${date.day}-${index}`}
//             className={[
//               "calendar-card__date",
//               date.muted ? "is-muted" : "",
//               date.period ? "is-period" : "",
//               date.predicted ? "is-predicted" : "",
//               date.fertile ? "is-fertile" : "",
//               date.selected ? "is-selected" : "",
//             ].join(" ")}
//           >
//             {date.day}
//           </span>
//         ))}
//       </div>

//       <div className="calendar-card__legend">
//         <span><i className="legend-dot legend-dot--period" />Period</span>
//         <span><i className="legend-dot legend-dot--predicted" />Predicted Period</span>
//         <span><i className="legend-dot legend-dot--fertile" />Fertile Window</span>
//         <span><i className="legend-dot legend-dot--ovulation" />Ovulation</span>
//       </div>
//     </section>

//     <section className="cycle-section-header">
//       <h2>Cycle Summary</h2>
//       <a href="#insights">View Insights <ChevronRight size={20} /></a>
//     </section>

//     <section className="summary-grid" aria-label="Cycle summary">
//       {summaryCards.map(({ label, value, note, tone, icon: Icon }) => (
//         <article className="summary-card" key={label}>
//           <div className={`summary-card__icon summary-card__icon--${tone}`}>
//             <Icon size={25} />
//           </div>
//           <p>{label}</p>
//           <strong className={`summary-card__value summary-card__value--${tone}`}>{value}</strong>
//           <span>{note}</span>
//         </article>
//       ))}
//     </section>

//     {/* <section className="cycle-section-header cycle-section-header--records">
//       <h2>Your Period Records</h2>
//       <button type="button"><CirclePlus size={20} /> Add Record</button>
//     </section> */}

//     <section className="records-list" aria-label="Period records">
//       {records.map((record) => (
//         <article className="record-card" key={record.range}>
//           <div className="record-card__icon">
//             <Droplet size={21} fill="currentColor" />
//           </div>
//           <div className="record-card__date">
//             <h3>{record.range}</h3>
//             <p>{record.days}</p>
//           </div>
//           <p className="record-card__cycle">Cycle: {record.cycle}</p>
//           <ChevronRight className="record-card__arrow" size={23} />
//         </article>
//       ))}
//     </section>

//     <p className="privacy-note">
//       <Lock size={16} fill="currentColor" /> Your data is private and secure
//     </p>

//     <button className="floating-button" type="button" aria-label="Add period record">
//       <Plus size={38} />
//     </button>

//     <nav className="bottom-navigation" aria-label="Main navigation">
//       {navItems.map(({ label, icon: Icon, active }) => (
//         <a className={active ? "is-active" : ""} href={active ? "#records" : "#"} key={label}>
//           <Icon size={27} strokeWidth={2.15} />
//           <span>{label}</span>
//         </a>
//       ))}
//     </nav>
//   </main>
// );


import { useEffect, useState } from "react";

const CyclePage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleSaveRecord = () => {
    if (!startDate || !endDate) {
      return;
    }

    if (endDate < startDate) {
      return;
    }

    console.log("New period record:", {
      startDate,
      endDate,
    });

    // Later you can replace this with your API call.

    setStartDate("");
    setEndDate("");
    setIsAddModalOpen(false);
  };

  // Close popup with Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeAddModal();
      }
    };

    if (isAddModalOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isAddModalOpen]);

  return (
    <main className="cycle-page">

      <header className="cycle-header">
        <button
          className="cycle-header__button"
          type="button"
          aria-label="Go back"
        >
          <ChevronLeft size={27} strokeWidth={2.6} />
        </button>

        <div className="cycle-header__title">
          <h1>Period Cycle Records</h1>
          <p>Track, understand &amp; care for yourself</p>
        </div>

        <button
          className="cycle-header__button"
          type="button"
          aria-label="Open insights"
        >
          <BarChart3 size={25} strokeWidth={2.35} />
        </button>
      </header>

      <section
        className="calendar-card"
        aria-label="June 2026 period calendar"
      >
        <div className="calendar-card__month">
          <button type="button" aria-label="Previous month">
            <ChevronLeft size={23} strokeWidth={3} />
          </button>

          <h2>June 2026</h2>

          <button type="button" aria-label="Next month">
            <ChevronRight size={23} strokeWidth={3} />
          </button>
        </div>

        <div className="calendar-card__weekdays">
          {WEEK_DAYS.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        <div className="calendar-card__dates">
          {calendarRows.flat().map((date, index) => (
            <span
              key={`${date.day}-${index}`}
              className={[
                "calendar-card__date",
                date.muted ? "is-muted" : "",
                date.period ? "is-period" : "",
                date.predicted ? "is-predicted" : "",
                date.fertile ? "is-fertile" : "",
                date.selected ? "is-selected" : "",
              ].join(" ")}
            >
              {date.day}
            </span>
          ))}
        </div>

        <div className="calendar-card__legend">
          <span>
            <i className="legend-dot legend-dot--period" />
            Period
          </span>

          <span>
            <i className="legend-dot legend-dot--predicted" />
            Predicted Period
          </span>

          <span>
            <i className="legend-dot legend-dot--fertile" />
            Fertile Window
          </span>

          <span>
            <i className="legend-dot legend-dot--ovulation" />
            Ovulation
          </span>
        </div>
      </section>

      <section className="cycle-section-header">
        <h2>Cycle Summary</h2>

        <a href="#insights">
          View Insights
          <ChevronRight size={20} />
        </a>
      </section>

      <section
        className="summary-grid"
        aria-label="Cycle summary"
      >
        {summaryCards.map(
          ({ label, value, note, tone, icon: Icon }) => (
            <article
              className="summary-card"
              key={label}
            >
              <div
                className={`summary-card__icon summary-card__icon--${tone}`}
              >
                <Icon size={25} />
              </div>

              <p>{label}</p>

              <strong
                className={`summary-card__value summary-card__value--${tone}`}
              >
                {value}
              </strong>

              <span>{note}</span>
            </article>
          )
        )}
      </section>

      <section
        className="records-list"
        aria-label="Period records"
      >
        {records.map((record) => (
          <article
            className="record-card"
            key={record.range}
          >
            <div className="record-card__icon">
              <Droplet
                size={21}
                fill="currentColor"
              />
            </div>

            <div className="record-card__date">
              <h3>{record.range}</h3>
              <p>{record.days}</p>
            </div>

            <p className="record-card__cycle">
              Cycle: {record.cycle}
            </p>

            <ChevronRight
              className="record-card__arrow"
              size={23}
            />
          </article>
        ))}
      </section>

      <p className="privacy-note">
        <Lock
          size={16}
          fill="currentColor"
        />
        Your data is private and secure
      </p>

      {/* ========================= */}
      {/* FLOATING ADD BUTTON */}
      {/* ========================= */}

      <button
        className={`floating-button ${
          isAddModalOpen ? "is-open" : ""
        }`}
        type="button"
        aria-label="Add period record"
        onClick={openAddModal}
      >
        <Plus size={38} />
      </button>

      <nav
        className="bottom-navigation"
        aria-label="Main navigation"
      >
        {navItems.map(({ label, icon: Icon, active }) => (
          <a
            className={active ? "is-active" : ""}
            href={active ? "#records" : "#"}
            key={label}
          >
            <Icon
              size={27}
              strokeWidth={2.15}
            />
            <span>{label}</span>
          </a>
        ))}
      </nav>

      {/* ================================= */}
      {/* ADD PERIOD RECORD MODAL */}
      {/* ================================= */}

      {isAddModalOpen && (
        <div
          className="period-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              closeAddModal();
            }
          }}
        >
          <section
            className="period-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-period-title"
          >

            {/* Animated decorative background */}

            <div
              className="period-modal__decorations"
              aria-hidden="true"
            >
              <span className="period-particle particle-1">
                🌸
              </span>

              <span className="period-particle particle-2">
                💕
              </span>

              <span className="period-particle particle-3">
                ✨
              </span>

              <span className="period-particle particle-4">
                🌷
              </span>

              <span className="period-particle particle-5">
                💗
              </span>

              <span className="period-particle particle-6">
                ✨
              </span>

              <span className="period-particle particle-7">
                🌸
              </span>

              <span className="period-particle particle-8">
                💕
              </span>

              <div className="period-glow period-glow--one" />
              <div className="period-glow period-glow--two" />
            </div>

            {/* Top handle */}

            <div className="period-modal__handle" />

            {/* Close */}

            <button
              className="period-modal__close"
              type="button"
              aria-label="Close add period record"
              onClick={closeAddModal}
            >
              ×
            </button>

            {/* Header */}

            <div className="period-modal__header">
              <div className="period-modal__icon">
                <Droplet
                  size={26}
                  fill="currentColor"
                />
              </div>

              <div>
                <h2 id="add-period-title">
                  Add Period Record
                </h2>

                <p>
                  Select the start and end date of
                  your period.
                </p>
              </div>
            </div>

            {/* Form */}

            <div className="period-form">

              {/* START DATE */}

              <div className="period-field">
                <label htmlFor="period-start-date">
                  Start Date
                </label>

                <div className="period-date-input">
                  <input
                    id="period-start-date"
                    type="date"
                    value={startDate}
                    onChange={(event) =>
                      setStartDate(
                        event.target.value
                      )
                    }
                    max={endDate || undefined}
                  />

                  <CalendarDays
                    size={21}
                    className="period-date-icon"
                  />
                </div>
              </div>

              {/* END DATE */}

              <div className="period-field">
                <label htmlFor="period-end-date">
                  End Date
                </label>

                <div className="period-date-input">
                  <input
                    id="period-end-date"
                    type="date"
                    value={endDate}
                    onChange={(event) =>
                      setEndDate(
                        event.target.value
                      )
                    }
                    min={startDate || undefined}
                  />

                  <CalendarDays
                    size={21}
                    className="period-date-icon"
                  />
                </div>
              </div>

              {/* DATE VALIDATION */}

              {startDate &&
                endDate &&
                endDate < startDate && (
                  <p className="period-error">
                    End date cannot be before the
                    start date.
                  </p>
                )}

              {/* SAVE */}

              <button
                className="period-save-button"
                type="button"
                disabled={
                  !startDate ||
                  !endDate ||
                  endDate < startDate
                }
                onClick={handleSaveRecord}
              >
                <span>Save Record</span>

                <span className="period-save-arrow">
                  →
                </span>
              </button>

              {/* CANCEL */}

              <button
                className="period-cancel-button"
                type="button"
                onClick={closeAddModal}
              >
                Cancel
              </button>

            </div>
          </section>
        </div>
      )}
    </main>
  );
};


export default CyclePage;
