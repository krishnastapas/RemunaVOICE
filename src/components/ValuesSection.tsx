const values = [
  { title: "Purity", desc: "Every snack is made with sattvic ingredients." },
  { title: "Tradition", desc: "Recipes inspired by ISKCON mahaprasad." },
  { title: "Hygiene", desc: "Prepared in clean, devotional environments." },
  { title: "Devotion", desc: "Snacks offered with bhakti." },
];

export default function ValuesSection() {
  return (
    <section id="values" className="py-16 bg-white text-center">
      <h2 className="text-3xl font-bold text-orange-700 mb-10">Our Core Values</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-8">
        {values.map((v, i) => (
          <div key={i} className="p-6 bg-gray-100 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-2">{v.title}</h3>
            <p className="text-gray-600">{v.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
