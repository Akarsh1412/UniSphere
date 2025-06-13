import { TrendingUp } from "lucide-react";

const StatCard = ({ icon: Icon, label, value, trend }) => {
  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg text-white">
          <Icon size={24} />
        </div>
        {trend && (
          <div className="flex items-center text-green-600 text-sm">
            <TrendingUp size={16} />
            <span className="ml-1">+{trend}%</span>
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-gray-600 text-sm">{label}</p>
    </div>
  );
};

export default StatCard;
