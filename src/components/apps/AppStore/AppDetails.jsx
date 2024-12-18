import React from 'react';
import PropTypes from 'prop-types';
import { Download, Trash2, RefreshCw } from 'lucide-react';

export function AppDetails({ app, onInstall, onUninstall, isInstalled, installing }) {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-start gap-6 mb-8">
        <div className="bg-gray-700/30 p-4 rounded-lg">
          <app.icon className="w-16 h-16 text-gray-300" />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-white">{app.name}</h2>
            <button
              onClick={isInstalled ? onUninstall : onInstall}
              disabled={installing}
              className={`
                px-4 py-2 rounded-lg font-medium
                flex items-center gap-2
                transition-colors focus:outline-none focus:ring-2
                ${
                  isInstalled
                    ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30 focus:ring-red-500/50'
                    : 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 focus:ring-blue-500/50'
                }
                ${installing ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {installing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  {isInstalled ? 'Uninstalling...' : 'Installing...'}
                </>
              ) : isInstalled ? (
                <>
                  <Trash2 className="w-5 h-5" />
                  Uninstall
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Install
                </>
              )}
            </button>
          </div>

          <p className="text-gray-400 mt-2">{app.description}</p>
        </div>
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold text-white mb-3">Screenshots</h3>
          <div className="grid grid-cols-2 gap-4">
            {app.screenshots.map((screenshot, index) => (
              <img
                key={index}
                src={screenshot}
                alt={`${app.name} screenshot ${index + 1}`}
                className="rounded-lg border border-gray-700 w-full"
              />
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-white mb-3">Features</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            {app.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </section>

        {app.requirements && (
          <section>
            <h3 className="text-lg font-semibold text-white mb-3">System Requirements</h3>
            <div className="bg-gray-700/30 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                {Object.entries(app.requirements).map(([key, value]) => (
                  <div key={key}>
                    <span className="text-gray-400">{key}:</span> <span className="text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

AppDetails.propTypes = {
  app: PropTypes.object,
  onInstall: PropTypes.func,
  onUninstall: PropTypes.func,
  isInstalled: PropTypes.func,
  installing: PropTypes.string,
};
