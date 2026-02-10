// ... your existing imports ...
import { AnalyticsProvider, DevAnalyticsPanel } from './context/AnalyticsContext';

function App() {
  return (
    <AnalyticsProvider>
      {/* Your existing app structure */}
      <Router>
        {/* ... your routes ... */}
      </Router>
      {import.meta.env.DEV && <DevAnalyticsPanel />}
    </AnalyticsProvider>
  );
}
