export default function CategorySidebar({ categories, activeCategory, onSelect, allLabel, totalCount }) {
  return (
    <nav className="w-full shrink-0 lg:w-[240px]">
      <div className="rounded-[12px] border border-hairline-border bg-pure-white p-2.5 lg:sticky lg:top-6">
        <ul className="flex flex-col gap-0.5">
          <li>
            <button
              type="button"
              onClick={() => onSelect("all")}
              className={`flex w-full items-center justify-between rounded-[8px] px-2.5 py-[9px] text-left text-[13.5px] font-semibold transition ${
                activeCategory === "all" ? "bg-indigo-primary/10 text-indigo-primary" : "text-slate-gray hover:bg-lavender-canvas"
              }`}
            >
              <span>{allLabel}</span>
              <span className="text-[11px] font-medium text-faint-gray">{totalCount}</span>
            </button>
          </li>
        </ul>
        <p className="mb-1 mt-3 px-2.5 text-[10.5px] font-bold uppercase tracking-[0.6px] text-faint-gray">Kategori</p>
        <ul className="flex flex-col gap-0.5">
          {categories.map((c) => {
            const isActive = activeCategory === c.category;
            return (
              <li key={c.category}>
                <button
                  type="button"
                  onClick={() => onSelect(c.category)}
                  className={`flex w-full items-center justify-between rounded-[8px] px-2.5 py-[9px] text-left text-[13.5px] font-semibold transition ${
                    isActive ? "bg-indigo-primary/10 text-indigo-primary" : "text-slate-gray hover:bg-lavender-canvas"
                  }`}
                >
                  <span className="truncate">{c.category}</span>
                  <span className="text-[11px] font-medium text-faint-gray">{c.terms.length}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
