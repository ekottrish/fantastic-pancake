
import { useAppContext } from '@/context/AppContext';

const DatabaseSetupPage = () => {
    const { retryConnection, loading } = useAppContext();

    const handleRetry = () => {
        if (!loading) {
            retryConnection();
        }
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-deep to-background-dark p-4 text-white">
            <div className="w-full max-w-2xl p-8 space-y-6 bg-primary-deep/50 rounded-xl shadow-2xl backdrop-blur-lg">
                <div className="text-center">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Database Setup Required
                    </h1>
                    <p className="text-light-gray">
                        The application has connected to your Supabase project, but the required database tables (`users`, `players`, etc.) are missing.
                    </p>
                </div>
                
                <div className="bg-background-dark/50 p-6 rounded-lg space-y-4">
                    <h2 className="text-xl font-semibold text-accent">How to Fix</h2>
                    <ol className="list-decimal list-inside space-y-2 text-light-gray">
                        <li>
                            In the file explorer on the left, find and open the file named <code className="bg-dark-gray text-white px-2 py-1 rounded">schema.sql</code>.
                        </li>
                        <li>
                           Copy the <strong>entire content</strong> of that file.
                        </li>
                        <li>
                           Go to your project on <a href="https://supabase.com/" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">Supabase.com</a>.
                        </li>
                        <li>
                            In your project's dashboard, navigate to the <strong className="text-white">SQL Editor</strong>.
                        </li>
                         <li>
                           Click <strong className="text-white">"+ New query"</strong>, paste the copied SQL script, and click <strong className="text-white">"RUN"</strong>.
                        </li>
                         <li>
                           Once the script finishes, come back here and click the button below.
                        </li>
                    </ol>
                </div>

                <div>
                    <button 
                        onClick={handleRetry} 
                        disabled={loading}
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-accent hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors disabled:bg-dark-gray"
                    >
                        {loading ? 'Checking...' : 'Retry Connection'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DatabaseSetupPage;
