import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import { Bar } from 'react-chartjs-2';
import {
    ExamContainer,
    SidebarContainer,
    Content,
    ExamHeader,
    ExamResultsContainer,
    ExamSubject,
    ExamResult,
    ExamChartContainer,
    ExamContent
} from "../../styles/ExamStyles";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const StudentExamSection = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [exams, setExams] = useState([]);

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1/exams/getall');
            setExams(response.data.exams || []);
        } catch (error) {
            console.error('Error fetching exams: ', error);
        }
    };

    const barChartData = {
        labels: exams.map(exam => `${exam.examCategory} (${exam.subject})`),
        datasets: [
            {
                label: 'Exam Scores',
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(54, 162, 235, 0.8)',
                hoverBorderColor: 'rgba(54, 162, 235, 1)',
                data: exams.map(exam => exam.marks)
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Your Academic Performance',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100
            }
        }
    };

    return (
        <ExamContainer>
            <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
            <Content isOpen={isOpen}>
                <ExamContent>
                    <ExamHeader>Academic Performance</ExamHeader>
                    
                    <ExamResultsContainer>
                        <h3>Score Summary:</h3>
                        {exams.length > 0 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px', marginTop: '10px' }}>
                                {exams.map((exam, index) => (
                                    <div key={exam.id || index} style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #007bff' }}>
                                        <ExamSubject>{exam.subject}</ExamSubject>
                                        <ExamResult>{exam.examCategory}: <strong>{exam.marks}%</strong></ExamResult>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No exam data available to display.</p>
                        )}
                    </ExamResultsContainer>

                    {exams.length > 0 && (
                        <ExamChartContainer>
                            <Bar data={barChartData} options={chartOptions} />
                        </ExamChartContainer>
                    )}
                </ExamContent>
            </Content>
        </ExamContainer>
    );
};

export default StudentExamSection;