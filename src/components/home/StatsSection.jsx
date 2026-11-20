import { MdMovie, MdPeople } from "react-icons/md";
import { FiTrendingUp, FiStar } from "react-icons/fi";

const StatsSection = ({ stats }) => {
  const statsData = [
    {
      icon: <MdMovie className="text-5xl" />,
      value: stats.totalMovies,
      label: "Total Movies",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: <MdPeople className="text-5xl" />,
      value: stats.totalUsers,
      label: "Active Users",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      icon: <FiTrendingUp className="text-5xl" />,
      value: "100+",
      label: "New This Month",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: <FiStar className="text-5xl" />,
      value: "4.8",
      label: "Average Rating",
      color: "text-success",
      bgColor: "bg-success/10",
    },
  ];

  return (
    <section className="py-16 bg-movie-darker">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="bg-movie-card rounded-xl p-6 text-center space-y-4 hover:scale-105 transition-transform duration-300 animate-fadeIn"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`${stat.bgColor} ${stat.color} w-20 h-20 rounded-full flex items-center justify-center mx-auto`}
              >
                {stat.icon}
              </div>
              <div>
                <h3 className="text-3xl md:text-4xl font-bold text-white">{stat.value}</h3>
                <p className="text-gray-400 text-sm md:text-base mt-2">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
