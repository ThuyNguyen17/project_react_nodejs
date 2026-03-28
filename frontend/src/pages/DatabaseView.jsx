import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { 
  Users, 
  UserCheck, 
  GraduationCap, 
  School, 
  BookOpen, 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Database
} from 'lucide-react';

const API_BASE = 'http://localhost:8080/api/data';

export default function DatabaseView() {
  const [data, setData] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resetting, setResetting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dataResponse, dashboardResponse] = await Promise.all([
        fetch(`${API_BASE}/all`),
        fetch(`${API_BASE}/dashboard`)
      ]);

      if (!dataResponse.ok || !dashboardResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const dataResult = await dataResponse.json();
      const dashboardResult = await dashboardResponse.json();

      setData(dataResult.data);
      setDashboard(dashboardResult.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetDatabase = async () => {
    if (!confirm('Are you sure you want to reset the database? This will delete all existing data and create new sample data.')) {
      return;
    }

    setResetting(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/reset`, { method: 'POST' });
      if (!response.ok) {
        throw new Error('Failed to reset database');
      }
      await fetchData(); // Refresh data after reset
      alert('Database reset successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setResetting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Database className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Database Management</h1>
        </div>
        <div className="flex space-x-2">
          <Button onClick={fetchData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={resetDatabase} variant="destructive" disabled={resetting}>
            <RefreshCw className={`h-4 w-4 mr-2 ${resetting ? 'animate-spin' : ''}`} />
            Reset Database
          </Button>
        </div>
      </div>

      {/* Dashboard Stats */}
      {dashboard && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard.stats.users}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Teachers</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard.stats.teachers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Students</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard.stats.students}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Classes</CardTitle>
              <School className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard.stats.classes}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Data Tables */}
      {data && (
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="teachers">Teachers</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Users ({data.users?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2 text-left">Username</th>
                        <th className="border border-gray-300 p-2 text-left">Role</th>
                        <th className="border border-gray-300 p-2 text-left">Active</th>
                        <th className="border border-gray-300 p-2 text-left">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.users?.map((user) => (
                        <tr key={user._id}>
                          <td className="border border-gray-300 p-2">{user.username}</td>
                          <td className="border border-gray-300 p-2">
                            <Badge variant={user.role === 'ADMIN' ? 'destructive' : user.role === 'TEACHER' ? 'default' : 'secondary'}>
                              {user.role}
                            </Badge>
                          </td>
                          <td className="border border-gray-300 p-2">
                            {user.isActive ? <CheckCircle className="h-4 w-4 text-green-500" /> : <AlertCircle className="h-4 w-4 text-red-500" />}
                          </td>
                          <td className="border border-gray-300 p-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teachers">
            <Card>
              <CardHeader>
                <CardTitle>Teachers ({data.teachers?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2 text-left">Code</th>
                        <th className="border border-gray-300 p-2 text-left">Name</th>
                        <th className="border border-gray-300 p-2 text-left">Email</th>
                        <th className="border border-gray-300 p-2 text-left">Phone</th>
                        <th className="border border-gray-300 p-2 text-left">Username</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.teachers?.map((teacher) => (
                        <tr key={teacher._id}>
                          <td className="border border-gray-300 p-2">{teacher.teacherCode}</td>
                          <td className="border border-gray-300 p-2">{teacher.fullName}</td>
                          <td className="border border-gray-300 p-2">{teacher.email || '-'}</td>
                          <td className="border border-gray-300 p-2">{teacher.phone || '-'}</td>
                          <td className="border border-gray-300 p-2">{teacher.userId?.username || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Students ({data.students?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2 text-left">Code</th>
                        <th className="border border-gray-300 p-2 text-left">Name</th>
                        <th className="border border-gray-300 p-2 text-left">Gender</th>
                        <th className="border border-gray-300 p-2 text-left">Date of Birth</th>
                        <th className="border border-gray-300 p-2 text-left">Email</th>
                        <th className="border border-gray-300 p-2 text-left">Phone</th>
                        <th className="border border-gray-300 p-2 text-left">Username</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.students?.map((student) => (
                        <tr key={student._id}>
                          <td className="border border-gray-300 p-2">{student.studentCode}</td>
                          <td className="border border-gray-300 p-2">{student.fullName}</td>
                          <td className="border border-gray-300 p-2">{student.gender || '-'}</td>
                          <td className="border border-gray-300 p-2">
                            {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : '-'}
                          </td>
                          <td className="border border-gray-300 p-2">{student.contact?.email || '-'}</td>
                          <td className="border border-gray-300 p-2">{student.contact?.phone || '-'}</td>
                          <td className="border border-gray-300 p-2">{student.userId?.username || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="classes">
            <Card>
              <CardHeader>
                <CardTitle>Classes ({data.classes?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2 text-left">Grade</th>
                        <th className="border border-gray-300 p-2 text-left">Class Name</th>
                        <th className="border border-gray-300 p-2 text-left">Homeroom Teacher</th>
                        <th className="border border-gray-300 p-2 text-left">Academic Year</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.classes?.map((cls) => (
                        <tr key={cls._id}>
                          <td className="border border-gray-300 p-2">{cls.gradeLevel}</td>
                          <td className="border border-gray-300 p-2">{cls.className}</td>
                          <td className="border border-gray-300 p-2">{cls.homeroomTeacherId?.fullName || '-'}</td>
                          <td className="border border-gray-300 p-2">{cls.academicYearId?.year || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subjects">
            <Card>
              <CardHeader>
                <CardTitle>Subjects ({data.subjects?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2 text-left">Subject Code</th>
                        <th className="border border-gray-300 p-2 text-left">Subject Name</th>
                        <th className="border border-gray-300 p-2 text-left">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.subjects?.map((subject) => (
                        <tr key={subject._id}>
                          <td className="border border-gray-300 p-2">{subject.subjectCode}</td>
                          <td className="border border-gray-300 p-2">{subject.subjectName}</td>
                          <td className="border border-gray-300 p-2">{new Date(subject.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle>Recent Attendance ({data.attendances?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2 text-left">Student Name</th>
                        <th className="border border-gray-300 p-2 text-left">Class</th>
                        <th className="border border-gray-300 p-2 text-left">Status</th>
                        <th className="border border-gray-300 p-2 text-left">Check-in Time</th>
                        <th className="border border-gray-300 p-2 text-left">Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.attendances?.slice(0, 20).map((attendance) => (
                        <tr key={attendance._id}>
                          <td className="border border-gray-300 p-2">{attendance.studentName}</td>
                          <td className="border border-gray-300 p-2">{attendance.studentClass}</td>
                          <td className="border border-gray-300 p-2">
                            <Badge variant={attendance.status === 'PRESENT' ? 'default' : attendance.status === 'LATE' ? 'secondary' : 'destructive'}>
                              {attendance.status}
                            </Badge>
                          </td>
                          <td className="border border-gray-300 p-2">
                            {attendance.checkInTime ? new Date(attendance.checkInTime).toLocaleString() : '-'}
                          </td>
                          <td className="border border-gray-300 p-2">{attendance.location || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
