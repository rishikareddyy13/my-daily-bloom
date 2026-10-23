
import { useEffect, useState } from 'react'
import './App.css'

type DailyEntry = {
  studySubject: string
studyMinutes: string
studyTask: string
studyDone: boolean
englishMinutes: string
speakingDone: boolean
vocabularyWord: string
vocabularyMeaning: string
  writing: boolean
  breakfast: boolean
  lunch: boolean
  dinner: boolean
  snacks: boolean
  steps: string
  activity: string
  duration: string
  water: string
  sleep: string
  mood: string
  reflection: string
}

const habits = [
  ['writing', 'Writing / journaling'],
  ['breakfast', 'Breakfast'],
  ['lunch', 'Lunch'],
  ['dinner', 'Dinner'],
  ['snacks', 'Snacks recorded'],
] as const

const journeyStart = '2026-10-23'
const journeyEnd = '2027-04-22'

const monthNames = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December',
]

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function makeEmptyEntry(): DailyEntry {
  return {
    writing: false,
    breakfast: false,
    lunch: false,
    dinner: false,
    snacks: false,
    steps: '',
    activity: '',
    duration: '',
    water: '',
    sleep: '',
    mood: '',
    reflection: '',
    studySubject: '',
studyMinutes: '',
studyTask: '',
studyDone: false,
englishMinutes: '',
speakingDone: false,
vocabularyWord: '',
vocabularyMeaning: '',
  }
}

function getJourneyMonths() {
  const months: { title: string; dates: string[]; offset: number }[] = []
  const current = new Date(Date.UTC(2026, 9, 1))
  const end = new Date(Date.UTC(2027, 3, 1))

  while (current <= end) {
    const year = current.getUTCFullYear()
    const month = current.getUTCMonth()
    const title = `${monthNames[month]} ${year}`
    const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
    const dates: string[] = []

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(Date.UTC(year, month, day))
        .toISOString()
        .slice(0, 10)

      if (date >= journeyStart && date <= journeyEnd) {
        dates.push(date)
      }
    }

    months.push({
      title,
      dates,
      offset: new Date(Date.UTC(year, month, 1)).getUTCDay(),
    })

    current.setUTCMonth(current.getUTCMonth() + 1)
  }

  return months
}

