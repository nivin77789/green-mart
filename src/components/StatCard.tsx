interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
  delay?: number;
}

const StatCard = ({ label, value, change, positive, delay = 0 }: StatCardProps) => {
  return (
    <div 
      className="glass-card rounded-2xl p-6 opacity-0 animate-fade-in hover:scale-[1.02] transition-transform"
      style={{ animationDelay: `${delay}ms` }}
    >
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-3xl font-semibold text-foreground">{value}</p>
      {change && (
        <p className={`text-sm mt-2 ${positive ? 'text-icon-green' : 'text-icon-red'}`}>
          {positive ? '↑' : '↓'} {change}
        </p>
      )}
    </div>
  );
};

export default StatCard;
