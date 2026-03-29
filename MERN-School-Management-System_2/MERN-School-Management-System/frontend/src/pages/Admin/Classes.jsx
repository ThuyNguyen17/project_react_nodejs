import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import {
    ClassesContainer,
    Content,
    ClassesContent,
    ClassHeader,
    ClassList,
    ClassItem,
    AddClassButton,
    AddClassForm,
    AddClassInput,
} from "../../styles/ClassesStyles";

const Classes = () =>{
    const [isOpen, setIsOpen] = useState(true);
    const [gradeLevel, setGradeLevel] = useState('');
    const [className, setClassName] = useState('');
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try{
            const response = await axios.get('http://localhost:8080/api/v1/class/getall');
            if(response.data && response.data.success){
                setClasses(response.data.classes || []);
            }else{
                console.log("Error while fetching classes: Invalid data format", response.data)
            }
        }catch (error){
            console.error('Error fetching classes: ', error);
        }
    };

    const handleAddClass = async (e) => {
        e.preventDefault();
        if(gradeLevel !== '' && className !== ''){
            try{
                const response = await axios.post('http://localhost:8080/api/v1/class', {
                    gradeLevel: parseInt(gradeLevel),
                    className: className
                });
                if (response.data.success) {
                    fetchClasses(); // Refresh list
                    setGradeLevel('');
                    setClassName('');
                }
            }catch (error){
                console.error("Error adding class: ", error);
            }
        }
    };

    const handleDeleteClass = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/v1/class/${id}`);
            fetchClasses();
        } catch (error) {
            console.error("Error deleting class: ", error);
        }
    };

    return(
        <ClassesContainer>
            <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
            <Content isOpen={isOpen}>
                <ClassesContent>
                    <ClassHeader>Classes</ClassHeader>
                    <AddClassForm onSubmit={handleAddClass}>
                        <AddClassInput 
                            type="number"
                            placeholder="Grade Level (e.g. 10)"
                            value={gradeLevel}
                            onChange={(e) => setGradeLevel(e.target.value)}
                            required
                        />
                        <AddClassInput 
                            type="text"
                            placeholder="Class Name (e.g. A1)"
                            value={className}
                            onChange={(e) => setClassName(e.target.value)}
                            required
                        />
                        <AddClassButton type="submit">Add Class</AddClassButton>
                    </AddClassForm>
                    <ClassList>
                        {Array.isArray(classes) && classes.map((cls, index) => (
                            <ClassItem key={cls._id || cls.id || index}>
                                {cls.gradeLevel}{cls.className}
                                <button onClick={() => handleDeleteClass(cls._id || cls.id)} style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                            </ClassItem>
                        ))}
                    </ClassList>
                </ClassesContent>
            </Content>
        </ClassesContainer>
    )
}

export default Classes