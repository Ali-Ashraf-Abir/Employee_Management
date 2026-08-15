import {
    Navigate,
    Route,
    Routes
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ForbiddenPage from "./pages/ForbiddenPage";
import NotFoundPage from "./pages/NotFoundPage";

import EmployeeListPage
    from "./pages/employees/EmployeeListPage";

import EmployeeDetailsPage
    from "./pages/employees/EmployeeDetailsPage";

import CreateEmployeePage
    from "./pages/employees/CreateEmployeePage";

import EditEmployeePage
    from "./pages/employees/EditEmployeePage";

import EmployeeRolesPage
    from "./pages/employees/EmployeeRolesPage";

import MasterLayout
    from "./layouts/MasterLayout";
import EmployeeAttendancePage from "./pages/attendance/EmployeeAttendancePage";
import EmployeeAttendanceHistoryPage from "./pages/attendance/EmployeeAttendanceHistoryPage";
import AdminAttendancePage from "./pages/attendance/AdminAttendancePage";
import AttendanceReportPage from "./pages/attendance/AttendanceReportPage";

import RoleRoute
    from "./routes/RoleRoute";
import ProtectedRoute from "./routes/ProtectedRoutes";
import LeaveTypesPage from "./pages/leaveType/LeaveTypePage";
import CreateLeaveTypePage from "./pages/leaveType/CreateLeaveTypePage";
import EditLeaveTypePage from "./pages/leaveType/EditLeaveTypePage";
import LeavePage from "./pages/leaveType/leavePage";
import CreateLeaveRequestPage from "./pages/leaveType/CreateLeaveRequestPage";
import LeaveRequestDetailsPage from "./pages/leaveType/LeaveRequestDetailsPage";
import EditLeaveRequestPage from "./pages/leaveType/EditLeaveRequestPage";
import LeaveRequestsAdminPage from "./pages/leaveType/LeaveRequestAdmin";
import AdminLeaveRequestDetailsPage from "./pages/leaveType/AdminLeaveRequestDetailsPage";

export default function App() {
    return (
        <Routes>
            <Route
                path="/login"
                element={<LoginPage />}
            />

            <Route element={<ProtectedRoute />}>
                <Route element={<MasterLayout />}>
                    <Route
                        path="/dashboard"
                        element={<DashboardPage />}
                    />

                    <Route element={
                        <RoleRoute
                            allowedRoles={[
                                "Admin",
                                "HR"
                            ]}
                        />
                    }>
                        <Route
                            path="/employees"
                            element={
                                <EmployeeListPage />
                            }
                        />

                        <Route
                            path="/employees/new"
                            element={
                                <CreateEmployeePage />
                            }
                        />

                        <Route
                            path="/employees/:id"
                            element={
                                <EmployeeDetailsPage />
                            }
                        />

                        <Route
                            path="/employees/:id/edit"
                            element={
                                <EditEmployeePage />
                            }
                        />

                        <Route
                            path="/employees/:id/roles"
                            element={
                                <EmployeeRolesPage />
                            }
                        />
                    </Route>



                    <Route element={
                        <RoleRoute
                            allowedRoles={[
                                "Admin"
                            ]}
                        />
                    }>
                        <Route
                            path="/users"
                            element={
                                <div>
                                    User Management
                                </div>
                            }
                        />
                    </Route>
                    <Route
                        element={
                            <RoleRoute
                                allowedRoles={[
                                    "Employee",
                                    "HR",
                                    "Admin"
                                ]}
                            />
                        }
                    >
                        <Route
                            path="/attendance"
                            element={<EmployeeAttendancePage />}
                        />

                        <Route
                            path="/attendance/history"
                            element={
                                <EmployeeAttendanceHistoryPage />
                            }
                        />
                    </Route>
                    <Route
                        element={
                            <RoleRoute
                                allowedRoles={[
                                    "Admin",
                                    "HR"
                                ]}
                            />
                        }
                    >
                        <Route
                            path="/admin/attendance"
                            element={<AdminAttendancePage />}
                        />

                        <Route
                            path="/admin/attendance/report"
                            element={<AttendanceReportPage />}
                        />
                    </Route>
                    <Route
                        element={
                            <ProtectedRoute />
                        }>
                        <Route
                            path="/leave"
                            element={<LeavePage />}
                        />
                        <Route
                            path="/leave/new"
                            element={
                                <CreateLeaveRequestPage />
                            }
                        />

                        <Route
                            path="/leave/requests/:id"
                            element={
                                <LeaveRequestDetailsPage />
                            }
                        />
                        <Route
                            path="/leave/requests/:id/edit"
                            element={
                                <EditLeaveRequestPage />
                            }
                        />
                        <Route
                            path="/leave/types"
                            element={<LeaveTypesPage />}
                        />
                    </Route>
                    <Route
                        element={
                            <RoleRoute
                                allowedRoles={[
                                    "Admin",
                                    "HR"
                                ]}
                            />
                        }
                    >

                        <Route
                            path="/leave/types/:id/edit"
                            element={
                                <EditLeaveTypePage />
                            }
                        />
                        <Route
                            path="/leave/types/new"
                            element={
                                <CreateLeaveTypePage />
                            }
                        />




                        <Route
                            path="/leave/requests-admin/:id"
                            element={
                                <AdminLeaveRequestDetailsPage />
                            }
                        />





                    </Route>
                    <Route
                        element={
                            <RoleRoute
                                allowedRoles={[
                                    "Admin",
                                    "HR"
                                ]}
                            />
                        }
                    >
                        <Route
                            path="/leave/all-requests"
                            element={
                                <LeaveRequestsAdminPage />
                            }
                        />
                    </Route>
                </Route>

            </Route>

            <Route
                path="/forbidden"
                element={
                    <ForbiddenPage />
                }
            />

            <Route
                path="/404"
                element={
                    <NotFoundPage />
                }
            />

            <Route
                path="/"
                element={
                    <Navigate
                        to="/dashboard"
                        replace
                    />
                }
            />

            {/* <Route
                path="*"
                element={
                    <Navigate
                        to="/404"
                        replace
                    />
                }
            /> */}

        </Routes>
    );
}