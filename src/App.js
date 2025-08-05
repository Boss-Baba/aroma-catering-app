import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, doc, addDoc, onSnapshot, updateDoc, setDoc, query, where, getDocs, deleteDoc, writeBatch } from 'firebase/firestore';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// --- Firebase Configuration ---// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: "AIzaSy...your...key",
  authDomain: "aroma-catering-app.firebaseapp.com",
  // ... other config properties
};

const appId = 'aroma-catering-app'; // <-- ADD THIS LINE HERE

// --- Main App Component ---
function App() {
//... rest of the code

// This configuration will be automatically populated by the environment.
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};

// --- Icon Components (using SVG for a clean, dependency-free approach) ---
const BriefcaseIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect x="2" y="6" width="20" height="14" rx="2"/></svg>;
const UsersIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const ReceiptIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/></svg>;
const DollarSignIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const SettingsIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2.12l-.15.1a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1 0-2.12l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;
const PlusCircleIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>;
const TrashIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
const UploadCloudIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></svg>;
const XCircleIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>;
const SparklesIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 3L9.5 8.5 4 11l5.5 2.5L12 19l2.5-5.5L20 11l-5.5-2.5z"/></svg>;
const TagIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2z"/><path d="M7 7h.01"/></svg>;


// --- Helper Functions ---
const formatCurrency = (amount, currencySymbol) => {
    return `${currencySymbol}${Number(amount).toFixed(2)}`;
};

// --- Main App Component ---
function App() {
    // --- State Management ---
    const [page, setPage] = useState('dashboard');
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    
    const [projects, setProjects] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [commonItems, setCommonItems] = useState([]);
    
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    
    const [settings, setSettings] = useState({ currencySymbol: '£' });
    const [loading, setLoading] = useState(true);

    // --- Firebase Initialization and Auth ---
    useEffect(() => {
    try {
        const app = initializeApp(firebaseConfig);
        const firestore = getFirestore(app);
        const authInstance = getAuth(app);

        setDb(firestore);
        setAuth(authInstance);

        const unsubscribe = onAuthStateChanged(authInstance, async (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                await signInAnonymously(authInstance);
            }
            setIsAuthReady(true);
        });
        return () => unsubscribe();
    } catch (error) {
        console.error("Firebase initialization failed:", error);
        setIsAuthReady(true);
    }
}, []);opedocke

    // --- Data Fetching from Firestore ---
    useEffect(() => {
        if (!isAuthReady || !db || !userId) {
            if(isAuthReady) setLoading(false);
            return;
        }

        setLoading(true);

        const settingsDocRef = doc(db, `artifacts/${appId}/users/${userId}/settings`, 'userSettings');
        const unsubscribeSettings = onSnapshot(settingsDocRef, (doc) => {
            if (doc.exists()) {
                setSettings(doc.data());
            }
        }, err => console.error("Error fetching settings:", err));

        const projectsQuery = query(collection(db, `artifacts/${appId}/users/${userId}/projects`));
        const unsubscribeProjects = onSnapshot(projectsQuery, (snapshot) => {
            const projectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProjects(projectsData);
        }, err => console.error("Error fetching projects:", err));

        const workersQuery = query(collection(db, `artifacts/${appId}/users/${userId}/workers`));
        const unsubscribeWorkers = onSnapshot(workersQuery, (snapshot) => {
            const workersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setWorkers(workersData);
        }, err => console.error("Error fetching workers:", err));
        
        const expensesQuery = query(collection(db, `artifacts/${appId}/users/${userId}/expenses`));
        const unsubscribeExpenses = onSnapshot(expensesQuery, (snapshot) => {
            const expensesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setExpenses(expensesData);
        }, err => console.error("Error fetching expenses:", err));

        const commonItemsQuery = query(collection(db, `artifacts/${appId}/users/${userId}/commonItems`));
        const unsubscribeCommonItems = onSnapshot(commonItemsQuery, (snapshot) => {
            const itemsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCommonItems(itemsData);
            setLoading(false);
        }, err => {
            console.error("Error fetching common items:", err);
            setLoading(false);
        });

        return () => {
            unsubscribeSettings();
            unsubscribeProjects();
            unsubscribeWorkers();
            unsubscribeExpenses();
            unsubscribeCommonItems();
        };
    }, [isAuthReady, db, userId]);

    // --- Navigation and View Rendering ---
    const navigateToProject = (projectId) => {
        setSelectedProjectId(projectId);
        setPage('projectDetail');
    };

    const renderPage = () => {
        if (loading) {
            return <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div></div>;
        }
        
        switch (page) {
            case 'dashboard':
                return <Dashboard projects={projects} expenses={expenses} navigateToProject={navigateToProject} setPage={setPage} settings={settings} />;
            case 'menuPlanner':
                return <MenuPlanner settings={settings} db={db} userId={userId} setPage={setPage} navigateToProject={navigateToProject}/>;
            case 'projects':
                return <ProjectsList projects={projects} db={db} userId={userId} navigateToProject={navigateToProject} settings={settings} />;
            case 'projectDetail':
                return <ProjectDetail projectId={selectedProjectId} db={db} userId={userId} workers={workers} expenses={expenses} settings={settings} setPage={setPage} />;
            case 'workers':
                return <WorkersList workers={workers} db={db} userId={userId} />;
            case 'expenses':
                return <ExpensesList expenses={expenses} db={db} userId={userId} projects={projects} commonItems={commonItems} settings={settings} />;
            case 'commonItems':
                return <CommonItemsList commonItems={commonItems} db={db} userId={userId} settings={settings} />;
            case 'settings':
                return <Settings settings={settings} db={db} userId={userId} />;
            default:
                return <Dashboard projects={projects} expenses={expenses} navigateToProject={navigateToProject} setPage={setPage} settings={settings} />;
        }
    };

    if (!isAuthReady) {
        return (
            <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Aroma</h1>
                    <p>Initializing your catering dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen flex font-sans">
            <Sidebar setPage={setPage} currentPage={page} />
            <main className="flex-1 p-4 sm:p-6 lg:p-8">
                {renderPage()}
            </main>
        </div>
    );
}

