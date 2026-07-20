export default function CategorySidebar({ categories, activeCategory, onSelect, allLabel, totalCount }) {
  return (
    <nav className="w-full shrink-0 lg:w-[240px]">
      <div className="rounded-2xl border border-hairline-border bg-pure-white p-3 lg:sticky lg:top-20">
        <ul className="flex flex-col gap-0.5">
          <li>
            <button
              type="button"
              onClick={() => onSelect("all")}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-label font-medium transition ${
                activeCategory === "all" ? "bg-indigo-wash font-semibold text-indigo-primary" : "text-slate-gray hover:bg-lavender-canvas"
              }`}
            >
              <span>{allLabel}</span>
              <span className="text-caption text-faint-gray">{totalCount}</span>
            </button>
          </li>
        </ul>
        <p className="mb-1 mt-4 px-3 text-caption font-semibold uppercase tracking-wide text-faint-gray">Kategori</p>
        <ul className="flex flex-col gap-0.5">
          {categories.map((c) => {
            const isActive = activeCategory === c.category;
            return (
              <li key={c.category}>
                <button
                  type="button"
                  onClick={() => onSelect(c.category)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-label font-medium transition ${
                    isActive ? "bg-indigo-wash font-semibold text-indigo-primary" : "text-slate-gray hover:bg-lavender-canvas"
                  }`}
                >
                  <span className="truncate">{c.category}</span>
                  <span className="text-caption text-faint-gray">{c.terms.length}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
