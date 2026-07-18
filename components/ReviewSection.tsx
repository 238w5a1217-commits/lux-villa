const reviews = [
  {
    id: 1,
    name: "Arjun Sharma",
    location: "Mumbai, Maharashtra",
    avatar: "A",
    rating: 5,
    text: "An absolutely extraordinary experience. The Ocean Breeze Villa in Goa exceeded every expectation — the private infinity pool, the attentive staff, the sunset views over the Arabian Sea. Truly a once-in-a-lifetime stay.",
    villa: "Ocean Breeze Villa, Goa",
  },
  {
    id: 2,
    name: "Priya Nair",
    location: "Bengaluru, Karnataka",
    avatar: "P",
    rating: 5,
    text: "LuxVilla made booking our Coorg honeymoon villa completely effortless. The property was even more stunning than the photos — lush coffee estates, cool mountain air, and flawless service. We are already planning our return trip!",
    villa: "Misty Pines Estate, Coorg",
  },
  {
    id: 3,
    name: "Vikram Mehta",
    location: "Delhi, NCR",
    avatar: "V",
    rating: 5,
    text: "Stayed at the Udaipur Lake View Villa for our anniversary. Waking up to the sight of Lake Pichola from the private terrace was magical. The concierge team arranged everything perfectly — this is luxury done right.",
    villa: "Lake View Heritage Villa, Udaipur",
  },
];

const avatarColors = ["#8b5e3c", "#6b4626", "#a0724a"];

export default function ReviewSection() {
  return (
    <section className="py-20">
      {/* Header */}
      <div className="section-reveal text-center mb-14">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-amber)] mb-3">
          Guest Experiences
        </p>
        <h2 className="section-title">What Our Guests Say</h2>
        <p className="text-[var(--color-ink-soft)] text-base mt-3 max-w-lg mx-auto">
          Thousands of discerning travellers across India have found their
          perfect villa retreat through LuxVilla.
        </p>
      </div>

      {/* Cards */}
      <div className="review-grid grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((r, i) => (
          <div
            key={r.id}
            className="review-card card p-7 flex flex-col gap-4 group transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
          >
            {/* Large quote mark */}
            <div
              className="font-playfair text-6xl leading-none select-none"
              style={{ color: "var(--color-amber-light)", opacity: 0.35 }}
            >
              &ldquo;
            </div>

            {/* Stars */}
            <div className="flex gap-0.5 -mt-4">
              {Array.from({ length: r.rating }).map((_, idx) => (
                <span key={idx} className="text-[var(--color-gold)] text-sm">
                  ★
                </span>
              ))}
            </div>

            {/* Quote */}
            <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed flex-1 italic">
              {r.text}
            </p>

            {/* Author */}
            <div
              className="flex items-center gap-3 pt-4"
              style={{ borderTop: "1px solid var(--color-line)" }}
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                style={{ background: avatarColors[i % avatarColors.length] }}
              >
                {r.avatar}
              </div>
              <div>
                <p className="font-semibold text-sm text-[var(--color-ink)]">
                  {r.name}
                </p>
                <p className="text-xs text-[var(--color-ink-soft)] mt-0.5">
                  {r.location}
                </p>
                <p className="text-xs text-[var(--color-amber)] mt-0.5 font-medium">
                  {r.villa}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