function App() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10),
  )

  const [entries, setEntries] = useState<Record<string, DailyEntry>>(() => {
    try {
      const saved = localStorage.getItem('my-daily-bloom-entries')
      return saved
        ? JSON.parse(saved) as Record<string, DailyEntry>
        : {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    localStorage.setItem('my-daily-bloom-entries', JSON.stringify(entries))
  }, [entries])

  const entry = entries[selectedDate] ?? makeEmptyEntry()
  const completed = habits.filter(([key]) => entry[key]).length
  const recordedDays = Object.keys(entries).filter((date) => {
  const saved = entries[date]
  return (
    date >= journeyStart &&
    date <= journeyEnd &&
    Object.values(saved).some((value) => value !== '' && value !== false)
  )
}).length
const progressPercent = Math.round((recordedDays / 182) * 100)

  function updateEntry<K extends keyof DailyEntry>(
    key: K,
    value: DailyEntry[K],
  ) {
    setEntries((previous) => ({
      ...previous,
      [selectedDate]: {
        ...(previous[selectedDate] ?? makeEmptyEntry()),
        [key]: value,
      },
    }))
  }

  function hasEntry(date: string) {
    const saved = entries[date]
    return saved
      ? Object.values(saved).some((value) => value !== '' && value !== false)
      : false
  }

  return (
    <main className="app">
      <header className="hero">
        
<div className="brand-heading">
  <p className="eyebrow">YOUR SIX-MONTH RESET</p>
  <h1>My Daily Bloom <span>✿</span></h1>
  <p className="subtitle">
    Small steps, honest reflections, and room to grow.
  </p>
</div>
        <div className="journey">
          <div>
            <span className="small-label">YOUR JOURNEY</span>
            <strong>Oct 23, 2026 — Apr 22, 2027</strong>
          </div>
          <span className="flower">🌷</span>
        </div>
      </header>

      <section className="summary">
        <article className="stat">
          <span>Daily habits</span>
          <strong>{completed}/5</strong>
          <small>recorded today</small>
        </article>
        <article className="stat">
          <span>Steps</span>
          <strong>{entry.steps || '—'}</strong>
          <small>your daily record</small>
        </article>
        <article className="stat">
          <span>Sleep</span>
          <strong>{entry.sleep ? `${entry.sleep}h` : '—'}</strong>
          <small>hours recorded</small>
        </article>
      </section>
      <section className="panel">
  <p className="eyebrow">YOUR PROGRESS</p>
  <h2>Your journey so far 🌱</h2>
  <div className="stat">
    <span>Days recorded</span>
    <strong>{recordedDays} / 182</strong>
    <small>Every entry is a little step forward.</small>
    <div className="progress-track">
  <div
    className="progress-fill"
    style={{ width: `${progressPercent}%` }}
  />
</div>
<p>{progressPercent}% of your journey completed 🌱</p>
  </div>
</section>

      <section className="panel calendar-panel">
        <p className="eyebrow">YOUR SIX-MONTH JOURNEY</p>
        <h2>My Progress Calendar 🌱</h2>
        <p>Choose a date to record or revisit your day.</p>

        {getJourneyMonths().map((month) => (
          <div className="month-block" key={month.title}>
            <h3 className="month-heading">{month.title}</h3>

            <div className="calendar-grid">
              {weekdays.map((day) => (
                <div className="weekday" key={day}>{day}</div>
              ))}

              {Array.from({ length: month.offset }, (_, index) => (
                <div className="calendar-empty" key={`empty-${index}`} />
              ))}

              {month.dates.map((date) => (
                <button
                  key={date}
                  type="button"
                  className={`calendar-day ${
                    hasEntry(date) ? 'has-entry' : ''
                  } ${selectedDate === date ? 'selected-day' : ''}`}
                  onClick={() => setSelectedDate(date)}
                  title={date}
                  aria-label={`Choose ${date}`}
                >
                  <span>{Number(date.slice(8, 10))}</span>
                  {hasEntry(date) && <span>🌱</span>}
                </button>
              ))}
            </div>
          </div>
        ))}

        <p className="gentle-note">
          🌱 Days with saved entries have a little plant.
        </p>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">YOUR DAILY PAGE</p>
            <h2>How was your day?</h2>
          </div>
          <span className="flower">🌼</span>
        </div>

        <label className="field-label" htmlFor="date">
          Choose a date
        </label>
        <input
          id="date"
          type="date"
          min={journeyStart}
          max={journeyEnd}
          value={selectedDate}
          onChange={(event) => setSelectedDate(event.target.value)}
        />

        <h3>Daily habits</h3>
        <div className="habit-list">
          {habits.map(([key, label]) => (
            <label className="habit" key={key}>
              <input
                type="checkbox"
                checked={entry[key]}
                onChange={(event) => updateEntry(key, event.target.checked)}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>

        <h3>Movement and wellbeing</h3>
        <div className="form-grid">
          <label>
            Steps
            <input
              type="number"
              min="0"
              placeholder="e.g. 6500"
              value={entry.steps}
              onChange={(event) => updateEntry('steps', event.target.value)}
            />
          </label>

          <label>
            Water (litres)
            <input
              type="number"
              min="0"
              step="0.1"
              placeholder="e.g. 2"
              value={entry.water}
              onChange={(event) => updateEntry('water', event.target.value)}
            />
          </label>

          <label>
            Sleep (hours)
            <input
              type="number"
              min="0"
              max="24"
              step="0.5"
              placeholder="e.g. 8"
              value={entry.sleep}
              onChange={(event) => updateEntry('sleep', event.target.value)}
            />
          </label>

          <label>
            Activity duration (minutes)
            <input
              type="number"
              min="0"
              placeholder="e.g. 20"
              value={entry.duration}
              onChange={(event) => updateEntry('duration', event.target.value)}
            />
          </label>
        </div>

        <label className="field-label" htmlFor="activity">
          Activity
        </label>
        <input
          id="activity"
          placeholder="Walking, dancing, stretching..."
          value={entry.activity}
          onChange={(event) => updateEntry('activity', event.target.value)}
        />

        <label className="field-label" htmlFor="mood">
          Today's mood
        </label>
        <select
          id="mood"
          value={entry.mood}
          onChange={(event) => updateEntry('mood', event.target.value)}
        >
          <option value="">Choose your mood</option>
          <option>Happy</option>
          <option>Calm</option>
          <option>Motivated</option>
          <option>Tired</option>
          <option>Stressed</option>
          <option>Sad</option>
          <option>Mixed feelings</option>
        </select>

        <label className="field-label" htmlFor="reflection">
          A little reflection
        </label>
        <textarea
          id="reflection"
          rows={4}
          placeholder="What went well? What did you learn? What do you need tomorrow?"
          value={entry.reflection}
          onChange={(event) => updateEntry('reflection', event.target.value)}
        />

        <p className="gentle-note">
          You don't need a perfect day to make progress. Just record what is
          true for you today. ✨
        </p>
      </section>

      <footer>Growing at your own pace · My Daily Bloom 🌱</footer>
    </main>
  )
}

export default App

