import { createBrowserRouter, Navigate } from "react-router";

// Layouts
import PublicLayouts from "./layouts/PublicLayouts";
import ProtectedLayouts from "./layouts/ProtectedLayouts";
import AppLayout from "./layouts/AppLayout";
import CallLayout from "./layouts/CallLayout";
import AuthLayout from "./layouts/AuthLayout";
import AdminLayout from "./layouts/AdminLayout";

// Pages & Components
import Publicpage from "./pages/Publicpage";
import Home from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import HistoryPage from "./pages/HistoryPage";
import NotificationsPage from "./pages/NotificationsPage";
import SupportPage from "./pages/SupportPage";
import AdminPage from "./pages/AdminPage";
import VideoCallScreen from "./components/VideoCallScreen";
import Register from "./components/Register";
import Login from "./components/Login";
import RoomsDashboardPage from "./pages/RoomsDashboardPage";
import CustomRoomView from "./components/CustomRoomView";
import NotFoundPage from "./pages/NotFoundPage";


// Settings Features & Sub-pages
import AccountSecuritySettings from "./features/settings/AccountSecuritySettings";
import MatchPreferencesSettings from "./features/settings/MatchPreferencesSettings";
import CallSettingsSettings from "./features/settings/CallSettingsSettings";
import PrivacySafetySettings from "./features/settings/PrivacySafetySettings";
import NotificationsSettings from "./features/settings/NotificationsSettings";
import AppearanceLanguageSettings from "./features/settings/AppearanceLanguageSettings";
import HelpLegalSettings from "./features/settings/HelpLegalSettings";

import ActiveDevicesSubPage from "./features/settings/subpages/ActiveDevicesSubPage";
import BlockedUsersSubPage from "./features/settings/subpages/BlockedUsersSubPage";
import MyReportsSubPage from "./features/settings/subpages/MyReportsSubPage";
import JoinRoomRedirect from "./components/JoinRoomRedirect";

const Routes = createBrowserRouter([
    // 1. Public Landing & Join Routes
    {
        path: '/',
        element: <PublicLayouts />,
        children: [
            {
                index: true,
                element: <Publicpage />
            },
            {
                path: 'join/:roomId',
                element: <JoinRoomRedirect />
            },
            {
                path: 'room/:roomId',
                element: <JoinRoomRedirect />
            }
        ]
    },

    // 2. Auth Routes (Logo only top bar via AuthLayout)
    {
        element: <AuthLayout />,
        children: [
            {
                path: 'login',
                element: <Login />
            },
            {
                path: 'register',
                element: <Register />
            }
        ]
    },

    // 3. Protected Routes Layer (Guarded by session auth)
    {
        element: <ProtectedLayouts />,
        children: [
            // App Navigation Routes (AppLayout with sticky Navbar & MobileTabBar)
            {
                path: 'home',
                element: <AppLayout />,
                children: [
                    {
                        index: true,
                        element: <Home />
                    },
                    {
                        path: 'history',
                        element: <HistoryPage />
                    },
                    {
                        path: 'notifications',
                        element: <NotificationsPage />
                    },
                    {
                        path: 'profile',
                        element: <ProfilePage />
                    },
                    {
                        path: 'rooms',
                        element: <RoomsDashboardPage />
                    },
                    {
                        path: 'rooms/:roomId',
                        element: <CustomRoomView />
                    },
                    {
                        path: 'settings',
                        element: <SettingsPage />,
                        children: [
                            {
                                path: 'account',
                                element: <AccountSecuritySettings />
                            },
                            {
                                path: 'account/devices',
                                element: <ActiveDevicesSubPage />
                            },
                            {
                                path: 'preferences',
                                element: <MatchPreferencesSettings />
                            },
                            {
                                path: 'call',
                                element: <CallSettingsSettings />
                            },
                            {
                                path: 'privacy',
                                element: <PrivacySafetySettings />
                            },
                            {
                                path: 'privacy/blocked',
                                element: <BlockedUsersSubPage />
                            },
                            {
                                path: 'privacy/reports',
                                element: <MyReportsSubPage />
                            },
                            {
                                path: 'notifications',
                                element: <NotificationsSettings />
                            },
                            {
                                path: 'appearance',
                                element: <AppearanceLanguageSettings />
                            },
                            {
                                path: 'help',
                                element: <HelpLegalSettings />
                            },
                            {
                                path: 'help/tickets',
                                element: <SupportTicketsSubPage />
                            }
                        ]
                    },
                    {
                        path: 'support',
                        element: <SupportPage />
                    }
                ]
            },

            // Fullscreen Video Call Route (CallLayout - no navbar, no tab bar)
            {
                path: 'home/call',
                element: <CallLayout />,
                children: [
                    {
                        index: true,
                        element: <VideoCallScreen />
                    },
                    {
                        path: ':roomId',
                        element: <VideoCallScreen />
                    }
                ]
            },

            // Role-Guarded Admin Routes (AdminLayout - admin/moderator only)
            {
                path: 'admin/*',
                element: <AdminLayout />,
                children: [
                    {
                        index: true,
                        element: <AdminPage />
                    }
                ]
            }
        ]
    },

    // Wildcard 404 Catch-All Route
    {
        path: '*',
        element: <NotFoundPage />
    }
]);

export default Routes;