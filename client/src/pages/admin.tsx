import { useState, useEffect } from "react";

interface Quote {
  text: string;
  source: string;
  year: string;
}

interface Essay {
  title: string;
  year: string;
  publisher: string;
  description: string;
  coverImage: string | null;
  body: string | null;
}

interface SectionItem {
  slug: string;
  title: string;
  content: string | null;
  sortOrder: number;
}

interface SiteConfig {
  title: string;
  subtitle: string;
  authorName: string;
  authorImage: string;
  navigation: { label: string; path: string }[];
  contactFormEndpoint?: string;
}

function api(path: string, token: string, options?: RequestInit) {
  return fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options?.headers as Record<string, string>),
    },
  });
}

function SaveButton({ onClick, saving }: { onClick: () => void; saving: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-lg font-bold px-8 py-3 rounded-lg shadow"
      data-testid="button-save"
    >
      {saving ? "Saving..." : "Save Changes"}
    </button>
  );
}

function SuccessMessage({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="bg-green-100 border border-green-400 text-green-800 text-lg px-6 py-3 rounded-lg">
      Saved successfully!
    </div>
  );
}

function SiteSettings({ token }: { token: string }) {
  const [site, setSite] = useState<SiteConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api("/api/admin/site", token).then((r) => r.json()).then(setSite);
  }, [token]);

  const save = async () => {
    if (!site) return;
    setSaving(true);
    await api("/api/admin/site", token, { method: "PUT", body: JSON.stringify(site) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!site) return <p className="text-xl text-gray-500">Loading...</p>;

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-lg font-bold text-gray-700 mb-2">Site Title</label>
        <input
          className="w-full text-xl border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
          value={site.title}
          onChange={(e) => setSite({ ...site, title: e.target.value })}
          data-testid="input-site-title"
        />
      </div>
      <div>
        <label className="block text-lg font-bold text-gray-700 mb-2">Subtitle</label>
        <input
          className="w-full text-xl border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
          value={site.subtitle}
          onChange={(e) => setSite({ ...site, subtitle: e.target.value })}
          data-testid="input-site-subtitle"
        />
      </div>
      <div>
        <label className="block text-lg font-bold text-gray-700 mb-2">Author Name</label>
        <input
          className="w-full text-xl border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
          value={site.authorName}
          onChange={(e) => setSite({ ...site, authorName: e.target.value })}
          data-testid="input-author-name"
        />
      </div>
      <div>
        <label className="block text-lg font-bold text-gray-700 mb-2">Author Image Path</label>
        <input
          className="w-full text-xl border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
          value={site.authorImage || ""}
          onChange={(e) => setSite({ ...site, authorImage: e.target.value })}
          placeholder="/images/author-photo.jpg"
          data-testid="input-author-image"
        />
      </div>
      <div>
        <label className="block text-lg font-bold text-gray-700 mb-2">Contact Form Endpoint (Formspree)</label>
        <input
          className="w-full text-xl border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
          value={site.contactFormEndpoint || ""}
          onChange={(e) => setSite({ ...site, contactFormEndpoint: e.target.value || undefined })}
          placeholder="https://formspree.io/f/YOUR_FORM_ID"
          data-testid="input-contact-endpoint"
        />
        <p className="text-sm text-gray-500 mt-1">For Cloudflare Pages, use your Formspree URL. Leave empty to use /api/contact.</p>
      </div>
      <div className="flex gap-4 items-center">
        <SaveButton onClick={save} saving={saving} />
        <SuccessMessage show={saved} />
      </div>
    </div>
  );
}

