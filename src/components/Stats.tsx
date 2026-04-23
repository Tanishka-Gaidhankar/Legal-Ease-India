const Stats = () => {
  const stats = [
    { value: "470+", label: "Constitutional Articles" },
    { value: "12", label: "Schedules Covered" },
    { value: "97+", label: "Amendments Explained" },
    { value: "24/7", label: "AI Assistance" },
  ];

  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary-foreground mb-2">
                {stat.value}
              </div>
              <div className="text-primary-foreground/80 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
