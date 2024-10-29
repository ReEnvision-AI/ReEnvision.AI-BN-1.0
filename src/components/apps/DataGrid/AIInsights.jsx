import { Brain, Loader2, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

export function AIInsights({ insights, analyzing }) {
  if (analyzing) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p>Analyzing your data...</p>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <Brain className="w-8 h-8 mb-4" />
        <p>Click "Analyze" in the toolbar to get AI insights about your data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <section className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-2">Data Summary</h3>
        <p className="text-gray-300">{insights.summary}</p>
      </section>

      {/* Patterns */}
      <section className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-2">Patterns Detected</h3>
        <div className="space-y-2">
          {insights.patterns.map((pattern, index) => (
            <div key={index} className="flex items-start gap-2 text-gray-300">
              {pattern.type === 'increase' ? (
                <TrendingUp className="w-5 h-5 text-green-400 shrink-0" />
              ) : pattern.type === 'decrease' ? (
                <TrendingDown className="w-5 h-5 text-red-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0" />
              )}
              <p>{pattern.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recommendations */}
      <section className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-2">Recommendations</h3>
        <ul className="space-y-2">
          {insights.recommendations.map((rec, index) => (
            <li key={index} className="flex items-center gap-2 text-gray-300">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              {rec}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}