// --- Component: Sidebar ---
const Sidebar = ({ setPage, currentPage }) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <DollarSignIcon className="w-6 h-6" /> },
        { id: 'menuPlanner', label: 'AI Menu Planner', icon: <SparklesIcon className="w-6 h-6" /> },
        { id: 'projects', label: 'Projects', icon: <BriefcaseIcon className="w-6 h-6" /> },
        { id: 'expenses', label: 'Expenses', icon: <ReceiptIcon className="w-6 h-6" /> },
        { id: 'commonItems', label: 'Shopping List Items', icon: <TagIcon className="w-6 h-6" /> },
        { id: 'workers', label: 'Workers', icon: <UsersIcon className="w-6 h-6" /> },
        { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-6 h-6" /> },
    ];

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-lg w-16 sm:w-20 lg:w-64 p-2 lg:p-4 flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-center lg:justify-start mb-10">
                    <span className="text-2xl lg:text-3xl font-bold text-purple-600 dark:text-purple-400">A</span>
                    <h1 className="hidden lg:block text-2xl font-bold ml-2">Aroma</h1>
                </div>
                <ul>
                    {navItems.map(item => (
                        <li key={item.id} className="mb-2">
                            <button
                                onClick={() => setPage(item.id)}
                                className={`w-full flex items-center justify-center lg:justify-start p-3 rounded-lg transition-colors duration-200 ${
                                    currentPage === item.id 
                                        ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300' 
                                        : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                            >
                                {item.icon}
                                <span className="hidden lg:inline ml-4 font-medium">{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="text-center text-xs text-gray-500 hidden lg:block">
                <p>&copy; 2024 Aroma</p>
                <p>Catering Simplified</p>
            </div>
        </nav>
    );
};

// --- Component: Welcome Guide ---
const WelcomeGuide = ({ setPage }) => (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md text-center mb-8">
        <SparklesIcon className="w-12 h-12 text-purple-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Welcome to Aroma!</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Your new dashboard for managing your catering business. Here's how to get started:</p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
            <button onClick={() => setPage('projects')} className="bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-transform hover:scale-105">
                Create Your First Project
            </button>
            <button onClick={() => setPage('menuPlanner')} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-transform hover:scale-105">
                Try the AI Menu Planner
            </button>
        </div>
    </div>
);

// --- Component: Dashboard ---
const Dashboard = ({ projects, expenses, navigateToProject, setPage, settings }) => {
    const totalRevenue = projects.reduce((acc, p) => acc + (p.revenue || 0), 0);
    const totalExpenses = expenses.reduce((acc, e) => acc + (e.amount || 0), 0);
    const totalProfit = totalRevenue - totalExpenses;

    const recentProjects = [...projects].sort((a, b) => (b.eventDate || '').localeCompare(a.eventDate || '')).slice(0, 3);
    
    const chartData = {
        labels: projects.map(p => p.name),
        datasets: [
            {
                label: `Revenue (${settings.currencySymbol})`,
                data: projects.map(p => p.revenue || 0),
                backgroundColor: 'rgba(74, 222, 128, 0.6)',
                borderColor: 'rgba(34, 197, 94, 1)',
                borderWidth: 1,
            },
            {
                label: `Profit (${settings.currencySymbol})`,
                data: projects.map(p => {
                    const projectExpenses = expenses.filter(e => e.projectId === p.id).reduce((sum, e) => sum + e.amount, 0);
                    return (p.revenue || 0) - projectExpenses;
                }),
                backgroundColor: 'rgba(96, 165, 250, 0.6)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Projects Overview', font: { size: 16 } },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return formatCurrency(value, settings.currencySymbol);
                    }
                }
            }
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            {projects.length === 0 && <WelcomeGuide setPage={setPage} />}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-green-100 dark:bg-green-900/50 p-6 rounded-xl shadow-md border-l-4 border-green-500">
                    <h2 className="text-lg font-semibold text-gray-500 dark:text-gray-300">Total Revenue</h2>
                    <p className="text-4xl font-extrabold text-green-600 dark:text-green-400">{formatCurrency(totalRevenue, settings.currencySymbol)}</p>
                </div>
                <div className="bg-red-100 dark:bg-red-900/50 p-6 rounded-xl shadow-md border-l-4 border-red-500">
                    <h2 className="text-lg font-semibold text-gray-500 dark:text-gray-300">Total Expenses</h2>
                    <p className="text-4xl font-extrabold text-red-500 dark:text-red-400">{formatCurrency(totalExpenses, settings.currencySymbol)}</p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900/50 p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                    <h2 className="text-lg font-semibold text-gray-500 dark:text-gray-300">Total Profit</h2>
                    <p className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">{formatCurrency(totalProfit, settings.currencySymbol)}</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md h-96">
                    <Bar options={chartOptions} data={chartData} />
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold mb-4">Recent Projects</h2>
                    <div className="space-y-4">
                        {recentProjects.length > 0 ? recentProjects.map(project => (
                            <div key={project.id} onClick={() => navigateToProject(project.id)} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-all">
                                <h3 className="font-bold">{project.name}</h3>
                                <p className="text-sm text-gray-500">{project.clientName}</p>
                                <p className="text-sm font-semibold text-purple-500">{new Date(project.eventDate).toLocaleDateString()}</p>
                            </div>
                        )) : <p className="text-gray-500 text-center py-8">No projects yet.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Component: AI Menu Planner ---
const MenuPlanner = ({ settings, db, userId, setPage, navigateToProject }) => {
    const [form, setForm] = useState({ eventType: 'Wedding', guestCount: 50, budget: 20 });
    const [isGenerating, setIsGenerating] = useState(false);
    const [menuSuggestion, setMenuSuggestion] = useState(null);
    const [error, setError] = useState('');

    const handleGenerateMenu = async () => {
        setIsGenerating(true);
        setError('');
        setMenuSuggestion(null);

        const prompt = `
            As an expert Nigerian caterer, create a suggested menu for a client.
            Event Details:
            - Type: ${form.eventType}
            - Number of Guests: ${form.guestCount}
            - Budget per person: ${settings.currencySymbol}${form.budget}

            Based on these details, provide a well-balanced and popular menu.
            For each dish, provide a name, a short, enticing description, an estimated cost per serving for me (the caterer), and a suggested price for the client.
            Ensure the total suggested price per person is within the client's budget.
            Return the response as a JSON object. The root object should have a key "menu" which is an array of dish objects. Each dish object must have the following keys: "name", "description", "estimatedCostPerServing", and "suggestedServingPrice".
        `;

        const payload = {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        menu: {
                            type: "ARRAY",
                            items: {
                                type: "OBJECT",
                                properties: {
                                    name: { type: "STRING" },
                                    description: { type: "STRING" },
                                    estimatedCostPerServing: { type: "NUMBER" },
                                    suggestedServingPrice: { type: "NUMBER" }
                                },
                                required: ["name", "description", "estimatedCostPerServing", "suggestedServingPrice"]
                            }
                        }
                    }
                }
            }
        };

        try {
            const apiKey = ""; // Leave empty
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            
            const result = await response.json();
            const data = JSON.parse(result.candidates[0].content.parts[0].text);
            setMenuSuggestion(data);
        } catch (err) {
            console.error("AI Menu Generation Error:", err);
            setError("Sorry, I couldn't generate a menu right now. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const createProjectFromMenu = async () => {
        if (!menuSuggestion || !menuSuggestion.menu) return;

        const totalRevenue = menuSuggestion.menu.reduce((sum, item) => sum + item.suggestedServingPrice, 0) * form.guestCount;

        try {
            const newProjectRef = await addDoc(collection(db, `artifacts/${appId}/users/${userId}/projects`), {
                name: `${form.eventType} for ${form.guestCount} guests`,
                clientName: 'New Client',
                eventDate: new Date().toISOString().split('T')[0],
                revenue: totalRevenue,
                createdAt: new Date().toISOString(),
                assignedWorkers: []
            });

            const batch = writeBatch(db);
            menuSuggestion.menu.forEach(item => {
                const orderRef = doc(collection(db, `artifacts/${appId}/users/${userId}/projects/${newProjectRef.id}/orders`));
                batch.set(orderRef, {
                    name: item.name,
                    quantity: form.guestCount,
                    price: item.suggestedServingPrice
                });
            });
            await batch.commit();

            navigateToProject(newProjectRef.id);

        } catch (error) {
            console.error("Error creating project from menu:", error);
            setError("Could not create the project. Please try again.");
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">AI Menu & Portion Scientist</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Let AI help you craft the perfect, profitable menu for your next event.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold mb-4">Event Details</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block font-medium mb-1">Event Type</label>
                            <select value={form.eventType} onChange={e => setForm({...form, eventType: e.target.value})} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700">
                                <option>Wedding</option>
                                <option>Birthday Party</option>
                                <option>Corporate Lunch</option>
                                <option>Anniversary</option>
                                <option>Private Dinner</option>
                            </select>
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Number of Guests</label>
                            <input type="number" value={form.guestCount} onChange={e => setForm({...form, guestCount: Number(e.target.value)})} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700"/>
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Budget per Guest ({settings.currencySymbol})</label>
                            <input type="number" value={form.budget} onChange={e => setForm({...form, budget: Number(e.target.value)})} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700"/>
                        </div>
                        <button onClick={handleGenerateMenu} disabled={isGenerating} className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 disabled:bg-purple-400 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all">
                            {isGenerating ? 'Thinking...' : 'Generate Menu'}
                            <SparklesIcon className="w-5 h-5"/>
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    {isGenerating && <div className="text-center p-10"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto"></div><p className="mt-4">Crafting your menu...</p></div>}
                    {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">{error}</div>}
                    {menuSuggestion && (
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold">Suggested Menu</h2>
                                    <p className="text-gray-500">A delicious and profitable selection for your event.</p>
                                </div>
                                <button onClick={createProjectFromMenu} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700">
                                    Create Project
                                </button>
                            </div>
                            <div className="space-y-4">
                                {menuSuggestion.menu.map((item, index) => (
                                    <div key={index} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400">{item.name}</h3>
                                            <span className="font-semibold">{formatCurrency(item.suggestedServingPrice, settings.currencySymbol)} / guest</span>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-300 mt-1">{item.description}</p>
                                        <p className="text-xs text-gray-500 mt-2">Est. Cost: {formatCurrency(item.estimatedCostPerServing, settings.currencySymbol)}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-4 border-t text-right">
                                <p className="text-lg font-bold">Total Suggested Price: {formatCurrency(menuSuggestion.menu.reduce((sum, item) => sum + item.suggestedServingPrice, 0), settings.currencySymbol)} / guest</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


// --- Component: ProjectsList ---
const ProjectsList = ({ projects, db, userId, navigateToProject, settings }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newProject, setNewProject] = useState({ name: '', clientName: '', eventDate: '', revenue: 0 });

    const handleAddProject = async () => {
        if (!newProject.name || !newProject.clientName || !newProject.eventDate) {
            alert("Please fill all fields.");
            return;
        }
        try {
            await addDoc(collection(db, `artifacts/${appId}/users/${userId}/projects`), {
                ...newProject,
                revenue: Number(newProject.revenue),
                createdAt: new Date().toISOString(),
            });
            setNewProject({ name: '', clientName: '', eventDate: '', revenue: 0 });
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error adding project:", error);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Food Projects</h1>
                <button onClick={() => setIsModalOpen(true)} className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 flex items-center gap-2">
                    <PlusCircleIcon className="w-5 h-5" />
                    New Project
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(project => (
                    <div key={project.id} onClick={() => navigateToProject(project.id)} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-shadow">
                        <h2 className="text-xl font-bold text-purple-600 dark:text-purple-400">{project.name}</h2>
                        <p className="text-gray-600 dark:text-gray-300">Client: {project.clientName}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Date: {new Date(project.eventDate).toLocaleDateString()}</p>
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <p className="font-semibold">Revenue: {formatCurrency(project.revenue || 0, settings.currencySymbol)}</p>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Create New Project</h2>
                        <input type="text" placeholder="Project Name" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} className="w-full p-2 mb-4 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                        <input type="text" placeholder="Client Name" value={newProject.clientName} onChange={e => setNewProject({...newProject, clientName: e.target.value})} className="w-full p-2 mb-4 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                        <input type="date" value={newProject.eventDate} onChange={e => setNewProject({...newProject, eventDate: e.target.value})} className="w-full p-2 mb-4 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">{settings.currencySymbol}</span>
                            <input type="number" placeholder="Quoted Revenue" value={newProject.revenue} onChange={e => setNewProject({...newProject, revenue: e.target.value})} className="w-full p-2 pl-8 mb-4 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                        </div>
                        <div className="flex justify-end gap-4">
                            <button onClick={() => setIsModalOpen(false)} className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg">Cancel</button>
                            <button onClick={handleAddProject} className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg">Create</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Component: ProjectDetail ---
const ProjectDetail = ({ projectId, db, userId, workers, expenses, settings, setPage }) => {
    const [project, setProject] = useState(null);
    const [projectOrders, setProjectOrders] = useState([]);
    const [newOrderItem, setNewOrderItem] = useState({ name: '', quantity: 1, price: 0 });
    const [assignedWorkers, setAssignedWorkers] = useState([]);

    useEffect(() => {
        if (!db || !userId || !projectId) return;

        const projectRef = doc(db, `artifacts/${appId}/users/${userId}/projects`, projectId);
        const unsubscribeProject = onSnapshot(projectRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                setProject({ id: doc.id, ...data });
                setAssignedWorkers(data.assignedWorkers || []);
            }
        });

        const ordersQuery = query(collection(db, `artifacts/${appId}/users/${userId}/projects/${projectId}/orders`));
        const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
            const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProjectOrders(ordersData);
        });

        return () => {
            unsubscribeProject();
            unsubscribeOrders();
        };
    }, [db, userId, projectId]);

    const handleAddOrderItem = async () => {
        if (!newOrderItem.name || newOrderItem.quantity <= 0 || newOrderItem.price < 0) {
            alert("Please provide valid order item details.");
            return;
        }
        await addDoc(collection(db, `artifacts/${appId}/users/${userId}/projects/${projectId}/orders`), {
            ...newOrderItem,
            quantity: Number(newOrderItem.quantity),
            price: Number(newOrderItem.price)
        });
        setNewOrderItem({ name: '', quantity: 1, price: 0 });
    };

    const handleDeleteOrderItem = async (orderId) => {
        await deleteDoc(doc(db, `artifacts/${appId}/users/${userId}/projects/${projectId}/orders`, orderId));
    };

    const handleWorkerToggle = async (workerId) => {
        const updatedWorkers = assignedWorkers.includes(workerId)
            ? assignedWorkers.filter(id => id !== workerId)
            : [...assignedWorkers, workerId];
        
        setAssignedWorkers(updatedWorkers);
        const projectRef = doc(db, `artifacts/${appId}/users/${userId}/projects`, projectId);
        await updateDoc(projectRef, { assignedWorkers: updatedWorkers });
    };
    
    const handleDeleteProject = async () => {
        if(window.confirm("Are you sure you want to delete this project and all its data? This cannot be undone.")) {
            await deleteDoc(doc(db, `artifacts/${appId}/users/${userId}/projects`, projectId));
            setPage('projects');
        }
    };

    if (!project) return <div className="text-center p-10">Loading project details...</div>;
    
    const projectExpenses = expenses.filter(e => e.projectId === projectId);
    const totalExpenses = projectExpenses.reduce((sum, e) => sum + e.amount, 0);
    const profit = (project.revenue || 0) - totalExpenses;

    return (
        <div>
            <div className="flex justify-between items-start mb-6">
                <div>
                    <button onClick={() => setPage('projects')} className="text-purple-500 hover:underline mb-2">&larr; Back to Projects</button>
                    <h1 className="text-4xl font-bold">{project.name}</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">Client: {project.clientName}</p>
                    <p className="text-md text-gray-500">Date: {new Date(project.eventDate).toLocaleDateString()}</p>
                </div>
                <button onClick={handleDeleteProject} className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 flex items-center gap-2">
                    <TrashIcon className="w-5 h-5" /> Delete Project
                </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-lg">
                    <h3 className="font-bold text-green-800 dark:text-green-300">Revenue</h3>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(project.revenue, settings.currencySymbol)}</p>
                </div>
                <div className="bg-red-100 dark:bg-red-900/50 p-4 rounded-lg">
                    <h3 className="font-bold text-red-800 dark:text-red-300">Expenses</h3>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(totalExpenses, settings.currencySymbol)}</p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900/50 p-4 rounded-lg">
                    <h3 className="font-bold text-blue-800 dark:text-blue-300">Profit</h3>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(profit, settings.currencySymbol)}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Order Details / Menu</h2>
                    <div className="space-y-2 mb-4">
                        {projectOrders.map(item => (
                            <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                                <span>{item.name} (x{item.quantity})</span>
                                <div className="flex items-center gap-4">
                                    <span>{formatCurrency(item.price * item.quantity, settings.currencySymbol)}</span>
                                    <button onClick={() => handleDeleteOrderItem(item.id)}><TrashIcon className="w-4 h-4 text-red-500 hover:text-red-700"/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                     <div className="flex gap-2 items-end p-2 border-t pt-4">
                        <input type="text" placeholder="Item Name" value={newOrderItem.name} onChange={e => setNewOrderItem({...newOrderItem, name: e.target.value})} className="flex-grow p-2 border rounded bg-gray-50 dark:bg-gray-700"/>
                        <input type="number" placeholder="Qty" value={newOrderItem.quantity} onChange={e => setNewOrderItem({...newOrderItem, quantity: e.target.value})} className="w-16 p-2 border rounded bg-gray-50 dark:bg-gray-700"/>
                        <input type="number" placeholder="Price" value={newOrderItem.price} onChange={e => setNewOrderItem({...newOrderItem, price: e.target.value})} className="w-24 p-2 border rounded bg-gray-50 dark:bg-gray-700"/>
                        <button onClick={handleAddOrderItem} className="bg-purple-500 text-white p-2 rounded-md hover:bg-purple-600">Add</button>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                        <h2 className="text-2xl font-bold mb-4">Assigned Workers</h2>
                        <div className="space-y-2">
                            {workers.map(worker => (
                                <div key={worker.id} className="flex items-center justify-between p-2">
                                    <span>{worker.name}</span>
                                    <input type="checkbox" checked={assignedWorkers.includes(worker.id)} onChange={() => handleWorkerToggle(worker.id)} className="form-checkbox h-5 w-5 text-purple-600 rounded"/>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                        <h2 className="text-2xl font-bold mb-4">Project Expenses</h2>
                        <div className="space-y-2">
                            {projectExpenses.length > 0 ? projectExpenses.map(expense => (
                                <div key={expense.id} className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                                    <span>{expense.description} ({expense.category})</span>
                                    <span className="font-semibold">{formatCurrency(expense.amount, settings.currencySymbol)}</span>
                                </div>
                            )) : <p>No expenses logged for this project yet.</p>}
                        </div>
                         <button onClick={() => setPage('expenses')} className="text-purple-500 hover:underline mt-4 w-full text-center">Add Expense</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Component: WorkersList ---
const WorkersList = ({ workers, db, userId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newWorker, setNewWorker] = useState({ name: '', role: '', contact: '' });

    const handleAddWorker = async () => {
        if (!newWorker.name) return;
        await addDoc(collection(db, `artifacts/${appId}/users/${userId}/workers`), newWorker);
        setNewWorker({ name: '', role: '', contact: '' });
        setIsModalOpen(false);
    };
    
    const handleDeleteWorker = async (workerId) => {
        if(window.confirm("Are you sure you want to remove this worker?")) {
            await deleteDoc(doc(db, `artifacts/${appId}/users/${userId}/workers`, workerId));
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Workers</h1>
                <button onClick={() => setIsModalOpen(true)} className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 flex items-center gap-2">
                    <PlusCircleIcon className="w-5 h-5" />
                    Add Worker
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b dark:border-gray-700">
                            <th className="p-4">Name</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Contact</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workers.map(worker => (
                            <tr key={worker.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="p-4 font-medium">{worker.name}</td>
                                <td className="p-4">{worker.role}</td>
                                <td className="p-4">{worker.contact}</td>
                                <td className="p-4">
                                    <button onClick={() => handleDeleteWorker(worker.id)}><TrashIcon className="w-5 h-5 text-red-500 hover:text-red-700"/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Add New Worker</h2>
                        <input type="text" placeholder="Worker Name" value={newWorker.name} onChange={e => setNewWorker({...newWorker, name: e.target.value})} className="w-full p-2 mb-4 border rounded bg-gray-50 dark:bg-gray-700"/>
                        <input type="text" placeholder="Role (e.g., Chef, Server)" value={newWorker.role} onChange={e => setNewWorker({...newWorker, role: e.target.value})} className="w-full p-2 mb-4 border rounded bg-gray-50 dark:bg-gray-700"/>
                        <input type="text" placeholder="Contact (Phone/Email)" value={newWorker.contact} onChange={e => setNewWorker({...newWorker, contact: e.target.value})} className="w-full p-2 mb-4 border rounded bg-gray-50 dark:bg-gray-700"/>
                        <div className="flex justify-end gap-4">
                            <button onClick={() => setIsModalOpen(false)} className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg">Cancel</button>
                            <button onClick={handleAddWorker} className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg">Add</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Component: ExpensesList & Receipt Scanner ---
const ExpensesList = ({ expenses, db, userId, projects, commonItems, settings }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newExpense, setNewExpense] = useState({ description: '', amount: '', category: 'Ingredients', date: new Date().toISOString().split('T')[0], projectId: '' });
    
    const [imageFile, setImageFile] = useState(null);
    const [imageBase64, setImageBase64] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [scanError, setScanError] = useState('');
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageBase64(reader.result.split(',')[1]); 
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleDescriptionChange = (e) => {
        const value = e.target.value;
        setNewExpense(prev => ({ ...prev, description: value }));

        const matchedItem = commonItems.find(item => item.name === value);
        if (matchedItem) {
            setNewExpense(prev => ({
                ...prev,
                description: matchedItem.name,
                amount: matchedItem.defaultPrice || '',
            }));
        }
    };

    const extractTextFromImage = async () => {
        if (!imageBase64) {
            setScanError("Please select an image first.");
            return;
        }
        setIsScanning(true);
        setScanError('');

        const prompt = "From the attached receipt image, extract the vendor name (as 'vendor'), the final total amount (as 'total'), and the date (as 'date' in YYYY-MM-DD format). If any field is not found, return null for that field.";
        
        const payload = {
            contents: [{
                parts: [
                    { text: prompt },
                    { inline_data: { mime_type: imageFile.type, data: imageBase64 } }
                ]
            }],
            generation_config: {
                response_mime_type: "application/json",
                response_schema: {
                    type: "OBJECT",
                    properties: {
                        vendor: { type: "STRING" },
                        total: { type: "NUMBER" },
                        date: { type: "STRING" }
                    }
                }
            }
        };

        try {
            const apiKey = ""; 
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`API Error: ${response.status} ${errorBody}`);
            }

            const result = await response.json();
            const text = result.candidates[0].content.parts[0].text;
            const data = JSON.parse(text);

            setNewExpense(prev => ({
                ...prev,
                description: data.vendor || prev.description,
                amount: data.total || prev.amount,
                date: data.date || prev.date,
            }));

        } catch (error) {
            console.error("Error during receipt scan:", error);
            setScanError("Could not extract details from receipt. Please enter manually.");
        } finally {
            setIsScanning(false);
        }
    };

    const handleAddExpense = async () => {
        if (!newExpense.description || !newExpense.amount) return;
        await addDoc(collection(db, `artifacts/${appId}/users/${userId}/expenses`), {
            ...newExpense,
            amount: Number(newExpense.amount),
        });
        setNewExpense({ description: '', amount: '', category: 'Ingredients', date: new Date().toISOString().split('T')[0], projectId: '' });
        setImageFile(null);
        setImageBase64('');
        setIsModalOpen(false);
    };

    const categories = ['Ingredients', 'Venue', 'Staffing', 'Marketing', 'Utilities', 'Other'];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Expenses</h1>
                <button onClick={() => setIsModalOpen(true)} className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 flex items-center gap-2">
                    <PlusCircleIcon className="w-5 h-5" />
                    Add Expense
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b dark:border-gray-700">
                            <th className="p-4">Date</th>
                            <th className="p-4">Description</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Project</th>
                            <th className="p-4 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map(expense => (
                            <tr key={expense.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="p-4">{new Date(expense.date).toLocaleDateString()}</td>
                                <td className="p-4 font-medium">{expense.description}</td>
                                <td className="p-4">{expense.category}</td>
                                <td className="p-4 text-purple-500">{projects.find(p => p.id === expense.projectId)?.name || 'N/A'}</td>
                                <td className="p-4 text-right font-semibold">{formatCurrency(expense.amount, settings.currencySymbol)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto p-4">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg w-full max-w-lg">
                        <h2 className="text-2xl font-bold mb-4">Log New Expense</h2>
                        
                        <div className="mb-6 p-4 border-2 border-dashed rounded-lg text-center">
                            <h3 className="text-lg font-semibold mb-2">Scan a Receipt (Optional)</h3>
                            <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} className="hidden" />
                            <button onClick={() => fileInputRef.current.click()} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg mb-2 flex items-center justify-center w-full gap-2">
                                <UploadCloudIcon className="w-5 h-5"/>
                                {imageFile ? 'Change Image' : 'Upload Image'}
                            </button>
                            {imageFile && (
                                <div className="relative inline-block">
                                    <img src={URL.createObjectURL(imageFile)} alt="Receipt preview" className="max-h-32 rounded-md mx-auto"/>
                                    <button onClick={() => {setImageFile(null); setImageBase64('');}} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full">
                                        <XCircleIcon className="w-6 h-6"/>
                                    </button>
                                </div>
                            )}
                            {imageBase64 && (
                                <button onClick={extractTextFromImage} disabled={isScanning} className="mt-2 w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-blue-300">
                                    {isScanning ? 'Scanning...' : 'Extract Details with AI'}
                                </button>
                            )}
                            {scanError && <p className="text-red-500 text-sm mt-2">{scanError}</p>}
                        </div>
                        
                        <label className="block font-medium mb-1">Description</label>
                        <input 
                            list="common-items-list"
                            placeholder="Type or select a common item" 
                            value={newExpense.description} 
                            onChange={handleDescriptionChange} 
                            className="w-full p-2 mb-4 border rounded bg-gray-50 dark:bg-gray-700"
                        />
                        <datalist id="common-items-list">
                            {commonItems.map(item => <option key={item.id} value={item.name} />)}
                        </datalist>

                        <label className="block font-medium mb-1">Amount</label>
                        <div className="relative mb-4">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">{settings.currencySymbol}</span>
                            <input type="number" placeholder="Amount" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} className="w-full p-2 pl-8 border rounded bg-gray-50 dark:bg-gray-700"/>
                        </div>
                        <label className="block font-medium mb-1">Category</label>
                        <select value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value})} className="w-full p-2 mb-4 border rounded bg-gray-50 dark:bg-gray-700">
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                        <label className="block font-medium mb-1">Date</label>
                        <input type="date" value={newExpense.date} onChange={e => setNewExpense({...newExpense, date: e.target.value})} className="w-full p-2 mb-4 border rounded bg-gray-50 dark:bg-gray-700"/>
                        <label className="block font-medium mb-1">Project (Optional)</label>
                        <select value={newExpense.projectId} onChange={e => setNewExpense({...newExpense, projectId: e.target.value})} className="w-full p-2 mb-4 border rounded bg-gray-50 dark:bg-gray-700">
                            <option value="">Assign to a Project</option>
                            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <div className="flex justify-end gap-4">
                            <button onClick={() => setIsModalOpen(false)} className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg">Cancel</button>
                            <button onClick={handleAddExpense} className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg">Save Expense</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Component: CommonItemsList ---
const CommonItemsList = ({ commonItems, db, userId, settings }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', defaultPrice: '' });

    const handleAddItem = async () => {
        if (!newItem.name) return;
        await addDoc(collection(db, `artifacts/${appId}/users/${userId}/commonItems`), {
            ...newItem,
            defaultPrice: Number(newItem.defaultPrice)
        });
        setNewItem({ name: '', defaultPrice: '' });
        setIsModalOpen(false);
    };
    
    const handleDeleteItem = async (itemId) => {
        if(window.confirm("Are you sure you want to remove this item from your shopping list?")) {
            await deleteDoc(doc(db, `artifacts/${appId}/users/${userId}/commonItems`, itemId));
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Shopping List Items</h1>
                <button onClick={() => setIsModalOpen(true)} className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 flex items-center gap-2">
                    <PlusCircleIcon className="w-5 h-5" />
                    Add Item
                </button>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Manage a list of items you frequently buy to speed up expense entry.</p>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b dark:border-gray-700">
                            <th className="p-4">Item Name</th>
                            <th className="p-4">Default Price</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {commonItems.map(item => (
                            <tr key={item.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="p-4 font-medium">{item.name}</td>
                                <td className="p-4">{item.defaultPrice ? formatCurrency(item.defaultPrice, settings.currencySymbol) : 'N/A'}</td>
                                <td className="p-4">
                                    <button onClick={() => handleDeleteItem(item.id)}><TrashIcon className="w-5 h-5 text-red-500 hover:text-red-700"/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Add Common Item</h2>
                        <input type="text" placeholder="Item Name (e.g., 25kg Bag of Rice)" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="w-full p-2 mb-4 border rounded bg-gray-50 dark:bg-gray-700"/>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">{settings.currencySymbol}</span>
                            <input type="number" placeholder="Default Price (Optional)" value={newItem.defaultPrice} onChange={e => setNewItem({...newItem, defaultPrice: e.target.value})} className="w-full p-2 pl-8 mb-4 border rounded bg-gray-50 dark:bg-gray-700"/>
                        </div>
                        <div className="flex justify-end gap-4">
                            <button onClick={() => setIsModalOpen(false)} className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg">Cancel</button>
                            <button onClick={handleAddItem} className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg">Add</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


// --- Component: Settings ---
const Settings = ({ settings, db, userId }) => {
    const [currentSettings, setCurrentSettings] = useState(settings);
    const [message, setMessage] = useState('');

    useEffect(() => {
        setCurrentSettings(settings);
    }, [settings]);

    const handleSave = async () => {
        const settingsRef = doc(db, `artifacts/${appId}/users/${userId}/settings`, 'userSettings');
        try {
            await setDoc(settingsRef, currentSettings, { merge: true });
            setMessage('Settings saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error("Error saving settings:", error);
            setMessage('Failed to save settings.');
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Settings</h1>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md max-w-md">
                <div className="mb-4">
                    <label className="block font-bold mb-2" htmlFor="currency">Currency Symbol</label>
                    <input
                        id="currency"
                        type="text"
                        value={currentSettings.currencySymbol}
                        onChange={e => setCurrentSettings({ ...currentSettings, currencySymbol: e.target.value })}
                        className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700"
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-bold mb-2">Your User ID (for support)</label>
                    <p className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-sm break-all">{userId}</p>
                </div>
                <button onClick={handleSave} className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700">
                    Save Settings
                </button>
                {message && <p className="mt-4 text-center text-green-500">{message}</p>}
            </div>
        </div>
    );
};

export default App;