function QuotesEditor({ token }: { token: string }) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api("/api/admin/quotes", token).then((r) => r.json()).then(setQuotes);
  }, [token]);

  const update = (index: number, field: keyof Quote, value: string) => {
    const updated = [...quotes];
    updated[index] = { ...updated[index], [field]: value };
    setQuotes(updated);
  };

  const addQuote = () => {
    setQuotes([...quotes, { text: "", source: "", year: new Date().getFullYear().toString() }]);
  };

  const removeQuote = (index: number) => {
    if (confirm("Are you sure you want to delete this quote?")) {
      setQuotes(quotes.filter((_, i) => i !== index));
    }
  };

  const save = async () => {
    setSaving(true);
    await api("/api/admin/quotes", token, { method: "PUT", body: JSON.stringify(quotes) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {quotes.map((q, i) => (
        <div key={i} className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-500">Quote {i + 1}</span>
            <button
              onClick={() => removeQuote(i)}
              className="bg-red-100 hover:bg-red-200 text-red-700 text-base font-bold px-4 py-2 rounded-lg"
              data-testid={`button-delete-quote-${i}`}
            >
              Delete
            </button>
          </div>
          <div>
            <label className="block text-base font-bold text-gray-600 mb-1">Quote Text</label>
            <textarea
              className="w-full text-lg border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none min-h-[100px]"
              value={q.text}
              onChange={(e) => update(i, "text", e.target.value)}
              data-testid={`input-quote-text-${i}`}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-bold text-gray-600 mb-1">Source</label>
              <input
                className="w-full text-lg border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
                value={q.source}
                onChange={(e) => update(i, "source", e.target.value)}
                data-testid={`input-quote-source-${i}`}
              />
            </div>
            <div>
              <label className="block text-base font-bold text-gray-600 mb-1">Year</label>
              <input
                className="w-full text-lg border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
                value={q.year}
                onChange={(e) => update(i, "year", e.target.value)}
                data-testid={`input-quote-year-${i}`}
              />
            </div>
          </div>
        </div>
      ))}
      <div className="flex gap-4 items-center flex-wrap">
        <button
          onClick={addQuote}
          className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold px-8 py-3 rounded-lg shadow"
          data-testid="button-add-quote"
        >
          + Add New Quote
        </button>
        <SaveButton onClick={save} saving={saving} />
        <SuccessMessage show={saved} />
      </div>
    </div>
  );
}

function EssaysEditor({ token }: { token: string }) {
  const [essays, setEssays] = useState<Essay[]>([]);
  const [editing, setEditing] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api("/api/admin/essays", token).then((r) => r.json()).then(setEssays);
  }, [token]);

  const update = (index: number, field: keyof Essay, value: string | null) => {
    const updated = [...essays];
    updated[index] = { ...updated[index], [field]: value };
    setEssays(updated);
  };

  const addEssay = () => {
    const newEssay: Essay = {
      title: "",
      year: new Date().getFullYear().toString(),
      publisher: "",
      description: "",
      coverImage: null,
      body: "",
    };
    setEssays([...essays, newEssay]);
    setEditing(essays.length);
  };

  const removeEssay = (index: number) => {
    if (confirm("Are you sure you want to delete this essay?")) {
      setEssays(essays.filter((_, i) => i !== index));
      setEditing(null);
    }
  };

  const save = async () => {
    setSaving(true);
    await api("/api/admin/essays", token, { method: "PUT", body: JSON.stringify(essays) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {essays.map((essay, i) => (
        <div key={i} className="bg-white border-2 border-gray-200 rounded-xl p-6">
          {editing === i ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-500">Editing Essay</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditing(null)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-base font-bold px-4 py-2 rounded-lg"
                  >
                    Done Editing
                  </button>
                  <button
                    onClick={() => removeEssay(i)}
                    className="bg-red-100 hover:bg-red-200 text-red-700 text-base font-bold px-4 py-2 rounded-lg"
                    data-testid={`button-delete-essay-${i}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-base font-bold text-gray-600 mb-1">Title</label>
                <input
                  className="w-full text-xl border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
                  value={essay.title}
                  onChange={(e) => update(i, "title", e.target.value)}
                  data-testid={`input-essay-title-${i}`}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-base font-bold text-gray-600 mb-1">Year</label>
                  <input
                    className="w-full text-lg border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
                    value={essay.year}
                    onChange={(e) => update(i, "year", e.target.value)}
                    data-testid={`input-essay-year-${i}`}
                  />
                </div>
                <div>
                  <label className="block text-base font-bold text-gray-600 mb-1">Cover Image Path</label>
                  <input
                    className="w-full text-lg border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
                    value={essay.coverImage || ""}
                    onChange={(e) => update(i, "coverImage", e.target.value || null)}
                    placeholder="/images/covers/filename.jpg"
                    data-testid={`input-essay-cover-${i}`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-base font-bold text-gray-600 mb-1">Short Description (one sentence)</label>
                <input
                  className="w-full text-lg border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
                  value={essay.description}
                  onChange={(e) => update(i, "description", e.target.value)}
                  data-testid={`input-essay-desc-${i}`}
                />
              </div>
              <div>
                <label className="block text-base font-bold text-gray-600 mb-1">Full Essay Text</label>
                <p className="text-sm text-gray-400 mb-2">Separate paragraphs with a blank line.</p>
                <textarea
                  className="w-full text-base border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none min-h-[300px] leading-relaxed"
                  value={essay.body || ""}
                  onChange={(e) => update(i, "body", e.target.value)}
                  data-testid={`input-essay-body-${i}`}
                />
              </div>
            </div>
          ) : (
            <div
              className="flex justify-between items-center cursor-pointer hover:bg-gray-50 -m-6 p-6 rounded-xl"
              onClick={() => setEditing(i)}
            >
              <div>
                <h3 className="text-xl font-bold text-gray-800">{essay.title || "(untitled)"}</h3>
                <p className="text-base text-gray-500 mt-1">
                  {essay.year} — {essay.description || "No description"}
                </p>
              </div>
              <span className="text-blue-600 text-lg font-bold">Edit →</span>
            </div>
          )}
        </div>
      ))}
      <div className="flex gap-4 items-center flex-wrap">
        <button
          onClick={addEssay}
          className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold px-8 py-3 rounded-lg shadow"
          data-testid="button-add-essay"
        >
          + Add New Essay
        </button>
        <SaveButton onClick={save} saving={saving} />
        <SuccessMessage show={saved} />
      </div>
    </div>
  );
}

function SectionsEditor({ token }: { token: string }) {
  const [sections, setSections] = useState<SectionItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api("/api/admin/sections", token).then((r) => r.json()).then(setSections);
  }, [token]);

  const update = (index: number, field: keyof SectionItem, value: string | number | null) => {
    const updated = [...sections];
    updated[index] = { ...updated[index], [field]: value } as SectionItem;
    setSections(updated);
  };

  const save = async () => {
    setSaving(true);
    await api("/api/admin/sections", token, { method: "PUT", body: JSON.stringify(sections) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {sections.map((s, i) => (
        <div key={i} className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-lg font-bold text-gray-700 mb-2">
              {s.title} ({s.slug})
            </label>
          </div>
          <div>
            <label className="block text-base font-bold text-gray-600 mb-1">Content</label>
            <p className="text-sm text-gray-400 mb-2">
              Separate paragraphs with a blank line. Use ALL CAPS for section headings.
            </p>
            <textarea
              className="w-full text-base border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none min-h-[400px] leading-relaxed"
              value={s.content || ""}
              onChange={(e) => update(i, "content", e.target.value)}
              data-testid={`input-section-content-${i}`}
            />
          </div>
        </div>
      ))}
      <div className="flex gap-4 items-center">
        <SaveButton onClick={save} saving={saving} />
        <SuccessMessage show={saved} />
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(() => {
    return sessionStorage.getItem("admin_token");
  });
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"site" | "quotes" | "essays" | "biography">("essays");

  const login = async () => {
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setToken(password);
      sessionStorage.setItem("admin_token", password);
    } else {
      setError("Wrong password. Please try again.");
    }
  };

  const logout = () => {
    setToken(null);
    sessionStorage.removeItem("admin_token");
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md space-y-6">
          <h1 className="text-3xl font-bold text-gray-800 text-center">Content Manager</h1>
          <p className="text-lg text-gray-500 text-center">Enter your password to edit the website.</p>
          <div>
            <input
              type="password"
              className="w-full text-xl border-2 border-gray-300 rounded-lg px-4 py-4 focus:border-blue-500 focus:outline-none text-center"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
              autoFocus
              data-testid="input-admin-password"
            />
          </div>
          {error && <p className="text-red-600 text-lg text-center font-bold">{error}</p>}
          <button
            onClick={login}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-4 rounded-lg shadow"
            data-testid="button-admin-login"
          >
            Log In
          </button>
          <a href="/" className="block text-center text-blue-500 text-base hover:underline">
            ← Back to website
          </a>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "essays" as const, label: "Essays / Writings" },
    { id: "quotes" as const, label: "Quotes" },
    { id: "biography" as const, label: "Biography" },
    { id: "site" as const, label: "Site Settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b-2 border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-800">Content Manager</h1>
        <div className="flex gap-4 items-center">
          <a href="/" className="text-blue-500 text-base hover:underline" data-testid="link-view-site">
            View Site
          </a>
          <button
            onClick={logout}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-base font-bold px-4 py-2 rounded-lg"
            data-testid="button-admin-logout"
          >
            Log Out
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 md:p-10">
        <nav className="flex gap-2 mb-8 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-lg font-bold px-6 py-3 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow"
                  : "bg-white text-gray-600 hover:bg-gray-100 border-2 border-gray-200"
              }`}
              data-testid={`tab-${tab.id}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {activeTab === "site" && <SiteSettings token={token} />}
        {activeTab === "quotes" && <QuotesEditor token={token} />}
        {activeTab === "essays" && <EssaysEditor token={token} />}
        {activeTab === "biography" && <SectionsEditor token={token} />}
      </div>
    </div>
  );
}
