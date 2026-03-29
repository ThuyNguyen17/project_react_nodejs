import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import {
    PerformanceContainer,
    Content,
    PerformanceContent,
    PerformanceHeader,
    SchoolPerformance,
    IndividualPerformance
} from "../../styles/PerformanceStyles";

const CheckPerformanceSection = () =>{
    const [isOpen, setIsOpen] = useState(true);
    const [performanceData, setPerformanceData] = useState({
        averageScore: 0,
        totalStudents: 0,
    });
    const [individualPerformanceData, setIndividualPerformanceData] = useState([]);

    useEffect(() => {
        fetchPerformance();
    }, []);

    const fetchPerformance = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1/exams/getall');
            const exams = response.data.exams || [];
            
            if (exams.length > 0) {
                const totalMarks = exams.reduce((sum, exam) => sum + (exam.marks || 0), 0);
                const avg = totalMarks / exams.length;
                
                setPerformanceData({
                    averageScore: avg.toFixed(2),
                    totalStudents: new Set(exams.map(e => e.id)).size, // Simplified count
                });
                
                // Group by subject or just show all for now
                setIndividualPerformanceData(exams.map(e => ({
                    id: e.id,
                    name: e.subject,
                    score: e.marks
                })));
            }
        } catch (error) {
            console.error('Error fetching performance: ', error);
        }
    }

    return(
        <PerformanceContainer>
            <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
            <Content isOpen={isOpen}>
                <PerformanceContent>
                    <PerformanceHeader>School Performance Overview</PerformanceHeader>
                    <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
                        <p><strong>Average Score:</strong> {performanceData.averageScore}%</p>
                        <p><strong>Total Exam Records:</strong> {individualPerformanceData.length}</p>
                    </div>

                    <PerformanceHeader>Recent Results</PerformanceHeader>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                        {individualPerformanceData.map(item => (
                            <div key={item.id} style={{ background: 'white', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #4b83b5' }}>
                                <strong>{item.name}:</strong> {item.score}%
                            </div>
                        ))}
                    </div>
                </PerformanceContent>
            </Content>
        </PerformanceContainer>
    )
}

export default CheckPerformanceSection